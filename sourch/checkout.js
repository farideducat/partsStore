// ===============================
// Restore basket from localStorage
// ===============================
//let basket = JSON.parse(localStorage.getItem("data")) || [];

// ===============================
// References to HTML elements
// ===============================
const checkoutItemsContainer = document.getElementById("checkout-items-container");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryShipping = document.getElementById("summary-shipping");
const summaryTotal = document.getElementById("summary-total");
const placeOrderBtn = document.getElementById("place-order-btn");
const shippingAddressForm = document.getElementById("shipping-address-form");
const addressWarningMessage = document.getElementById("address-warning-message");

// Shipping fee
const SHIPPING_FEE = 2.67; // Example shipping fee in OMR

// ===============================
// Generate Checkout Items
// ===============================
let generateCheckoutItems = () => {
  if (basket.length === 0) {
    if (checkoutItemsContainer) {
      checkoutItemsContainer.innerHTML = `
        <p style="text-align: center; padding: 20px;">
          Your cart is empty. Please add items from the 
          <a href="index.html">shop</a>.
        </p>`;
    }
    return;
  }

  if (checkoutItemsContainer) {
    checkoutItemsContainer.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((y) => y.id === id) || {
          img: "",
          name: "Unknown",
          price: 0,
        };
        let { name, img, price } = search;

        return `
          <div class="checkout-item">
            <img src="${img}" alt="${name}">
            <div class="checkout-item-details">
              <p>${name}</p>
              <p class="price">OMR ${parseFloat(price).toFixed(2)}</p>
            </div>
            <span class="checkout-item-quantity">Qty: ${item}</span>
          </div>
        `;
      })
      .join(" ");
  }
};

// ===============================
// Calculate Order Summary
// ===============================
let calculateOrderSummary = () => {
  let subtotal = 0;
  if (basket.length !== 0) {
    subtotal = basket
      .map((x) => {
        let { item, id } = x;
        let search = shopItemsData.find((y) => y.id === id) || { price: 0 };
        return item * parseFloat(search.price || 0);
      })
      .reduce((x, y) => x + y, 0);
  }

  const total = subtotal + SHIPPING_FEE;

  if (summarySubtotal) summarySubtotal.textContent = `OMR ${subtotal.toFixed(2)}`;
  if (summaryShipping) summaryShipping.textContent = `OMR ${SHIPPING_FEE.toFixed(2)}`;
  if (summaryTotal) summaryTotal.textContent = `OMR ${total.toFixed(2)}`;
};

// ===============================
// Load Saved Address
// ===============================
let loadSavedAddress = () => {
  const savedAddress = JSON.parse(localStorage.getItem("shippingAddress"));
  if (savedAddress && shippingAddressForm) {
    shippingAddressForm["full-name"].value = savedAddress.fullName || "";
    shippingAddressForm["phone-number"].value = savedAddress.phoneNumber || "";
    shippingAddressForm["street-address"].value = savedAddress.streetAddress || "";
    shippingAddressForm["city"].value = savedAddress.city || "";
    shippingAddressForm["postal-code"].value = savedAddress.postalCode || "";
    shippingAddressForm["country"].value = savedAddress.country || "";
  }
};

// ===============================
// Save Address
// ===============================
let saveAddress = (event) => {
  event.preventDefault();
  if (!shippingAddressForm) return;

  const address = {
    fullName: shippingAddressForm["full-name"].value,
    email:shippingAddressForm["email-address"].value,
    phoneNumber: shippingAddressForm["phone-number"].value,
    streetAddress: shippingAddressForm["street-address"].value,
    city: shippingAddressForm["city"].value,
    postalCode: shippingAddressForm["postal-code"].value,
    country: shippingAddressForm["country"].value,
  };

  const allFieldsFilled = Object.values(address).every((field) => field.trim() !== "");

  if (allFieldsFilled) {
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    Swal.fire({
      title: "Address Saved!",
      text: "Your shipping address has been saved.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    if (addressWarningMessage) addressWarningMessage.style.display = "none";
  } else {
    Swal.fire({
      title: "Incomplete Address",
      text: "Please fill in all shipping address fields.",
      icon: "warning",
    });
    if (addressWarningMessage) addressWarningMessage.style.display = "block";
  }
};

// ===============================
// Event Listeners
// ===============================
if (shippingAddressForm) {
  shippingAddressForm.addEventListener("submit", saveAddress);
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", async () => {
    if (basket.length === 0) {
      Swal.fire({
        title: "Cart Empty",
        text: "Please add items to your cart before placing an order.",
        icon: "warning",
      });
      return;
    }

    const savedAddress = JSON.parse(localStorage.getItem("shippingAddress"));
    if (!savedAddress || Object.values(savedAddress).some((field) => field.trim() === "")) {
      Swal.fire({
        title: "Address Missing",
        text: "Please fill in and save your shipping address details.",
        icon: "warning",
      });
      if (addressWarningMessage) addressWarningMessage.style.display = "block";
      return;
    } else {
      if (addressWarningMessage) addressWarningMessage.style.display = "none";
    }

    // Build order items
    const orderItems = basket.map((x) => {
      let { id, item } = x;
      let product = shopItemsData.find((y) => y.id === id) || { name: "Unknown", price: 0 };
      return {
        name: product.name,
        quantity: item,
        price: parseFloat(product.price) * item,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price, 0);
    const total = subtotal + SHIPPING_FEE;

    // Order data to backend
    const orderData = {
      name: savedAddress.fullName,
      email: savedAddress.email,
      phone: savedAddress.phoneNumber,
      address: `${savedAddress.streetAddress}, ${savedAddress.city}, ${savedAddress.postalCode}, ${savedAddress.country}`,
      orderItems,
      subtotal,
      shipping: SHIPPING_FEE,
      total,
    };

    try {
      const res = await fetch("https://order-backend-o09t.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();
      if (result.success) {
        Swal.fire({
          title: "Order Placed!",
          text: "Your order has been successfully placed. Thank you for your purchase!",
          icon: "success",
        }).then(() => {
          basket = [];
          localStorage.setItem("data", JSON.stringify(basket));
          window.location.href = "index.html";
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to send order email.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("❌ Error:", err);
      Swal.fire({
        title: "Error",
        text: "Could not connect to the server.",
        icon: "error",
      });
    }
  });
}

// ===============================
// Initial Page Load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  generateCheckoutItems();
  calculateOrderSummary();
  loadSavedAddress();
  if (typeof calculation === "function") {
    calculation(); // Update cart count in navbar
  }
});
