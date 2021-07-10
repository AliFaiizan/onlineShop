const GetDb= require('../util/database').GetDb;
const mongodb = require('mongodb');
class Product {
  constructor(title, price, description, imageUrl,id,userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id=id;
    this.userId=userId;
  }


  save() {
    const db = GetDb();
    if(!this._id)
    return db.collection("products").insertOne(this);
    else
    return db.collection("products").updateOne({_id:new mongodb.ObjectID(this._id)},{$set:this})

  }
  static findById(id) {
    const db = GetDb();
    return db.collection("products").find({ _id: new mongodb.ObjectID(id) }).next().then((product) => {
      return product;
    }).catch(err=>console.log(err))
  }

  static fetchAll() { 
    const db = GetDb();
    return db.collection("products").find().toArray().then((products) => {
      return products;
    }).catch((err) => {
      console.log(err)
    });
  }

  static deleteById(id){
    const db=GetDb();
    return db.collection("products").deleteOne({_id:new mongodb.ObjectID(id)}).then(() => {
      console.log(`product with id ${id} has been deleted`)
    }).catch(err=>console.log(err))
  }
}


module.exports=Product;

