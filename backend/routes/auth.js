const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    try {
        const existingUser = await prisma.users.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = uuidv4();
        const createdAt = new Date().toISOString();

        await prisma.users.create({
            data: {
                id: userId,
                username,
                password: hashedPassword,
                createdAt
            }
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    try {
        const user = await prisma.users.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Identifiants incorrects.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Identifiants incorrects.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' } // Token valid for 7 days
        );

        res.json({
            message: 'Connexion réussie',
            token,
            user: { id: user.id, username: user.username }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion.' });
    }
});

module.exports = router;
