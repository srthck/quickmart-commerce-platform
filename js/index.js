// ===== INDEX PAGE LOGIC =====

let currentCategory = 'All';
let currentSort = 'default';
let currentView = 'grid';
let maxPrice = 500;
let minRating = 0;
let searchQuery = '';
let wishlistedIds = new Set(Wishlist.get());

function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchCat = currentCategory === 'All' || p.category === currentCategory;
    const matchPrice = p.price <= maxPrice;
    const matchRating = p.rating >= minRating;
    const matchSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.tags.some(t => t.includes(searchQuery));
    return matchCat && matchPrice && matchRating && matchSearch;
  }).sort((a, b) => {
    switch (currentSort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      case 'discount': return (b.originalPrice - b.price) - (a.originalPrice - a.price);
      default: return 0;
    }
  });
}

function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const countEl = document.getElementById('resultsCount');
  const products = getFilteredProducts();

  countEl.innerHTML = `Showing <span>${products.length}</span> of <span>${PRODUCTS.length}</span> products`;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button class="btn btn-primary" style="margin-top:1.5rem" onclick="resetFilters()">Reset Filters</button>
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(p => {
    const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
    const isWished = wishlistedIds.has(p.id);
    const starsHtml = renderStars(p.rating);

    return `
    <div class="product-card" onclick="goToProduct(${p.id})" id="product-${p.id}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%230f0f2d%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 text-anchor=%22middle%22 font-size=%2260%22>🛍️</text></svg>'">
        ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === 'sale' ? `${discount}% OFF` : p.badge.toUpperCase()}</span>` : ''}
        ${!p.inStock ? '<span class="product-badge" style="background:rgba(100,116,139,0.8);color:#94a3b8">OUT OF STOCK</span>' : ''}
        <button class="wishlist-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist(event, ${p.id})" title="Add to wishlist">${isWished ? '❤️' : '🤍'}</button>
        <div class="product-actions-overlay">
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); goToProduct(${p.id})">👁️ View</button>
          ${p.inStock ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); quickAddToCart(${p.id})">🛒 Add</button>` : ''}
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description}</div>
        <div class="product-rating">
          <span class="rating-stars">${starsHtml}</span>
          <span style="font-size:0.85rem;font-weight:600;">${p.rating}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-current">${formatPrice(p.price)}</span>
            ${p.originalPrice ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
            ${discount > 0 ? `<span class="price-discount">Save ${discount}%</span>` : ''}
          </div>
          ${p.inStock
            ? `<button class="add-cart-btn" onclick="event.stopPropagation(); quickAddToCart(${p.id})">🛒 Add to Cart</button>`
            : `<button class="add-cart-btn" style="opacity:0.4;cursor:not-allowed" disabled>Out of Stock</button>`
          }
        </div>
      </div>
    </div>`;
  }).join('');
}

function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function toggleWishlist(e, id) {
  e.stopPropagation();
  const added = Wishlist.toggle(id);
  if (added) wishlistedIds.add(id);
  else wishlistedIds.delete(id);

  const btn = document.querySelector(`#product-${id} .wishlist-btn`);
  if (btn) {
    btn.classList.toggle('active', added);
    btn.textContent = added ? '❤️' : '🤍';
  }
  Toast.show(added ? 'Added to wishlist! ❤️' : 'Removed from wishlist', added ? 'success' : 'info');
}

function resetFilters() {
  currentCategory = 'All';
  currentSort = 'default';
  maxPrice = 500;
  minRating = 0;
  searchQuery = '';

  document.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === 'All'));
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = 'default';
  const priceRange = document.getElementById('priceRange');
  if (priceRange) { priceRange.value = 500; updatePriceDisplay(500); }
  const navSearch = document.getElementById('navSearch');
  if (navSearch) navSearch.value = '';
  document.querySelectorAll('.rating-star-btn').forEach(b => b.classList.remove('active'));

  renderProducts();
}

function updatePriceDisplay(val) {
  maxPrice = parseInt(val);
  const display = document.getElementById('priceDisplay');
  if (display) display.textContent = formatPrice(maxPrice);
  const range = document.getElementById('priceRange');
  if (range) range.style.setProperty('--val', `${(val / 600) * 100}%`);
}

// ===== INIT INDEX =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();

  // Category buttons
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.dataset.cat;
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });

  // Sort
  const sortSel = document.getElementById('sortSelect');
  sortSel && sortSel.addEventListener('change', e => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Price range
  const priceRange = document.getElementById('priceRange');
  priceRange && priceRange.addEventListener('input', e => {
    updatePriceDisplay(e.target.value);
    renderProducts();
  });
  if (priceRange) updatePriceDisplay(priceRange.value);

  // Rating filter
  document.querySelectorAll('.rating-star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseFloat(btn.dataset.rating);
      if (minRating === val) {
        minRating = 0;
        document.querySelectorAll('.rating-star-btn').forEach(b => b.classList.remove('active'));
      } else {
        minRating = val;
        document.querySelectorAll('.rating-star-btn').forEach(b => b.classList.toggle('active', parseFloat(b.dataset.rating) === val));
      }
      renderProducts();
    });
  });

  // Nav search
  const navSearch = document.getElementById('navSearch');
  navSearch && navSearch.addEventListener('input', e => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderProducts();
  });

  // View toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('productsGrid');
      grid.classList.toggle('list-view', currentView === 'list');
    });
  });
});
