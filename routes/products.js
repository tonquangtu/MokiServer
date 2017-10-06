const productController = require('../controllers/product-controller');

const { express } = global;
const { auth } = global;

const router = express.Router();

router.post('/products', auth.authenticate(), productController.getListProducts);