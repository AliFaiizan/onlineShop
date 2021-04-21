const products = require('../Model/product');
const Cart= require('../Model/cart');

module.exports.getProducts=(req, res, next) => {
    products.fetchAll((content) => {
      res.render('shop/product-list', {
        prods: content,
        pageTitle: 'All product',
        path: '/products',
      });
    })
    
  } 

  module.exports.getProductById=(req,res,next) => {
    const prodId= req.params.productId;
    products.findById(prodId,(productFound)=>{
      res.render('shop/product-detail',{
        product:productFound,
        pageTitle: productFound.title,
        path:"/products"
      });
      console.log(productFound.title);
    });
   
  }

//controller for displaying the index page

module.exports.getIndex= (req,res,next) => {
  products.fetchAll((content) => {
    res.render('shop/index', {
      prods: content,
      pageTitle: 'Shop',
      path: '/',
    });
  })
}

//controler for getting cart information

module.exports.getCart= (req,res,next)=>{ // retrive all the cart data to display
  products.fetchAll((content) => {
    res.render('shop/cart', {
      prods: content,
      pageTitle: 'Cart',
      path: '/cart',
    });
  })
}

module.exports.postCart= (req,res,next) => { // whenb add to cart is pressed
  const prodId= req.body.productId;
  products.findById(prodId,(product) =>{
    Cart.addproduct(prodId,product.price);
  })
  
  res.redirect('/cart');
}

//controller for getting orders
module.exports.getOrders= (req,res,next)=>{
  products.fetchAll((content) => {
    res.render('shop/orders', {
      
      pageTitle: 'Orders',
      path: '/orders',
    });
  })
}
 //controller for checkout process

module.exports.getCheckout= (req,res,next)=>{
  products.fetchAll((content) => {
    res.render('shop/checkout', {
      prods: content,
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  })
}