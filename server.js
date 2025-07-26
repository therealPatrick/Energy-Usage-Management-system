const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./energy_usage.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        createTable();
    }
});

// Create table if it doesn't exist
function createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS energy_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT NOT NULL,
      kwh_used REAL NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Energy usage table created or already exists');
        }
    });
}

// Routes

// GET - List all records
app.get('/api/usage', (req, res) => {
    const sql = 'SELECT * FROM energy_usage ORDER BY timestamp DESC';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

// GET - Get a specific record by ID
app.get('/api/usage/:id', (req, res) => {
    const sql = 'SELECT * FROM energy_usage WHERE id = ?';

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});

// POST - Add new usage record
app.post('/api/usage', (req, res) => {
    const { customer_id, kwh_used } = req.body;

    if (!customer_id || !kwh_used) {
        res.status(400).json({ error: 'Customer ID and kWh used are required' });
        return;
    }

    const sql = 'INSERT INTO energy_usage (customer_id, kwh_used) VALUES (?, ?)';

    db.run(sql, [customer_id, kwh_used], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Usage record created successfully',
            data: {
                id: this.lastID,
                customer_id,
                kwh_used,
                timestamp: new Date().toISOString()
            }
        });
    });
});

// PUT - Update a record
app.put('/api/usage/:id', (req, res) => {
    const { customer_id, kwh_used } = req.body;

    if (!customer_id || !kwh_used) {
        res.status(400).json({ error: 'Customer ID and kWh used are required' });
        return;
    }

    const sql = 'UPDATE energy_usage SET customer_id = ?, kwh_used = ? WHERE id = ?';

    db.run(sql, [customer_id, kwh_used, req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({
            message: 'Usage record updated successfully',
            data: {
                id: req.params.id,
                customer_id,
                kwh_used,
                timestamp: new Date().toISOString()
            }
        });
    });
});

// DELETE - Delete a record
app.delete('/api/usage/:id', (req, res) => {
    const sql = 'DELETE FROM energy_usage WHERE id = ?';

    db.run(sql, [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        res.json({
            message: 'Usage record deleted successfully'
        });
    });
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
}); 