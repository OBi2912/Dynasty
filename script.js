// Product filtering and navigation functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const products = document.querySelectorAll('.product');
    const productSections = document.querySelectorAll('.product-section');

    // Shopping cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Ensure all cart items have quantity property
    cart = cart.map(item => ({
        ...item,
        quantity: item.quantity || 1
    }));
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Product modal functionality
    const productModal = document.getElementById('product-modal');
    const closeProductModal = document.getElementById('close-product-modal');
    const productModalImg = document.getElementById('product-modal-img');
    const productModalTitle = document.getElementById('product-modal-title');
    const productModalDescription = document.getElementById('product-modal-description');
    const productModalPrice = document.getElementById('product-modal-price');
    const productModalBuy = document.getElementById('product-modal-buy');
    const productModalFavorite = document.getElementById('product-modal-favorite');
    const decreaseQty = document.getElementById('decrease-qty');
    const increaseQty = document.getElementById('increase-qty');
    const productQuantity = document.getElementById('product-quantity');

    let currentProduct = null;
    let currentQuantity = 1;

    // Favorites and user functionality
    const favoritesBtn = document.getElementById('favorites-btn');
    const favoritesCount = document.getElementById('favorites-count');
    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const closeUser = document.getElementById('close-user');
    const userForm = document.getElementById('user-form');
    const createAccountBtn = document.getElementById('create-account-btn');
    const loginLink = document.getElementById('login-link');

    // Favorites modal
    const favoritesModal = document.createElement('div');
    favoritesModal.id = 'favorites-modal';
    favoritesModal.className = 'favorites-modal';
    favoritesModal.innerHTML = `
        <div class="favorites-modal-content">
            <div class="favorites-header">
                <h2>My Favorites</h2>
                <button id="clear-favorites-btn" class="clear-btn" style="font-size: 0.8rem; padding: 5px 10px; margin-right: auto; margin-left: 10px; background-color: #ff4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Clear All</button>
                <button id="close-favorites" class="close-favorites">&times;</button>
            </div>
            <div id="favorites-list" class="favorites-list">
                <!-- Favorites will be added here -->
            </div>
        </div>
    `;
    document.body.appendChild(favoritesModal);

    const closeFavorites = document.getElementById('close-favorites');
    const favoritesList = document.getElementById('favorites-list');

    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const closeSearch = document.getElementById('close-search');

    // Image loading handler
    const images = document.querySelectorAll('.product img');
    images.forEach(img => {
        img.addEventListener('load', function () {
            this.classList.add('loaded');
        });
        // Fallback for cached images
        if (img.complete) {
            img.classList.add('loaded');
        }
    });


    // Filter functionality (existing filters)
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filterType = this.parentElement.querySelector('h3').textContent.toLowerCase().split(' ')[2]; // "type", "material", or "size"
            const filterValue = this.getAttribute('data-filter');

            // Remove active class from siblings
            this.parentElement.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply filter
            filterProducts(filterType, filterValue);
        });
    });

    // Category navigation functionality
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.getAttribute('data-category');

            // Remove active class from all category buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show/hide sections based on category
            showCategory(category);
        });
    });

    // Alternative filter menu functionality
    const typeSelect = document.getElementById('type-select');
    const materialSelect = document.getElementById('material-select');
    const sizeSelect = document.getElementById('size-select');

    // Type filter functionality
    typeSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        console.log(`Type filter changed to: ${selectedValue}`);
        filterProducts('type', selectedValue);
    });

    // Material filter functionality
    materialSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        console.log(`Material filter changed to: ${selectedValue}`);
        filterProducts('material', selectedValue);
    });

    // Size filter functionality
    sizeSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        console.log(`Size filter changed to: ${selectedValue}`);
        filterProducts('size', selectedValue);
    });

    // Unified dropdown functionality
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation();

            // Determine which type of filter this is based on parent container
            const parentContainer = this.closest('.filter-type-container');
            let filterType = '';

            if (parentContainer.querySelector('.filter-type-btn[data-filter-type="type"]')) {
                filterType = 'type';
            } else if (parentContainer.querySelector('.filter-type-btn[data-filter-type="material"]')) {
                filterType = 'material';
            } else if (parentContainer.querySelector('.filter-type-btn[data-filter-type="size"]')) {
                filterType = 'size';
            }

            // Remove active class from all items in the same dropdown
            const siblingItems = parentContainer.querySelectorAll('.dropdown-item');
            siblingItems.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');

            // Apply the filter
            const filterValue = this.getAttribute('data-filter');
            console.log(`Applying ${filterType} filter: ${filterValue}`); // Debug log
            filterProducts(filterType, filterValue);
        });
    });

    function showFilterSection(filterType) {
        // Hide all filter sections first
        const allFilterSections = document.querySelectorAll('.filters-bar, .filter-section');
        allFilterSections.forEach(section => {
            section.style.display = 'none';
        });

        // Show the appropriate filter section
        if (filterType === 'type') {
            // Show the horizontal filter bar (which has type filters)
            const filtersBar = document.querySelector('.filters-bar');
            if (filtersBar) filtersBar.style.display = 'block';
        } else if (filterType === 'material' || filterType === 'size') {
            // Show the dedicated filter section
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) filterSection.style.display = 'block';
        }
    }

    function filterProducts(filterType, filterValue) {
        console.log(`Filtering by ${filterType}: ${filterValue}`); // Debug log

        // If filtering by category navigation, don't apply additional filters
        if (filterType === 'category') {
            return;
        }

        products.forEach(product => {
            const productData = product.getAttribute(`data-${filterType}`);
            console.log(`Product data-${filterType}:`, productData); // Debug log

            let shouldShow = false;

            if (filterValue === 'all') {
                // Show all products when "all" is selected
                shouldShow = true;
            } else if (productData && productData.includes(filterValue)) {
                // Show products that match the filter
                shouldShow = true;
            }

            if (shouldShow) {
                product.classList.remove('hidden');
            } else {
                product.classList.add('hidden');
            }
        });
    }

    function showCategory(category) {
        if (category === 'all') {
            // Show all sections
            productSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // Hide all sections first
            productSections.forEach(section => {
                section.style.display = 'none';
            });
            // Show the selected section
            const targetSection = document.getElementById(category);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Smooth scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Smooth scrolling for footer navigation
    const navLinks = document.querySelectorAll('footer a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add hover effects for products
    products.forEach(product => {
        product.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        product.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button click animation
    const buttons = document.querySelectorAll('.product button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    products.forEach(product => {
        observer.observe(product);
    });


    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';

        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        console.log('Initial theme set to:', currentTheme);

        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            console.log('Switching from', currentTheme, 'to', newTheme);

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    } else {
        console.error('Theme toggle button not found!');
    }

    // Language toggle functionality
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        const currentLanguage = localStorage.getItem('language') || 'en';

        // Set initial language
        document.documentElement.setAttribute('data-lang', currentLanguage);
        updateLanguage(currentLanguage);

        // Set initial button text
        languageToggle.innerHTML = currentLanguage === 'en' ? '🇺🇸 EN/ES' : '🇪🇸 ES/EN';

        languageToggle.addEventListener('click', function () {
            const currentLanguage = document.documentElement.getAttribute('data-lang');
            const newLanguage = currentLanguage === 'en' ? 'es' : 'en';

            document.documentElement.setAttribute('data-lang', newLanguage);
            localStorage.setItem('language', newLanguage);
            updateLanguage(newLanguage);

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    function updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-en], [data-es]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                if (element.tagName === 'TITLE') {
                    document.title = text;
                } else {
                    element.textContent = text;
                }
            }
        });

        // Update button text
        languageToggle.innerHTML = lang === 'en' ? '🇺🇸 EN/ES' : '🇪🇸 ES/EN';

        // Update placeholders
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.placeholder = lang === 'en' ? 'Search jewelry...' : 'Buscar joyería...';
        }

        // Update select options
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            const options = select.querySelectorAll('option');
            options.forEach(option => {
                const text = option.getAttribute(`data-${lang}`);
                if (text) {
                    option.textContent = text;
                }
            });
        });
    }

    // Function to hide all dropdowns
    function hideAllDropdowns() {
        const dropdowns = document.querySelectorAll('.type-dropdown, .material-dropdown, .size-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }

    // Cart and favorites functions
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    function updateFavoritesCount() {
        favoritesCount.textContent = favorites.length;
    }

    function addToCart(productName, price, imageSrc) {
        const itemPrice = parseFloat(price.replace('$', '').replace(',', ''));
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            // If product exists, increase quantity
            existingItem.quantity += 1;
        } else {
            // If product doesn't exist, add new item with quantity 1
            const item = {
                name: productName,
                price: itemPrice,
                image: imageSrc,
                id: Date.now(), // Simple unique ID
                quantity: 1
            };
            cart.push(item);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }

    function addToFavorites(productName, price, imageSrc) {
        const item = {
            name: productName,
            price: parseFloat(price.replace('$', '').replace(',', '')),
            image: imageSrc,
            id: Date.now() // Simple unique ID
        };
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();
    }

    function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }

    function updateCartDisplay() {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.quantity;
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                        <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">×</button>
                `;
                cartItems.appendChild(itemElement);
            });
        }

        cartTotal.textContent = total.toFixed(2);
    }

    // Search functions
    function searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        let hasResults = false;

        products.forEach(product => {
            const name = product.querySelector('h3').textContent.toLowerCase();
            const description = product.querySelector('p').textContent.toLowerCase();

            if (name.includes(lowerQuery) || description.includes(lowerQuery)) {
                product.classList.remove('hidden');
                hasResults = true;
            } else {
                product.classList.add('hidden');
            }
        });

        // Show all sections if no search query
        if (!query) {
            productSections.forEach(section => {
                section.style.display = 'block';
            });
        } else {
            // Hide sections that have no visible products
            productSections.forEach(section => {
                const visibleProducts = section.querySelectorAll('.product:not(.hidden)');
                if (visibleProducts.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            });
        }
    }

    // Event listeners for cart
    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
        updateCartDisplay();
    });

    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(itemId);
        }
    });

    checkoutBtn.addEventListener('click', () => {
        openCheckoutModal();
    });

    function openCheckoutModal() {
        // Populate checkout items
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');

        checkoutItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="checkout-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            checkoutItems.appendChild(itemElement);
        });

        checkoutTotal.textContent = total.toFixed(2);
        document.getElementById('checkout-modal').style.display = 'block';
    }

    // Checkout modal functionality
    const closeCheckout = document.getElementById('close-checkout');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const shippingForm = document.getElementById('shipping-form');

    closeCheckout.addEventListener('click', () => {
        document.getElementById('checkout-modal').style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('checkout-modal')) {
            document.getElementById('checkout-modal').style.display = 'none';
        }
    });

    placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Validate form
        const formData = new FormData(shippingForm);
        let isValid = true;

        shippingForm.querySelectorAll('input[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }

        // Get payment method
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Process order
        alert(`Order placed successfully!\nPayment Method: ${paymentMethod}\nTotal: $${document.getElementById('checkout-total').textContent}`);

        // Clear cart and close modal
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
        document.getElementById('checkout-modal').style.display = 'none';
        shippingForm.reset();
    });

    // Event listeners for search
    searchBtn.addEventListener('click', () => {
        searchModal.style.display = 'block';
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        // Reset search results
        products.forEach(product => {
            product.classList.remove('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = '';
            // Reset search results
            products.forEach(product => {
                product.classList.remove('hidden');
            });
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        searchProducts(query);
    });

    // Search button functionality in modal
    document.getElementById('search-btn').addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchProducts(query);
            searchModal.style.display = 'none';
        }
    });

    // Enter key functionality in search modal
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
                searchModal.style.display = 'none';
            }
        }
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            searchModal.style.display = 'none';
            searchInput.value = '';
            // Reset search results
            products.forEach(product => {
                product.classList.remove('hidden');
            });
        }
    });

    // Product click functionality
    document.querySelectorAll('.product').forEach(product => {
        product.addEventListener('click', function (e) {
            // Don't open modal if clicking on favorite icon, buy button, or size options
            if (e.target.closest('.favorite-icon') || e.target.tagName === 'BUTTON' || e.target.closest('.size-option')) {
                return;
            }

            const name = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const price = this.querySelector('.price').textContent;
            const image = this.querySelector('img').src;

            openProductModal(name, description, price, image);
        });
    });

    // Size selection functionality
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function () {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.size-option').forEach(opt => {
                opt.classList.remove('active');
            });
            // Add active class to clicked option
            this.classList.add('active');
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.product button').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation(); // Prevent product modal from opening
            const product = this.closest('.product');
            const name = product.querySelector('h3').textContent;
            const price = product.querySelector('.price').textContent;
            const image = product.querySelector('img').src;

            addToCart(name, price, image);
            this.textContent = 'Added to Cart!';
            setTimeout(() => {
                this.textContent = 'Buy Now';
            }, 2000);
        });
    });

    function openProductModal(name, description, price, image) {
        currentProduct = { name, description, price, image };
        currentQuantity = 1;

        productModalImg.src = image;
        productModalImg.alt = name;
        productModalTitle.textContent = name;
        productModalDescription.textContent = description;
        productModalPrice.textContent = price;
        productQuantity.textContent = currentQuantity;

        // Check if product is in favorites
        const isInFavorites = favorites.some(item => item.name === name);
        productModalFavorite.textContent = isInFavorites ? '❤️' : '🤍';

        productModal.style.display = 'flex';
    }

    // Close product modal
    closeProductModal.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Quantity controls
    decreaseQty.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            productQuantity.textContent = currentQuantity;
        }
    });

    increaseQty.addEventListener('click', () => {
        currentQuantity++;
        productQuantity.textContent = currentQuantity;
    });

    // Product modal favorite button
    productModalFavorite.addEventListener('click', () => {
        if (!currentProduct) return;

        const isFavorited = productModalFavorite.textContent === '❤️';
        if (isFavorited) {
            removeFromFavorites(currentProduct.name);
            productModalFavorite.textContent = '🤍';
        } else {
            addToFavorites(currentProduct.name, currentProduct.price, currentProduct.image);
            productModalFavorite.textContent = '❤️';
        }
    });

    // Product modal buy button
    productModalBuy.addEventListener('click', () => {
        if (!currentProduct) return;

        // Add multiple items to cart based on quantity
        for (let i = 0; i < currentQuantity; i++) {
            addToCart(currentProduct.name, currentProduct.price, currentProduct.image);
        }

        productModalBuy.textContent = 'Added to Cart!';
        setTimeout(() => {
            productModalBuy.textContent = 'Buy Now';
        }, 2000);
    });

    // Favorites button
    favoritesBtn.addEventListener('click', () => {
        displayFavorites();
        favoritesModal.style.display = 'flex';
    });

    // Close favorites modal
    closeFavorites.addEventListener('click', () => {
        favoritesModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === favoritesModal) {
            favoritesModal.style.display = 'none';
        }
    });

    // Clear Favorites Functionality
    const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all favorites?')) {
                favorites = [];
                localStorage.setItem('favorites', JSON.stringify(favorites));
                updateFavoritesCount();
                displayFavorites();
                // Reset all heart icons
                document.querySelectorAll('.favorite-icon').forEach(icon => {
                    icon.setAttribute('data-favorited', 'false');
                    icon.textContent = '🤍';
                });
            }
        });
    }

    // User button
    userBtn.addEventListener('click', () => {
        userModal.style.display = 'flex';
    });

    // Close user modal
    closeUser.addEventListener('click', () => {
        userModal.style.display = 'none';
        userForm.reset();
    });

    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            userModal.style.display = 'none';
            userForm.reset();
        }
    });

    // Create account functionality
    createAccountBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const formData = new FormData(userForm);
        const userData = {
            fullName: document.getElementById('reg-full-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            confirmPassword: document.getElementById('reg-confirm-password').value,
            phone: document.getElementById('reg-phone').value,
            newsletter: document.getElementById('reg-newsletter').checked
        };

        // Validation
        if (!userData.fullName || !userData.email || !userData.password) {
            alert('Please fill in all required fields.');
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (userData.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = existingUsers.some(user => user.email === userData.email);

        if (userExists) {
            alert('An account with this email already exists.');
            return;
        }

        // Save user (without password for security)
        const userToSave = {
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            newsletter: userData.newsletter,
            createdAt: new Date().toISOString()
        };

        existingUsers.push(userToSave);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        alert('Account created successfully! Welcome to Luxury Jewelry Dynasty Collection.');
        userModal.style.display = 'none';
        userForm.reset();
    });

    // Login link (placeholder)
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Login functionality would be implemented here.');
    });

    // Initialize cart and favorites count
    updateCartCount();
    updateFavoritesCount();

    // Load favorites from localStorage and update UI
    loadFavorites();

    // Favorite icon functionality
    document.querySelectorAll('.favorite-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            const product = this.closest('.product');
            const name = product.querySelector('h3').textContent;
            const price = product.querySelector('.price').textContent;
            const image = product.querySelector('img').src;
            const isFavorited = this.getAttribute('data-favorited') === 'true';

            if (isFavorited) {
                // Remove from favorites
                removeFromFavorites(name);
                this.setAttribute('data-favorited', 'false');
                this.textContent = '🤍';
            } else {
                // Add to favorites
                addToFavorites(name, price, image);
                this.setAttribute('data-favorited', 'true');
                this.textContent = '❤️';
            }
        });
    });

    function addToFavorites(productName, price, imageSrc) {
        // Check if already in favorites to prevent duplicates
        if (favorites.some(item => item.name === productName)) {
            return;
        }

        const item = {
            name: productName,
            price: typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price,
            image: imageSrc,
            image: imageSrc,
            id: Date.now() + Math.random() // Robust unique ID
        };
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();

        // Update icon state if visible
        const icon = Array.from(document.querySelectorAll('.product')).find(p =>
            p.querySelector('h3').textContent === productName
        )?.querySelector('.favorite-icon');

        if (icon) {
            icon.setAttribute('data-favorited', 'true');
            icon.textContent = '❤️';
        }
    }

    function removeFromFavorites(productName) {
        favorites = favorites.filter(item => item.name !== productName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesCount();

        // Update grid icons
        const icon = Array.from(document.querySelectorAll('.product')).find(p =>
            p.querySelector('h3').textContent === productName
        )?.querySelector('.favorite-icon');

        if (icon) {
            icon.setAttribute('data-favorited', 'false');
            icon.textContent = '🤍';
        }

        // Also update modal favorite button if open
        if (currentProduct && currentProduct.name === productName) {
            productModalFavorite.textContent = '🤍';
        }
    }

    function loadFavorites() {
        const favoriteIcons = document.querySelectorAll('.favorite-icon');
        favoriteIcons.forEach(icon => {
            const product = icon.closest('.product');
            const name = product.querySelector('h3').textContent;
            const isInFavorites = favorites.some(item => item.name === name);

            if (isInFavorites) {
                icon.setAttribute('data-favorited', 'true');
                icon.textContent = '❤️';
            } else {
                icon.setAttribute('data-favorited', 'false');
                icon.textContent = '🤍';
            }
        });
    }

    function displayFavorites() {
        if (!favoritesList) return;

        favoritesList.innerHTML = '';

        if (favorites.length === 0) {
            favoritesList.innerHTML = '<p style="text-align: center; padding: 40px; color: var(--text-secondary);">No favorites yet. Add some products to your favorites!</p>';
            return;
        }

        favorites.forEach(item => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                <div class="favorite-item-details">
                    <h3 style="color: var(--text-primary); margin-bottom: 5px;">${item.name}</h3>
                    <p style="color: var(--text-secondary); font-weight: bold;">$${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
                </div>
                <button class="remove-favorite" data-name="${item.name}">Remove</button>
            `;
            favoritesList.appendChild(favoriteItem);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', function () {
                const name = this.getAttribute('data-name');
                removeFromFavorites(name);
                displayFavorites(); // Refresh the display
            });
        });
    }

    // Initialize: show all sections by default
    showCategory('all');
    hideAllDropdowns(); // Start with all dropdowns hidden

    // Close modals with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            // Close cart modal if open
            if (cartModal.style.display === 'block') {
                cartModal.style.display = 'none';
            }
            // Close search modal if open
            if (searchModal.style.display === 'block') {
                searchModal.style.display = 'none';
                searchInput.value = '';
                // Reset search results
                products.forEach(product => {
                    product.classList.remove('hidden');
                });
            }
            // Close product modal if open
            if (productModal.style.display === 'flex') {
                productModal.style.display = 'none';
            }
            // Close checkout modal if open
            if (document.getElementById('checkout-modal').style.display === 'block') {
                document.getElementById('checkout-modal').style.display = 'none';
            }
            // Close user modal if open
            if (userModal.style.display === 'flex') {
                userModal.style.display = 'none';
                userForm.reset();
            }
            // Close favorites modal if open
            if (favoritesModal.style.display === 'flex') {
                favoritesModal.style.display = 'none';
            }
        }
    });
});
// Payment Method Toggle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const creditCardForm = document.getElementById('credit-card-form');
    const paypalForm = document.getElementById('paypal-form');
    const bankTransferForm = document.getElementById('bank-transfer-form');
    const codForm = document.getElementById('cod-form');

    function togglePaymentForms() {
        // Hide all forms first
        if (creditCardForm) creditCardForm.style.display = 'none';
        if (paypalForm) paypalForm.style.display = 'none';
        if (bankTransferForm) bankTransferForm.style.display = 'none';
        if (codForm) codForm.style.display = 'none';

        // Get selected value
        const selectedValue = document.querySelector('input[name="payment"]:checked').value;

        // Show relevant form
        if (selectedValue === 'credit-card' && creditCardForm) {
            creditCardForm.style.display = 'block';
        } else if (selectedValue === 'paypal' && paypalForm) {
            paypalForm.style.display = 'block';
        } else if (selectedValue === 'bank-transfer' && bankTransferForm) {
            bankTransferForm.style.display = 'block';
        } else if (selectedValue === 'cash-on-delivery' && codForm) {
            codForm.style.display = 'block';
        }
    }

    // Attach event listeners to all payment radio buttons
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', togglePaymentForms);
    });

    // Run once on load to set initial state
    togglePaymentForms();
});
