import express from 'express';
import dotenc from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

import transactionRoute from './routes/transactionsRoute.js';
import job from './config/cron.js';

dotenc.config();

const app = express();

 // cron job to send GET requests every 14 minutes
if (process.env.NODE_ENV === 'production') job.start();

// middleware
app.use(rateLimiter);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Expense Tracker APIs are runnnnnnnnnnning!');
});

app.use('/api/transactions', transactionRoute);

initDB().then(() => {
    app.listen(process.env.PORT || 5001, () => {
        console.log('Server is running on port', process.env.PORT);
    });
});