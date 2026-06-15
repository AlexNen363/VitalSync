const {
    Patient,
    Appointment,
    Bill,
    AmbulanceRequest
} = require("../models/receptionist-models");

const Doctor = require("../models/doctor-models");

// ======================
// REGISTER PATIENT
// ======================

const registerPatient = async (req, res) => {
    try {
        const { patientName, age, gender, phoneNumber, address } = req.body;

        if (!patientName || !age || !gender || !phoneNumber || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (age < 1 || age > 120) {
            return res.status(400).json({ success: false, message: "Invalid age" });
        }

        const validGenders = ["Male", "Female", "Other"];
        if (!validGenders.includes(gender)) {
            return res.status(400).json({ success: false, message: "Invalid gender" });
        }

        if (!/^[0-9]{10}$/.test(phoneNumber)) {
    return res.status(400).json({
        success: false,
        message: "Phone number must contain exactly 10 digits"
    });
}

        const patient = new Patient({ patientName, age, gender, phoneNumber, address });
        await patient.save();

        res.status(201).json({ success: true, message: "Patient Registered Successfully", patient });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// SEARCH PATIENT
// ======================

const searchPatient = async (req, res) => {

    try {

        const patientName = req.query.patientName || "";

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const patients = await Patient.find({
            patientName: {
                $regex: patientName,
                $options: "i"
            }
        })
        .skip(skip)
        .limit(limit);

        const totalPatients = await Patient.countDocuments({
            patientName: {
                $regex: patientName,
                $options: "i"
            }
        });

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalPatients / limit),
            totalPatients,
            patients
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================
// BOOK APPOINTMENT
// ======================

const bookAppointment = async (req, res) => {
    try {
        const { patientName, doctorName, specialization, appointmentDate, appointmentTime } = req.body;
        if (
    !patientName ||
    !doctorName ||
    !specialization ||
    !appointmentDate ||
    !appointmentTime
) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}

        if (!doctorName || !doctorName.trim()) {
            return res.status(400).json({ success: false, message: "Doctor name is required" });
        }

        const selectedDate = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({ success: false, message: "Cannot book appointment for past dates" });
        }

        const appointment = new Appointment({ patientName, doctorName, specialization, appointmentDate, appointmentTime });
        await appointment.save();

        res.status(201).json({ success: true, message: "Appointment Booked Successfully", appointment });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// GENERATE BILL
// ======================

const generateBill = async (req, res) => {
    try {
        const { patientName, doctorName, consultationFee } = req.body;

    if (!patientName || !doctorName || !consultationFee) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}

if (consultationFee <= 0) {
    return res.status(400).json({
        success: false,
        message: "Consultation fee must be greater than 0"
    });
}

        const bill = new Bill({ patientName, doctorName, consultationFee });
        await bill.save();

        res.status(201).json({ success: true, message: "Bill Generated Successfully", bill });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// REQUEST AMBULANCE
// ======================

const requestAmbulance = async (req, res) => {
    try {
        const { patientName, pickupLocation, emergencyDetails } = req.body;

        if (!emergencyDetails || emergencyDetails.length < 5) {
            return res.status(400).json({ success: false, message: "Please provide emergency details" });
        }
        if (
    !patientName ||
    !pickupLocation ||
    !emergencyDetails
) {
    return res.status(400).json({
        success: false,
        message: "All fields are required"
    });
}

        const ambulanceRequest = new AmbulanceRequest({ patientName, pickupLocation, emergencyDetails });
        await ambulanceRequest.save();

        res.status(201).json({ success: true, message: "Ambulance Request Created Successfully", ambulanceRequest });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// VIEW APPOINTMENTS
// ======================

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({ success: true, appointments });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// UPDATE APPOINTMENT STATUS
// ======================

const updateAppointmentStatus = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const { status } = req.body;

        const validStatus = ["Checked In", "Not Checked In", "Cancelled"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Appointment Status Updated", appointment });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ======================
// GET AVAILABLE DOCTORS
// ======================

const getAvailableDoctors = async (req, res) => {

    try {

        const specialization = req.query.specialization || "";

        const doctors = await Doctor.find({
            Specialization: {
                $regex: specialization,
                $options: "i"
            },
            AvailabilityStatus: "Available"
        });

        res.status(200).json({
            success: true,
            doctors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    registerPatient,
    searchPatient,
    bookAppointment,
    generateBill,
    requestAmbulance,
    getAppointments,
    updateAppointmentStatus,
    getAvailableDoctors
};