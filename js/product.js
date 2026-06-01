// ===== PRODUCT DETAIL PAGE =====

let selectedVariant = null;
let selectedQty = 1;
let selectedRating = 0;
const productId = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

function renderProductDetail() {
  if (!product) { window.location.href = 'index.html'; return; }

  document.title = `${product.name} — FreshMart`;

  // Breadcrumb
  document.getElementById('breadcrumbProduct').textContent = product.name;

  // Images (use same image for all thumbs for demo)
  const mainImg = document.getElementById('mainProductImg');
  mainImg.src = product.image;
  mainImg.alt = product.name;

  document.querySelectorAll('.gallery-thumb img').forEach((img, idx) => {
    img.src = product.image;
    img.alt = product.name;
    // Set different crops / zoom / filters for premium gallery simulation
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    if (idx === 0) {
      img.style.transform = 'scale(1)';
      img.style.objectPosition = 'center';
    } else if (idx === 1) {
      img.style.transform = 'scale(1.4)';
      img.style.objectPosition = 'center';
    } else if (idx === 2) {
      img.style.transform = 'scale(1.6)';
      img.style.objectPosition = 'top right';
    } else if (idx === 3) {
      img.style.transform = 'scale(1.2)';
      img.style.filter = 'hue-rotate(15deg) brightness(1.05)';
    }
  });

  // Info
  document.getElementById('productCategory').textContent = product.category;
  document.getElementById('productTitle').textContent = product.name;
  document.getElementById('productDesc').textContent = product.description;

  // Rating
  const starsHtml = renderStars(product.rating);
  document.getElementById('productStars').innerHTML = starsHtml;
  document.getElementById('productRatingScore').textContent = product.rating;
  document.getElementById('productReviewCount').textContent = `${product.reviews} reviews`;

  // Price
  document.getElementById('productPriceCurrent').textContent = formatPrice(product.price);
  if (product.originalPrice) {
    document.getElementById('productPriceOld').textContent = formatPrice(product.originalPrice);
    const save = Math.round((1 - product.price / product.originalPrice) * 100);
    document.getElementById('productPriceSave').textContent = `Save ${save}%`;
  }

  // Stock
  document.getElementById('stockStatus').textContent = product.inStock ? '✅ In Stock' : '❌ Out of Stock';
  document.getElementById('stockStatus').style.color = product.inStock ? 'var(--success)' : 'var(--danger)';

  // Variants
  const variantsWrap = document.getElementById('productVariants');
  if (product.variants && product.variants.length) {
    selectedVariant = product.variants[0];
    variantsWrap.innerHTML = product.variants.map((v, i) =>
      `<button class="variant-btn ${i === 0 ? 'selected' : ''}" onclick="selectVariant(this, '${v}')">${v}</button>`
    ).join('');
  }

  // Reviews
  renderReviews();
  renderReviewSummary();
}

function selectVariant(btn, variant) {
  selectedVariant = variant;
  document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function changeQty(delta) {
  selectedQty = Math.max(1, Math.min(20, selectedQty + delta));
  document.getElementById('qtyDisplay').textContent = selectedQty;
}

function addToCartDetail() {
  if (!product.inStock) { Toast.show('This product is out of stock', 'error'); return; }
  Cart.add(product, selectedQty, selectedVariant);
  Toast.show(`<strong>${selectedQty}× ${product.name}</strong> added to cart! 🛒`, 'success');
}

// ===== GALLERY =====
function selectThumb(thumb) {
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const mainImg = document.getElementById('mainProductImg');
  const thumbImg = thumb.querySelector('img');
  if (mainImg && thumbImg) {
    mainImg.src = thumbImg.src;
    mainImg.style.transform = thumbImg.style.transform;
    mainImg.style.objectPosition = thumbImg.style.objectPosition;
    mainImg.style.filter = thumbImg.style.filter;
    mainImg.style.transition = 'transform 0.4s ease, filter 0.4s ease';
  }
}

// ===== REVIEWS =====
function renderReviews() {
  const list = document.getElementById('reviewsList');
  const reviews = PRODUCT_REVIEWS[productId] || PRODUCT_REVIEWS[1] || [];

  if (!reviews.length) {
    list.innerHTML = `<div class="empty-state" style="padding:2rem"><div class="empty-icon" style="font-size:3rem">💬</div><h3>No reviews yet</h3><p>Be the first to review this product!</p></div>`;
    return;
  }

  list.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer">
          <div class="reviewer-avatar">${r.name.charAt(0)}</div>
          <div>
            <div class="reviewer-name">${r.name}</div>
            <div class="reviewer-date">${r.date}</div>
          </div>
        </div>
        <div class="review-rating">${renderStars(r.rating)}</div>
      </div>
      <div class="review-title">${r.title}</div>
      <div class="review-body">${r.body}</div>
      <div class="review-helpful">
        Was this helpful?
        <button class="helpful-btn" onclick="markHelpful(this, ${r.id})">👍 Yes (${r.helpful})</button>
        <button class="helpful-btn" onclick="markHelpful(this, ${r.id})">👎 No</button>
      </div>
    </div>
  `).join('');
}

function renderReviewSummary() {
  const reviews = PRODUCT_REVIEWS[productId] || PRODUCT_REVIEWS[1] || [];
  const total = reviews.length;
  const avg = total ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : product.rating;

  document.getElementById('avgScore').textContent = avg;
  document.getElementById('avgStars').innerHTML = renderStars(parseFloat(avg));
  document.getElementById('totalReviews').textContent = `${product.reviews} total reviews`;

  // Bar distribution (demo)
  const dist = [0, 0, 0, 0, 0];
  reviews.forEach(r => dist[r.rating - 1]++);

  for (let i = 5; i >= 1; i--) {
    const fill = document.getElementById(`bar${i}`);
    const count = document.getElementById(`count${i}`);
    if (fill) fill.style.width = total ? `${(dist[i-1] / total) * 100}%` : '0%';
    if (count) count.textContent = dist[i-1] || 0;
  }
}

function markHelpful(btn) {
  btn.style.color = 'var(--accent-cyan)';
  btn.style.borderColor = 'var(--accent-cyan)';
  Toast.show('Thanks for your feedback!', 'info');
}

// ===== SUBMIT REVIEW =====
function initReviewForm() {
  // Star input
  const stars = document.querySelectorAll('.star-input-btn');
  stars.forEach((star, idx) => {
    star.addEventListener('mouseover', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
    });
    star.addEventListener('click', () => {
      selectedRating = idx + 1;
      stars.forEach((s, i) => s.classList.toggle('active', i <= idx));
    });
  });
  document.querySelector('.star-rating-input')?.addEventListener('mouseleave', () => {
    stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
  });

  const form = document.getElementById('reviewForm');
  form && form.addEventListener('submit', e => {
    e.preventDefault();
    if (!selectedRating) { Toast.show('Please select a star rating', 'warning'); return; }
    const name = document.getElementById('reviewName').value.trim();
    const title = document.getElementById('reviewTitle').value.trim();
    const body = document.getElementById('reviewBody').value.trim();
    if (!name || !body) { Toast.show('Please fill all required fields', 'error'); return; }

    // Add to local reviews
    if (!PRODUCT_REVIEWS[productId]) PRODUCT_REVIEWS[productId] = [];
    PRODUCT_REVIEWS[productId].unshift({ id: Date.now(), name, rating: selectedRating, title: title || 'My Review', body, date: 'Just now', helpful: 0 });

    Toast.show('Review submitted! Thank you 🙏', 'success');
    form.reset();
    selectedRating = 0;
    stars.forEach(s => s.classList.remove('active'));
    renderReviews();
    renderReviewSummary();
  });
}

// ===== RELATED PRODUCTS =====
function renderRelated() {
  const related = PRODUCTS.filter(p => p.id !== productId && p.category === product.category).slice(0, 4);
  const container = document.getElementById('relatedProducts');
  if (!container) return;
  container.innerHTML = related.map(p => `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'" style="cursor:pointer">
      <div class="product-img-wrap" style="aspect-ratio:4/3;overflow:hidden">
        <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer" style="margin-top:0.75rem">
          <span class="price-current">${formatPrice(p.price)}</span>
          <button class="add-cart-btn btn-sm" onclick="event.stopPropagation();quickAddToCart(${p.id})"
            style="padding:6px 12px;font-size:0.78rem">🛒 Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductDetail();
  initReviewForm();
  renderRelated();

  // Qty buttons
  document.getElementById('qtyMinus')?.addEventListener('click', () => changeQty(-1));
  document.getElementById('qtyPlus')?.addEventListener('click', () => changeQty(1));

  // Add to cart button
  document.getElementById('addToCartBtn')?.addEventListener('click', addToCartDetail);

  // Gallery thumbs
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => selectThumb(thumb));
  });
});
