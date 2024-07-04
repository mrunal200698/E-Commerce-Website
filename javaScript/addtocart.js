
// const cards = document.querySelectorAll('.card');
//         const cart = document.getElementById('cart');
//         const totalElement = document.getElementById('total'); 
//         const selectedItems = {};

//         function handleCardClick(event) {
//             const card = event.currentTarget;
//             const itemId = card.id;
//             const itemName = card.querySelector('h5').textContent;
//             const itemPrice = parseFloat(card.querySelector('.price').textContent); 

//             if (selectedItems[itemId]) {
//                 selectedItems[itemId].count++;
//             } else {
//                 selectedItems[itemId] = {
//                     name: itemName,
//                     price: itemPrice,
//                     count: 1,
//                 };
//             }

//             updateCart();
//         }

//         function updateCart() {
//             cart.innerHTML = '';
//             let total = 0; 

//             for (const itemId in selectedItems) {
//                 const item = selectedItems[itemId];
//                 const listItem = document.createElement('li');
//                 const quantityContainer = document.createElement('div'); 
//                 const quantityText = document.createElement('span'); 
//                 const addButton = document.createElement('button');
//                 const subtractButton = document.createElement('button');

//                 addButton.textContent = '+';
//                 subtractButton.textContent = '-';

//                 quantityText.textContent = item.count; 

//                 addButton.addEventListener('click', () => {
//                     addItem(itemId);
//                 });

//                 subtractButton.addEventListener('click', () => {
//                     removeItem(itemId);
//                 });

//                 const hr = document.createElement('hr');

//                 quantityContainer.appendChild(subtractButton); 
//                 quantityContainer.appendChild(quantityText); 
//                 quantityContainer.appendChild(addButton); 
//                 quantityContainer.appendChild(hr); 

//                 listItem.textContent = `${item.name} - $${item.price * item.count}`;
//                 listItem.appendChild(quantityContainer); 
//                 cart.appendChild(listItem);

//                 total += item.price * item.count; 
//             }

//             totalElement.textContent = `Общая сумма: $${total.toFixed(2)}`; 
//         }

//         function addItem(itemId) {
//             if (selectedItems[itemId]) {
//                 selectedItems[itemId].count++;
//             }
//             updateCart();
//         }

//         function removeItem(itemId) {
//             if (selectedItems[itemId]) {
//                 selectedItems[itemId].count--;
//                 if (selectedItems[itemId].count <= 0) {
//                     delete selectedItems[itemId];
//                 }
//             }
//             updateCart();
//         }

//         cards.forEach((card) => {
//             card.addEventListener('click', handleCardClick);
//         });























let iconCart = document.querySelector('.card');
let cart = document.querySelector('.item');
let container = document.querySelector('.cartTab');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function(){
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
})
close.addEventListener('click', function (){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
})


let products = null;
// get data from file json
fetch('product.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})

//show datas product in list 
function addDataToHTML(){
    // remove datas default from HTML
    let listProductHTML = document.querySelector('.listProduct');
    listProductHTML.innerHTML = '';

    // add new datas
    if(products != null) // if has data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button onclick="addCart(${product.id})">Add To Cart</button>`;

            listProductHTML.appendChild(newProduct);

        });
    }
}
//use cookie so the cart doesn't get lost on refresh page


let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));
    //// If this product is not in the cart
    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{
        //If this product is already in the cart.
        //I just increased the quantity
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML(){
    // clear data default
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;
    // if has product in Cart
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">$${product.price} / 1 product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        })
    }
    totalHTML.innerText = totalQuantity;
}
function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}

