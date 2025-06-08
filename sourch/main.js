let shop = document.getElementById("shop");


let basket = JSON.parse(localStorage.getItem("data")) || [];

let generatorShop = () => {
  shop.innerHTML = shopItemsData
    .map((x) => {
      let { id, name, price, description, img } = x;
      let search = basket.find((y) => y.id === id) || [];
      return `
      <div id=product-id-${id} class="items">
        <img src=${img} alt="">
          <div class="details">
            <h3>${name}</h3>
             <p>${description}</p>
               <div class="price-quantity">
                 <h2>${price}</h2>
                   <div class="buttons">
                 <i onclick="decreement(${id})" class="bi bi-dash-lg"></i>
                <div id="${id}" class="quantity">
               ${search.item === undefined? 0 : search.item}
               </div>
              <i onclick="increement(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
};

generatorShop();


let increement = (id) => {
  let selecteditem = id;
  let search = basket.find((x) => x.id === selecteditem.id);

  if (search === undefined) {
    basket.push({
       id:selecteditem.id,
        item: 1,
       });

  } else {
    search.item += 1;
  }


  
  update(selecteditem.id);
  localStorage.setItem("data", JSON.stringify(basket));
}

let decreement = (id) => {
  let selecteditem = id;
  let search = basket.find((x) => x.id === selecteditem.id);

 if(search === undefined)return;
 else if (search.item === 0) return;
 else{ 
   search.item -= 1;
 }
update(selecteditem.id);
basket = basket.filter((x) => x.item !== 0);
localStorage.setItem("data", JSON.stringify(basket)); 
}

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
}

let calculation = () => { 
  let cartItem = document.getElementById("cartAmount");
  cartItem.innerText = basket
    .map((x) => x.item)
    .reduce((x, y) => x + y, 0);
  };

 calculation();

 
