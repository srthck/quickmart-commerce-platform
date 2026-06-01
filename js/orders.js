// ===== ORDERS PAGE LOGIC =====

function getAllOrders() {
  const stored = JSON.parse(localStorage.getItem('orders') || '[]');
  return [...stored, ...SAMPLE_ORDERS];
}

function getStatusClass(status) {
  const map = { pending: 'status-pending', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' };
  return map[status] || 'status-pending';
}

function getStatusLabel(status) {
  const map = { pending: '⏳ Pending', processing: '⚙️ Processing', shipped: '🚚 Shipped', delivered: '✅ Delivered', cancelled: '❌ Cancelled' };
  return map[status] || status;
}

function getTimelineProgress(timeline) {
  const done = timeline.filter(t => t.done).length;
  return `${(done / timeline.length) * 100}%`;
}

function renderOrders(orders) {
  const container = document.getElementById('ordersList');
  if (!container) return;

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No orders found</h3>
        <p>You haven't placed any orders yet</p>
        <a href="index.html" class="btn btn-primary" style="margin-top:1.5rem">🛍️ Start Shopping</a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map((order, idx) => {
    const progress = getTimelineProgress(order.timeline);
    const itemsTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);

    return `
    <div class="order-card ${idx === 0 ? 'open' : ''}" id="order-${order.id}">
      <div class="order-card-header" onclick="toggleOrder('${order.id}')">
        <div>
          <div class="order-id">Order ID: <span>${order.id}</span></div>
          <div class="order-date">📅 Placed on ${order.date}</div>
        </div>
        <div class="order-status ${getStatusClass(order.status)}">
          <span class="status-dot"></span>
          ${getStatusLabel(order.status)}
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem">
          <div style="font-size:0.9rem;font-weight:700;color:var(--accent-purple-light)">${formatPrice(order.total)}</div>
          <span class="order-collapse-icon">▼</span>
        </div>
      </div>

      <div class="order-card-body">
        <!-- TIMELINE -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-bottom:1.5rem">
          <div>
            <h4 style="margin-bottom:1.25rem;font-size:0.95rem;color:var(--text-secondary)">📍 Order Timeline</h4>
            <div class="order-timeline">
              <div class="timeline-track">
                <div class="timeline-progress" style="height:${progress}"></div>
              </div>
              ${order.timeline.map(step => `
                <div class="timeline-step ${step.done ? 'done' : ''} ${step.active && !step.done ? 'active' : ''}">
                  <div class="timeline-dot">${step.icon}</div>
                  <div class="timeline-content">
                    <div class="timeline-title">${step.title}</div>
                    <div class="timeline-desc">${step.desc}</div>
                    <div class="timeline-time">${step.time}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 style="margin-bottom:1.25rem;font-size:0.95rem;color:var(--text-secondary)">📦 Items Ordered</h4>
            <div class="order-items">
              ${order.items.map(item => `
                <div class="order-item">
                  <div class="order-item-img">
                    <img src="${item.image || 'images/fruits.png'}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%230f0f2d%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2260%22 text-anchor=%22middle%22 font-size=%2230%22>🛍️</text></svg>'">
                  </div>
                  <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-meta">Qty: ${item.qty} × ${formatPrice(item.price)}</div>
                  </div>
                  <div class="order-item-total">${formatPrice(item.price * item.qty)}</div>
                </div>
              `).join('')}
            </div>

            <!-- DELIVERY MAP (for shipped orders) -->
            ${order.status === 'shipped' ? `
            <div class="delivery-map">
              <h4>🗺️ Delivery Route</h4>
              <div class="map-route">
                <div class="map-point">
                  <div class="map-dot origin"></div>
                  <div class="map-label">Warehouse</div>
                </div>
                <div class="map-line">
                  <div class="map-truck">🚚</div>
                </div>
                <div class="map-point">
                  <div class="map-dot destination"></div>
                  <div class="map-label">Your Address</div>
                </div>
              </div>
            </div>` : ''}
          </div>
        </div>

        <!-- ORDER FOOTER -->
        <div class="order-card-footer">
          <div class="order-total-info">
            <div class="order-total-label">📍 ${order.address || '—'}</div>
            <div style="margin-top:4px">
              <span class="order-total-label">Order Total: </span>
              <span class="order-total-amount">${formatPrice(order.total)}</span>
            </div>
          </div>
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
            ${order.status !== 'cancelled' && order.status !== 'delivered'
              ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">Cancel Order</button>`
              : ''}
            ${order.status === 'delivered'
              ? `<a href="index.html" class="btn btn-outline btn-sm">🔄 Reorder</a>
                 <button class="btn btn-secondary btn-sm" onclick="downloadInvoice('${order.id}')">📄 Invoice</button>`
              : ''}
            <button class="btn btn-secondary btn-sm" onclick="window.location.href='support.html'">💬 Support</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleOrder(id) {
  const card = document.getElementById(`order-${id}`);
  if (card) card.classList.toggle('open');
}

function cancelOrder(id) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = 'cancelled';
    localStorage.setItem('orders', JSON.stringify(orders));
    renderOrders(getAllOrders());
    Toast.show('Order cancelled successfully', 'info');
  } else {
    Toast.show('This sample order cannot be cancelled', 'warning');
  }
}

function downloadInvoice(id) {
  Toast.show(`Invoice for ${id} would download here 📄`, 'info');
}

function trackByOrderId(id) {
  if (!id) { Toast.show('Please enter an order ID', 'warning'); return; }
  const all = getAllOrders();
  const found = all.find(o => o.id.toLowerCase() === id.toLowerCase());
  if (!found) {
    Toast.show(`No order found with ID: ${id}`, 'error');
    return;
  }

  // Scroll to order
  renderOrders([found]);
  document.getElementById('ordersList').scrollIntoView({ behavior: 'smooth' });
  Toast.show(`Showing order ${found.id}`, 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  renderOrders(getAllOrders());

  // Track button
  const trackBtn = document.getElementById('trackBtn');
  const trackInput = document.getElementById('trackInput');

  trackBtn?.addEventListener('click', () => {
    trackByOrderId(trackInput?.value.trim());
  });

  trackInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') trackByOrderId(trackInput.value.trim());
  });

  // Show all orders
  document.getElementById('showAllBtn')?.addEventListener('click', () => {
    renderOrders(getAllOrders());
    if (trackInput) trackInput.value = '';
    Toast.show('Showing all orders', 'info');
  });

  // Filter tabs
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.dataset.status;
      const all = getAllOrders();
      const filtered = status === 'all' ? all : all.filter(o => o.status === status);
      renderOrders(filtered);
    });
  });
});
