const userController = require('../controllers/user-controller');

const { express, auth } = global;

const router = express.Router();

// authenticate route
router.post('/detail', auth.jwtAuthenticate(), userController.userDetail);

module.exports = router;
