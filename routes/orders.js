const orderController = require('../controllers/order-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), orderController.getOrderAddressList);

module.exports = router;
