const productController = require('../controllers/product-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', productController.getProductList);
router.post('/detail', productController.getProductDetail);
router.post('/comments', productController.getCommentProduct);
router.post('/add-comment', auth.jwtAuthenticate(), productController.postCommentProduct);
router.post('/delete-product', auth.jwtAuthenticate(), productController.deleteProduct);

module.exports = router;
