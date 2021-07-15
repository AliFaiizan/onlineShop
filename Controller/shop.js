const Product = require("../Model/product");
const Order = require("../Model/order");


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
  Product.find()
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
  Product.find()
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

 req.user.populate('cart.items.productId').execPopulate()
 .then((user) => {
     res.render("shop/cart", {
       prods: user.cart.items,
       cartTotal:user.cart.total,
       pageTitle: "Cart",
       path: "/cart", 
     });   
 }).catch((err) => {
   console.log(err)
 });


}



module.exports.postCart = (req, res, next) => {
  const prodId= req.body.productId;
  // whenb add to cart is pressed 
  req.user
    .addToCart(prodId)
    .then((user) => {
      req.user= user
      
      return req.user.updateCartTotal();
    })
    .then(() => {
      console.log(req.user);
      // req.user = user; ///set updated user to previously saved user
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));

}

 



module.exports.removeCartProduct = (req, res, next) => {
  let productId= req.body.productId;
  req.user.removeCartItem(productId)
    .then((user) => {
      req.user= user;
      return req.user.updateCartTotal();
    })
    .then(() => {
     //req.user = user; ///set updated user to previously saved user
    res.redirect("/cart");
   });
}


module.exports.postOrders=(req,res,next) => {
  req.user.populate("cart.items.productId").execPopulate()
  .then((populatedUser) => {
     let order = new Order({
       userId: req.user._id,
       products: populatedUser.cart.items,
       total: populatedUser.total,
     });
     return order.save();
  })
  .then(() => {
    req.user.cart.items=[];
    req.user.cart.total=0;
    req.user.save().then(() => {
      res.redirect('/orders')
           
    })
  })
}

//controller for getting orders
module.exports.getOrders = (req, res, next) => {
  Order.find({userId:req.user._id}).then((orders) => {
    
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
