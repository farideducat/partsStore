
let label = document.getElementById('label');
let shoppingCart = document.getElementById("shopping-cart");
let basket = JSON.parse(localStorage.getItem("data")) || [];



let calculation = () => { 
  let cartItem = document.getElementById("cartAmount");
if(cartItem){  //add check if cartitem existance
 cartItem.innerText = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
   }
};
   calculation(); // Call calculation on load to update navbar cart amount

   let generateCartItems  = () => {
    //only proceed if shopping cart exist on the page
    if(shoppingCart) { 
    if(basket.length !== 0){
       shoppingCart.innerHTML = basket.map((x) => {
        let {id,item} = x;
        let search =  shopItemsData.find((y) => y.id === id ) || { img: '', name: 'Unknown', price: 0 }; 
        let {img, name, price} = search;
           return `
              <div class="cart-item">
                <img width="100" src=${img} alt="${name}" >
                  <div class="details">
                     <div class="title-price-x">
                        <h4  class="title-price">
                           <p>${name}</p>
                          <p class="cart-item-price"> OMR ${price}</p>
                         </h4>
                       <i onclick="removeItems('${id}')" <i class="bi bi-trash3-fill"></i>
                    </div>
                    <div class="buttons">
                        <i onclick="decreement('${id}')" class="bi bi-dash-lg"></i>
                           <div id="${id}" class="quantity">${item}</div>
                        <i onclick="increement('${id}')" class="bi bi-plus-lg"></i>
                    </div>
                    <h3>RO ${(item * search.price).toFixed(2)}</h3>  
                </div>
              </div>
           `;
       })
       .join('');
       if(label){
         label.innerHTML= ``;
       }
    } else{
      shoppingCart.innerHTML = ``;
      if(label) { 
      label.innerHTML = `
      <h2>CART IS EMPTY</h2>
      <a href="./index.html">
    <button class="HomeBtn">Back To HomePage</button>
</a>
      `;
         }
       }  
    }
 }




  let increement = (id) => {
  let selecteditem = id;
  let search = basket.find((x) => x.id === selecteditem);

  if (search === undefined) {
    basket.push({ 
      id: selecteditem,
      item: 1,
    });
  } else {
    search.item += 1;
  }
   
    update(selecteditem);
    localStorage.setItem("data", JSON.stringify(basket));
     generateCartItems();
};

let decreement = (id) => {
  let selecteditem = id;
  let search = basket.find((x) => x.id === selecteditem);

 if(search === undefined)return;
 else if (search.item === 0) return;

  else{
    search.item -= 1;
  }

update(selecteditem);
basket = basket.filter((x) => x.item !== 0);
 localStorage.setItem("data", JSON.stringify(basket));
generateCartItems();
 
}

let  update =  (id) => {
  let search = basket.find((x) => x.id === id);
  const quantityElement = document.getElementById(id);
 if(quantityElement){
     quantityElement.innerHTML = search ? search.item : 0 ;

 }
  calculation();
  totalAmount();
}


let removeItems = (id) => {
  let selecteditem = id;
  basket = basket.filter((x)=>x.id !== selecteditem);
  localStorage.setItem("data", JSON.stringify(basket));
     generateCartItems();
     calculation();
     totalAmount();
}
     let clearCart = () =>{
      basket = [];
      generateCartItems();
      localStorage.setItem("data", JSON.stringify(basket));
      calculation();
     }



let totalAmount =  ()=> {
      if(label){
      if(basket.length !==0){
      let amount = basket.map((x)=> {
      let {item, id} = x;
      let search =  shopItemsData.find((y) => y.id === id ) || { price: 0 };
       return item * parseFloat(search.price || 0);
   }).reduce((x,y)=> x + y, 0);
   
   label.innerHTML  =` 
     <h2> TOTAL bill : OMR ${amount.toFixed(2)}</h2>
       <button class="checkout">checkout</button>
         <button onclick="clearCart()" class="removeAll">clear All </button>
   `;
       } else{
          label.innerHTML = `
             <h2>CART IS EMPTY</h2>
             <a href="./index.html">
                    <button class="HomeBtn">Back To HomePage</button>
                </a>
          `;
  
        }
    }
};

if (label && shoppingCart) { 
    generateCartItems();
    totalAmount();
}