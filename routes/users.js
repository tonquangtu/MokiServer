const userController = require('../controllers/user-controller');

const { express } = global;
const { auth } = global;

const router = express.Router();

// authenticate route
router.post('/user-detail', auth.jwtAuthenticate(), userController.userDetail);

module.exports = router;
