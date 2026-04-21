const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const UserController = require('../controllers/UserController');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Muitas tentativas. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, UserController.register);
router.post('/login', authLimiter, UserController.login);

module.exports = router;

