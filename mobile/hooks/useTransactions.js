import { useCallback, useState } from "react";
import {Alert} from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0, //
    });

    //callback is used to memoize the function so that it does not change on every render
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            
            if (data && data.transactions && Array.isArray(data.transactions)) {
                setTransactions(data.transactions.reverse()); // latest first
            } else {
                console.warn("Unexpected transaction data format:", data);
                setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching transactions in usetrans:", error);
            setTransactions([]);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    const deleteTransaction = async (transactionId) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete transaction");
            }
            loadData(); // Refresh data after deletion
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message || "Failed to delete transaction");
        }
    };

    return {
        transactions,
        isLoading,
        summary,
        loadData,
        deleteTransaction,
    };
};