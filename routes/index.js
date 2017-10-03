const express = require('express');

const router = express.Router();

const productController = require('../controllers/product-controller');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/products', (req, res) => {
  return productController.get_list_products(req, res);
});

module.exports = router;
