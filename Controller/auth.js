const User = require("../Model/user");
const bcrypt = require("bcryptjs");
const sgMail=require("@sendgrid/mail")
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

sgMail.setApiKey(process.env.SENDGRID_URI);
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key:
        process.env.SENDGRID_URI,
    },
  })
);

module.exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput:{email:'',password:''},
    validationMsg:[]
  });
};

module.exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput:{email:'',password:'',confirmPassword:''},
    validationMsg:[]
  });
};

module.exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            errorMessage: "Invalid Email or Password",
            oldInput: {email, password },
            validationMsg: [{param:'email'},{param: 'password'}]
          })
        }
        bcrypt.compare(password, user.password).then((doMatch) => {
          if (doMatch) {
            req.session.isLogedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              console.log(`successfully logedin`);
              res.redirect("/");
            });
          } else {
            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "login",
              errorMessage: "Invalid Email or Password",
              oldInput: {email, password },
              validationMsg: [{param:'email'},{param: 'password'}]
            })
          }

        }).catch((err) => {
              console.log(err);
            });
      })
};

module.exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput:{email,password,confirmPassword:req.body.confirmPassword},
      validationMsg:errors.array()
    });
  }

  bcrypt.hash(password, 12)
    .then((hashedpass) => {
      const user = new User({
        email: email,
        password: hashedpass,
        cart: { items: [], total: 0 },
      });
      return user.save();
    })
    .then(() => {
      transporter
        .sendMail({
          to: email,
          from: "alif.1dev@gmail.com",
          subject: "You have sucessfully created a account",
          html: "<h1>Hi Welcome<h1>",
        })
        .catch((err) => console.log(err));
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};

module.exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

module.exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

module.exports.postResetPassword = (req, res, next) => {
  crypto.pseudoRandomBytes(32, (err, bufferToken) => {
    if (err) {
      console.log(err);
      return res.redirect("/resetPassword");
    }

    const token = bufferToken.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Reset link has been sent to this address");
          console.log("email doesnot exists");
          return res.redirect("/resetPassword");
        }
        user.resetToken = token;
        user.resetTokenExpire = Date.now() + 3600000; // 3600000 stand for 1hour in mili seconds
        return user.save();
      })
      .then(() => {
        res.redirect("/resetPassword");
        transporter
          .sendMail({
            to: req.body.email,
            from: "alif.1dev@gmail.com",
            subject: "Password Reset Link",
            html: `
            <a href="http://localhost:3000/resetPassword/${token}">Click to reset Password</a>
         `,
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

module.exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      req.flash("error", "link is broken");
      return res.redirect("/resetPassword");
    }
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    res.render("auth/newPassword", {
      path: "/newPassword",
      pageTitle: "New Password",
      token,
      userId: user._id.toString(),
      errorMessage: message,
    });
  });
};

module.exports.postNewPassword = (req, res, next) => {
  const token = req.body.token;
  const password = req.body.password;
  const userId = req.body.userId;

  User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "invalid token or there is no user");
        console.log("invalid token ");
        return res.redirect("/resetPassword");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpire = undefined;
          return user.save();
        })
        .then(() => {
          console.log("password is sucessfully upadated");
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
