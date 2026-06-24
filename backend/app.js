const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const dns = require('dns');
const app = express();

const AdminRoutes = require('./routes/admin-routes');
const ReceptionistRoutes = require('./routes/receptionist-routes');
// const DoctorRoutes = require('./routes/doctor-routes');
// const PharmacistRoutes = require('./routes/pharmacist-routes');
// const LabTechRoutes = require('./routes/labtech-routes');

// Parse JSON Data
app.use(express.json());

// Enable CORS
app.use(cors());

// Body Parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Creation of Middleware
app.use(AdminRoutes);
app.use(ReceptionistRoutes);
// app.use(DoctorRoutes);
// app.use(PharmacistRoutes);
// app.use(LabTechRoutes);

// ======================
// HOME ROUTE
// ======================

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'VitalSync Clinical Management System API Running'
    });
});

// ======================
// ERROR HANDLING
// ======================

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    res.status(error.code || 500);
    res.json({
        message: error.message || 'An unknown error occurred!'
    });
});

// ======================
// DATABASE CONNECTION
// ======================

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(process.env.PORT || 5000, () => {
        console.log(
            `Server Running On Port ${process.env.PORT || 5000}`
        );
    });
}).catch((error) => {
    console.log('Database Connection Failed');
    console.log(error);
});

