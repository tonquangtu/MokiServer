const notifyController = require('../controllers/notification-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), notifyController.getNotifications);

router.post('/set-read-notification', auth.jwtAuthenticate(), notifyController.setReadNotification);

module.exports = router;
