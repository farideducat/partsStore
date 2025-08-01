// Part 1: Get the product Id from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Part 2: Get the main container from the HTML
const productDetailsContainer = document.getElementById('product-details-container');
const cartAmount = document.getElementById("cartAmount");

// Load existing basket from local storage
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to update the quantity display and cart icon
let update = (id) => {
    const search = basket.find((x) => x.id === id);
    const quantityElement = document.getElementById(id);

    if (quantityElement) {
        quantityElement.innerHTML = search ? search.item : 0;
    }
    calculation();
};

let calculation = () => {
    if (cartAmount) {
        const totalItems = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
        cartAmount.innerText = totalItems;
    }
};

// --- Cart Management Functions for this page ---
let increement = (id) => {
    const selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    update(selectedItem);
    localStorage.setItem("data", JSON.stringify(basket));
};

let decreement = (id) => {
    const selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined || search.item === 0) return;
    else {
        search.item -= 1;
    }

    update(selectedItem);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
};

let addToCart = (id) => {
    const selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        });
    }

    localStorage.setItem("data", JSON.stringify(basket));
    calculation();

    const messageContainer = document.getElementById('add-to-cart-message');
    if (messageContainer) {
        messageContainer.innerHTML = 'Item added to cart!';
        messageContainer.style.color = 'green';
        setTimeout(() => messageContainer.innerHTML = '', 3000);
    }
};

// Part 3: Display the product details
function displayProductDetails() {
    if (typeof shopItemsData === 'undefined') {
        if (productDetailsContainer) {
            productDetailsContainer.innerHTML = `<p>Error: Product data not found. Check if sourch/data.js is loaded correctly.</p>`;
        }
        return;
    }

    const product = shopItemsData.find(item => item.id === productId);

    if (!productId || !product) {
        if (productDetailsContainer) {
            productDetailsContainer.innerHTML = `<p>Product not found. Please go back to the <a href="index.html">shop</a>.</p>`;
        }
        return;
    }

    const search = basket.find(x => x.id === product.id) || { item: 0 };
    const whatsappNumber = '96878150431';
    const message = `Hello, I would like to order the following product from PARTS STORE:\n\n` +
        `Product Name: ${product.name}\n` +
        `Price: ${product.price} OMR\n` +
        `Description: ${product.description.substring(0, 100)}...\n\n` +
        `Please confirm availability and assist with the order. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    if (productDetailsContainer) {
        productDetailsContainer.innerHTML = `
            <div class="product-details-content">
                <div class="product-image-gallery">
                    <img id="main-product-image" src="${product.img}" alt="${product.name}" class="product-main-image">
                    <div class="product-thumbnails" id="product-thumbnails-container">
                        </div>
                </div>
                <div class="product-info-area">
                    <h1 class="product-detail-name">${product.name}</h1>
                    <p class="product-detail-price">Price: <span>${product.price} OMR</span></p>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-action-section">
                        <div class="quantity-selector">
                            <i onclick="decreement('${product.id}')" class="bi bi-dash-lg"></i>
                            <div id="${product.id}" class="quantity">${search.item}</div>
                            <i onclick="increement('${product.id}')" class="bi bi-plus-lg"></i>
                        </div>
                        <button onclick="addToCart('${product.id}')" class="add-to-cart-btn">Add to Cart</button>
                        <a href="${whatsappLink}" target="_blank" class="whatsapp-order-btn">
                            <i class="bi bi-whatsapp"></i> Order Via Whatsapp
                        </a>
                        <div class="add-to-cart-message" id="add-to-cart-message"></div>
                    </div>
                </div>
            </div>
        `;

        const thumbnailsContainer = document.getElementById('product-thumbnails-container');
        if (product.images && thumbnailsContainer) {
            product.images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = `Thumbnail for ${product.name}`;
                img.classList.add('product-thumbnail');
                img.onclick = () => {
                    document.getElementById('main-product-image').src = imageSrc;
                };
                thumbnailsContainer.appendChild(img);
            });
        }
    }
    update(product.id);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();
    calculation();
});
