
let shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];

// Get references to search elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// --- Main generator function for products ---
let generatorShop = (itemsToDisplay = shopItemsData) => {
    if (shop) {
        if (itemsToDisplay.length === 0) {
            shop.innerHTML = `<h2 style="text-align:center; padding: 50px; color: #555;">No products found matching your search.</h2>`;
            return;
        }
        shop.innerHTML = "";

        itemsToDisplay.forEach((x) => {
            let { id, name, price, description, img } = x;
            let itemDiv = document.createElement("div");
            itemDiv.id = `product-id-${id}`;
            itemDiv.classList.add("items");

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

            itemDiv.addEventListener('click', () => {
                window.location.href = `product-details.html?id=${id}`;
            });
            shop.appendChild(itemDiv);
        });
    }
};

generatorShop();

// --- Update cart icon number ---
let calculation = () => {
    let cartItem = document.getElementById("cartAmount");
    if (cartItem) {
        let basket = JSON.parse(localStorage.getItem("data")) || [];
        cartItem.innerText = basket
            .map((x) => x.item)
            .reduce((x, y) => x + y, 0);
    }
};

calculation();

// --- Search and Filter Logic ---
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
    searchInput.addEventListener('keyup', () => {
        performSearch();
    });
}

// --- Dynamic Category Links & Dropdown Logic ---
const categoryDropdown = document.getElementById('categoryDropdown');
const allCategoriesBtn = document.getElementById('allCategoriesBtn');

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