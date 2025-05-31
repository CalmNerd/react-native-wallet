import express from 'express';
import dotenc from 'dotenv';
import { sql } from './config/db.js';

dotenc.config();

// middleware
const app = express();

app.use(express.json());

async function initDB() {
    try {
        await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE DEFAULT CURRENT_DATE
      )`;

        console.log('Database initialized successfully');
    } catch (error) {
        console.log("Error initializing database:", error);
        process.exit(1); // status code 1 indicates an error
    }

}

app.post('/api/transactions', async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body;
        if (!user_id || !title || amount === "undefined" || !category) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *`; // Using RETURNING to get the inserted row
        return res.status(201).json({
            message: 'Transaction created successfully',
            transaction: transaction[0] // Return the first (and only) row
        });

    } catch (error) {
        console.error('Error creating transaction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

app.get("/api/transactions/:userId", async (req, res) => {
    try {
        req.params.userId = req.params.userId.replace(/"/g, ''); // Remove any quotes from the userId
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        res.status(200).json({
            message: 'Transactions fetched successfully',
            transactions: transactions
        });
        
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return res.status(500).json({ error: 'Internal server error' });        
    }
})

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === "undefined") {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        if( isNaN(id)) {
            return res.status(400).json({ error: 'Transaction ID must be a number' });
        }

        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
        if (result.length === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({
            message: 'Transaction deleted successfully',
            transaction: result[0]
        });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

initDB().then(() => {
    app.listen(process.env.PORT || 5001, () => {
        console.log('Server is running on port', process.env.port);
    });
});