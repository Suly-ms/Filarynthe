require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 14285;

// Middlewares
app.use(helmet()); // Basic security headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow 3D files to be fetched cross-origin

const allowedOrigins = [
    'http://localhost:15372',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Rate Limiting for all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: "Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from 'uploads' - enables frontend to fetch and visualize 3D files
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const filesRoutes = require('./routes/files');
app.use('/api/auth', authRoutes);
app.use('/api/files', filesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
