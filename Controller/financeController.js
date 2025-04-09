const { getFinanceData, getInvoicesById, updatePayments } = require("../Model/financeModel");

const getFinanceDataHandler = async (req, res) => {
    const { category, userID } = req.params;

    try {
        await getFinanceData(category, userID, res);
    } catch (error) {
        console.error("Error fetching finance data:", error);
        res.status(500).json({ error: "Failed to fetch finance data" });
    }
};

const getInvoicesByIdHandler = async (req, res) => {
    const studentId = req.user.userId;
    console.log("Extracted User ID from Token:", studentId);

    try {
        getInvoicesById(studentId, (err, result) => {
            if(err){
                console.error("Error fetching invoices:", err);
                return res.status(500).json({ error: "Failed to fetch invoices" });
            }

            return res.status(200).json({
                success: true,
                message: "Invoices Retrieved Successfully",
                data: {
                    invoices: result.courses,
                    total: result.total,
                    totalPaid: result.totalPaid,
                    totalPayable: result.payableAmount
                }
            });
    
        });
        
    } catch (error) {

        console.error("Error fetching invoices:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
        
    }

   
};

const updatePaymentsHandler = async (req, res) => {
    console.log("Request body:", req.body);

    const { customer_id, transaction_id, amount_paid, status, currency, payment_method, created_at } = req.body;
    

    try {
        const result = await new Promise((resolve, reject) => {
            updatePayments(customer_id, transaction_id, amount_paid, status, currency, payment_method, created_at, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error updating payments:", error);
        return res.status(500).json({ error: 'Failed to update payments', details: error });
    }
};

module.exports = {
    getFinanceDataHandler,
    getInvoicesByIdHandler,
    updatePaymentsHandler
};