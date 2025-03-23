const { financeDb } = require('../db');

const getFinanceData = (category, userID, res) => {
    let query ="";

    switch(category){
        case "invoice":
            query = `SELECT invoice_id, semester, amt_due, amt_paid, due_date FROM invoices WHERE student_id = ?`;
            break;
        
        case "payments":
            query = `SELECT payment_id, semester, amt, des, receipt_id, payment_date FROM payments WHERE student_id = ?`;
            break;

        case "sponsorships":
            query = 'SELECT semester, sponsor  FROM sponsorship WHERE student_id = ?';
            break;

        case "holds":
            query = `SELECT semester, hold_status FROM holds WHERE student_id = ?`;
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