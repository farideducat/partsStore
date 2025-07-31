// sourch/main.js

let shop = document.getElementById("shop");

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
                        <button onclick="window.location.href = 'product-details.html?id=${id}'" class="view-product-btn">Add to Cart</button>
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

if (allCategoriesBtn) {
    allCategoriesBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the document click from immediately closing it
        categoryDropdown.classList.toggle('show');
        if (topMenuItems) {
            topMenuItems.style.display = categoryDropdown.classList.contains('show') ? 'none' : 'flex';
        }
    });
}

if (categoryDropdown) {
    categoryDropdown.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault(); // Prevent default link behavior
            const category = event.target.dataset.category;
            let filteredItems = [];
            if (category === 'all') {
                filteredItems = shopItemsData;
            } else {
                filteredItems = shopItemsData.filter(item => item.category === category);
            }
            generatorShop(filteredItems);
            categoryDropdown.classList.remove('show'); // Hide dropdown after selection
            if (topMenuItems) {
                topMenuItems.style.display = 'flex'; // Show top menu items again
            }
        }
    });
}

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', (event) => {
    if (categoryDropdown && allCategoriesBtn) {
        if (!allCategoriesBtn.contains(event.target) && !categoryDropdown.contains(event.target)) {
            categoryDropdown.classList.remove('show');
            if (topMenuItems) {
                topMenuItems.style.display = 'flex'; // Ensure top menu items are visible
            }
        }
    }
});
