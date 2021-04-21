const express = require("express");

const adminProductController = require("../Controller/admin");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminProductController.getAddProduct);

// /admin/add-product => POST

router.post("/add-product", adminProductController.postAddProduct);

router.get('/edit-product/:productId', adminProductController.getEditProduct);
router.post('/edit-product', adminProductController.postEditProduct);

router.get("/products", adminProductController.getAdminProducts);

module.exports = router;
