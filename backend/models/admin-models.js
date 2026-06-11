const mongoose = require('mongoose');
 const Schema = mongoose.Schema

//STAFF SCHEMA
const staffSchema = new Schema({
    StaffName: {type: String, required: true, trim: true},
    StaffPhone: {type: String, required: true, unique: true},
    StaffEmail: {type: String, required: true, unique: true, lowercase: true},
    StaffUsername: {type: String, required: true, unique: true},
    StaffPassword: {type: String, required: true},
    StaffRole: {type: String, required: true,
                enum: [
                    "Administrator",
                    "Receptionist",
                    "Doctor",
                    "Pharmacist",
                    "Lab Technician"]},
    Status: {type: String,
            enum: ["Active", "Inactive"],
            default: "Active"}}, 
    {timestamps: true}
);

//DOCTOR SCHEMA
const doctorSchema = new Schema({
    StaffId: {type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true},
    Specialization: {type: String, required: true},
    ConsultationFee: {type: Number, required: true, min: 0},
    AvailabilityStatus: {type: String, 
                        enum: ["Available", "Busy", "On Leave"],
                        default: "Available"}},
    
    {timestamps: true}
);


//AMBULANCE SCHEMA
const ambulanceSchema = new Schema({
    VehicleNumber: {type: String, required: true, unique: true},
    DriverName: {type: String, required: true},
    DriverPhone: {type: String, required: true},
    Status: {type: String, 
            enum: ["Available", "On Duty", "Maintenance", "Inactive"],
            default: "Available"}},
    {timestamps: true}
);


const Staff = mongoose.model("Staff", staffSchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
module.exports = {Staff, Doctor, Ambulance};