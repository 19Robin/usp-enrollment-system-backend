const { get } = require('mongoose');
const { getManagerProfilebyId } = require('../Model/userModel');
const errorCodes = require('./errorCodes');

const ManagerProfileHandler = async (req, res) => {
    const managerId = req.user.userId;
    console.log("Extracted User ID from Token:", managerId); 

    try {
        const managerProfile = await new Promise((resolve, reject) => {
            getManagerProfilebyId(managerId, (err, profile) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(profile);
                }
            });
        });

        if (!managerProfile) {
            return res.status(404).json({ details: errorCodes.INVALID_CREDENTIALS });
        }

        res.status(200).json({
            success: true,
            user:{
                data: {
                    managerProfile
                },
                message: "Manager Profile Retrieved Successfully"
            }
        });
    } catch (error) {
        console.error("Error fetching manager profile:", error);
        res.status(500).json({ details: { message: "An Unexpected Error Occurred" } });
    }
}


module.exports = {
    getManagerProfile: ManagerProfileHandler,
};
