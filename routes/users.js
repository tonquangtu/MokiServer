const userController = require('../controllers/user-controller');

const { express, auth } = global;

const router = express.Router();

// authenticate route
router.post('/detail', auth.jwtAuthenticate(), userController.userDetail);
router.post('/setting', auth.jwtAuthenticate(), userController.getSetting);
module.exports = router;
