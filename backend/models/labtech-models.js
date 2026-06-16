const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labTestSchema = new Schema({
    TestID: {
        type: String,
        required: true,
        unique: true
    },
    PatientId: {
        type: mongoose.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    RequestedBy: {
        type: mongoose.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    TechnicianId: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        default: null
    },
    TestType: {
        type: String,
        required: true
    },
    RequestedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Results Entered', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    Results: {
        type: Map,
        of: String,
        default: null
    },
    ReportGenerated: {
        type: Boolean,
        default: false
    },
    ReportGeneratedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model("LabTest", labTestSchema);