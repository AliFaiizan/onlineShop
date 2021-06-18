const path = require("path");
const sequelize= require("./util/database");
const User= require('./Model/user');
const Product = require('./Model/product')
const Cart = require("./Model/cart");
const cartItem = require("./Model/cart-Item");
const Order = require('./Model/order');
const OrderItem= require('./Model/order-item');

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");



const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const error = require("./Controller/error");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Dummy user  

app.use((req,res,next) => {
User.findByPk(1).then((user) => {
  req.user=user;
  next()
}).catch((err) => {
  console.log(err)
})
  
})





app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(error.get404Page);

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through:cartItem});
Product.belongsToMany(Cart,{through:cartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem})
//Product.belongsToMany(Order,{through:OrderItem}) //can be done both ways


sequelize
//.sync({force:true})
.sync()
.then(() =>{
  return User.findByPk(1); 
})
.then((user) => {
  
  if(!user){
    return User.create({
      name:'Ali',
      email:'has@gaml.com',
      password:'haha'
    })
  }
  return user;
})
.then((user) => {
  user.getCart()
  .then((cart) => {
    if(!cart)
    user.createCart();
   
  }).catch((err) => {
    console.log(err)
  })
  
  
}).then(() => {
   app.listen(3000, () => {
     console.log("server started on port 3k");
   }); 
})
.catch((err) => {
  console.log(err);
})


