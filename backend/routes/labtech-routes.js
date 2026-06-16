const express = require("express");
const router = express.Router();

const pharmacistController = require("../controller/pharmacist-controller");

// Manage medicine inventory
router.get("/inventory", pharmacistController.getInventory);

// Update medicine stock
router.patch("/stock/:medicineId", pharmacistController.updateStock);

// Dispense medicines
router.post("/dispense/:prescriptionId", pharmacistController.dispenseMedicine);

// Schedule medicine reminders
router.post("/reminder", pharmacistController.scheduleReminder);

// Monitor medicine availability
router.get("/availability", pharmacistController.checkMedicineAvailability);

module.exports = router;