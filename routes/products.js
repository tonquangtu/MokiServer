const productController = require('../controllers/product-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', productController.getProductList);
router.post('/detail', productController.getProductDetail);

router.post('/like', auth.jwtAuthenticate(), productController.likeProduct);

module.exports = router;
