require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./Routes/authRoutes");
const { db, financeDb, gradesDb } = require("./db");
const profileRoutes = require("./Routes/profileRoutes");
const courseRoutes = require("./Routes/courseRoutes");
const financeRoutes = require("./Routes/financeRoutes");
const programRoutes = require("./Routes/programRoutes");
const holdRoutes = require("./Routes/holdsRoutes");
const programCourseRoutes = require("./Routes/programCourseRoutes");
const gradesRoutes = require("./Routes/gradesRoutes"); 
const stripeRoutes = require("./Routes/stripeRoutes");
const webhookRoutes = require("./Routes/stripeWebhooks");
const applicationRoutes = require("./Routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parse JSON bodies (as sent by API clients)



// Use auth routes
app.use("/api/holds", holdRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api", courseRoutes);
app.use("/api", programRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/holds", holdRoutes);
app.use("/api", programCourseRoutes);
app.use("/api", gradesRoutes); 
app.use("/api/stripe", stripeRoutes); 
app.use("/api/stripe/webhooks", webhookRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});