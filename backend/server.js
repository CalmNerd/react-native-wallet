import express from 'express';
import dotenc from 'dotenv';
import { sql } from './config/db.js';

dotenc.config();

const app = express();

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

app.get('/', (req, res) => {
    res.send('Hello, Worsdlds!');
}
);

initDB().then(() => {
    app.listen(process.env.PORT || 5001, () => {
        console.log('Server is running on port', process.env.port);
    });
});