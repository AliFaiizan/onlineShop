const db= require("../util/database");
const Cart = require("./cart");



module.exports = class product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  Save() {
    
    if(this.id){
      db.execute('UPDATE `node-complete`.`products` SET `title` = ? , `imageUrl` = ? , `description` = ? , `price` = ? WHERE (`id` = ?)',[this.title,this.imageUrl,this.description,this.price,this.id])
      .then(() =>console.log('record updated sucessfully')).catch((err) => console.log(err+'There was an error updating the record'))
    }
    else{
      db.execute('INSERT INTO `node-complete`.`products` (`title`, `price`, `description`, `imageUrl`) VALUES (?,?, ?, ?)',[this.title,this.price,this.description,this.imageUrl])
      .then(() => {
           console.log("**NEW** record added sucessfully")
      }).catch(err =>console.log(err))
    }
  }

  static fetchAll() {
   return db.execute("SELECT * FROM products")
  
  }

  static findById(id) {
    return db.execute("SELECT * FROM products WHERE id="+id)
  }

  static deleteById(id) {
    return db.execute("DELETE FROM products WHERE id="+id)
    //also remove this item from cart

   
}}
