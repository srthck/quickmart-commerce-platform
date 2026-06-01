// ===== PRODUCT DATA =====
const PRODUCTS = [
  {
    id: 1,
    name: "Organic Fruit Basket",
    category: "Fruits",
    price: 249,
    originalPrice: 320,
    rating: 4.8,
    reviews: 142,
    image: "images/fruits.png",
    badge: "hot",
    description: "A handpicked selection of the freshest organic fruits — apples, oranges, bananas, and grapes sourced directly from local farms. Rich in vitamins and naturally sweet.",
    tags: ["organic", "fresh", "seasonal"],
    inStock: true,
    variants: ["500g", "1 kg", "2 kg"]
  },
  {
    id: 2,
    name: "Farm Fresh Dairy Pack",
    category: "Dairy",
    price: 189,
    originalPrice: 220,
    rating: 4.6,
    reviews: 89,
    image: "images/dairy.png",
    badge: "new",
    description: "Premium dairy collection including farm-fresh milk, artisan cheese, creamy yogurt, and butter. All sourced from free-range, grass-fed cows with no preservatives.",
    tags: ["dairy", "fresh", "protein"],
    inStock: true,
    variants: ["Standard", "Premium"]
  },
  {
    id: 3,
    name: "Artisan Bakery Bundle",
    category: "Bakery",
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    reviews: 213,
    image: "images/bakery.png",
    badge: "sale",
    description: "Freshly baked artisan sourdough bread, buttery croissants, and wholesome muffins baked every morning. Made with heritage grain flour, no artificial ingredients.",
    tags: ["baked", "fresh", "artisan"],
    inStock: true,
    variants: ["Small", "Large", "Family"]
  },
  {
    id: 4,
    name: "Garden Fresh Vegetables",
    category: "Vegetables",
    price: 179,
    originalPrice: 240,
    rating: 4.9,
    reviews: 318,
    image: "images/vegetables.png",
    badge: "hot",
    description: "A vibrant mix of garden-fresh vegetables — crisp broccoli, juicy tomatoes, sweet bell peppers, crunchy carrots, and leafy spinach. Farm to table in 24 hours.",
    tags: ["organic", "fresh", "healthy"],
    inStock: true,
    variants: ["500g", "1 kg", "2 kg"]
  },
  {
    id: 5,
    name: "Healthy Snack Collection",
    category: "Snacks",
    price: 299,
    originalPrice: 380,
    rating: 4.5,
    reviews: 76,
    image: "images/snacks.png",
    badge: "new",
    description: "A curated collection of healthy snacks — mixed nuts, energy bars, dried tropical fruits, and whole-grain crackers. Perfect for guilt-free snacking anytime.",
    tags: ["healthy", "snacks", "energy"],
    inStock: true,
    variants: ["Assorted", "Nuts Only", "Fruits Only"]
  },
  {
    id: 6,
    name: "Premium Juice Selection",
    category: "Beverages",
    price: 220,
    originalPrice: 280,
    rating: 4.4,
    reviews: 54,
    image: "images/fruits.png",
    badge: null,
    description: "Cold-pressed juices made from freshly squeezed oranges, pomegranates, and seasonal berries. No added sugars, no preservatives — pure natural goodness.",
    tags: ["beverages", "fresh", "natural"],
    inStock: true,
    variants: ["4-pack", "8-pack", "12-pack"]
  },
  {
    id: 7,
    name: "Whole Grain Bread Loaf",
    category: "Bakery",
    price: 89,
    originalPrice: 110,
    rating: 4.6,
    reviews: 167,
    image: "images/bakery.png",
    badge: null,
    description: "Hearty whole grain bread loaf baked fresh daily, packed with fiber, seeds, and wholesome grains. Perfect for a nutritious breakfast or healthy sandwiches.",
    tags: ["bread", "whole grain", "healthy"],
    inStock: true,
    variants: ["400g", "800g"]
  },
  {
    id: 8,
    name: "Seasonal Veggie Box",
    category: "Vegetables",
    price: 349,
    originalPrice: 420,
    rating: 4.8,
    reviews: 95,
    image: "images/vegetables.png",
    badge: "sale",
    description: "Weekly seasonal vegetable box curated by our in-store experts. Includes 8–10 varieties of farm-fresh produce harvested at peak ripeness for maximum flavor.",
    tags: ["seasonal", "organic", "variety"],
    inStock: true,
    variants: ["Small Box", "Medium Box", "Large Box"]
  },
  {
    id: 9,
    name: "Tropical Fruit Mix",
    category: "Fruits",
    price: 319,
    originalPrice: 390,
    rating: 4.3,
    reviews: 42,
    image: "images/fruits.png",
    badge: null,
    description: "Exotic tropical fruits including mangoes, papayas, pineapples, and dragon fruit. Hand-selected for perfect ripeness and delivered same day.",
    tags: ["tropical", "exotic", "fresh"],
    inStock: false,
    variants: ["1 kg", "2 kg"]
  },
  {
    id: 10,
    name: "Creamy Greek Yogurt",
    category: "Dairy",
    price: 129,
    originalPrice: 160,
    rating: 4.7,
    reviews: 203,
    image: "images/dairy.png",
    badge: "hot",
    description: "Thick, creamy Greek yogurt with live probiotic cultures. High in protein, low in fat. Available in natural, vanilla, and honey varieties.",
    tags: ["dairy", "protein", "probiotic"],
    inStock: true,
    variants: ["Natural", "Vanilla", "Honey", "Strawberry"]
  },
  {
    id: 11,
    name: "Mixed Nut Trail Mix",
    category: "Snacks",
    price: 189,
    originalPrice: 220,
    rating: 4.5,
    reviews: 88,
    image: "images/snacks.png",
    badge: null,
    description: "Premium trail mix with almonds, cashews, walnuts, pistachios, and dried cranberries. Roasted in small batches for maximum freshness and crunch.",
    tags: ["nuts", "healthy", "protein"],
    inStock: true,
    variants: ["200g", "500g", "1 kg"]
  },
  {
    id: 12,
    name: "Sourdough Starter Bread",
    category: "Bakery",
    price: 119,
    originalPrice: 149,
    rating: 4.9,
    reviews: 287,
    image: "images/bakery.png",
    badge: "hot",
    description: "Tangy, chewy sourdough bread made with our 5-year-old starter culture. Naturally leavened, with a perfect crispy crust and airy open crumb. Baked fresh daily.",
    tags: ["sourdough", "artisan", "fermented"],
    inStock: true,
    variants: ["Small Loaf", "Large Loaf"]
  }
];

// ===== REVIEWS DATA =====
const PRODUCT_REVIEWS = {
  1: [
    { id: 1, name: "Priya Sharma", rating: 5, title: "Absolutely Fresh!", body: "The fruits were incredibly fresh and sweet. You can really taste the difference with organic produce. Will definitely order again!", date: "2 days ago", helpful: 12 },
    { id: 2, name: "Rahul Mehta", rating: 4, title: "Great quality, fast delivery", body: "Really happy with the quality. The oranges were a bit small but everything else was perfect. Delivery was super fast!", date: "1 week ago", helpful: 8 },
    { id: 3, name: "Ananya Patel", rating: 5, title: "Best fruit basket ever!", body: "Perfect mix of fruits, all extremely fresh. My kids loved the grapes especially. The packaging was also very eco-friendly.", date: "2 weeks ago", helpful: 15 }
  ],
  2: [
    { id: 1, name: "Vikram Singh", rating: 5, title: "Pure and fresh dairy", body: "The milk is so creamy and fresh, nothing like the packaged stuff. The cheese is excellent too — great for cooking!", date: "3 days ago", helpful: 9 },
    { id: 2, name: "Deepa Nair", rating: 4, title: "Good quality products", body: "Very satisfied with the dairy pack. The yogurt is particularly good — thick and tangy just like homemade.", date: "5 days ago", helpful: 6 }
  ]
};

// ===== ORDERS DATA =====
const SAMPLE_ORDERS = [
  {
    id: "ORD-2024-7821",
    date: "May 28, 2026",
    status: "shipped",
    items: [
      { name: "Organic Fruit Basket", qty: 2, price: 249, image: "images/fruits.png" },
      { name: "Garden Fresh Vegetables", qty: 1, price: 179, image: "images/vegetables.png" }
    ],
    total: 677,
    address: "42, MG Road, Bengaluru – 560001",
    estimatedDelivery: "May 31, 2026",
    timeline: [
      { icon: "✅", title: "Order Placed", desc: "Your order has been confirmed", time: "May 28, 9:15 AM", done: true },
      { icon: "🏭", title: "Processing", desc: "Items picked and packed", time: "May 28, 2:30 PM", done: true },
      { icon: "🚚", title: "Shipped", desc: "Out for delivery with courier", time: "May 29, 8:00 AM", done: true, active: true },
      { icon: "🏠", title: "Delivered", desc: "Delivered to your address", time: "Expected May 31", done: false }
    ]
  },
  {
    id: "ORD-2024-7654",
    date: "May 20, 2026",
    status: "delivered",
    items: [
      { name: "Artisan Bakery Bundle", qty: 1, price: 159, image: "images/bakery.png" },
      { name: "Creamy Greek Yogurt", qty: 3, price: 129, image: "images/dairy.png" }
    ],
    total: 546,
    address: "42, MG Road, Bengaluru – 560001",
    estimatedDelivery: "May 22, 2026",
    timeline: [
      { icon: "✅", title: "Order Placed", desc: "Your order has been confirmed", time: "May 20, 10:00 AM", done: true },
      { icon: "🏭", title: "Processing", desc: "Items picked and packed", time: "May 20, 3:00 PM", done: true },
      { icon: "🚚", title: "Shipped", desc: "Dispatched via delivery partner", time: "May 21, 9:00 AM", done: true },
      { icon: "🏠", title: "Delivered", desc: "Delivered successfully!", time: "May 22, 11:30 AM", done: true }
    ]
  },
  {
    id: "ORD-2024-7512",
    date: "May 15, 2026",
    status: "delivered",
    items: [
      { name: "Healthy Snack Collection", qty: 2, price: 299, image: "images/snacks.png" }
    ],
    total: 598,
    address: "42, MG Road, Bengaluru – 560001",
    estimatedDelivery: "May 17, 2026",
    timeline: [
      { icon: "✅", title: "Order Placed", desc: "Your order has been confirmed", time: "May 15, 7:00 PM", done: true },
      { icon: "🏭", title: "Processing", desc: "Items picked and packed", time: "May 16, 10:00 AM", done: true },
      { icon: "🚚", title: "Shipped", desc: "Dispatched via delivery partner", time: "May 16, 4:00 PM", done: true },
      { icon: "🏠", title: "Delivered", desc: "Delivered successfully!", time: "May 17, 2:00 PM", done: true }
    ]
  }
];

// ===== CART MANAGEMENT =====
const Cart = {
  get() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  },
  save(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.updateBadge();
    window.dispatchEvent(new Event('cart-updated'));
  },
  add(product, qty = 1, variant = null) {
    const cart = this.get();
    const key = variant ? `${product.id}-${variant}` : `${product.id}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        qty,
        variant: variant || (product.variants ? product.variants[0] : null)
      });
    }
    this.save(cart);
  },
  remove(key) {
    const cart = this.get().filter(i => i.key !== key);
    this.save(cart);
  },
  updateQty(key, qty) {
    const cart = this.get();
    const item = cart.find(i => i.key === key);
    if (item) {
      if (qty <= 0) { this.remove(key); return; }
      item.qty = qty;
      this.save(cart);
    }
  },
  clear() { localStorage.removeItem('cart'); this.updateBadge(); },
  getTotal() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
  getCount() { return this.get().reduce((s, i) => s + i.qty, 0); },
  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ===== WISHLIST =====
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('wishlist') || '[]'); },
  save(w) { localStorage.setItem('wishlist', JSON.stringify(w)); },
  toggle(id) {
    const w = this.get();
    const idx = w.indexOf(id);
    if (idx > -1) { w.splice(idx, 1); } else { w.push(id); }
    this.save(w);
    return idx === -1;
  },
  has(id) { return this.get().includes(id); }
};

// ===== TOAST NOTIFICATIONS =====
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'success', duration = 3000) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    this.container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ===== STARS HELPER =====
function renderStars(rating, max = 5) {
  let html = '';
  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star">⭐</span>';
    else if (i - rating < 1 && i - rating > 0) html += '<span class="star">⭐</span>';
    else html += '<span class="star star-empty">☆</span>';
  }
  return html;
}

function formatPrice(p) { return '₹' + p.toLocaleString('en-IN'); }

function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  Cart.add(product);
  Toast.show(`<strong>${product.name}</strong> added to cart! 🛒`, 'success');

  // Animate cart badge
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = '', 300);
  }
}

// ===== SUPPORT CHAT BOT =====
const SupportBot = {
  responses: [
    { keywords: ['order', 'track', 'delivery', 'shipped'], reply: "You can track your order on the 📦 Orders page. Just enter your Order ID or browse your recent orders!" },
    { keywords: ['return', 'refund', 'exchange'], reply: "We offer hassle-free returns within 7 days of delivery. Contact us at support@freshmart.in or call 1800-FRESHMART." },
    { keywords: ['payment', 'pay', 'upi', 'card', 'cash'], reply: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. All online payments are secured with 256-bit SSL." },
    { keywords: ['cancel', 'cancell'], reply: "Orders can be cancelled within 1 hour of placing. Go to Orders > Select Order > Cancel Order. Need help? We're here!" },
    { keywords: ['fresh', 'quality', 'organic'], reply: "All our products are sourced directly from local farms and delivered within 24 hours of harvest. 100% freshness guaranteed!" },
    { keywords: ['time', 'hours', 'when', 'open'], reply: "Our store is open 7 AM – 10 PM, 7 days a week. Same-day delivery available for orders placed before 6 PM!" },
    { keywords: ['hi', 'hello', 'hey', 'namaste'], reply: "Hello! 👋 Welcome to FreshMart support! How can I help you today? Ask me about orders, products, delivery, or returns!" },
    { keywords: ['thank', 'thanks'], reply: "You're welcome! 😊 Is there anything else I can help you with?" },
  ],
  getReply(msg) {
    const lower = msg.toLowerCase();
    for (const r of this.responses) {
      if (r.keywords.some(k => lower.includes(k))) return r.reply;
    }
    return "Thanks for reaching out! 🙏 For detailed assistance, please email us at support@freshmart.in or call 1800-FRESHMART (available 9 AM – 9 PM).";
  }
};

// ===== INIT SUPPORT CHAT =====
function initSupportChat() {
  const fab = document.getElementById('supportFab');
  const popup = document.getElementById('supportPopup');
  const closeBtn = document.getElementById('chatCloseBtn');
  const sendBtn = document.getElementById('chatSendBtn');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  if (!fab) return;

  fab.addEventListener('click', () => {
    popup.classList.toggle('open');
    if (popup.classList.contains('open')) messages.scrollTop = messages.scrollHeight;
  });

  closeBtn && closeBtn.addEventListener('click', () => popup.classList.remove('open'));

  function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    setTimeout(() => {
      addMsg(SupportBot.getReply(text), 'bot');
    }, 800);
  }

  sendBtn && sendBtn.addEventListener('click', sendMsg);
  input && input.addEventListener('keypress', e => e.key === 'Enter' && sendMsg());

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `chat-msg ${who}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Cart.updateBadge();
  initSupportChat();
});
