const userController = require('../controllers/user-controller');

const { express } = global;
const { auth } = global;

const router = express.Router();

// authenticate route
router.post('/user-detail', auth.authenticate(), userController.userDetail);

module.exports = router;
