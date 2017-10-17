const userController = require('../controllers/user-controller');

const { express, auth } = global;

const router = express.Router();

// authenticate route
router.post('/detail', auth.jwtAuthenticate(), userController.userDetail);
router.post('/set-setting', auth.jwtAuthenticate(), userController.setSetting);
module.exports = router;
