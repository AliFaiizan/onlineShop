const Product = require("../Model/product");
const Cart=require("../Model/cart");

/**
 * @typedef {import("express").Request} req
 * @typedef {import("express").Response} res
 * @typedef {import("express").NextFunction} next
 *
 */

/**
 *
 * @param {req} req
 * @param {res} res
 * @param {next} next
 */
module.exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All product",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// /**
//  * @param {req} req
//  * @param {res} res
//  *
// */

module.exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => res.send(err));
};

// //controller for displaying the index page (home page)

module.exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// //controler for getting cart information

module.exports.getCart = (req, res, next) => {
let prods = [];
let cartTotal=0;
 req.user.getCart()
 .then((cart) => {
   if(cart.items.length>0){
    cart.items.forEach((prod) => { //for each..... instead should use map // it should be in model
      Product.findById(prod.productId).then((product) => {
        product.quantity = prod.quantity;
        prods.push(product);
        cartTotal= cartTotal + product.price * product.quantity;
        if (prods.length === cart.items.length) {
          req.user.cartUpdateTotal(cartTotal).then(() => {
               res.render("shop/cart", {
                 prods: prods,
                 cartTotal,
                 pageTitle: "Cart",
                 path: "/cart",
               });
          })
       
        }
      });
    });
   }else{
     res.render("shop/cart", {
       prods: prods,
       pageTitle: "Cart",
       path: "/cart",
     });
   }
      
   
 }).catch((err) => {
   console.log(err)
 });


}



module.exports.postCart = (req, res, next) => {
  const prodId= req.body.productId;
  // whenb add to cart is pressed
  req.user.addToCart(prodId)
  .then((result) => {
    console.log("product Updated ")
    res.redirect('/cart')
  }).catch(err=>console.log(err))

}

 



module.exports.removeCartProduct = (req, res, next) => {
  let productId= req.body.productId;
  req.user.removeCartItem(productId).then(() => {
    console.log(`item sucessfully deleted`)
    res.redirect('/cart')
   }
   )}

module.exports.postOrders=(req,res,next) => {
  //map function return array with first element as promise
  req.user.addOrders()[0].then(() => {

    res.redirect('/orders')
  })
}

//controller for getting orders
module.exports.getOrders = (req, res, next) => {
   req.user.getOrders().then((orders) => {
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders:orders
    });
  })
  .catch((err) => {
    console.log(err)
  })

};
// //controller for checkout process

// module.exports.getCheckout = (req, res, next) => {
//   Product.fetchAll((content) => {
//     res.render("shop/checkout", {
//       prods: content,
//       pageTitle: "Checkout",
//       path: "/checkout",
//     });
//   });
// }
