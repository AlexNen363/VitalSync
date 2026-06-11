const { Staff, Doctor, Ambulance } = require("../models/admin-model");


//CRUD OPERATIONS FOR STAFF AND DOCTORS
//TO CREATE NEW STAFF/DOCTOR
const createStaff = async(req, res) => {
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

        //Validation for doctor
        if (StaffRole === "Doctor" && 
           (!Specialization || !ConsultationFee === undefined)){
            return res.status(400).json({
                message: "Specialization and Consultation Fee are required for Doctors"
            });
        } 

        const staff = await Staff.create({
            StaffName,
            StaffPhone,
            StaffEmail,
            StaffUsername,
            StaffPassword,
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

        res.status(201).json({
            message: `${StaffRole} created successfully`,
            staff
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//TO GET ALL STAFFS
const getStaff = async(req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json(staff);
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
}

//TO UPDATE A STAFF
const updateStaff = async (req, res) => {
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

//COMPLETE DELETION OR ONLY JUST DEACTIVATION?
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

//==========================================================================

//CRUD OPERATIONS FOR AMBULANCE
//TO CREATE AN AMBULANCE 
const createAmbulance = async(req, res) => {
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

//==========================================================================

exports.createStaff = createStaff;
exports.getStaff = getStaff;
exports.getStaffByID = getStaffByID;
exports.updateStaff = updateStaff;
exports.deactivateStaff = deactivateStaff;

exports.createAmbulance = createAmbulance;
exports.getAmbulances = getAmbulances;
exports.getAmbulanceById = getAmbulanceById;
exports.updateAmbulance = updateAmbulance;
exports.deactivateAmbulance = deactivateAmbulance;
