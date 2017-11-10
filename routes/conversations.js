const consController = require('../controllers/conversation-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), consController.getConversations);

router.post('/detail', auth.jwtAuthenticate(), consController.getConversationDetail);

router.post('/set', auth.jwtAuthenticate(), consController.setConversation);

module.exports = router;
