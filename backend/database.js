const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'metadata.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating users table', err.message);
        });

        // Create files table
        db.run(`CREATE TABLE IF NOT EXISTS files (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            originalName TEXT NOT NULL,
            size INTEGER NOT NULL,
            uploadDate TEXT NOT NULL,
            mimetype TEXT NOT NULL,
            extension TEXT NOT NULL,
            userId TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating files table', err.message);
            } else {
                // Attempt to add userId column to existing databases
                // This will fail silently if the column already exists
                db.run(`ALTER TABLE files ADD COLUMN userId TEXT`, (alterErr) => {
                    // Ignore errors as they typically mean the column already exists
                });
            }
        });
    }
});

module.exports = db;
