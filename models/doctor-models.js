const mongoose = require("mongoose");


// Appointment Schema
const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled"
    }
});


// Consultation Schema
const consultationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});


// Lab Test Schema
const labTestSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    testName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    }
});


// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    medicines: [{
        medicineName: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Appointment = mongoose.model("Appointment", appointmentSchema);
const Consultation = mongoose.model("Consultation", consultationSchema);
const LabTest = mongoose.model("LabTest", labTestSchema);
const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = {
    Appointment,
    Consultation,
    LabTest,
    Prescription
};