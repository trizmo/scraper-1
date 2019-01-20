console.log('mainApp routing works!')

const express = require('express');
const router  = express.Router();
const app = express();
const newsCards_controller = require('../controllers/newsCards_controller');

router.get('/', newsCards_controller.index);
router.get('/scrape', newsCards_controller.scrape);
router.get('/articles/:id', newsCards_controller.getOne);
router.post('/articles/:id', newsCards_controller.addComment)

module.exports = router;