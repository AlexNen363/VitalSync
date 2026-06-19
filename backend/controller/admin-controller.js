const { Staff, Doctor, Ambulance } = require("../models/admin-models");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//AUTHENTICATION CONTROLLER
//TO REGISTER A USER 
const register = async (req, res, next) => {
    const {
        StaffName,
        StaffPhone,
        StaffEmail,
        StaffUsername,
        StaffPassword,
        StaffRole,
        Specialization,
        ConsultationFee
    } = req.body;

    try {
        const existingUser = await Staff.findOne({
            StaffUsername
        });

        if (existingUser) {
            return next({
                code: 400,
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(StaffPassword, 12);
        const staff = new Staff({
            StaffName,
            StaffPhone,
            StaffEmail,
            StaffUsername,
            StaffPassword: hashedPassword,
            StaffRole
        });

        await staff.save();
        if (StaffRole === "Doctor") {
            const { Doctor } = require("../models/admin-models");
            const doctor = new Doctor({
                StaffId: staff._id,
                Specialization,
                ConsultationFee
            });

            await doctor.save();
        }

        res.status(201).json({
            success: true,
            message: `${StaffRole} registered successfully`,
            staffId: staff._id,
            username: staff.StaffUsername
        });

    } catch (error) {
        return next({
            code: 500,
            message: "Unable to register user"
        });
    }
};

//USER LOGIN
const login = async (req, res, next) => {
    const { StaffUsername, StaffPassword } = req.body;
    try {
        const existingUser = await Staff.findOne({ StaffUsername });
        if (!existingUser) {
            return next({
                code: 401,
                message: "Invalid Username"
            });
        }

        const isValidPassword = await bcrypt.compare(
            StaffPassword,
            existingUser.StaffPassword
        )

        if (!isValidPassword) {
            return next({
                code: 401,
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({
            userId: existingUser._id,
            username: existingUser.StaffUsername,
            role: existingUser.StaffRole
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
    );

    res.json({
        success: true,
        token,
        username: existingUser.StaffUsername,
        role: existingUser.StaffRole
    });
    } catch (error) {
        return next ({
            code: 500,
            message: "Login Failed!"
        });
    }
};

//==========================================================================

//CRUD OPERATIONS FOR STAFF AND DOCTORS
//TO CREATE NEW STAFF/DOCTOR
const createStaff = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const {
            StaffName,
            StaffPhone,
            StaffEmail,
            StaffUsername,
            StaffPassword,
            StaffRole,
            Specialization,
            ConsultationFee
        } = req.body;

        //Duplicate check
        const existingStaff = await Staff.findOne({
            $or: [{ StaffEmail }, { StaffUsername }, { StaffPhone }]
        });

        if (existingStaff) {
            return res.status(400).json({
                message: "Email, Username or Phone Number already exists"
            });
        }

        //Validation for doctor
        if (StaffRole === "Doctor" && (!Specialization || ConsultationFee == null)){
            return res.status(400).json({
                success: false,
                message: "Specialization and Consultation Fee are required for Doctors"
            });
        } 

        //Hash Password
        const hashedPassword = await bcrypt.hash(StaffPassword, 12);

        const staff = await Staff.create({
            StaffName,
            StaffPhone,
            StaffEmail,
            StaffUsername,
            StaffPassword: hashedPassword,
            StaffRole
        });

        //Creation of Doctor profile if role is Doctor
        if (StaffRole === "Doctor"){
            await Doctor.create({
                StaffId: staff._id,
                Specialization,
                ConsultationFee
            });
        }

        const staffResponse = staff.toObject();
        delete staffResponse.StaffPassword;

        res.status(201).json({
            success: true,
            message: `${StaffRole} created successfully`,
            data: staffResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//TO GET ALL STAFFS
const getStaff = async(req, res) => {
    try {
        const filter = {};

        // Filtering
        if (req.query.role) {
            filter.StaffRole = req.query.role;
        }

        if (req.query.status) {
            filter.Status = req.query.status;
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;
        const staff = await Staff.find(filter)
            .skip(skip)
            .limit(limit);

        const totalStaff = await Staff.countDocuments(filter);
        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalStaff / limit),
            totalStaff,
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO GET STAFF BY ID
const getStaffByID = async(req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO GET ALL DOCTORS
const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate("StaffId");
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO UPDATE A STAFF
const updateStaff = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff updated successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO DEACTIVATE A STAFF
const deactivateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            { Status: "Inactive" },
            { new: true }
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff deactivated successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO ACTIVATE A STAFF
const activateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            {
                Status: "Active"
            },
            {
                new: true
            }
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff activated successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//==========================================================================

//CRUD OPERATIONS FOR AMBULANCE
//TO CREATE AN AMBULANCE 
const createAmbulance = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const {
            VehicleNumber,
            DriverName,
            DriverPhone,
            Status
        } = req.body;

        const ambulance = await Ambulance.create({
            VehicleNumber,
            DriverName,
            DriverPhone,
            Status
        });

        res.status(201).json({
            message: "Ambulance created successfully",
            ambulance
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO GET ALL AMBULANCES
const getAmbulances = async (req, res) => {
    try {
        const ambulances = await Ambulance.find();
        res.status(200).json(ambulances);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO GET AN AMBULANCE BY ID
const getAmbulanceById = async (req, res) => {
    try {
        const ambulance = await Ambulance.findById(req.params.id);
        if (!ambulance) {
            return res.status(404).json({
                message: "Ambulance not found"
            });
        }
        res.status(200).json(ambulance);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO UPDATE AN AMBULANCE
const updateAmbulance = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const {
            VehicleNumber,
            DriverName,
            DriverPhone,
            Status
        } = req.body;

        const ambulance = await Ambulance.findByIdAndUpdate(
            req.params.id,
            {
                VehicleNumber,
                DriverName,
                DriverPhone,
                Status
            },
            { new: true }
        );

        if (!ambulance) {
            return res.status(404).json({
                message: "Ambulance not found"
            });
        }

        res.status(200).json({
            message: "Ambulance updated successfully",
            ambulance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO DEACTIVATE AN AMBULANCE
const deactivateAmbulance = async (req, res) => {
    try {
        const ambulance = await Ambulance.findByIdAndUpdate(
            req.params.id,
            {
                Status: "Inactive"
            },
            { new: true }
        );

        if (!ambulance) {
            return res.status(404).json({
                message: "Ambulance not found"
            });
        }

        res.status(200).json({
            message: "Ambulance deactivated successfully",
            ambulance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO ACTIVATE AN AMBULANCE
const activateAmbulance = async (req, res) => {
    try {
        const ambulance = await Ambulance.findByIdAndUpdate(
            req.params.id,
            {
                Status: "Available"
            },
            {
                new: true
            }
        );

        if (!ambulance) {
            return res.status(404).json({
                message: "Ambulance not found"
            });
        }

        res.status(200).json({
            message: "Ambulance activated successfully",
            ambulance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//==========================================================================

exports.register = register;
exports.login = login;

exports.createStaff = createStaff;
exports.getStaff = getStaff;
exports.getStaffByID = getStaffByID;
exports.getDoctors = getDoctors; 
exports.updateStaff = updateStaff;
exports.deactivateStaff = deactivateStaff;
exports.activateStaff = activateStaff;

exports.createAmbulance = createAmbulance;
exports.getAmbulances = getAmbulances;
exports.getAmbulanceById = getAmbulanceById;
exports.updateAmbulance = updateAmbulance;
exports.deactivateAmbulance = deactivateAmbulance;
exports.activateAmbulance = activateAmbulance;