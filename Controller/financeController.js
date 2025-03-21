const { financeDb } = require('../db');

const getFinanceData = (category, userID, res) => {
    let query ="";

    switch(category){
        case "invoice":
            query = `SELECT invoice_id, amount, date FROM invoices WHERE user_id = ?`;
            break;
        
        case "payments":
            query = `SELECT payment_id, amount, status FROM payments WHERE user_id = ?`;
            break;

        case "scholarships":
            query = 'SELECT scholarship_name, amount, status FROM scholarships WHERE user_id = ?';
            break;

        case "refund":
            query = `SELECT hold_id, amount, status FROM holds WHERE user_id = ?`;
            break;
        
        default:
            return res.status(400).json({error:"Invalid category"});
    }

    financeDb.query(query, [userID], (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Failed to fetch data" });
        
        }

        if (results.length > 0) {
            const headers = Object.keys(results[0]); 
            const rows = results.map((row) => Object.values(row)); 
            res.json({ headers, rows });
        } else {
            res.json({ headers: [], rows: [] });
        }

    });

};

module.exports = { getFinanceData, };