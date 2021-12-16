const express = require("express");
const User= require('../Model/user')
const authController = require("../Controller/auth");
const { check, body } = require("express-validator");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/login", [
    check("email")
        .isEmail()
        .withMessage("Email is invalid")
], authController.postLogin);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Email is invalid")
      .custom((val, { req }) => {
          return User.findOne({ email: val }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      }),
    body("password", "password length is too short")
      .isLength({ min: 5 })
      ,
    body("confirmPassword").custom((val, { req }) => {
      if (val !== req.body.password) {

        throw new Error("password does not match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/resetPassword", authController.getResetPassword);
router.post("/resetPassword", authController.postResetPassword); // this route will send the email to user
router.get("/resetPassword/:token", authController.getNewPassword); //shows interface of new password set
router.post("/newPassword", authController.postNewPassword); // this will update the user password

module.exports = router;
