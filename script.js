const menuItems = [
  {
    id: "espresso",
    category: "Coffee",
    name: "Espresso",
    price: 99,
    description: "Bold and aromatic single-origin espresso with a rich crema finish.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cappuccino",
    category: "Coffee",
    name: "Cappuccino",
    price: 149,
    description: "Velvety milk foam and a deep coffee base for a perfectly balanced cup.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cafe-latte",
    category: "Coffee",
    name: "Cafe Latte",
    price: 159,
    description: "Smooth espresso blended with steamed milk and a hint of sweetness.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "cold-coffee",
    category: "Coffee",
    name: "Cold Coffee",
    price: 169,
    description: "Chilled, creamy, and refreshingly smooth with a decadent finish.",
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "veg-burger",
    category: "Fast Food",
    name: "Classic Veg Burger",
    price: 129,
    description: "Crispy patty, fresh greens, and chef-made sauce in a toasted bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "margherita-pizza",
    category: "Fast Food",
    name: "Margherita Pizza",
    price: 199,
    description: "Wood-fired crust topped with basil, tomato sauce, and creamy mozzarella.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "white-sauce-pasta",
    category: "Fast Food",
    name: "White Sauce Pasta",
    price: 219,
    description: "Creamy garlic sauce, parmesan, and perfectly cooked pasta ribbons.",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "fries",
    category: "Fast Food",
    name: "Loaded French Fries",
    price: 119,
    description: "Golden fries topped with cheese, herbs, and zesty seasoning.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "brownie",
    category: "Desserts",
    name: "Chocolate Brownie",
    price: 129,
    description: "Warm, fudgy, and rich with bites of melted chocolate goodness.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "waffle",
    category: "Desserts",
    name: "Chocolate Waffle",
    price: 179,
    description: "Crisp waffle topped with cocoa drizzle and a scoop of vanilla cream.",
    image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "lava-cake",
    category: "Desserts",
    name: "Chocolate Lava Cake",
    price: 149,
    description: "Warm center, deep cocoa flavor, and a luxurious dessert finish.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80"
  }
];

const STORAGE_KEY = "hotAndChillsCart";
const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("navMenu");

let activeFilter = "all";
let cart = loadCart();

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderMenu(filter = "all") {
  activeFilter = filter;

  const visibleItems = filter === "all"
    ? menuItems
    : menuItems.filter((item) => item.category === filter);

  menuGrid.innerHTML = visibleItems
    .map(
      (item) => `
        <article class="menu-card" aria-label="${item.name}">
          <img src="${item.image}" alt="${item.name}" />
          <div class="menu-card-body">
            <div class="menu-header">
              <h3>${item.name}</h3>
              <span class="price">${formatCurrency(item.price)}</span>
            </div>
            <p>${item.description}</p>
            <button class="add-cart-btn" type="button" data-id="${item.id}">Add to Cart</button>
          </div>
        </article>
      `
    )
    .join("");

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  document.querySelectorAll(".add-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.id);
    });
  });
}

function addToCart(id) {
  const item = menuItems.find((menuItem) => menuItem.id === id);
  if (!item) return;

  const existingItem = cart.find((cartItem) => cartItem.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart();
  renderCart();
}

function updateQuantity(id, change) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
  }

  saveCart();
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getCartTotal();

  cartCount.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
  cartSubtotal.textContent = formatCurrency(subtotal);
  cartTotal.textContent = formatCurrency(subtotal);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        Your cart is empty. Add your favorite coffee or bites to get started.
      </div>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div class="cart-item-main">
            <strong>${item.name}</strong>
            <span>${formatCurrency(item.price)} each</span>
            <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
              <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity for ${item.name}">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity for ${item.name}">+</button>
            </div>
          </div>
          <div class="cart-item-price">
            <strong>${formatCurrency(item.price * item.quantity)}</strong>
          </div>
        </div>
      `
    )
    .join("");

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const { id, action } = button.dataset;
      const change = action === "increase" ? 1 : -1;
      updateQuantity(id, change);
    });
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    renderMenu(button.dataset.filter);
  });
});

navToggle?.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navLinks.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const checkoutButton = document.getElementById("checkoutButton");
checkoutButton?.addEventListener("click", () => {
  if (!cart.length) {
    alert("Your cart is empty. Add a few delicious items before checking out.");
    return;
  }

  alert(`Demo checkout: Your total is ${formatCurrency(getCartTotal())}. No real card payment is processed in this demo.`);
});

function setStatus(element, message, type) {
  element.textContent = message;
  element.classList.remove("success", "error");
  element.classList.add(type);
}

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    setStatus(contactStatus, "Please fill in all fields before sending your message.", "error");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setStatus(contactStatus, "Please enter a valid email address.", "error");
    return;
  }

  setStatus(contactStatus, "Thanks! Your message has been sent successfully.", "success");
  contactForm.reset();
});

const reservationForm = document.getElementById("reservationForm");
const reservationStatus = document.getElementById("reservationStatus");

reservationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const fullName = document.getElementById("reservationName").value.trim();
  const date = document.getElementById("reservationDate").value;
  const time = document.getElementById("reservationTime").value;
  const guests = document.getElementById("guestCount").value;

  if (!fullName || !date || !time || !guests) {
    setStatus(reservationStatus, "Please complete all reservation details.", "error");
    return;
  }

  const guestCount = Number(guests);
  if (guestCount < 1 || guestCount > 20) {
    setStatus(reservationStatus, "Guest count must be between 1 and 20.", "error");
    return;
  }

  setStatus(
    reservationStatus,
    `Reservation request received for ${fullName} on ${date} at ${time}. Demo confirmation only.`,
    "success"
  );
  reservationForm.reset();
});

renderMenu(activeFilter);
renderCart();
