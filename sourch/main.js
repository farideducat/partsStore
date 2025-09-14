// sourch/main.js

/*let shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];

// Get references to search elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Modified generatorShop to accept an array of items to display
let generatorShop = (itemsToDisplay = shopItemsData) => { // Default to all items
    if (shop) { // Ensure the 'shop' element exists
        if (itemsToDisplay.length === 0) {
            shop.innerHTML = `<h2 style="text-align:center; padding: 50px; color: #555;">No products found matching your search.</h2>`;
            return;
        }

        shop.innerHTML = ""; // Clear existing content

        itemsToDisplay.forEach((x) => {
            let { id, name, price, description, img } = x;

            // create the product card element
            let itemDiv = document.createElement("div");
            itemDiv.id = `product-id-${id}`;
            itemDiv.classList.add("items"); // Add your existing CSS class

            itemDiv.innerHTML = `
                <img src="${img}" alt="${name}">
                <div class="details">
                    <h3>${name}</h3>
                    <p>${description.substring(0, 70)}...</p>
                    <div class="price-action">
                        <h2>${price} OMR</h2>
                        <button onclick="window.location.href = 'product-details.html?id=${id}'" class="view-product-btn"><i class="bi bi-cart-plus"></i></button>
                    </div>
                </div>
            `;

            // Add a click event listener to the entire product card
            itemDiv.addEventListener('click', (event) => {
                // Ensure clicks on the button still trigger its own action (which is navigation)
                // If you click outside the button but on the card, it also navigates.
                window.location.href = `product-details.html?id=${id}`;
            });
            shop.appendChild(itemDiv);
        });
    }
};

// Initial call to display all products
generatorShop();

// These functions (increement, decreement, update) are not directly used on index.html anymore for interaction
// They are kept here for completeness if cart.js relies on their global presence,
// but they will primarily be called from product-details.js and cart.js itself.
// The logic for them will reside on the product-details page.

// However, we still need 'calculation' on index.html to update the navbar cart icon.
let calculation = () => {
    let cartItem = document.getElementById("cartAmount");
    if (cartItem) {
        let basket = JSON.parse(localStorage.getItem("data")) || []; // Ensure basket is fresh
        cartItem.innerText = basket
            .map((x) => x.item)
            .reduce((x, y) => x + y, 0);
    }
};

calculation();


// --- Search and Filter Logic (remains the same) ---

const performSearch = () => {
    if (!searchInput) {
        console.error("Search input element not found!");
        return;
    }
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = shopItemsData.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.id.toLowerCase().includes(searchTerm);
    });
    generatorShop(filteredItems);
};

if (searchButton) {
    searchButton.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keyup', (event) => {
        performSearch();
    });
}

// Category Filtering (assuming this logic is in main.js as well)
const allCategoriesBtn = document.getElementById('allCategoriesBtn');
const categoryDropdown = document.getElementById('categoryDropdown');
const topMenuItems = document.querySelector('.top-menu-items'); // Assuming you want to hide/show this with categories

if (categoryDropdown && allCategoriesBtn) {
    categoryDropdown.innerHTML = '';

    const allLink = document.createElement('a');
    allLink.href = "#";
    allLink.dataset.category = "all";
    allLink.innerText = "All Categories";
    allLink.addEventListener('click', (event) => {
        event.preventDefault();
        generatorShop(shopItemsData);
        categoryDropdown.classList.remove('show');
    });
        categoryDropdown.appendChild(allLink);

         const categories = [...new Set(shopItemsData.map(item => item.category))];


        categories.forEach(category => {
        const categoryLink = document.createElement('a');
        categoryLink.href = "#";
        categoryLink.dataset.category = category;
        categoryLink.innerText = category;
        categoryLink.addEventListener('click', (event) => {
            event.preventDefault();
            const filteredItems = shopItemsData.filter(item => item.category === category);
            generatorShop(filteredItems);
            categoryDropdown.classList.remove('show');
        });
        categoryDropdown.appendChild(categoryLink);
    });


allCategoriesBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        categoryDropdown.classList.toggle('show');
    });


     document.addEventListener('click', (event) => {
        if (!allCategoriesBtn.contains(event.target) && !categoryDropdown.contains(event.target)) {
            categoryDropdown.classList.remove('show');
        }
    });

}






    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cart");
    document.getElementById("category-title").innerText = cat;

    const container = document.getElementById("category-products");
    const products = shopItemsData.filter(item => item.category === cat);

    container.innerHTML = products.map(p => `
      <div class="item-card" onclick="window.location.href='product-details.html?id=${p.id}'">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.price} OMR</p>
      </div>
    `).join("");*/


    // sourch/main.js

let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];

// ✅ NEW: products will now come from backend instead of static data.js
let shopItemsData = [];

// Get references to search elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// ===============================
// Generate Shop Items
// ===============================
let generatorShop = (itemsToDisplay = shopItemsData) => {
    if (shop) {
        if (itemsToDisplay.length === 0) {
            shop.innerHTML = `<h2 style="text-align:center; padding: 50px; color: #555;">No products found matching your search.</h2>`;
            return;
        }

        shop.innerHTML = ""; // Clear existing content

        itemsToDisplay.forEach((x) => {
            let { _id, name, price, desc, img } = x; // ✅ use _id from MongoDB

            let itemDiv = document.createElement("div");
            itemDiv.id = `product-id-${_id}`;
            itemDiv.classList.add("items");

            itemDiv.innerHTML = `
                <img src="${img}" alt="${name}">
                <div class="details">
                    <h3>${name}</h3>
                    <p>${desc ? desc.substring(0, 70) : ""}...</p>
                    <div class="price-action">
                        <h2>${price} OMR</h2>
                        <button onclick="window.location.href = 'product-details.html?id=${_id}'" class="view-product-btn"><i class="bi bi-cart-plus"></i></button>
                    </div>
                </div>
            `;

            // Clicking anywhere opens details page
            itemDiv.addEventListener('click', (event) => {
                if (!event.target.closest("button")) {
                    window.location.href = `product-details.html?id=${_id}`;
                }
            });
            shop.appendChild(itemDiv);
        });
    }
};

// ===============================
// Fetch Products from Backend
// ===============================
async function loadProducts() {
    try {
        const res = await fetch("https://order-backend-o09t.onrender.com/api/product");
        shopItemsData = await res.json(); // ✅ store fetched products
        generatorShop(shopItemsData);
        setupCategories();
    } catch (error) {
        console.error("❌ Failed to load products:", error);
        shop.innerHTML = `<p style="color:red;text-align:center;">Failed to load products. Please try again later.</p>`;
    }
}

// ===============================
// Cart Calculation (navbar cart badge)
// ===============================
let calculation = () => {
    let cartItem = document.getElementById("cartAmount");
    if (cartItem) {
        let basket = JSON.parse(localStorage.getItem("data")) || [];
        cartItem.innerText = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
    }
};
calculation();

// ===============================
// Search Logic
// ===============================
const performSearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = shopItemsData.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) ||
               (item.desc && item.desc.toLowerCase().includes(searchTerm));
    });
    generatorShop(filteredItems);
};

if (searchButton) searchButton.addEventListener('click', performSearch);
if (searchInput) searchInput.addEventListener('keyup', performSearch);

// ===============================
// Category Filtering
// ===============================
const allCategoriesBtn = document.getElementById('allCategoriesBtn');
const categoryDropdown = document.getElementById('categoryDropdown');

function setupCategories() {
    if (categoryDropdown && allCategoriesBtn) {
        categoryDropdown.innerHTML = '';

        // All categories option
        const allLink = document.createElement('a');
        allLink.href = "#";
        allLink.innerText = "All Categories";
        allLink.addEventListener('click', (event) => {
            event.preventDefault();
            generatorShop(shopItemsData);
            categoryDropdown.classList.remove('show');
        });
        categoryDropdown.appendChild(allLink);

        // Unique categories
        const categories = [...new Set(shopItemsData.map(item => item.category))];
        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = "#";
            categoryLink.innerText = category;
            categoryLink.addEventListener('click', (event) => {
                event.preventDefault();
                const filteredItems = shopItemsData.filter(item => item.category === category);
                generatorShop(filteredItems);
                categoryDropdown.classList.remove('show');
            });
            categoryDropdown.appendChild(categoryLink);
        });

        // Toggle dropdown
        allCategoriesBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            categoryDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!allCategoriesBtn.contains(event.target) && !categoryDropdown.contains(event.target)) {
                categoryDropdown.classList.remove('show');
            }
        });
    }
}

// ===============================
// Initial Page Load
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts(); // ✅ fetch products when page loads
});
