const { getCompletedCoursesFromDB } = require('../Model/gradesModel');

const getCompletedCourses = async (req, res) => {
  const { studentId } = req.query;
  try {
    const completedCourses = await new Promise((resolve, reject) => {
      getCompletedCoursesFromDB(studentId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    res.status(200).json(completedCourses);
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ error: "Failed to fetch completed courses" });
  }
};

module.exports = {
  getCompletedCourses,
};