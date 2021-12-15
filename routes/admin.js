const express = require("express");
const isAuth = require("../middleware/aAuth");
const adminProductController = require("../Controller/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminProductController.getAddProduct);

// /admin/add-product => POST

router.post("/add-product", isAuth, adminProductController.postAddProduct);

router.get(
  "/edit-product/:productId",
  isAuth,
  adminProductController.getEditProduct
);

router.post("/edit-product", adminProductController.postEditProduct);

router.post(
  "/delete-Product/",
  isAuth,
  adminProductController.postDeleteProducts
);

router.get("/products", isAuth, adminProductController.getAdminProducts);

module.exports = router;
