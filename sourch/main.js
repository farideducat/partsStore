


let shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];

let generatorShop = () => {
  if (shop) { // Ensure the 'shop' element exists
    shop.innerHTML = ""; // Clear existing content

    shopItemsData.forEach((x) => {
      let { id, name, price, description, img } = x;
      // Ensure search has a default 'item' property if not found
      let search = basket.find((y) => y.id === id) || { item: 0 }; 
            
      // create the product card element
      let itemDiv = document.createElement("div");
      itemDiv.id = `product-id-${id}`;
      itemDiv.classList.add("items");

      itemDiv.innerHTML = `
        <img src="${img}" alt="${name}">
          <div class="details">
            <h3>${name}</h3>
            <p>${description.substring(0, 70)}...</p>
              <div class="price-quantity">
                <h2>${price} OMR </h2>
                  <div class="buttons">
                    <i onclick="decreement('${id}')" class="bi bi-dash-lg"></i>
                    <div id="${id}" class="quantity">
                      ${search.item === undefined ? 0 : search.item}
                    </div>
                    <i onclick="increement('${id}')" class="bi bi-plus-lg"></i>
                </div>
            </div>
          </div>
        `;
        
      // Add a click event listener to the entire product card
      itemDiv.addEventListener('click', (event) => {
        // If the click is not on one of the quantity buttons, navigate
        if (!event.target.closest('.buttons')) {
          window.location.href = `product-details.html?id=${id}`;
        }
      });
      shop.appendChild(itemDiv);
    });
  }
};

generatorShop();

let increement = (id) => {
  let selecteditem = id; // id is already the string
  // FIXED: Removed .id from selecteditem
  let search = basket.find((x) => x.id === selecteditem); 

  if (search === undefined) {
    basket.push({
      // FIXED: Removed .id from selecteditem
      id: selecteditem, 
      item: 1,
    });
  } else {
    search.item += 1;
  }
  
  // FIXED: Removed .id from selecteditem
  update(selecteditem); 
  localStorage.setItem("data", JSON.stringify(basket));
}

let decreement = (id) => {
  let selecteditem = id; // id is already the string
  // FIXED: Removed .id from selecteditem
  let search = basket.find((x) => x.id === selecteditem); 

  if (search === undefined) return;
  else if (search.item === 0) return;
  else { 
    search.item -= 1;
  }
  // FIXED: Removed .id from selecteditem
  update(selecteditem); 
  basket = basket.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(basket)); 
}

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  const quantityElement = document.getElementById(id); 
  if (quantityElement) { // FIXED: Added check for quantityElement existence
    quantityElement.innerHTML = search ? search.item : 0; // Added fallback if search is undefined
  }
  calculation();
}

let calculation = () => { 
  let cartItem = document.getElementById("cartAmount");
  if (cartItem) { // FIXED: Added check for cartItem existence
    cartItem.innerText = basket
      .map((x) => x.item)
      .reduce((x, y) => x + y, 0);
  }
};

calculation();




