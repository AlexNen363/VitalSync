const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ─── Medicine Schema ───────────────────────────────────────────────────────────

const medicineSchema = new Schema({

    MedicineCode: {
        type: String,
        required: true,
        unique: true
    },

    MedicineName: {
        type: String,
        required: true
    },

    Category: {
        type: String,
        required: true
    },

    StockQuantity: {
        type: Number,
        required: true,
        min: 0
    },

    Unit: {
        type: String,
        required: true
    },

    ExpiryDate: {
        type: Date,
        required: true
    },

    IsActive: {
        type: Boolean,
        default: true
    },

    ReorderLevel: {
    type: Number,
    default: 0
}

}, { timestamps: true });

// ─── Medicine Item Sub-Schema (embedded inside Prescription) ──────────────────

const medicineItemSchema = new Schema({

    MedicineId: {
        type: mongoose.Types.ObjectId,
        ref: "Medicine",
        required: true
    },

    MedicineName: {
        type: String,
        required: true
    },

    Quantity: {
        type: Number,
        required: true
    },

    Dosage: {
        type: String,
        required: true
    },

    Frequency: {
        type: String,
        required: true
    },

    DurationDays: {
        type: Number,
        required: true
    }

});

// ─── Prescription Schema ───────────────────────────────────────────────────────

const prescriptionSchema = new Schema({

    PatientId: {
        type: mongoose.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    PatientName: {
        type: String,
        required: true
    },

    DoctorId: {
        type: mongoose.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    DoctorName: {
        type: String,
        required: true
    },

    IssuedDate: {
        type: Date,
        required: true,
        default: Date.now
    },

    IsDispensed: {
        type: Boolean,
        default: false
    },

    DispensedDate: {
        type: Date,
        default: null
    },

    DispensedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },

    Medicines: {
        type: [medicineItemSchema],
        required: true
    },

    IsActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

// ─── Reminder Schema ───────────────────────────────────────────────────────────

const reminderSchema = new Schema({

    PrescriptionId: {
        type: mongoose.Types.ObjectId,
        ref: "Prescription",
        required: true
    },

    PatientId: {
        type: mongoose.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    PatientName: {
        type: String,
        required: true
    },

    MedicineName: {
        type: String,
        required: true
    },

    Dosage: {
        type: String,
        required: true
    },

    Times: {
        type: [String],
        required: true        // e.g. ["08:00 AM", "02:00 PM", "09:00 PM"]
    },

    StartDate: {
        type: Date,
        required: true
    },

    EndDate: {
        type: Date,
        required: true
    },

    DurationDays: {
        type: Number,
        required: true
    },

    IsActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

// ─── Export All Models ─────────────────────────────────────────────────────────

const Medicine     = mongoose.model("Medicine",     medicineSchema);
const Prescription = mongoose.model("Prescription", prescriptionSchema);
const Reminder     = mongoose.model("Reminder",     reminderSchema);

module.exports = { Medicine, Prescription, Reminder };