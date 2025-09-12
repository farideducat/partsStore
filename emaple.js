
// Get all necessary elements from the DOM
let label = document.getElementById('label');
let shoppingCart = document.getElementById("shopping-cart");
let summarySection = document.getElementById("summary-section"); // New element for the summary card
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Function to calculate the total number of items in the cart
let calculation = () => {
    let cartItem = document.getElementById("cartAmount");
    if (cartItem) {
        cartItem.innerText = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
    }
};

// Call calculation on load to update the navbar cart amount
calculation();

// Function to dynamically generate all cart items
let generateCartItems = () => {
    if (shoppingCart) {
        // Check if the cart has items
        if (basket.length !== 0) {
            shoppingCart.innerHTML = basket.map((x) => {
                let { id, item } = x;
                let search = shopItemsData.find((y) => y.id === id) || { img: '', name: 'Unknown', price: 0 };
                let { img, name, price } = search;

                // Return the new, more detailed HTML structure for each item
                return `
                    <div class="cart-item">
                        <img class="cart-item-image" src=${img} alt="${name}">
                        <div class="cart-item-details">
                            <h4>${name}</h4>
                            <p class="cart-item-price">OMR ${price}</p>
                            <div class="quantity-control">
                                <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
                                <div id="${id}" class="quantity">${item}</div>
                                <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                        <div class="item-actions">
                            <i onclick="removeItem('${id}')" class="bi bi-trash3-fill"></i>
                            <h3 class="item-total-price">RO ${(item * parseFloat(price)).toFixed(2)}</h3>
                        </div>
                    </div>
                `;
            }).join('');

            // Also update the header of the cart items section
            if (label) {//if label exist
                label.innerHTML = `
                    <div class="cart-header-title">
                        <h2>Shopping Cart (${basket.length})</h2>
                    </div> 
                    <button class="clear-all-btn" onclick="clearCart()">Clear All Items</button>
                `;
            }

        } else {
            // Display a message and button if the cart is empty
            shoppingCart.innerHTML = ''; // Clear the items
            if (label) {
                label.innerHTML = `
                    <div class="empty-cart">
                        <h2>Your Cart Is Empty</h2>
                        <a href="./index.html">
                            <button class="HomeBtn">Start Shopping</button>
                        </a>
                    </div>
                `;
            }
        }
    }
    updateCartTotals(); // Call the new total function after items are generated
};

// Function to handle incrementing the item quantity
let increment = (id) => {
    let selectedItem = id;
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
    generateCartItems(); // Re-generate the cart items to update the page view
};

// Function to handle decrementing the item quantity
let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((x) => x.id === selectedItem);

    if (search === undefined || search.item === 0) return;
    else {
        search.item -= 1;
    }

    // Filter out items with a quantity of 0
    basket = basket.filter((x) => x.item !== 0);
    update(selectedItem);
    localStorage.setItem("data", JSON.stringify(basket));
    generateCartItems();
};

// Function to update the quantity displayed for a single item
let update = (id) => {
    let search = basket.find((x) => x.id === id);
    const quantityElement = document.getElementById(id);
    if (quantityElement) {
        quantityElement.innerHTML = search ? search.item : 0;
    }
    calculation(); // Updates the cart icon amount
    updateCartTotals(); // Recalculates and updates the summary
};

// Function to remove an item from the cart
let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem);
    localStorage.setItem("data", JSON.stringify(basket));
    generateCartItems();
    calculation();
    updateCartTotals();
};

// Function to clear the entire cart
let clearCart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
    calculation();
};

// Function to calculate and update the total amount and summary card
let updateCartTotals = () => {
    if (summarySection) {
        if (basket.length !== 0) {
            let itemsTotal = basket.map((x) => {
                let { item, id } = x;
                let search = shopItemsData.find((y) => y.id === id) || { price: 0 };
                return item * parseFloat(search.price || 0);
            }).reduce((x, y) => x + y, 0);

            let shipping = 1.73; // Example shipping fee
            let itemsDiscount = 5.47; // Example discount
            let subtotal = itemsTotal - itemsDiscount;
            let estimatedTotal = subtotal + shipping;

            // Generate the summary HTML
            summarySection.innerHTML = `
                <h3>Summary</h3>
                <div class="summary-row">
                    <span>Items total</span>
                    <span>OMR ${itemsTotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Items discount</span>
                    <span>-OMR ${itemsDiscount.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>OMR ${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>OMR ${shipping.toFixed(2)}</span>
                </div>
                <div class="summary-row total-row">
                    <span>Estimated total</span>
                    <span>OMR ${estimatedTotal.toFixed(2)}</span>
                </div>
                <button class="checkout-btn" onclick="window.location.href='checkout.html'">Checkout (${basket.length})</button>
            `;
        } else {
            // Clear the summary section if the cart is empty
            summarySection.innerHTML = '';
        }
    }
};

// Initial calls when the page loads
if (shoppingCart) {
    generateCartItems();
}




.quantity-control .quantity {
    font-weight: 600;
    font-size: 1rem;
    min-width: 25px;
    text-align: center;
}

.item-total-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin-top: 10px;
    text-align: right; /* Aligns the price to the right */
}

.item-actions {
    margin-left: auto; /* Pushes the actions to the right side of the container */
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
    flex-shrink: 0;
}

.item-actions .bi {
    font-size: 1.5rem;
    color: #999;
    cursor: pointer;
    transition: color 0.2s ease;
}

.item-actions .bi:hover {
    color: #000;
}

/* Empty cart message styling */
.empty-cart {
    text-align: center;
    padding: 50px 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.empty-cart h2 {
    font-size: 1.8rem;
    color: #555;
    margin-bottom: 20px;
}

.empty-cart .HomeBtn {
    background-color: #ff5400;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.empty-cart .HomeBtn:hover {
    background-color: #e04a00;
}

/* Order Summary Section */
.summary-section h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 600;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 1rem;
}

.summary-row.total-row {
    font-size: 1.4rem;
    font-weight: 700;
    color: #ff5400;
    padding-top: 10px;
    border-top: 1px solid #eee;
    margin-top: 15px;
}

.summary-row.total-row span {
    font-weight: 800;
}

.checkout-btn {
    background-color: #ff5400;
    color: white;
    padding: 15px 20px;
    border: none;
    border-radius: 50px;
    width: 100%;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-top: 20px;
}

.checkout-btn:hover {
    background-color: #e04a00;
}

/* Responsive adjustments for the cart page */
@media (max-width: 992px) {
    .cart-page-layout {
        flex-direction: column; /* Stack columns on smaller screens */
    }

    .summary-section {
        position: static; /* Remove sticky behavior on small screens */
        margin-top: 20px;
    }

    .cart-item {
        flex-direction: column; /* Stack image and details vertically */
        align-items: center;
        text-align: center;
    }

    .cart-item-details, .item-actions {
        align-items: center; /* Center-align text and icons */
    }

    .item-actions {
        margin-left: 0; /* Remove auto margin to center actions */
        flex-direction: row;
        gap: 20px;
        margin-top: 15px;
    }
}
/* ... (existing CSS from line 789 to the end should be kept) ... */