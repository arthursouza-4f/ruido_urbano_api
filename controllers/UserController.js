const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateInputs(email, password) {
    if (!email || !password) return 'email e password são obrigatórios';
    if (!EMAIL_REGEX.test(email)) return 'Formato de email inválido';
    if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (!/[0-9]/.test(password)) return 'A senha deve conter pelo menos um número';
    return null;
}

module.exports = class UserController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;

            const validationError = validateInputs(email, password);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(201).json({ message: 'Se esse email não estiver cadastrado, você receberá um link de confirmação em breve.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashedPassword });

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });

            res.status(201).json({
                token,
                user: {
                    id: user._id,
                    email: user.email,
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'email e password são obrigatórios' });
            }

            const user = await User.findOne({ email });
            // Roda bcrypt mesmo quando usuário não existe para evitar timing attack
            const DUMMY_HASH = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
            const passwordMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
            if (!user || !passwordMatch) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const expiresIn = 3600;
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });

            res.status(200).json({
                token,
                expiresIn,
                user: {
                    id: user._id,
                    email: user.email,
                }
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro interno no servidor' });
        }
    }
}
