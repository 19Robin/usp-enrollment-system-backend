const express = require("express");
const router = express.Router();
const { getFinanceDataHandler, getInvoicesByIdHandler, updatePaymentsHandler } = require("../Controller/financeController");
const auth = require("../Middleware/JWT/authenticateJWT");


router.get("/:category/:userID", getFinanceDataHandler);
router.get("/invoices", auth, getInvoicesByIdHandler); 
router.post("/payments", updatePaymentsHandler);


module.exports = router;
