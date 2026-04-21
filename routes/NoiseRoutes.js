const router = require('express').Router();
const NoiseController = require('../controllers/NoiseController');
const auth = require('../middleware/auth');

router.post('/create', auth, NoiseController.createNoise);
router.get('/active', auth, NoiseController.getNoises);
router.patch('/:id/vote', auth, NoiseController.voteNoise);

module.exports = router;

