
const express = require('express');
const shopProductController = require('../Controller/shop');


const router = express.Router();

router.get('/', shopProductController.getIndex);
router.get('/products',shopProductController.getProducts);
router.get('/products/:productId',shopProductController.getProductById);

router.get('/orders',shopProductController.getOrders);
router.post('/orders',shopProductController.postOrders);
// // router.get('/checkout',shopProductController.getCheckout);

router.get('/cart',shopProductController.getCart);
router.post('/cart',shopProductController.postCart);
router.post('/cart/removeitem',shopProductController.removeCartProduct);

module.exports = router;
