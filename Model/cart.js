const GetDb = require("../util/database").GetDb;
const mongodb = require("mongodb");

class Cart {

  static getCartById(id) {
    const db = GetDb();
    return db.collection("users").findOne({_id:new mongodb.ObjectID(id)}).then((user) => {
        return user.cart;
    })
  }
}


module.exports=Cart;