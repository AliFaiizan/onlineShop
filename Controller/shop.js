const Product = require("../Model/product");


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
  
  req.user.getProducts().then((products) => { //user is a sequilize method
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All product",
      path: "/products",
    });
   })
   .catch((err) => {console.log(err)})
    
 
};

/** 
 * @param {req} req 
 * @param {res} res 
 * 
*/

module.exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findByPk(prodId).then((product) => {
    
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  })
  .catch(err =>  res.send(err));
};

//controller for displaying the index page (home page)

module.exports.getIndex = (req, res, next) => {
  Product.findAll().then((products) => {
    res.render("shop/index", {
      prods : products,
      pageTitle: "Shop",
      path: "/",
    });
   })
   .catch((err) => {console.log(err)})
    
};

//controler for getting cart information

module.exports.getCart = (req, res, next) => {
req.user.getCart()
.then((cart) => {
  return cart.getProducts() 
.then((dprod) => {

    res.render("shop/cart", {
        prods: dprod,
        pageTitle: "Cart",
        path: "/cart",
      });
  })
})
.catch((err) => {
  console.error(err)
})
   
  // retrive all the cart data to display
  // Cart.fetchCart((content) => {
  //   let objContent = content;
  //   var product = objContent.products;
  //   var dprod = [];
    
  //   if(product.length>0){
  //     product.forEach((element) => {
  //       Product.findById(element.id, (prod) => {
  //         prod.qty= element.qty;
          
  //         dprod.push(prod);
  //         if (product.length === dprod.length) {
  //           res.render("shop/cart", {
  //             prods: dprod,
  //             totalprice: objContent.totalprice,
  //             pageTitle: "Cart",
  //             path: "/cart",
  //           });
  //         }
  //       });
  //     });

  //   }else{

  //     res.render("shop/cart", {
  //       prods: dprod,
  //       totalprice: objContent.totalprice,
  //       pageTitle: "Cart",
  //       path: "/cart",
  //     });
  //   }
    


  // });
};
   
module.exports.postCart = (req, res, next) => {
  const prodId= req.body.productId;
  let fetechedCart;
  let newQuantity;
  // whenb add to cart is pressed
  req.user.getCart()
  .then((cart) => {
    fetechedCart=cart;
    return cart.getProducts({where:{id:prodId}})
  })
  .then((products) => {
    let product
    if(products.length>0)
    product = products[0];

    newQuantity=1;
    if(product){
      const oldQuantity= product.cartItem.quantity;
      newQuantity=oldQuantity+1;
      
    }

    return Product.findByPk(prodId) 
  })
  .then((product) => {
    return fetechedCart.addProduct(product, {
      through: { quantity: newQuantity },
    });
  })
  .then(() => {
    res.redirect('/cart')
  })
  .catch((err) => {
    console.log(err)
  })

};

module.exports.removeCartProduct = (req, res, next) => { 
  let productId= req.body.productId;
  // let productPrice= req.body.productPrice;
  
  req.user.getCart().then((cart) => {
    cart.getProducts({where:{id:productId}}).then((product) => {
      let prod= product[0]
      return prod.cartItem.destroy();
    }).then((result) => {
       res.redirect("/cart");
    })
  })
 
}

module.exports.postOrders=(req,res,next) => {
  let fetechedCart;
  req.user.getCart()
  .then((cart) => {
    fetechedCart=cart;
    return cart.getProducts();
  })
  .then((product) => {
    return req.user.createOrder()
  .then((order) => {
      return order.addProducts(product.map((prod)=>{
        prod.orderItem={quantity: prod.cartItem.quantity};
        return prod;
      }))
    })
    
  })
  .then((result) => {
    return fetechedCart.setProducts(null);
    
  })
  .then((result) => {
    res.redirect('/orders')
  })
  .catch((err) => {
    console.log(err)
  })
} 

//controller for getting orders
module.exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
  .then((orders) => {
    
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
//controller for checkout process

module.exports.getCheckout = (req, res, next) => {
  Product.fetchAll((content) => {
    res.render("shop/checkout", {
      prods: content,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
}
