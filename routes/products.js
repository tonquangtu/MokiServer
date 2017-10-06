const express = require('express');
const productController = require('../controllers/product-controller');

const { auth } = global;

const router = express.Router();

router.post('/products', auth.jwtAuthenticate(), productController.getListProducts);
