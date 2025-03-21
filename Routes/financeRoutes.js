const express = require("express");
const router = express.Router();
const { getFinanceData } = require("../Controller/financeController");

router.get("/:category/:userID", (req, res) => {
  const { category, userID } = req.params;

  getFinanceData(req.params.category, req.params.userID, res);
});

module.exports = router;
