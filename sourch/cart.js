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
            if (label) {
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