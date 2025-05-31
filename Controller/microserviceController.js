const axios = require('axios');

const getRulesFromMicroservice = async (req, res) => {
  try {
    const response = await axios.get('http://localhost:6000/api/rules', {
      headers: {
        'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
      }
    });

    res.json(response.data); 
  } catch (error) {
    console.error("Error fetching rules:", error.message);
    res.status(500).json({ message: "Failed to fetch rules from microservice" });
  }
};

const updateRules = async (req, res) => {
  try {
    const newRules = req.body;

    const response = await axios.post('http://localhost:6000/api/rules', newRules, {
      headers: {
        'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
      }
    });

    res.status(200).json({
      message: "New rules applied successfully",
      result: response.data
    });
  } catch (error) {
    console.error("Error updating hold data:", error.message);

    const status = error.response?.status || 500;
    const msg = error.response?.data || "Microservice error";

    res.status(status).json({ message: msg });
  }
};

const checkHold = async (req, res) => {
  try{

    const studentId = req.user.userId;
    
    const holdRes = await axios.get(`http://localhost:6000/api/holds/${studentId}`, 
      {
        headers: {
          'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
        }
      }
    );

    const rulesRes = await axios.get(`http://localhost:6000/api/rules`, 
      {
        headers: {
          'Authorization': `Bearer ${process.env.MICROSERVICE_SECRET}`
        }
      }
    );

    res.json({
      hold: holdRes.data,
      rules: rulesRes.data
    });


  }catch(error){
    console.error("Error fetching hold status:", error.message);
    res.status(500).json({ message: "Failed to fetch hold status from microservice" });

  }
  
};

module.exports = {
  getRulesFromMicroservice,
  updateRules,
  checkHold
};
