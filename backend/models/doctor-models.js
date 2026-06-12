const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        DoctorID: {
            type: String,
            required: true,
            unique: true
        },

        DoctorName: {
            type: String,
            required: [true, 'Doctor name is required'],
            trim: true
        },

        Specialization: {
            type: String,
            required: [true, 'Specialization is required'],
            trim: true
            // e.g. "Cardiology", "Neurology", "General Medicine"
        },

        Designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true
            // e.g. "Senior Consultant", "Resident Doctor"
        },

        DateOfJoining: {
            type: Date,
            required: [true, 'Date of joining is required']
        },

        DepartmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: [true, 'Department is required']
        },

        ContactNumber: {
            type: String,
            required: [true, 'Contact number is required'],
            trim: true
        },

        AvailableDays: {
            type: [String],
            default: []
            // e.g. ["Monday", "Wednesday", "Friday"]
        },

        AvailableTimeSlots: {
            type: [String],
            default: []
            // e.g. ["09:00-11:00", "14:00-16:00"]
        },

        IsActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true   // adds createdAt and updatedAt
    }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;