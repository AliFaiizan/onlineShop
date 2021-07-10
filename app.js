const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const MongoConnect=require('./util/database').MongoConnect;
const User= require('./Model/user')


const app = express();

app.set("view engine", "ejs");
app.set("views", "views");



 const adminRoutes = require("./routes/admin");
 const shopRoutes = require("./routes/shop");
 const error = require("./Controller/error");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Dummy user  

app.use((req, res, next) => {
  User.findById("60e5cf0548e60bf93f01781d")
    .then((user) => {
      req.user = new User(user.name,user.pwd,user.cart,user._id);
      
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(error.get404Page);


MongoConnect(() => {
   app.listen(3000, () => {
     console.log("server started on port 3k",);
   }); 
})







