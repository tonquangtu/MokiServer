const loginController = require('../controllers/login-controller');

const { express } = global;
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});
router.post('/login', loginController.login);

module.exports = router;
