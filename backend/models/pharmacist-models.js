const mongoose = require("mongoose");

const pharmacistSchema = new mongoose.Schema({
    PharmacistName: {
        type: String,
        required: true
    },

    Medicines: [{
        MedicineId: String,
        MedicineName: String,
        StockQuantity: Number
    }],

    Prescriptions: [{
        PrescriptionId: String,
        PatientName: String,
        Medicines: [{
            MedicineId: String,
            MedicineName: String,
            Quantity: Number
        }],
        IsDispensed: {
            type: Boolean,
            default: false
        }
    }],

    Reminders: [{
        MedicineName: String,
        Dosage: String,
        Times: [String],
        StartDate: Date,
        EndDate: Date,
        IsActive: {
            type: Boolean,
            default: true
        }
    }]
});

module.exports = mongoose.model("Pharmacist", pharmacistSchema);