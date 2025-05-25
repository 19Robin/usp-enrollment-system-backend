const axios = require('axios');

const holdcheck = (serviceName)=>{
    return async (req, res, next) => {

        try{
            const paramsUserId = req.query.studentId;;
            const studentId = req.user?.userId || paramsUserId;
            console.log("Extracted User ID from Token or Query:", studentId);
            const response = await axios.get(`http://localhost:6000/api/holds/${studentId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
                    }
                }
            );

            const holdRes = await axios.get(`http://localhost:6000/api/rules`,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
                    }
                }
            );

            // check if the api returns data and if the hold status is true
            const data = response.data;
            const rules = holdRes.data;
            if (data.hold && rules[serviceName] === true) {
                console.log("Hold status:", response.data.hold, `Is ${serviceName} blocked:`, rules[serviceName]);
                return res.status(403).json({
                    message: `Student is on hold, access blocked for ${serviceName}`
                    
                });
            }

            console.log("Hold status:", response.data.hold, `Is ${serviceName} blocked:`, rules[serviceName]);

            next(); // proceed to route handler

        }catch(error){
            console.error("Hold check failed:", error.message);
            if (error.response) {
                return res.status(error.response.status).json({
                    message: error.response.data.error || "Unauthorized"
                });
            }else{
                
                return res.status(500).json({
                messsage: "Unable to verify hold status"
                });

            }
            
        }

    };

};
    

module.exports = holdcheck;