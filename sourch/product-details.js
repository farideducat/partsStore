//Part 1: get the product Id from the URL
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
                            <div class="button">
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

