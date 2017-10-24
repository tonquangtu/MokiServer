const consController = require('../controllers/conversation-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), consController.getConversations);

router.post('/detail', auth.jwtAuthenticate(), consController.getConversationDetail);

module.exports = router;
