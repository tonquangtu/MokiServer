const campaignController = require('../controllers/campaign-controller');

const { express } = global;
const router = express.Router();

router.post('/', campaignController.getNewestCampaigns);

router.post('/all', campaignController.getAllCampaigns);

module.exports = router;
