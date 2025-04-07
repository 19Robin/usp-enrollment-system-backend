const express = require("express");
const router = express.Router();
const { getFinanceDataHandler, getInvoicesByIdHandler } = require("../Controller/financeController");
const auth = require("../Middleware/JWT/authenticateJWT");


router.get("/:category/:userID", getFinanceDataHandler);
router.get("/invoices", auth, getInvoicesByIdHandler); 


module.exports = router;
