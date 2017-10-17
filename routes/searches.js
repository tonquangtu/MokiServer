const searchController = require('../controllers/search-controller');

const { express } = global;

const router = express.Router();

// authenticate route
router.post('/simple/products', searchController.simpleSearchProducts);

router.post('/full/products', searchController.fullSearchProducts);

module.exports = router;
