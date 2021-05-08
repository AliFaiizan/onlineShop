const products = require("../Model/product");
const Cart = require("../Model/cart");

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = null;

  const product = new products(id, title, imageUrl, price, description);

  product.Save();

  res.redirect("/");
};

module.exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.editing;
  if (!editing) {
    return res.redirect("/");
  }
  
  products.findById(prodId).then(([product]) =>{
    
    if (!product[0]) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product:product[0],
    });
  });
};

module.exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimgUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;

  const lastProductPrice= req.body.productPrice;

  const updatedProduct = new products(
    prodId,
    updatedTitle,
    updatedimgUrl,
    updatedprice,
    updateddescription
  );
  //update cart price when edited product
  //
  // Cart.fetchCart((content) => {
  //   const productPriceToUpdate= content.products.find((item) => {
  //     return item.id === prodId;
  //   })

  //   const totalqty= productPriceToUpdate.qty; // total quantity of product in cart 
  //   const totalLastPrice= totalqty*lastProductPrice; // last total price of this product in cart
  //   const totalUpdatedPrice= updatedprice*totalqty;  // new total price of this product


  //   const UpdatedCart= content;

  //   UpdatedCart.totalprice= UpdatedCart.totalprice - totalLastPrice; // deduct the last total price of product from cart

  //   UpdatedCart.totalprice+= totalUpdatedPrice; // add new updated price in cart

  //   Cart.updateCart(UpdatedCart);

  // })

  updatedProduct.Save();
  res.redirect("/admin/products");
};

module.exports.getAdminProducts = (req, res, next) => {
  products.fetchAll().then(([rows]) => {
    res.render("admin/products", {
      prods: rows,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  })
  .catch((err) => {console.log(err)})
};

module.exports.postDeleteProducts = (req, res, next) => {
  let productId = req.body.productId; 
  products.deleteById(productId).then(() => {
    res.redirect('/admin/products')
  });
};
