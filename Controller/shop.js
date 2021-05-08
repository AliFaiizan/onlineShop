const products = require("../Model/product");
const Cart = require("../Model/cart");



module.exports.getProducts = (req, res, next) => {
  products.fetchAll()
  .then(([rows,fields]) => {
    
    res.render("shop/product-list", {
      prods: rows,
      pageTitle: "All product",
      path: "/products",
    });
  })
  .catch((err) => {console.log(err)})
};

module.exports.getProductById = (req, res, next) => {
  const prodId = req.params.productId;
  products.findById(prodId).then(([product]) => {
    
    res.render("shop/product-detail", {
      product: product[0],
      pageTitle: product[0].title,
      path: "/products",
    });
  })
  .catch((err) => {res.send(err)});
};

//controller for displaying the index page (home page)

module.exports.getIndex = (req, res, next) => {
  products.fetchAll().then(([rows,fields]) => {
    res.render("shop/index", {
      prods: rows,
      pageTitle: "Shop",
      path: "/",
    });
  
  }).catch((err) => {console.log(err)})
    
};

//controler for getting cart information

module.exports.getCart = (req, res, next) => {
  // retrive all the cart data to display
  Cart.fetchCart((content) => {
    let objContent = content;
    var product = objContent.products;
    var dprod = [];
    
    if(product.length>0){
      product.forEach((element) => {
        products.findById(element.id, (prod) => {
          prod.qty= element.qty;
          
          dprod.push(prod);
          if (product.length === dprod.length) {
            res.render("shop/cart", {
              prods: dprod,
              totalprice: objContent.totalprice,
              pageTitle: "Cart",
              path: "/cart",
            });
          }
        });
      });

    }else{

      res.render("shop/cart", {
        prods: dprod,
        totalprice: objContent.totalprice,
        pageTitle: "Cart",
        path: "/cart",
      });
    }
    


  });
};

module.exports.postCart = (req, res, next) => {
  // whenb add to cart is pressed
  const prodId = req.body.productId;
  products.findById(prodId, (product) => {
    Cart.addproduct(prodId, product.price);
  });

  res.redirect("/cart");
};

module.exports.removeCartProduct = (req, res, next) => {
  let productId= req.body.productId;
  let productPrice= req.body.productPrice;
  
  Cart.removeProduct(productId,productPrice);
  res.redirect("/cart");
}

//controller for getting orders
module.exports.getOrders = (req, res, next) => {
  products.fetchAll((content) => {
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
    });
  });
};
//controller for checkout process

module.exports.getCheckout = (req, res, next) => {
  products.fetchAll((content) => {
    res.render("shop/checkout", {
      prods: content,
      pageTitle: "Checkout",
      path: "/checkout",
    });
  });
};
