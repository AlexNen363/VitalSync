const express = require("express");
const router = express.Router();

const doctorController = require("../controller/doctor-controller");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    doctorController.getDoctors
);

router.get(
    "/:docid",
    authMiddleware,
    roleMiddleware("Admin", "Doctor"),
    doctorController.getDoctorById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin"),
    doctorController.createDoctor
);

router.patch(
    "/:docid",
    authMiddleware,
    roleMiddleware("Admin"),
    doctorController.updateDoctor
);

router.delete(
    "/:docid",
    authMiddleware,
    roleMiddleware("Admin"),
    doctorController.deleteDoctor
);

module.exports = router;