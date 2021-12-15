
const express = require('express');
const isAuth= require('../middleware/aAuth');
const shopProductController = require('../Controller/shop');


const router = express.Router();

router.get('/', shopProductController.getIndex);
router.get('/products',shopProductController.getProducts);
router.get('/products/:productId',shopProductController.getProductById);

router.get("/orders", isAuth, shopProductController.getOrders);
router.post("/orders", isAuth, shopProductController.postOrders);
// // router.get('/checkout',shopProductController.getCheckout);

router.get("/cart", isAuth, shopProductController.getCart);
router.post("/cart", isAuth, shopProductController.postCart);
router.post(
  "/cart/removeitem",
  isAuth,
  shopProductController.removeCartProduct
);

module.exports = router;
     