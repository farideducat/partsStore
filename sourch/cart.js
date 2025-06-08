
let label = document.getElementById('label');
let shoppingCart = document.getElementById("shopping-cart");
let basket = JSON.parse(localStorage.getItem("data")) || [];



let calculation = () => { 
  let cartItem = document.getElementById("cartAmount");
  cartItem.innerText = basket.map((x) => x.item).reduce((x, y) => x + y, 0);}
   calculation();

   let generateCartItems  = () => {
    if(basket.length !== 0){
       return (shoppingCart.innerHTML = basket.map((x) => {
        let {id,item} = x;
        let search =  shopItemsData.find((y) => y.id === id ) || [];
        let {img, name, price} = search;
           return `
              <div class="cart-item">
              <img width="100" src=${img} alt="" >
             <div class="details">

               <div class="title-price-x">
               <h4  class="title-price">
                 <p>${name}</p>
                  <p class="cart-item-price"> OMR ${price}</p>
                 </h4>
                 <i onclick="removeItems(${id})" <i class="bi bi-trash3-fill"></i>
               </div>

             
            <div class="buttons">
                 <i onclick="decreement(${id})" class="bi bi-dash-lg"></i>
                 <div id="${id}" class="quantity">${item}</div>
                 <i onclick="increement(${id})" class="bi bi-plus-lg"></i>
            </div>


                <h3>RO ${(item * search.price).toFixed(2)}</h3>  
                </div>
              </div>
           `;
       })
       .join(''));
    } else{
      shoppingCart.innerHTML = ``;
      label.innerHTML = `
      <h2>CART IS EMPTY</h2>
      <a href="/indx.html">
    <button class="HomeBtn">Back To HomePage</button>
</a>
      `;
    }
   }

  generateCartItems();




  let increement = (id) => {
  let selecteditem = id;
  let search = basket.find((x) => x.id === selecteditem.id);

  if (search === undefined) {
    basket.push({ 
      id: selecteditem.id, 
      item: 1,
    });
  } else {
    search.item += 1;
  }
    generateCartItems();
    update(selecteditem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

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
   generateCartItems();
 
}

let  update =  (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  totalAmount();
}


let removeItems = (id) => {
  let selecteditem = id;
  basket = basket.filter((x)=>x.id !== selecteditem.id);
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
  if(basket.length !==0){
   let amount = basket.map((x)=> {
    let {item, id} = x;
     let search =  shopItemsData.find((y) => y.id === id ) || [];

     return item * search.price;
   }).reduce((x,y)=> x+y, 0);
   console.log(amount)
   label.innerHTML  =` 
     <h2> TOTAL bill : OMR ${amount}</h2>
       <button class="checkout">checkout</button>
         <button onclick="clearCart()" class="removeAll">clear All </button>
   `
  } else return;
}

totalAmount();