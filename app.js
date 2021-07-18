const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const session= require('express-session');
const MongoDBStore= require('connect-mongodb-session')(session);



const User= require('./Model/user')



const app = express();

app.set("view engine", "ejs");
app.set("views", "views");



 const adminRoutes = require("./routes/admin");
 const shopRoutes = require("./routes/shop");
 const authRoutes = require("./routes/auth");
 const error = require("./Controller/error");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const MONGODB_URI="mongodb+srv://AliShop:%28Dev%40787%29@cluster0.vmqff.mongodb.net/Shop?authSource=admin&replicaSet=atlas-4e7ld3-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";


//configuring a session and Store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});

app.use(session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    store  
  })
);

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
app.use(authRoutes)
app.use(error.get404Page);


mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify :true}
  )
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          User.create({
            name: "Ali",
            email: "ali@test.com",
            cart: { items: [], total: 0 },
          });
        }
      })
      .catch((err) => {
        console.log(`no user found with that id`);
      });

    app.listen(3000, () => {
      console.log(`server started on port 3k`);
    });
  })
  .catch((err) => console.log(err));






