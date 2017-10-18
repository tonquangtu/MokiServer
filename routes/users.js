const userController = require('../controllers/user-controller');

const { express, auth } = global;

const router = express.Router();

// authenticate route
router.post('/detail', auth.jwtAuthenticate(), userController.userDetail);
router.post('/setting', auth.jwtAuthenticate(), userController.getSetting);
router.post('/set-setting', auth.jwtAuthenticate(), userController.setSetting);
router.post('/set-info', auth.jwtAuthenticate(), userController.setUserInfo);
module.exports = router;
