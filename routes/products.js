const express = require('express');
const productController = require('../controllers/product-controller');

const { auth } = global;

const router = express.Router();

router.post('/product-list', auth.authenticate(), productController.getProductList);

module.exports = router;
