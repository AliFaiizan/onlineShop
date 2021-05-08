
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
      cart.totalprice = cart.totalprice + +price;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static fetchCart(cb) {
    fs.readFile(p, "utf8", (err, data) => {
      if (!err) {
        
        cb(JSON.parse(data));
      } else {
        console.log(err);
      }
    });
  }

  static updateCart(content) {
    fs.writeFile(p, JSON.stringify(content), (err)=>{
      if(err)
      console.log(err);
    })
  }

  static removeProduct(id, price) {
    fs.readFile(p, "utf8", (err, cart) => {
      if (!err) {
        const nCart = JSON.parse(cart);
        const productToUpdate = nCart.products.find((prod) => {
          return prod.id === id;
        });
       if(!productToUpdate){
         return;
       }
        let updatedCart = { ...nCart };

        updatedCart.products = updatedCart.products.filter((prod) => {
          return prod.id !== id;
        });

        updatedCart.totalprice =
          updatedCart.totalprice - parseInt(price) * productToUpdate.qty;// this has some issue when we delete item form admin and total price in cart does not update

        fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        console.log(err);
      }
    });
  }
};
