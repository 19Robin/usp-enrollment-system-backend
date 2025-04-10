const { financeDb, enrolSystemDb} = require('../db');

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
            query = 'SELECT semester, sponsor  FROM sponsorships WHERE student_id = ?';
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

const getPaymentsById = (studentId, callback) => {
    const query = `
        SELECT *
        FROM payments
        WHERE student_id = ?
    `;
    enrolSystemDb.query(query, [studentId], (err, results) => {
        if (err) {
          return callback(err, null);
        }
        if (results.length > 0) {
          return callback(null, results);
        } else {
          return callback(null, null);
        }
      });
};

const updatePayments = (customer_id,transaction_id, amount_paid, status, currency, payment_method, created_at, callback) => {
    const parsedAmountPaid = Math.round(amount_paid / 100); // Convert cents to whole amount

    const getStudentQuery = `SELECT student_id FROM students WHERE stripe_id = ?`;

    enrolSystemDb.query(getStudentQuery, [customer_id], (err, results) => {
        if (err) {
            console.error("Error fetching student_id:", err);
            return callback(err, null);
        }

        if (results.length === 0) {
            console.error("No student found with the given stripe_id.");
            return callback({ error: 'Student not found' }, null);
        }

        const student_id = results[0].student_id;

        
        const insertPaymentQuery = `
            INSERT INTO payments (
                student_id,
                customer_id,
                transaction_id,
                amount_paid,
                status,
                currency,
                payment_method,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        enrolSystemDb.query(insertPaymentQuery, [student_id, customer_id, transaction_id, parsedAmountPaid, status, currency, 
            payment_method, created_at
        ], (err, results) => {
            if (err) {
                console.error("Error inserting payment:", err);
                return callback(err, null);
            }

            console.log("Payment inserted successfully. Rows affected:", results.affectedRows);
            callback(null, { success: true, message: "Payments updated successfully." });
        });
    });
};



const getInvoicesById = (studentId, callback) => {

    console.log("Extracted User ID from Token:", studentId);

    const invoiceQuery = `
        SELECT invoice_id, due_date, fee_id
        FROM invoices
        WHERE student_id = ?
    `;
    enrolSystemDb.query(invoiceQuery, [studentId], (err, invoice_results) => {
        if (err) {
            return callback(err, null);
        }
        if (invoice_results.length === 0) {
            return callback(null, {courses:[], total:0});
        } 

        const feeIDs = invoice_results.map(row => row.fee_id);
        const feePlaceholders = feeIDs.map(() => '?').join(',');

        const feeQuery = `
            SELECT fee_id, fee_type, registration_id
            FROM fees
            WHERE fee_id IN (${feePlaceholders})
        `;

        enrolSystemDb.query(feeQuery, feeIDs, (err, fee_results) => {
            if (err) {
                return callback(err, null);
            }
           
            const registrationIDs = fee_results.map(row => row.registration_id);
            const regPlaceholders = registrationIDs.map(() => '?').join(',');

            const registrationQuery = `
                SELECT id, course_id, year
                FROM registrations
                WHERE id IN (${regPlaceholders})
            `;

            enrolSystemDb.query(registrationQuery, registrationIDs, (err, registration_results) => {
                if (err) {
                    return callback(err, null);
                }
            
                const courseIDs = registration_results.map(row => row.course_id);
                const coursePlaceholders = courseIDs.map(() => '?').join(',');

                const courseQuery = `
                    SELECT course_id, course_name, course_code, course_campus, course_mode, course_level, semester
                    FROM courses
                    WHERE course_id IN (${coursePlaceholders})
                `;

                enrolSystemDb.query(courseQuery, courseIDs, (err, course_results) => {
                    if (err) {
                        return callback(err, null);
                    }
                   
                    const courseLevelIDs = course_results.map(row => row.course_level);
                    const courseLevelPlaceholders = courseLevelIDs.map(() => '?').join(',');

                    const courseLevelQuery = `
                        SELECT id, course_level, price
                        FROM course_level
                        WHERE id IN (${courseLevelPlaceholders})
                    `;

                    enrolSystemDb.query(courseLevelQuery, courseLevelIDs, (err, course_level_results) => {
                        if (err) {
                            return callback(err, null);
                        }

                        const priceMap = {};
                        course_level_results.forEach(level => {
                            priceMap[level.id] = level.price;
                        });

                        const finalCourses = course_results.map(course => {
                            const price = Number(priceMap[course.course_level]) || 0;

                            const registration = registration_results.find(r => r.course_id === course.course_id);
    
                            const fee = fee_results.find(f => f.registration_id === registration?.id);

                            const invoice = invoice_results.find(i => i.fee_id === fee?.fee_id);

                            return {

                                course_name: course.course_name,
                                course_code: course.course_code,
                                course_campus: course.course_campus,
                                course_mode: course.course_mode,
                                semester: course.semester,
                                course_level: course.course_level, 
                                year: registration?.year|| null,
                                due_date: invoice?.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : null,
                                price,
                                invoiceId: invoice?.invoice_id || null
                            };

                        });

                        const total = finalCourses.reduce((sum, course) => sum + course.price, 0);

                        const paymentsQuery = `
                            SELECT amount_paid
                            FROM payments
                            WHERE student_id = ? AND status = 'succeeded'
                        `;

                        enrolSystemDb.query(paymentsQuery, [studentId], (err, payment_results) => {

                            if (err) return callback(err, null);

                            const totalPaid = payment_results.reduce((sum, payment) => sum + Number(payment.amount_paid), 0);
                            const payableAmount = total - totalPaid;

                            return callback(null, {
                                studentId: studentId,
                                total,
                                totalPaid,
                                payableAmount,
                                courses: finalCourses,
                                
                            });

                        });
                    });
                });
            });
        });
    });
};

module.exports = { 

    getFinanceData, 
    getInvoicesById, 
    getPaymentsById,
    updatePayments
};