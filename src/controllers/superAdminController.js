const Hospital = require('../models/Hospital');
const User = require('../models/User');

// @desc    Get all hospitals
// @route   GET /api/superadmin/hospitals
// @access  Private/SuperAdmin
exports.getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find().sort('-createdAt');
        
        // Also fetch user counts for each hospital
        const hospitalData = await Promise.all(hospitals.map(async (hospital) => {
            const usersCount = await User.countDocuments({ hospitalId: hospital._id });
            return {
                ...hospital.toObject(),
                users: usersCount
            };
        }));
        
        res.status(200).json({
            success: true,
            count: hospitalData.length,
            data: hospitalData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create a new hospital
// @route   POST /api/superadmin/hospitals
// @access  Private/SuperAdmin
exports.createHospital = async (req, res) => {
    try {
        const { name, location, adminName, adminEmail, adminPassword, plan } = req.body;

        // Check if admin email already exists
        let userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Admin email already in use' });
        }

        // Generate Hospital ID
        const lastHospital = await Hospital.findOne().sort('-createdAt');
        let hospitalNumber = 1;
        if (lastHospital && lastHospital.hospitalId) {
            const lastNumber = parseInt(lastHospital.hospitalId.split('-')[1]);
            if (!isNaN(lastNumber)) {
                hospitalNumber = lastNumber + 1;
            }
        }
        const hospitalId = `HSP-${String(hospitalNumber).padStart(3, '0')}`;

        // Create Hospital
        const hospital = await Hospital.create({
            hospitalId,
            name,
            location,
            adminName,
            adminEmail,
            plan
        });

        // Use the password provided by Super Admin
        const tempPassword = adminPassword || 'password123';

        // Create Admin User for this hospital
        const adminUser = await User.create({
            name: adminName,
            email: adminEmail,
            password: tempPassword,
            role: 'admin',
            hospitalId: hospital._id
        });

        res.status(201).json({
            success: true,
            data: {
                ...hospital.toObject(),
                users: 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Toggle hospital status
// @route   PUT /api/superadmin/hospitals/:id/toggle
// @access  Private/SuperAdmin
exports.toggleHospitalStatus = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        
        if (!hospital) {
            return res.status(404).json({ success: false, message: 'Hospital not found' });
        }

        hospital.status = hospital.status === 'Active' ? 'Suspended' : 'Active';
        await hospital.save();

        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
