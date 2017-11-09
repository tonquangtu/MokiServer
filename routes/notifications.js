const notifyController = require('../controllers/notification-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), notifyController.getNotifications);

module.exports = router;
