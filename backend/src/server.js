import express from 'express';
import dotenc from 'dotenv';
import { initDB, sql } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoute from './routes/transactionsRoute.js';

dotenc.config();

const app = express();

// middleware
app.use(rateLimiter);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Expense Tracker APIs are runnnnnnnnnnning!');
});

app.use('/api/transactions', transactionRoute);

initDB().then(() => {
    app.listen(process.env.PORT || 5001, () => {
        console.log('Server is running on port', process.env.port);
    });
});