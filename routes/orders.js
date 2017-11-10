const orderController = require('../controllers/order-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), orderController.getOrderAddressList);
router.post('/delete-address', auth.jwtAuthenticate(), orderController.deleteOrderAddress);
router.post('/add-address', auth.jwtAuthenticate(), orderController.addOrderAddress);
router.post('/edit-address', auth.jwtAuthenticate(), orderController.editOrderAddress);

module.exports = router;
