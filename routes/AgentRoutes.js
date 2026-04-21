const router = require('express').Router();
const AgentController = require('../controllers/AgentController');

router.post('/create', AgentController.createAgent);
router.get('/list', AgentController.getAgents);
router.put('/update/:id', AgentController.updateAgent);
router.delete('/delete/:id', AgentController.deleteAgent);

module.exports = router;
