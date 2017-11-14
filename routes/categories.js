const categoryController = require('../controllers/category-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', categoryController.getCategories);

module.exports = router;
