const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

console.log("ADMIN ROUTES LOADED");

const adminController = require('../controller/admin-controller');
const { checkAuth, checkRole } = require('../middlewares/admin-middleware')


//AUTHENTICATION AND AUTHORIZATION ROUTES
//Register Staff
router.post('/api/auth/register', adminController.register);

//Login Staff
router.post('/api/auth/login', adminController.login);

//==============================================================================================

//STAFF ROUTES
//Create Staff/Doctor
router.post('/api/staff', checkAuth, checkRole('Administrator'),
    [check('StaffName')
        .trim()
        .notEmpty()
        .withMessage('Staff Name is required'),

    check('StaffPhone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, min: 10 })
        .withMessage('Phone number must be 10 digits'),

    check('StaffEmail')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid email'),

    check('StaffUsername')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    check('StaffPassword')
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    check('StaffRole')
        .trim()
        .notEmpty()
        .withMessage('Role is required'),

    check('Specialization')
        .trim()
        .if(check('StaffRole').equals('Doctor'))
        .notEmpty()
        .withMessage('Specialization is required for Doctors'),

    check('ConsultationFee')
        .trim()
        .if(check('StaffRole').equals('Doctor'))
        .notEmpty()
        .withMessage("Consultation fee is required")
        .isNumeric()
        .withMessage("Consultation fee must be a number")
        .isFloat({ min: 0 })
        .withMessage('Consultation fee cannot be negative')
    ], adminController.createStaff);

//Get ALL Staff
router.get('/api/staff', checkAuth, checkRole("Administrator", "Receptionist"), adminController.getStaff);

//Get Staff by ID
router.get('/api/staff/:id', checkAuth, checkRole("Administrator", "Receptionist"), adminController.getStaffByID);

//Get ALL Doctors
router.get('/api/doctors', checkAuth, checkRole("Administrator", "Receptionist"), adminController.getDoctors);

//Update Staff
router.put('/api/staff/:id', checkAuth, checkRole("Administrator"),
    [check('StaffPhone')
        .trim()
        .optional()
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 10, min: 10 })
        .withMessage('Phone number must be 10 digits'),

    check('StaffEmail')
        .trim()
        .optional()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter a valid email'),

    check('StaffPassword')
        .trim()
        .optional()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    ], adminController.updateStaff);

//Deactivate Staff
router.patch('/api/staff/:id/deactivate', checkAuth, checkRole("Administrator"), adminController.deactivateStaff);

//Activate Staff
router.patch('/api/staff/:id/activate', checkAuth, checkRole("Administrator"), adminController.activateStaff);

//==============================================================================================

//AMBULANCE ROUTES
//Create Ambulance
router.post('/api/ambulance', checkAuth, checkRole("Administrator"),
    [check('VehicleNumber')
        .trim()
        .notEmpty()
        .withMessage('Vehicle number is required'),

    check('DriverName')
        .trim()
        .notEmpty()
        .withMessage('Driver name is required'),

    check('DriverPhone')
        .trim()
        .notEmpty()
        .withMessage("Driver phone number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits'),
    ], adminController.createAmbulance);

//Get All Ambulances
router.get('/api/ambulance', checkAuth, checkRole("Administrator", "Receptionist"), adminController.getAmbulances);

//Get Ambulance By ID
router.get('/api/ambulance/:id', checkAuth, checkRole("Administrator", "Receptionist"), adminController.getAmbulanceById);

//Update Ambulance
router.put('/api/ambulance/:id', checkAuth, 
    [check('DriverPhone')
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Driver phone number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits'),
    ], adminController.updateAmbulance);

//Deactivate Ambulance
router.patch('/api/ambulance/:id/deactivate', checkAuth, checkRole("Administrator"), adminController.deactivateAmbulance);

//Activate Ambulance
router.patch('/api/ambulance/:id/activate', checkAuth, checkRole("Administrator"), adminController.activateAmbulance);


module.exports = router;