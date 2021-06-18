const Product = require("../Model/product");
const Cart = require("../Model/cart");



/** 
 * @typedef {import("express").Request} req
 * @typedef {import("express").Response} res
 * @typedef {import("express").NextFunction} next
 * 
*/

module.exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

/** 
 * @param {req} req 
 * @param {res} res 
 * 
*/
module.exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  req.user.createProduct({ //mrythof defined by sequelize
    //sequlize formate
    title,
    price,
    imageUrl,
    description,
  }).then(() => {
    console.log('sucessfully created entry')
    res.redirect("/");
  }).catch((error) => {
    console.log(error)
  })

  
};

module.exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.editing;
  if (!editing) {
    return res.redirect("/");
  }
  req.user.getProducts({where:{id:prodId}})
  //Product.findByPk(prodId)
  .then((prod) =>{
    const product= prod[0]; //sequlize
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product:product,
    });
  });
};

module.exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimgUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;
  

  //const lastProductPrice= req.body.productPrice;

  Product.findByPk(prodId)
  .then((product) => {
    product.title=updatedTitle;
    product.imageUrl=updatedimgUrl;
    product.price=updatedprice;
    product.description=updateddescription;
    return product.save();
  })
  .then(() =>{console.log('Product sucessfully updated')
    res.redirect("/admin/products");})
  .catch((err) => {console.log(err)})
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

  
  
};

module.exports.getAdminProducts = (req, res, next) => {
  req.user.getProducts().then((rows) => {
    res.render("admin/products", {
      prods: rows,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: rows.length > 0,
      activeShop: true,
      productCSS: true,
    });
  })
  .catch((err) => {console.log(err)})
};

module.exports.postDeleteProducts = (req, res, next) => {
  let productId = req.body.productId; 
  Product.destroy({where: {id: productId}})
  .then(() => {
    res.redirect('/admin/products')
  });
};
