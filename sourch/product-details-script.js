/*//Part 1: get the product Id from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Part 2: Get the HTML container where product details will be displayed
const productDetailContainer = document.getElementById('product-detail-container');


// Part 3: Function to display the product details
 function displayProductDetails (){
    if(!productId) {
         productDetailContainer.innerHTML = `<p>Product not found. Please go back to the <a href="index.html">shop</a>.</p>`;
  return;
 }

         // Find the product in your shopItemsData array (from data.js)
          const product = shopItemsData.find(item => item.id === productId);

   // Check if the product was found
    if (!product) {
        productDetailContainer.innerHTML = `<p>Product with ID "${productId}" not found. Please go back to the <a href="index.html">shop</a>.</p>`;
        return; // Stop execution if product not found
    }

           // If product is found, populate the container with its details
           productDetailContainer.innerHTML = `
              <div class="single-product-wrapper">
                <div class="product-image-area"> 
                   <img src="${product.img}" alt="${product.name}" class="product-detail-image">
                </div>
                <div class="product-info-area">
                     <h1 class="product-detail-name">${product.name}</h1>
                     <p class="product-detail-price">Price: <span>${product.price} OMR</span></p>
                     <p class="product-detail-description">${product.description}</p>

                     <div class="whatsapp-button-placeholder">
                        </div>

                      <div class="price-quantity">
                            <div class="buttons">
                                  <i onclick="decreement('${product.id}')" class="bi bi-dash-lg"></i> 
                                   <div id="${product.id}" class="quantity">
                                    ${(basket.find(x => x.id === product.id)?.item || 0)}
                                  </div>
                                  <i onclick="increement('${product.id}')" class="bi bi-plus-lg"></i>
                            </div>
                         </div>
                           <div class="add-to-cart-message" id="add-to-cart-message"></div>
                    </div>
                 </div>
            `;
        
   }
                 // Part 4: Call the function when the page loads
                document.addEventListener('DOMContentLoaded', displayProductDetails);
              

*/



// This script will run on product-details.html

// Part 1: Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Part 2: Get the HTML container where product details will be displayed
const productDetailContainer = document.getElementById('product-detail-container');

// Oman's country code is +968. Replace with your actual WhatsApp number.
const whatsappNumber = "96878150431"; // Replace XXXXXXXXX with your 8-digit Omani number

// Function to generate the WhatsApp link and button
function createWhatsAppButton(product) {
    // Construct the message with product details
    const message = `Hello, I would like to order the following product from PARTS STORE:\n\n` +
                    `Product Name: ${product.name}\n` +
                    `Price: ${product.price} OMR\n` +
                    `Product ID: ${product.id}\n` +
                    `Description: ${product.description.substring(0, 100)}...\n\n` +
                    `Please confirm availability and assist with the order. Thank you!`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create the WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Create the button element
    const button = document.createElement('a');
    button.href = whatsappLink;
    button.target = '_blank'; // Opens in a new tab
    button.classList.add('whatsapp-order-btn'); // Add a class for styling
    button.innerHTML = `<i class="bi bi-whatsapp"></i> Order via WhatsApp`; // Icon + text

    return button;
}

// Part 3: Function to display the product details
function displayProductDetails() {
    if (!productId) {
        productDetailContainer.innerHTML = `<p>Product not found. Please go back to the <a href="index.html">shop</a>.</p>`;
        return;
    }

    const product = shopItemsData.find(item => item.id === productId);

    if (!product) {
        productDetailContainer.innerHTML = `<p>Product with ID "${productId}" not found. Please go back to the <a href="index.html">shop</a>.</p>`;
        return;
    }

    // If product is found, populate the container with its details
    productDetailContainer.innerHTML = `
        <div class="single-product-wrapper">
            <div class="product-image-area">
                <img src="${product.img}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-info-area">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-price">Price: <span>${product.price} OMR</span></p>
                <p class="product-detail-description">${product.description}</p>
                
                <div class="whatsapp-button-placeholder">
                    </div> <div class="price-quantity">
                    <div class="buttons">
                        <i onclick="decreement('${product.id}')" class="bi bi-dash-lg"></i>
                        <div id="${product.id}" class="quantity">
                            ${(basket.find(x => x.id === product.id)?.item || 0)}
                        </div>
                        <i onclick="increement('${product.id}')" class="bi bi-plus-lg"></i>
                    </div>
                </div>

                <div class="add-to-cart-message" id="add-to-cart-message"></div>
                
            </div>
        </div>
    `;

    // --- NEW: Insert WhatsApp button ---
    const whatsappButtonPlaceholder = productDetailContainer.querySelector('.whatsapp-button-placeholder');
    if (whatsappButtonPlaceholder) {
        const whatsappButton = createWhatsAppButton(product);
        whatsappButtonPlaceholder.appendChild(whatsappButton);
    }
    // --- END NEW ---

    update(product.id);
}

// Part 4: Call the function when the page loads
document.addEventListener('DOMContentLoaded', displayProductDetails);

// Ensure cart functions are globally accessible (they are if cart.js is linked)
// If not, you might need to copy them here or ensure proper module export/import
// The presence of cart.js linked in product-details.html should make these available.


