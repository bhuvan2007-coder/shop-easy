// Sample product data
const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 69999,
        image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 129999,
        image: "https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        name: "Wireless Earbuds",
        price: 14999,
        image: "https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 24999,
        image: "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const closeModal = document.querySelector('.close');
const customerForm = document.getElementById('customer-form');
const cartDetails = document.getElementById('cart-details');
const checkoutForm = document.getElementById('payment-form');
const orderConfirmation = document.getElementById('order-confirmation');
const orderId = document.getElementById('order-id');

// Current product index
let currentProductIndex = 0;

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    
    // Check if we're in the products section
    const isProductsSection = window.location.hash === '#products';
    
    if (isProductsSection) {
        // Step by step display for products section
        const productContainer = document.createElement('div');
        productContainer.className = 'product-container';
        
        const product = products[currentProductIndex];
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-navigation">
                <button class="nav-btn prev-btn" onclick="navigateProduct(-1)" ${currentProductIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="product-counter">${currentProductIndex + 1} / ${products.length}</span>
                <button class="nav-btn next-btn" onclick="navigateProduct(1)" ${currentProductIndex === products.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
            </div>
        `;
        
        productContainer.appendChild(productCard);
        productGrid.appendChild(productContainer);
    } else {
        // Grid display for home section
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }
}

// Navigate between products
function navigateProduct(direction) {
    currentProductIndex = (currentProductIndex + direction + products.length) % products.length;
    displayProducts();
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    const addButton = event.target.closest('.add-to-cart');
    
    // Add button animation
    addButton.innerHTML = '<i class="fas fa-check"></i> Added!';
    addButton.classList.add('added');
    
    // Reset button after animation
    setTimeout(() => {
        addButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        addButton.classList.remove('added');
    }, 1500);

    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`Added another ${product.name} to cart!`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
        showNotification(`${product.name} added to cart!`);
    }

    updateCart();
    
    // Animate cart icon
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.classList.add('bounce');
    setTimeout(() => {
        cartIcon.classList.remove('bounce');
    }, 300);
}

// Update cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn" title="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotalAmount.textContent = total.toLocaleString('en-IN');
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-shopping-cart"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Add show class for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Format card number
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    input.value = formattedValue;
}

// Format expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
    }
    input.value = value;
}

// Generate order ID
function generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Handle customer form submission
document.getElementById('customer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.checkValidity()) {
        return;
    }

    // Get customer details
    const customerDetails = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value,
        city: document.getElementById('customer-city').value,
        state: document.getElementById('customer-state').value,
        pin: document.getElementById('customer-pin').value
    };

    // Store customer details
    localStorage.setItem('customerDetails', JSON.stringify(customerDetails));

    // Hide customer details form and show payment form
    const cartDetails = document.getElementById('cart-details');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (cartDetails && checkoutForm) {
        cartDetails.style.display = 'none';
        checkoutForm.style.display = 'block';
    }
});

// Handle payment form submission
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get customer details from localStorage
    const customerDetails = JSON.parse(localStorage.getItem('customerDetails'));
    
    // Generate order ID
    const newOrderId = generateOrderId();
    document.getElementById('order-id').textContent = newOrderId;

    // Show confirmation with customer details
    const checkoutForm = document.getElementById('checkout-form');
    const orderConfirmation = document.getElementById('order-confirmation');
    
    if (checkoutForm && orderConfirmation) {
        checkoutForm.style.display = 'none';
        orderConfirmation.style.display = 'block';
        orderConfirmation.innerHTML = `
            <h3>Order Confirmed!</h3>
            <p>Thank you for your purchase, ${customerDetails.name}!</p>
            <p>Order ID: <span id="order-id">${newOrderId}</span></p>
            <p>Delivery Address:</p>
            <p>${customerDetails.address}<br>
            ${customerDetails.city}, ${customerDetails.state} ${customerDetails.pin}</p>
            <p>A confirmation email has been sent to ${customerDetails.email}</p>
        `;
    }

    // Clear cart and localStorage
    cart = [];
    localStorage.removeItem('customerDetails');
    updateCart();

    // Reset forms
    document.getElementById('customer-form').reset();
    this.reset();

    // Close modal after 5 seconds
    setTimeout(() => {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'none';
        }
        if (orderConfirmation) {
            orderConfirmation.style.display = 'none';
        }
        if (cartDetails) {
            cartDetails.style.display = 'block';
        }
        if (checkoutForm) {
            checkoutForm.style.display = 'none';
        }
    }, 5000);
});

// Add phone number formatting
document.getElementById('customer-phone').addEventListener('input', function() {
    formatPhoneNumber(this);
});

// Add input formatting
document.getElementById('card').addEventListener('input', function() {
    formatCardNumber(this);
});

document.getElementById('expiry').addEventListener('input', function() {
    formatExpiryDate(this);
});

// Event Listeners
document.querySelector('.cart-icon').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    const orderConfirmation = document.getElementById('order-confirmation');
    const cartDetails = document.getElementById('cart-details');
    const checkoutForm = document.getElementById('checkout-form');
    
    if (cartModal) {
        cartModal.style.display = 'block';
    }
    if (orderConfirmation) {
        orderConfirmation.style.display = 'none';
    }
    if (cartDetails) {
        cartDetails.style.display = 'block';
    }
    if (checkoutForm) {
        checkoutForm.style.display = 'none';
    }
});

// Close modal when clicking the close button
document.querySelector('.close').addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const cartModal = document.getElementById('cart-modal');
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add event listener for hash changes
window.addEventListener('hashchange', function() {
    displayProducts();
});

// Initialize the page
displayProducts(); 