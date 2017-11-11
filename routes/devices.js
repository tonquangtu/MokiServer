const deviceController = require('../controllers/device-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/set-dev-token', auth.jwtAuthenticate(), deviceController.setDeviceToken);

module.exports = router;
