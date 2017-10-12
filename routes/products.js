const productController = require('../controllers/product-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', productController.getProductList);
router.post('/detail', productController.getProductDetail);
router.post('/comments', productController.getCommentProduct);
router.post('/add-comment', auth.jwtAuthenticate(), productController.postCommentProduct);
module.exports = router;
