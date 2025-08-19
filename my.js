


// References to HTML elements
const checkoutItemsContainer = document.getElementById('checkout-items-container');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryTotal = document.getElementById('summary-total');
const placeOrderBtn = document.getElementById('place-order-btn');
const shippingAddressForm = document.getElementById('shipping-address-form');
const addressWarningMessage = document.getElementById('address-warning-message');

let basket = JSON.parse(localStorage.getItem("data")) || [];
// Define shipping fee (you can make this dynamic later)
const SHIPPING_FEE = 2.67; // Example shipping fee in OMR

let generateCheckoutItems = () => {
    console.log(generateCheckoutItems);
    if(basket.length ===  0){
        if(checkoutItemsContainer){
            checkoutItemsContainer.innerHTML = `<p style="text-align: center; padding: 20px;">Your cart is empty. Please add items from the <a href="index.html">shop</a>.</p>`;
        }
        return;
    }
    if(checkoutItemsContainer){
        checkoutItemsContainer.innerHTML = basket.map((x) => {
            let {id, item} = x;
            let search = shopItemsData.find((y) => y.id === id) || { img: '', name: 'Unknown', price: 0 };
            let {name , img, price} = search;

            return`
                <div class="checkout-item">
                    <img src="${img}" alt="${name}">
                    <div class="checkout-item-details">
                        <p>${name}</p>
                        <p class="price">OMR ${parseFloat(price).toFixed(2)}</p>
                    </div>
                    <span class="checkout-item-quantity">Qty: ${item}</span>
                </div>
            `;


        }).join(' ');
    }

};

// Function to calculate and update the order summary
let calculateOrderSummary = () =>{
    let subtotal = 0;
    if(basket.length !== 0){
        subtotal = basket.map((x) => {
         let {item, id}   = x;
         let search = shopItemsData.find((y) => y.id === id) || {price: 0}
       return item * parseFloat(search.price || 0);
        }).reduce((x, y) => x + y, 0 );
    }

    const total = subtotal + SHIPPING_FEE;

    if (summarySubtotal) summarySubtotal.textContent = `OMR ${subtotal.toFixed(2)}`;
    if (summaryShipping) summaryShipping.textContent = `OMR ${SHIPPING_FEE.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `OMR ${total.toFixed(2)}`;


}
    

   // Function to load saved address from localStorage
let loadSavedAddress = () => {
    const savedAddress = JSON.parse(localStorage.getItem('shippingAddress'));
    if (savedAddress && shippingAddressForm) {
        shippingAddressForm['full-name'].value = savedAddress.fullName || '';
        shippingAddressForm['phone-number'].value = savedAddress.phoneNumber || '';
        shippingAddressForm['street-address'].value = savedAddress.streetAddress || '';
        shippingAddressForm['city'].value = savedAddress.city || '';
        shippingAddressForm['postal-code'].value = savedAddress.postalCode || '';
        shippingAddressForm['country'].value = savedAddress.country || '';
    }
};






    // Function to save address to localStorage

    let saveAddress = (event) => {
         event.preventDefault(); // Prevent default form submission
         if(!shippingAddressForm) return ;


            const address = {
        fullName: shippingAddressForm['full-name'].value,
        phoneNumber: shippingAddressForm['phone-number'].value,
        streetAddress: shippingAddressForm['street-address'].value,
        city: shippingAddressForm['city'].value,
        postalCode: shippingAddressForm['postal-code'].value,
        country: shippingAddressForm['country'].value
    };


     // Basic validation for all fields
    const allFieldsFilled = Object.values(address).every(field => field.trim() !== '');

    if (allFieldsFilled) {
        localStorage.setItem('shippingAddress', JSON.stringify(address));
        Swal.fire({
            title: "Address Saved!",
            text: "Your shipping address has been saved.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
        if (addressWarningMessage) addressWarningMessage.style.display = 'none';
    } else {
        Swal.fire({
            title: "Incomplete Address",
            text: "Please fill in all shipping address fields.",
            icon: "warning"
        });
        if (addressWarningMessage) addressWarningMessage.style.display = 'block';
    }

    };


    // Event listener for the "Save Address" button
if (shippingAddressForm) {
    shippingAddressForm.addEventListener('submit', saveAddress);
}

// Event listener for the "Place order" button
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
        // Validate if cart is empty
        if (basket.length === 0) {
            Swal.fire({
                title: "Cart Empty",
                text: "Please add items to your cart before placing an order.",
                icon: "warning"
            });
            return;
        }

        // Validate if shipping address is filled
        const savedAddress = JSON.parse(localStorage.getItem('shippingAddress'));
        if (!savedAddress || Object.values(savedAddress).some(field => field.trim() === '')) {
            Swal.fire({
                title: "Address Missing",
                text: "Please fill in and save your shipping address details.",
                icon: "warning"
            });
            if (addressWarningMessage) addressWarningMessage.style.display = 'block';
            return;
        } else {
            if (addressWarningMessage) addressWarningMessage.style.display = 'none';
        }

        // Here you would integrate with a payment gateway or a backend
        Swal.fire({
            title: "Order Placed!",
            text: "Your order has been successfully placed. Thank you for your purchase!",
            icon: "success"
        }).then(() => {
            // Optionally clear the cart after successful order
            basket = [];
            localStorage.setItem("data", JSON.stringify(basket));
            // Redirect to homepage or order confirmation page
            window.location.href = 'index.html'; 
        });
    });
}

// Initial calls when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    generateCheckoutItems();
    calculateOrderSummary();
    loadSavedAddress(); // Load address on page load
    // Ensure cart amount in navbar is updated
    if (typeof calculation === 'function') { // Check if calculation function from cart.js is available
        calculation(); 
    }
});
