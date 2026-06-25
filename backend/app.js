const express = require("express");
const mongoose = require("mongoose");
const dns = require("dns");
const cors = require("cors");
require("dotenv").config();

const app = express(); // MUST come before app.use()

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DoctorRoutes = require("./routes/doctor-routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DOCTOR MODULE
app.use("/api/doctor", DoctorRoutes);

app.get("/", (req, res) => {
  res.json({ message: "VitalSync API Running" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));