const productController = require('../controllers/product-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', productController.getProductList);
router.post('/detail', productController.getProductDetail);
router.post('/comments', productController.getCommentProduct);
router.post('/add-comment', auth.jwtAuthenticate(), productController.postCommentProduct);
router.post('/delete-product', auth.jwtAuthenticate(), productController.deleteProduct);
router.post('/like-product', auth.jwtAuthenticate(), productController.likeProduct);
router.post('/report-product', auth.jwtAuthenticate(), productController.reportProduct);
router.post('/my-like', auth.jwtAuthenticate(), productController.getProductListMyLike);
router.post('/new-item', productController.getNewItemNumber);
router.post('/add-product', auth.jwtAuthenticate(), productController.addProduct);
router.post('/user-listing', productController.getUserListing);
router.post('/edit-product', auth.jwtAuthenticate(), productController.editProduct);

module.exports = router;
