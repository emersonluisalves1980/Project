// ============================
// CONFIG API
// ============================
const API_URL = 'http://localhost:3000/products'; // backend Node

// ============================
// ELEMENTOS
// ============================
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');

const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotal = document.getElementById('cart-total');

const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('Search-input');

// ============================
// ESTADO (com persistência)
// ============================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// ============================
// FETCH API (Node backend)
// ============================
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    products = await res.json();
    renderProducts(products);
  } catch (e) {
    console.error('Erro API, usando fallback local');
    products = [
      {
        id: 1,
        name: 'Product 1',
        price: 29.99,
        img: 'https://picsum.photos/300?1',
      },
      {
        id: 2,
        name: 'Product 2',
        price: 49.99,
        img: 'https://picsum.photos/300?2',
      },
      {
        id: 3,
        name: 'Product 3',
        price: 19.99,
        img: 'https://picsum.photos/300?3',
      },
    ];
    renderProducts(products);
  }
}

// ============================
// RENDER
// ============================
function renderProducts(list) {
  productGrid.innerHTML = list
    .map(
      (p) => `
    <div class="product-card">
      <img src="${p.img}" />
      <div style="padding:10px">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button class="add-to-cart" onclick="addToCart(${p.id}, event)">
          Add to Cart
        </button>
      </div>
    </div>
  `
    )
    .join('');
}

// ============================
// ANIMAÇÃO FLY TO CART
// ============================
function flyToCart(imgEl) {
  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  const clone = imgEl.cloneNode(true);
  clone.classList.add('flying-item');

  clone.style.top = rect.top + 'px';
  clone.style.left = rect.left + 'px';

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.transform = `
      translate(${cartRect.left - rect.left}px,
                ${cartRect.top - rect.top}px)
      scale(0.2)
    `;
    clone.style.opacity = '0.3';
  });

  setTimeout(() => clone.remove(), 800);
}

// ============================
// CART LOGIC
// ============================
function addToCart(id, event) {
  const product = products.find((p) => p.id === id);

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  // animação
  const img = event.target.closest('.product-card').querySelector('img');
  flyToCart(img);

  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));

  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);

  cartItemsContainer.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <span>${item.name}</span>

      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>

      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <span class="remove-btn" onclick="removeItem(${item.id})">✖</span>
    </div>
  `
    )
    .join('');

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal.textContent = total.toFixed(2);
}

// ============================
// QUANTIDADE
// ============================
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  updateCart();
}

// ============================
// REMOVER
// ============================
function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCart();
}

// ============================
// DEBOUNCE SEARCH
// ============================
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((value) => {
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(value.toLowerCase())
  );
  renderProducts(filtered);
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});

// ============================
// OPEN / CLOSE
// ============================
cartIcon.onclick = () => {
  cartSidebar.classList.add('active');
  overlay.classList.add('active');
};

closeCart.onclick = overlay.onclick = () => {
  cartSidebar.classList.remove('active');
  overlay.classList.remove('active');
};

// ============================
// INIT
// ============================
loadProducts();
updateCart();
