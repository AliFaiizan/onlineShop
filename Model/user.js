const GetDb = require("../util/database").GetDb;
const mongodb = require("mongodb");
const Product= require("../Model/product")
class User {
  constructor(name, pwd, cart, id) {
    this.name = name;
    this.pwd = pwd;
    this.cart = cart;
    this._id = id;
  }

  static findById(id) {
    const db = GetDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(id) })
      .then((user) => {
        return user;
      });
  }

  getCart() {
    const db = GetDb();
    return db
      .collection("users")
      .findOne({ _id: this._id })
      .then((user) => {
        return user.cart;
      });
  }
  addToCart(prodId) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId === prodId;
    });

    const db = GetDb();
    if (cartProductIndex >= 0) {
      return db
        .collection("users")
        .updateOne(
          {
            _id: new mongodb.ObjectID(this._id),
            "cart.items": { $exists: true },
          },
          { $inc: { "cart.items.$[el].quantity": 1 } },
          { arrayFilters: [{ "el.productId": prodId }] }
        );
    } else {
      return db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectID(this._id) },
          { $push: { "cart.items": { productId: prodId, quantity: 1 } } }
        );
    }
  }

  cartUpdateTotal(total){
    const db= GetDb()

    return db.collection("users").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{"cart.total":total}})
  }

  removeCartItem(prodId) {
    const db = GetDb();
    return db
      .collection("users")
      .updateOne(
        {
          _id: new mongodb.ObjectID(this._id),
          "cart.items": { $exists: true },
        },
        { $pull: { "cart.items": { productId: prodId } } }
      );
  }

  getOrders(){
    const db= GetDb()
    return db.collection("orders").find({userId:new mongodb.ObjectID(this._id)}).toArray()
    .then((order) => {
      return order;
    })
  }

  addOrders(){
    const db = GetDb();
    let prods=[]
      return this.cart.items.map((prod) => {
      return Product.findById(prod.productId)
      .then((product) => {
        product.quantity=prod.quantity;
        prods.push(product)
         
        return db
           .collection("orders")
           .insertOne({
             items: prods,
             userId: this._id,
             userName:this.name
           })
           
      }).then(() => {
          return db
            .collection("users")
            .updateOne(
              { _id: new mongodb.ObjectID(this._id) },
              { $set: { "cart.items": [] } }
            );
      })
    })
   
   
   
  }
}

module.exports=User;