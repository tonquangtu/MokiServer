const brandController = require('../controllers/brand-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', brandController.getBrands);

module.exports = router;
