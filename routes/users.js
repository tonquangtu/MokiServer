const userController = require('../controllers/user-controller');

const { express, auth, constants } = global;

const router = express.Router();

// authenticate route
router.post('/detail', auth.jwtAuthenticate(), userController.userDetail);
router.post('/followed', (req, res) => userController.getFollowList(req, res, constants.followedField));
router.post('/following', (req, res) => userController.getFollowList(req, res, constants.followingField));

module.exports = router;
