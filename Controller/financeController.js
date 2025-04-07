const { getFinanceData, getInvoicesById } = require("../Model/financeModel");

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
                    total: result.total
                }
            });
    
        });
        
    } catch (error) {

        console.error("Error fetching invoices:", error);
        res.status(500).json({ error: "Failed to fetch invoices" });
        
    }

   
};

module.exports = {
    getFinanceDataHandler,
    getInvoicesByIdHandler
};