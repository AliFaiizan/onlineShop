
const fs = require("fs");

const path = require("path");
const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "Data",
  "product.json"
);

const getDataFromFile = (cb) => {
  fs.readFile(p, "utf8", (err, filecontent) => {
    if (err) {
      return cb([]);
    }
    
    cb(JSON.parse(filecontent));
  });
};

module.exports = class product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  Save() {
    getDataFromFile((product) => {
      
      if (this.id) {
        const existingProductIndex = product.findIndex((prod) => {
          return (prod.id === this.id);
        });
        //const upprod=[...product];
        
        product[existingProductIndex] = this;
        
        fs.writeFile(p, JSON.stringify(product), (err) => {
          if (err) {
            console.log(err);
          }
        });
      } else {
        product.push(this);
        
        fs.writeFile(p, JSON.stringify(product), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }

  static fetchAll(cb) {
    getDataFromFile(cb);
  }

  static findById(id, cb) {
    getDataFromFile((products) => {
      const prod = products.find((p) => p.id == id);
      cb(prod);
    });
  }

  static deleteById(id,cb) {
    getDataFromFile((pro) => {
      const product= pro.find((p) => p.id === id);
      const updatedProducts= pro.filter(p => p.id !== id)
      
      fs.writeFile(p,JSON.stringify(updatedProducts),(err) => {
        if(!err){
          Cart.removeProduct(product.id,product.price)
          cb(id)
        }}
    )
  }
  )}
};
