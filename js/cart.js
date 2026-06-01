// ===== CART PAGE LOGIC =====

let couponApplied = false;
let selectedDelivery = 'standard';
let selectedPayment = 'upi';
let checkoutStep = 1;

const DELIVERY_OPTIONS = {
  standard: { name: 'Standard Delivery', desc: '2-3 business days', price: 0, label: 'FREE' },
  express: { name: 'Express Delivery', desc: 'Same day, by 8 PM', price: 49, label: '₹49' },
  midnight: { name: 'Midnight Delivery', desc: 'Tonight by midnight', price: 99, label: '₹99' }
};

const COUPONS = {
  'FRESH10': { type: 'percent', value: 10, label: '10% off' },
  'SAVE50': { type: 'flat', value: 50, label: '₹50 off' },
  'NEWUSER': { type: 'percent', value: 15, label: '15% off (new user)' }
};

function renderCart() {
  const cart = Cart.get();
  const container = document.getElementById('cartItems');
  const emptyState = document.getElementById('cartEmpty');
  const cartWrap = document.getElementById('cartWrap');

  if (!container) return;

  if (cart.length === 0) {
    cartWrap && (cartWrap.style.display = 'none');
    emptyState && (emptyState.style.display = 'block');
    return;
  }

  cartWrap && (cartWrap.style.display = 'grid');
  emptyState && (emptyState.style.display = 'none');

  container.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.key}">
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22><rect fill=%22%230f0f2d%22 width=%22200%22 height=%22200%22/><text x=%22100%22 y=%22110%22 text-anchor=%22middle%22 font-size=%2250%22>🛍️</text></svg>'">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-cat">${item.category}</div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">${item.variant ? `Variant: ${item.variant}` : ''}</div>
        <div style="font-size:0.85rem;color:var(--accent-purple-light);font-weight:600">${formatPrice(item.price)} each</div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
        <div class="cart-item-unit">${item.qty} × ${formatPrice(item.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="updateCartQty('${item.key}', ${item.qty - 1})">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.key}', ${item.qty + 1})">+</button>
        </div>
        <button class="btn btn-danger btn-sm" onclick="removeCartItem('${item.key}')">🗑️ Remove</button>
      </div>
    </div>
  `).join('');

  updateSummary();
}

function updateCartQty(key, qty) {
  if (qty <= 0) { removeCartItem(key); return; }
  Cart.updateQty(key, qty);
  renderCart();
}

function removeCartItem(key) {
  Cart.remove(key);
  renderCart();
  Toast.show('Item removed from cart', 'info');
}

function updateSummary() {
  const cart = Cart.get();
  const subtotal = Cart.getTotal();
  const deliveryFee = DELIVERY_OPTIONS[selectedDelivery]?.price || 0;

  let discount = 0;
  if (couponApplied) {
    const coupon = COUPONS[couponApplied];
    if (coupon.type === 'percent') discount = Math.round(subtotal * coupon.value / 100);
    else discount = coupon.value;
  }

  const total = Math.max(0, subtotal - discount + deliveryFee);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const show = (id, visible) => { const el = document.getElementById(id); if (el) el.style.display = visible ? '' : 'none'; };

  set('subtotalAmt', formatPrice(subtotal));
  set('deliveryAmt', deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee));
  set('totalAmt', formatPrice(total));
  set('itemCount', `${cart.reduce((s, i) => s + i.qty, 0)} items`);

  if (discount > 0) {
    set('discountAmt', `−${formatPrice(discount)}`);
    show('discountRow', true);
  } else {
    show('discountRow', false);
  }
}

function applyCoupon() {
  const input = document.getElementById('couponInput');
  const code = input?.value.trim().toUpperCase();
  if (!code) { Toast.show('Please enter a coupon code', 'warning'); return; }

  if (COUPONS[code]) {
    couponApplied = code;
    Toast.show(`Coupon <strong>${code}</strong> applied! ${COUPONS[code].label} 🎉`, 'success');
    updateSummary();
    if (input) { input.value = code; input.disabled = true; }
    const btn = document.getElementById('applyCouponBtn');
    if (btn) { btn.textContent = '✓ Applied'; btn.disabled = true; btn.style.color = 'var(--success)'; }
  } else {
    Toast.show('Invalid coupon code. Try FRESH10, SAVE50, or NEWUSER', 'error');
  }
}

// ===== CHECKOUT MODAL =====
function openCheckout() {
  if (Cart.get().length === 0) { Toast.show('Your cart is empty!', 'warning'); return; }
  checkoutStep = 1;
  updateCheckoutStep();
  document.getElementById('checkoutModal')?.classList.add('active');
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.remove('active');
}

function updateCheckoutStep() {
  document.querySelectorAll('.checkout-form-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === checkoutStep);
  });
  document.querySelectorAll('.checkout-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === checkoutStep);
    el.classList.toggle('done', i + 1 < checkoutStep);
  });
}

function nextCheckoutStep() {
  if (checkoutStep < 3) {
    checkoutStep++;
    updateCheckoutStep();
  } else {
    placeOrder();
  }
}

function prevCheckoutStep() {
  if (checkoutStep > 1) { checkoutStep--; updateCheckoutStep(); }
}

function placeOrder() {
  const total = Cart.getTotal() + (DELIVERY_OPTIONS[selectedDelivery]?.price || 0);
  const orderId = 'ORD-2026-' + Math.floor(Math.random() * 9000 + 1000);

  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.unshift({
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'processing',
    items: Cart.get(),
    total,
    address: document.getElementById('deliveryAddress')?.value || '—',
    estimatedDelivery: '2-3 days',
    timeline: [
      { icon: '✅', title: 'Order Placed', desc: 'Confirmed!', time: new Date().toLocaleTimeString(), done: true, active: true },
      { icon: '🏭', title: 'Processing', desc: 'Packing your items', time: 'Soon', done: false, active: true },
      { icon: '🚚', title: 'Shipped', desc: 'Out for delivery', time: 'Pending', done: false },
      { icon: '🏠', title: 'Delivered', desc: 'Delivered to your door', time: 'Pending', done: false }
    ]
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  Cart.clear();
  closeCheckout();

  // Show success
  document.getElementById('cartWrap').style.display = 'none';
  document.getElementById('cartEmpty').style.display = 'none';
  const successDiv = document.getElementById('orderSuccess');
  if (successDiv) {
    successDiv.style.display = 'block';
    document.getElementById('successOrderId').textContent = orderId;
  }
}

function selectDelivery(option) {
  selectedDelivery = option;
  document.querySelectorAll('.delivery-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.delivery === option);
  });
  updateSummary();
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.payment === method);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // Coupon
  document.getElementById('applyCouponBtn')?.addEventListener('click', applyCoupon);
  document.getElementById('couponInput')?.addEventListener('keypress', e => e.key === 'Enter' && applyCoupon());

  // Checkout button
  document.getElementById('checkoutBtn')?.addEventListener('click', openCheckout);

  // Modal close
  document.getElementById('checkoutModalClose')?.addEventListener('click', closeCheckout);
  document.getElementById('checkoutModal')?.addEventListener('click', e => {
    if (e.target.id === 'checkoutModal') closeCheckout();
  });

  // Step navigation
  document.getElementById('nextStep1')?.addEventListener('click', () => {
    const addr = document.getElementById('deliveryAddress')?.value.trim();
    if (!addr) { Toast.show('Please enter your delivery address', 'warning'); return; }
    nextCheckoutStep();
  });
  document.getElementById('nextStep2')?.addEventListener('click', nextCheckoutStep);
  document.getElementById('prevStep2')?.addEventListener('click', prevCheckoutStep);
  document.getElementById('prevStep3')?.addEventListener('click', prevCheckoutStep);
  document.getElementById('placeOrderBtn')?.addEventListener('click', placeOrder);

  // Delivery options
  document.querySelectorAll('.delivery-option').forEach(el => {
    el.addEventListener('click', () => selectDelivery(el.dataset.delivery));
  });

  // Payment options
  document.querySelectorAll('.payment-option').forEach(el => {
    el.addEventListener('click', () => selectPayment(el.dataset.payment));
  });

  // Clear cart
  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    if (confirm('Clear all items from cart?')) {
      Cart.clear();
      renderCart();
      Toast.show('Cart cleared', 'info');
    }
  });

  // Continue shopping
  document.getElementById('continueShopBtn')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Cart updated event
  window.addEventListener('cart-updated', renderCart);
});
