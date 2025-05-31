import expresss from "express"
import { createTransaction, deleteTransactionById, getTransactionsByUserId, getTransactionSummaryByUserId } from "../controllers/transactionsControllerRoutes.js";

const router = expresss.Router();

router.post('/', createTransaction)

router.get("/:userId", getTransactionsByUserId);

router.delete('/:id', deleteTransactionById);

router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;