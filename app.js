const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const bodyParser = require('body-parser');
const dns        = require('dns');
require('dotenv').config();

const app = express();

// ======================
// CORS — MUST BE FIRST
// ======================

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



// ======================
// BODY PARSERS
// ======================

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ======================
// ROUTES
// ======================

// const AdminRoutes       = require('./routes/admin-routes');
// const ReceptionistRoutes = require('./routes/receptionist-routes');
// const DoctorRoutes      = require('./routes/doctor-routes');
const PharmacistRoutes  = require('./routes/pharmacist-routes');
const LabTechRoutes     = require('./routes/labtech-routes');

// app.use('/api/admin',        AdminRoutes);
// app.use('/api/receptionist', ReceptionistRoutes);
// app.use('/api/doctor',       DoctorRoutes);
app.use('/api/pharmacist',   PharmacistRoutes);
app.use('/api/labtech',      LabTechRoutes);

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
// DNS CONFIGURATION
// ======================

dns.setServers([
    '8.8.8.8',
    '8.8.4.4'
]);

// ======================
// DATABASE CONNECTION
// ======================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`✅ Server Running On Port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.log('❌ Database Connection Failed');
        console.log(error);
    });