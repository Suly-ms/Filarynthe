const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { JWT_SECRET } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    try {
        // Build the query to check if user already exists
        db.get(`SELECT id FROM users WHERE username = ?`, [username], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de la vérification de l'utilisateur." });
            }
            if (row) {
                return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris." });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userId = uuidv4();
            const createdAt = new Date().toISOString();

            db.run(`INSERT INTO users (id, username, password, createdAt) VALUES (?, ?, ?, ?)`,
                [userId, username, hashedPassword, createdAt],
                (insertErr) => {
                    if (insertErr) {
                        return res.status(500).json({ error: "Erreur lors de la création de l'utilisateur." });
                    }
                    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
                });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Le nom d'utilisateur et le mot de passe sont requis." });
    }

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la connexion.' });
        }
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
    });
});

module.exports = router;
