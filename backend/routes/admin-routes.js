const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin-controller');

//STAFF ROUTES
//Create Staff/Doctor
router.post('/api/staff', adminController.createStaff);

//Get ALL Staff
router.get('/api/staff', adminController.getStaff);

//Get Staff by ID
router.get('/api/staff/:id', adminController.getStaffByID);

//Update Staff
router.put('/api/staff/:id', adminController.updateStaff);

//Deactivate Staff
router.patch('/api/staff/:id/deactivate', adminController.deactivateStaff);


//AMBULANCE ROUTES
// Create Ambulance
router.post("/api/ambulance", adminController.createAmbulance);

// Get All Ambulances
router.get("/api/ambulance", adminController.getAmbulances);

// Get Ambulance By ID
router.get("/api/ambulance/:id", adminController.getAmbulanceById);

// Update Ambulance
router.put("/api/ambulance/:id", adminController.updateAmbulance);

// Deactivate Ambulance
router.patch("/api/ambulance/:id/deactivate", adminController.deactivateAmbulance);


module.exports = router;