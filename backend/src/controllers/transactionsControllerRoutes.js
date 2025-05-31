import e from "express";
import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
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
}

export async function createTransaction(req, res) {
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
}

export async function deleteTransactionById(req, res) {
    try {
        const { id } = req.params;
        if (!id || id === "undefined") {
            return res.status(400).json({ error: 'Transaction ID is required' });
        }

        if (isNaN(id)) {
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
}

export async function getTransactionSummaryByUserId(req, res) {
    try {
        req.params.userId = req.params.userId.replace(/"/g, ''); // Remove any quotes from the userId
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const balanceResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as balance
            FROM transactions
            WHERE user_id = ${userId}
        `;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income
            FROM transactions
            WHERE user_id = ${userId} AND amount > 0
        `
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as expense
            FROM transactions
            WHERE user_id = ${userId} AND amount < 0
        `

        if (balanceResult.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        res.status(200).json({
            message: 'Transaction balance fetched successfully',
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expense
        });

    } catch (error) {
        console.error('Error fetching transaction balance:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}