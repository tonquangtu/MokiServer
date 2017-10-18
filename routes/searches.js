const searchController = require('../controllers/search-controller');

const { express } = global;

const router = express.Router();

// authenticate route
router.post('/products', searchController.searchProducts);

module.exports = router;
