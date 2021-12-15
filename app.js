const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const csrf= require('csurf');
const mongoose = require("mongoose");
const session= require('express-session');
const MongoDBStore= require('connect-mongodb-session')(session);
const flash= require('connect-flash');



const User= require('./Model/user');



const app = express();

app.set("view engine", "ejs");
app.set("views", "views");



 const adminRoutes = require("./routes/admin");
 const shopRoutes = require("./routes/shop");
 const authRoutes = require("./routes/auth");
 const error = require("./Controller/error");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));




//configuring a session and Store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,  // connection string of  server to database connection
  collection: "sessions" // where all the session will be stored
});


//const csrfProtection= csrf(); // imported module


app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store
  })
);

app.use(csrf());// must be added after the session because it uses it.
app.use(flash());
app.use((req, res, next) => {

  res.locals.isAuthenticated= req.session.isLogedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
//Dummy user  

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;

      next();
    })
    .catch((err) => {
      console.log(err);
    });
});



app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(error.get404Page);



mongoose
  .connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify :true}
  )
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server started on port 3k`);
    });
  })
  .catch((err) => console.log("something fishy"));

