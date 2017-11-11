const consController = require('../controllers/conversation-controller');

const { express, auth } = global;

const router = express.Router();

router.post('/', auth.jwtAuthenticate(), consController.getConversations);

router.post('/detail', auth.jwtAuthenticate(), consController.getConversationDetail);

router.post('/set', auth.jwtAuthenticate(), consController.setConversation);

router.post('/set-read-messages', auth.jwtAuthenticate(), consController.setReadMessages);

module.exports = router;
