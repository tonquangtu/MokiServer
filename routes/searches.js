const searchController = require('../controllers/search-controller');

const { express, auth } = global;

const router = express.Router();

// authenticate route
router.post('/products', searchController.searchProducts);
router.post('/delete', auth.jwtAuthenticate(), searchController.deleteSaveSearch);

module.exports = router;
