const mongoose = require("mongoose");

// ======================
// PATIENT SCHEMA
// ======================

const patientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    }
});

// ======================
// APPOINTMENT SCHEMA
// ======================

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },

    doctorName: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    appointmentDate: {
        type: String,
        required: true
    },

    appointmentTime: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Not Checked In"
    }
});

// ======================
// BILL SCHEMA
// ======================

const billSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },

    doctorName: {
        type: String,
        required: true
    },

    consultationFee: {
        type: Number,
        required: true
    },

    billDate: {
        type: Date,
        default: Date.now
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    }
});
// ======================
// AMBULANCE REQUEST SCHEMA
// ======================

const ambulanceRequestSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },

    pickupLocation: {
        type: String,
        required: true
    },

    emergencyDetails: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    },

    requestDate: {
        type: Date,
        default: Date.now
    }
});

// ======================
// MODELS
// ======================

const Patient = mongoose.model(
    "Patient",
    patientSchema
);

const Appointment = mongoose.model(
    "Appointment",
    appointmentSchema
);

const Bill = mongoose.model(
    "Bill",
    billSchema
);

const AmbulanceRequest = mongoose.model(
    "AmbulanceRequest",
    ambulanceRequestSchema
);
// ======================
// EXPORTS
// ======================

module.exports = {
    Patient,
    Appointment,
    Bill,
    AmbulanceRequest
};