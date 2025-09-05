// Part 1: Get the product Id from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Load existing basket from local storage
let basket = JSON.parse(localStorage.getItem("data")) || [];

// --- Image Modal Functions (Corrected Slider Logic) ---
let allProductImageUrls = [];
let currentImageIndex = 0;
const modalImageElement = document.getElementById('modal-image');
const prevButton = document.querySelector('.prev-modal-btn');
const nextButton = document.querySelector('.next-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');

// Function to show the image in the modal
function showModalImage(index) {
    if (index >= 0 && index < allProductImageUrls.length) {
        modalImageElement.src = allProductImageUrls[index];
        currentImageIndex = index;
    }
}

// Function to open the modal and set up the image slider
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');

    // Get all image URLs from the main image and thumbnails
    const mainImageUrl = document.getElementById('main-product-image').src;
    const thumbnailElements = document.querySelectorAll('.product-thumbnail');
    const thumbnailUrls = Array.from(thumbnailElements).map(thumb => thumb.src);

    // Combine main image and thumbnails, ensuring no duplicates
    allProductImageUrls = [mainImageUrl, ...thumbnailUrls];
    allProductImageUrls = [...new Set(allProductImageUrls)];

    // Set the initial image in the modal
    currentImageIndex = allProductImageUrls.indexOf(imageSrc);
    showModalImage(currentImageIndex);

    // Show/hide navigation buttons based on number of images
    if (allProductImageUrls.length > 1) {
        if (prevButton) prevButton.style.display = 'block';
        if (nextButton) nextButton.style.display = 'block';
    } else {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    }
}

// Attach event listeners for the slider buttons
if (prevButton && nextButton) {
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex - 1 + allProductImageUrls.length) % allProductImageUrls.length;
        showModalImage(newIndex);
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (currentImageIndex + 1) % allProductImageUrls.length;
        showModalImage(newIndex);
    });
}

// Attach event listener for the close button
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        const modal = document.getElementById('image-modal');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
}

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
    const cartAmount = document.getElementById("cartAmount");
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
        basket.push({ id: selectedItem, item: 1 });
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
        basket.push({ id: selectedItem, item: 1 });
        update(selectedItem);
    }
    localStorage.setItem("data", JSON.stringify(basket));
    calculation();
    const messageContainer = document.getElementById('add-to-cart-message');
    if (messageContainer) {
        messageContainer.innerHTML = ` <a href="checkout.html"> <button> add to cart Items </button> </a>`;
        messageContainer.style.color = 'green';
        setTimeout(() => messageContainer.innerHTML = '', 3000);
    }
};

// Part 3: Display the product details
function displayProductDetails() {
    const productDetailsContainer = document.getElementById('product-details-container');

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
                <img id="main-product-image" onclick="openModal(this.src)" src="${product.img}" alt="${product.name}" class="product-main-image">
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
                // Corrected onclick to use the new modal function
                img.onclick = () => openModal(imageSrc);
                thumbnailsContainer.appendChild(img);
            });
        }
    }
    update(product.id);
}

document.addEventListener('DOMContentLoaded', () => {
    displayProductDetails();
    calculation();
});