const productController = require('../controllers/product-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/products', auth.jwtAuthenticate(), productController.getProductList);

module.exports = router;
