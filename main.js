async function getApi(){
    try{
        const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/')
        const res = await data.json();
        window.localStorage.setItem('products',JSON.stringify(res))
        return res
    }catch(error){
        console.log(error);
    }  
}
function print_products(datos){
    const productstHTML = document.querySelector('.products')
    let html = '';
    for(const product of datos.products){
        html+=`
        <div class='product'>
            <div class='product_img'>
                <img id = ${product.id} class= 'modal_img' src=${product.image} alt='imagen del producto'/>
            </div>
            <div class = 'product_description'>
                <p><strong>Nombre:</strong> ${product.name}</p>
                <p><strong>Precio:</strong> $${product.price}.00</p>
                <p><strong>Stock:</strong> ${product.quantity}</p>
                <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
            </div>
        </div>
        `  
    }
    productstHTML.innerHTML = html;
}
function events(){
    const modal = document.querySelector('.modal');
    const activarCarrito = document.querySelector('.carrito');
    const menuCart = document.querySelector('.menu_cart');
    console.log(menuCart);
    activarCarrito.addEventListener('click',function(){
        menuCart.classList.toggle('active');
    })
    modal.addEventListener('click', function(){
        modal.classList.remove('active');
    })
}
function addToCart(datos){
    const productstHTML = document.querySelector('.products');
    productstHTML.addEventListener('click',function(event){
        if(event.target.classList.contains('cart_buy')){
            const id =Number(event.target.id);
            const productFind = datos.products.find(function(product){
                return product.id === id;
            })
            if(datos.cart[productFind.id]){
                datos.cart[productFind.id].amount++;
            }else{
                productFind.amount = 1;
                datos.cart[productFind.id] = productFind;
            }
            window.localStorage.setItem('cart',JSON.stringify(datos.cart));
            printToCart(datos);
            totalCart(datos);
        }
    });
}
function printToCart(datos){
    const cart_products = document.querySelector('.cart_products');
    let html = '';
    for(const product in datos.cart){
        const { quantity,price, name, image, id, amount} = datos.cart[product];
        html +=`
            <div class='cart_product'>
                <div class='cart_product_image'>
                    <img src='${image}' alt= 'image product' />
                </div>
                <div class='cart_product_container'>
                    <div class='cart_product_description'>
                        <h3>${name}</h3>
                        <h4>Precio: $${price}</h4>
                        <p>Stock: ${quantity}</p>
                    </div>
                    <div id=${id} class='cart_counter'> 
                        <b class='less'>-</b>
                        <span>${amount}</span>
                        <b class='plus'>+</b>
                        <img class='trash' src='./img/trash.png' alt='trash'/>
                    </div>
                </div>
            </div>
        `;
    }
    cart_products.innerHTML = html;
}
function handleCart(datos){
    const cart_products = document.querySelector('.cart_products');
    cart_products.addEventListener('click', function(event){
        if(event.target.classList.contains('plus')){
            const id= Number(event.target.parentElement.id);
            const productFind = datos.products.find(function(product){
                return product.id ===id;
            });
            if(datos.cart[productFind.id]){
                 if(productFind.quantity === datos.cart[productFind.id].amount){
                    return alert('¡No queda más stock!');
                 }
            }
            datos.cart[id].amount++;
        }
        if(event.target.classList.contains('less')){
            const id = Number(event.target.parentElement.id);
            if(datos.cart[id].amount===1){
                return 
            }else{
                datos.cart[id].amount--;
            }
        }
        if(event.target.classList.contains('trash')){
            const id = Number(event.target.parentElement.id);
            const response = confirm('¿Estás seguro que quieres borrar?')
            if(!response){
                return
            }
            delete datos.cart[id];
        }
        window.localStorage.setItem('cart', JSON.stringify(datos.cart));
        printToCart(datos);
        totalCart(datos)
    });
}
function totalCart(datos){
    const info_total = document.querySelector('.info_total');
    const info_amount = document.querySelector('.info_amount');
    let totalProducts = 0;
    let amountProducts = 0;
    for(const product in datos.cart){
        amountProducts += datos.cart[product].amount;
        totalProducts += (datos.cart[product].amount * datos.cart[product].price);
    }
    info_total.textContent = 'Total: $'+totalProducts+'.00';
    info_amount.textContent = 'Cantidad: '+amountProducts;
}
function buyCart(datos){
    const btnBuy = document.querySelector('.btn_buy');
    btnBuy.addEventListener('click',function(){
        if(!Object.keys(datos.cart).length){
            return alert('No hay productos en el carrito.')
        }
        const reponse = confirm('¿Seguro que quieres comprar?')
        if(!reponse){
            return;
        }
        for(const product of datos.products){
            const cartProduct = datos.cart[product.id];
            if(product.id===cartProduct?.id){
                product.quantity -= cartProduct.amount;
            }
        }
        datos.cart = {}
        window.localStorage.setItem('products', JSON.stringify(datos.products));
        window.localStorage.setItem('cart',JSON.stringify(datos.cart))
        print_products(datos);
        printToCart(datos);
        totalCart(datos);
    })
}
function handleList(datos){
    const lista_item = document.querySelectorAll('.lista_item');
    lista_item[0].addEventListener('click', function(){
        print_products(datos)
        lista_item[0].classList.add('active');
        lista_item[1].classList.remove('active');
        lista_item[2].classList.remove('active');
        lista_item[3].classList.remove('active');
    })
    lista_item[1].addEventListener('click', function(){

        lista_item[0].classList.remove('active');
        lista_item[1].classList.add('active');
        lista_item[2].classList.remove('active');
        lista_item[3].classList.remove('active');
        const productstHTML = document.querySelector('.products')
        let html = '';
        for(const product of datos.products){
            if(product.category==='shirt'){
                html+=`
                <div class='product'>
                    <div class='product_img'>
                        <img id = ${product.id} class= 'modal_img' src=${product.image} alt='imagen del producto'/>
                    </div>
                    <div class = 'product_description'>
                        <p><strong>Nombre:</strong> ${product.name}</p>
                        <p><strong>Precio:</strong> $${product.price}.00</p>
                        <p><strong>Stock:</strong> ${product.quantity}</p>
                        <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                    </div>
                </div>
                `
            }         
        }
        productstHTML.innerHTML = html;
    })
    lista_item[2].addEventListener('click', function(){
        lista_item[0].classList.remove('active');
        lista_item[1].classList.remove('active');
        lista_item[2].classList.add('active');
        lista_item[3].classList.remove('active');
        const productstHTML = document.querySelector('.products')
        let html = '';
        for(const product of datos.products){
            if(product.category==='hoddie'){
                html+=`
                <div class='product'>
                    <div class='product_img'>
                        <img id = ${product.id} class= 'modal_img' src=${product.image} alt='imagen del producto'/>
                    </div>
                    <div class = 'product_description'>
                        <p><strong>Nombre:</strong> ${product.name}</p>
                        <p><strong>Precio:</strong> $${product.price}.00</p>
                        <p><strong>Stock:</strong> ${product.quantity}</p>
                        <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                    </div>
                </div>
                `  
            }
        }   
        productstHTML.innerHTML = html;       
    })
    lista_item[3].addEventListener('click', function(){
        lista_item[0].classList.remove('active');
        lista_item[1].classList.remove('active');
        lista_item[2].classList.remove('active');
        lista_item[3].classList.add('active');
        const productstHTML = document.querySelector('.products')
        let html = '';
        for(const product of datos.products){
            if(product.category==='sweater'){
                html+=`
                <div class='product'>
                    <div class='product_img'>
                        <img id = ${product.id} class= 'modal_img'src=${product.image} alt='imagen del producto'/>
                    </div>
                    <div class = 'product_description'>
                        <p><strong>Nombre:</strong> ${product.name}</p>
                        <p><strong>Precio:</strong> $${product.price}.00</p>
                        <p><strong>Stock:</strong> ${product.quantity}</p>
                        <button id= ${product.id} class='cart_buy'>Agregar al carrito</button>
                    </div>
                </div>
                `
            }
        }   
        productstHTML.innerHTML = html;      
    })
}
function descriptionProducts(datos){
    const productstHTML = document.querySelector('.products');
    const modal = document.querySelector('.modal');
    const modal_product = document.querySelector('.modal_product')
    productstHTML.addEventListener('click',function(event){
        if(event.target.classList.contains('modal_img')){
            const id =Number(event.target.id);
            const productFind = datos.products.find(function(product){
            return product.id === id;
            });
            modal_product.innerHTML = `
                <div class='modal_img_product'>
                    <img src= '${productFind.image}' alt='image product'/>
                </div>
                <div class='modal_group'>
                    <h3><span>Nombre: </span>${productFind.name}</h3>
                    <h3><span>Descripcion: </span>${productFind.description}</h3>
                    <h3><span>Categoria: </span>${productFind.category}</h3>
                    <h3><span>Precio: </span>$${productFind.price}.00</h3>
                </div>
            `;
            modal.classList.add('active');
        }
    })
}
async function main(){
    const datos = {
        products: JSON.parse(window.localStorage.getItem('products')) || await getApi(),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    }
    events()
    print_products(datos)
    addToCart(datos);
    printToCart(datos)
    handleCart(datos) 
    totalCart(datos)
    buyCart(datos)
    handleList(datos);
    descriptionProducts(datos)
}
main();