const loginController = require('../controllers/login-controller');

const { express, auth } = global;
const router = express.Router();

router.post('/login', loginController.login);

router.post('/logout', auth.jwtAuthenticate(), loginController.logout);

module.exports = router;
