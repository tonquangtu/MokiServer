const sizeController = require('../controllers/size-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', sizeController.getListSizes);

module.exports = router;
