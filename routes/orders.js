const orderController = require('../controllers/order-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), orderController.getOrderAddressList);
router.post('/delete-address', auth.jwtAuthenticate(), orderController.deleteOrderAddress);

module.exports = router;
