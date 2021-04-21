const { throws } = require("assert");
const fs = require("fs");
const path = require("path");
const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static addproduct(id, price) {
    fs.readFile(p, "utf8", (err, fileContent) => {
      let cart = { products: [], totalprice: 0 };

      if (!err) {
        cart = JSON.parse(fileContent);
      }

      let updatedProduct;
      let ExistingProductIndex = cart.products.findIndex((product) => {
        return product.id === id;
      });
      let ExistingProduct = cart.products[ExistingProductIndex];

      if (ExistingProduct) {
        updatedProduct = { ...ExistingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        //cart.products=[...cart.products];
        cart.products[ExistingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalprice = cart.totalprice + price;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }
};
