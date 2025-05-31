const axios = require('axios');
const { getFinanceData, getInvoicesById, updatePayments, getPaymentsById, getStudentsWithInvoices } = require("../Model/financeModel");
const AppError = require("../appError");


const getFinanceDataHandler = async (req, res, next) => {
    const { category, userID } = req.params;

    try {
        await getFinanceData(category, userID, res);
    } catch (error) {
        console.error("Error fetching finance data:", error);
        //res.status(500).json({ error: "Failed to fetch finance data" });
        next(new AppError("DB_ERROR", "Error fetching finace data", 500));
    }
};

const getInvoicesByIdHandler = async (req, res, next) => {
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

        await applyHoldsHandler();

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error updating payments:", error);
        return res.status(500).json({ error: 'Failed to update payments', details: error });
    }
};

const applyHoldsHandler = async () => {
  
  const studentIds = await getStudentsWithInvoices();
  const holdDataArray = [];

  const invoicePromises = studentIds.map(studentId => {
    return new Promise((resolve) => {
      getInvoicesById(studentId, (err, invoiceResponse) => {
        if (err) {
          console.error(`Error fetching invoices for student ${studentId}:`, err);
          return resolve(); 
        }

        const balance = invoiceResponse.payableAmount || 0;
        console.log(`Balance for student ${studentId}:`, balance);

        if (balance > 0) {
          holdDataArray.push({
            studentId,
            hold: true,
          });
        }else{
            holdDataArray.push({
            studentId,
            hold: false,
          });
        }

        resolve(); 
      });
    });
  });

  // wait for all 
  await Promise.all(invoicePromises);

  if (holdDataArray.length > 0) {
    await axios.post('http://localhost:6000/api/holds/', holdDataArray, {
      headers: {
        "Authorization": `Bearer ${process.env.MICROSERVICE_SECRET}`
      }
    });

    console.log("Holds applied for students:", holdDataArray.map(h => h.studentId));
  } else {
    console.log("No students with positive balances found.");
  }
  
};




const getAllPaymentsHandler = async (req, res) => {
    const studentId = req.user.userId;
    console.log("Extracted User ID from Token:", studentId);

    try {
        const studentPayments = await new Promise((resolve, reject) => {
            getPaymentsById(studentId, (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve(results);
              }
            });
        });

        res.status(200).json({
            success: true,
            data:{
              
                studentPayments,
            },
            message: "Payments Retrieved Successfully"
      
        });
        
        
    } catch (error) {

        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "Failed to fetch payments" });
        
    }

   
}

module.exports = {
    getFinanceDataHandler,
    getInvoicesByIdHandler,
    updatePaymentsHandler,
    getAllPaymentsHandler,
    applyHoldsHandler
};