const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    total: { type: Number },
  },
  resetToken:String,
  resetTokenExpire:Date,
});

userSchema.methods.addToCart = function (prodId) {
  //ad to cart method

  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === prodId;
  });

  if (cartProductIndex >= 0) {
    return mongoose.model("User").findByIdAndUpdate(
      {
        _id: this._id,
        "cart.items": { $exists: true },
      },
      { $inc: { "cart.items.$[el].quantity": 1 } },
      {
        arrayFilters: [{ "el.productId": prodId }],
        new: true, //return object ofter modification
      }
    );
  } else {
    return mongoose.model("User").findByIdAndUpdate(
      {
        _id: this._id,
        "cart.items": { $exists: true },
      },
      { $push: { "cart.items": { productId: prodId, quantity: 1 } } },
      { new: true }
    );
  }
};

userSchema.methods.removeCartItem = function (prodId) {
  return mongoose
    .model("User")
    .findByIdAndUpdate(
      { _id: this._id, "cart.items": { $exists: true } },
      { $pull: { "cart.items": { productId: prodId } } },
      { new: true }
    );
};

userSchema.methods.updateCartTotal = function () {
  let total = 0;
  return mongoose
    .model("User")
    .findById({ _id: this._id })
    .then((user) => {
      this._id = user._id;
      this.email = user.email;
      this.password=user.password;
      this.cart = user.cart;
      return user.populate("cart.items.productId").execPopulate();
    })
    .then((populatedUser) => {
      populatedUser.cart.items.map((item) => {
        total += item.productId.price * item.quantity;
        //console.log(req.user.cart.total);
        this.cart.total = total;
      });

      return this.save();
    });
  // return mongoose.model("User").updateOne({_id:this._id,"cart.items":{$exists:true}},{$set:{"cart.total":{$sum:{$mul:{"cart.items.$[]":"cart.items.$[].quantity"}}}}})
};

module.exports = mongoose.model("User", userSchema);

