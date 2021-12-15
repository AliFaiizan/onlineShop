const Product = require("../Model/product");
const mongodb = require('mongodb');



/** 
 * @typedef {import("express").Request} req
 * @typedef {import("express").Response} res
 * @typedef {import("express").NextFunction} next
 * 
*/

module.exports.getAddProduct = (req, res, next) => { //mongo
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
module.exports.postAddProduct = (req, res, next) => { //mongo
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId=req.session.user._id;
  
  const product= new Product ({title,price,description,imageUrl,userId})
  product.save().then(() => {
    res.redirect('/')
  })
  .catch((err) => {
    console.log(err)
  })

  
};

module.exports.getEditProduct = (req, res, next) => { //mongo
  const prodId = req.params.productId;
  const editing = req.query.editing;
  if (!editing) {
    return res.redirect("/");
  }
  Product.findOne({_id:prodId,userId:req.user._id})
  //Product.findByPk(prodId)
  .then((product) =>{
    //const product= prod[0]; //sequlize
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product: product,
      
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
  // const updatedProduct ={
  //   title:updatedTitle,
  //   price:updatedprice,
  //   description:updateddescription,
  //   imageUrl:updatedimgUrl
  // };
  return Product.findOne({_id:prodId}) //we can get one product can call save method on it
  .then((product) =>{
    console.log(product)
    if(!product||product.userId.toString()!==req.user._id.toString()){
      console.log('post edit product: something fishy huh?')
      return res.redirect("/admin/products")
    }
    product.title=updatedTitle,
    product.price=updatedprice,
    product.description=updateddescription,
    product.imageUrl=updatedimgUrl
    product.save().then(() => {
      console.log(`product sucessfuly updated`)
      return res.redirect("/admin/products");
    })
    
  })
  .catch((err) => {console.log(err)})

};

module.exports.getAdminProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((Products) => {
      res.render("admin/products", {
        prods: Products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        hasProducts: Products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.postDeleteProducts = (req, res, next) => {
  let productId = req.body.productId; 
  Product.deleteOne({ _id: productId ,userId:req.user._id})
    .then(() => {
      return req.user.removeCartItem(productId);
    })
    .then(() => {
      res.redirect("/admin/products");
    });
};
