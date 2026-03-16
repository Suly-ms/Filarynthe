const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../prisma');
const { authMiddleware } = require('../middleware/authMiddleware');

// Allowed extensions
const ALLOWED_EXTS = ['.stl', '.obj', '.3mf'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const id = uuidv4();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${id}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTS.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Extension non autorisée. Seuls les fichiers ${ALLOWED_EXTS.join(', ')} sont acceptés.`), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// POST /api/files/upload
router.post('/upload', authMiddleware, (req, res) => {
    upload.single('file')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier valide fourni.' });
        }

        const { filename, originalname, size, mimetype } = req.file;
        const id = path.basename(filename, path.extname(filename));
        const ext = path.extname(originalname).toLowerCase();
        const uploadDate = new Date().toISOString();
        const userId = req.user.id;

        try {
            await prisma.files.create({
                data: {
                    id,
                    filename,
                    originalName: originalname,
                    size,
                    uploadDate,
                    mimetype,
                    extension: ext,
                    userId
                }
            });
            res.status(201).json({
                message: 'Fichier uploadé avec succès.',
                file: { id, filename, originalName: originalname, size, uploadDate, mimetype, extension: ext }
            });
        } catch (dbErr) {
            console.error(dbErr);
            fs.unlink(path.join(__dirname, '../uploads', filename), () => { });
            return res.status(500).json({
                error: "Erreur lors de l'enregistrement en base de données."
            });
        }
    });
});

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const rows = await prisma.files.findMany({
            where: { userId },
            orderBy: { uploadDate: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers.' });
    }
});

router.get('/download/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const row = await prisma.files.findFirst({
            where: { id, userId }
        });
        if (!row) {
            return res.status(404).json({ error: 'Fichier non trouvé ou non autorisé.' });
        }
        const filePath = path.join(__dirname, '../uploads', row.filename);
        res.download(filePath, row.originalName);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    try {
        const row = await prisma.files.findFirst({
            where: { id, userId },
            select: { filename: true }
        });
        if (!row) {
            return res.status(404).json({ error: 'Fichier non trouvé ou non autorisé.' });
        }

        // Delete from DB
        await prisma.files.delete({
            where: { id }
        });

        // Delete from filesystem
        const filePath = path.join(__dirname, '../uploads', row.filename);
        fs.unlink(filePath, (err3) => {
            if (err3) {
                console.error("Failed to delete file from disk:", err3);
            }
        });

        res.json({ message: 'Fichier supprimé avec succès.', id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la suppression en base de données." });
    }
});

module.exports = router;
