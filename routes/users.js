const userController = require('../controllers/user-controller');

const { express, auth, constants } = global;

const router = express.Router();

// authenticate route
router.post('/detail', userController.userDetail);
router.post('/setting', auth.jwtAuthenticate(), userController.getSetting);
router.post('/set-setting', auth.jwtAuthenticate(), userController.setSetting);
router.post('/set-info', auth.jwtAuthenticate(), userController.setUserInfo);
router.post('/followed', (req, res) => userController.getFollowList(req, res, constants.followedField));
router.post('/following', (req, res) => userController.getFollowList(req, res, constants.followingField));
router.post('/get-ship-from', userController.getShipForm);

module.exports = router;
