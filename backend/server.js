const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve static files from 'uploads' - enables frontend to fetch and visualize 3D files
app.use('/uploads', express.static(uploadsDir));

// Routes
const filesRoutes = require('./routes/files');
app.use('/api/files', filesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
