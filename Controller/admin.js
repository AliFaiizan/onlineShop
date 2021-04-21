const products = require("../Model/product");

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

  const product = new products(title, imageUrl, price, description);

  product.Save();

  res.redirect("/");
};

module.exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const editing = req.query.editing;
  if (!editing) {
    return res.redirect("/");
  }
  products.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing,
      product,
    });
  });
};

module.exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedimgUrl = req.body.imageUrl;
  const updatedprice = req.body.price;
  const updateddescription = req.body.description;

  const updatedProduct = new products(
    prodId,
    updatedTitle,
    updatedimgUrl,
    updatedprice,
    updateddescription
  );

  updatedProduct.Save();
};

module.exports.getAdminProducts = (req, res, next) => {
  products.fetchAll((content) => {
    res.render("admin/products", {
      prods: content,
      pageTitle: "Admin Products",
      path: "/admin/products",
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
    });
  });
};
