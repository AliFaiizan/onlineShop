const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");



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
  User.findById("60ed68b3076fcc405ca9635f")
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
app.use(error.get404Page);


mongoose
  .connect(
    "mongodb+srv://AliShop:%28Dev%40787%29@cluster0.vmqff.mongodb.net/Shop?authSource=admin&replicaSet=atlas-4e7ld3-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
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






