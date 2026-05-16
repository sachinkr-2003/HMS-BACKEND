const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("REGISTRATION ATTEMPT - NAME:", name, "EMAIL:", email, "ROLE:", role);
        
        // Final normalization to ensure database consistency
        const finalRole = (role || 'patient').toLowerCase();

        let hospitalId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const requestingUser = await User.findById(decoded.id);
                if (requestingUser && requestingUser.role !== 'superadmin') {
                    hospitalId = requestingUser.hospitalId;
                }
            } catch (err) {}
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: finalRole,
            hospitalId: hospitalId 
        });

        // Institutional Automation: If role is doctor, create a profile
        if (finalRole === 'doctor') {
            await Doctor.create({
                user: user._id,
                specialization: 'General Physician',
                fees: 500,
                availability: [
                    { day: 'Monday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Friday', startTime: '09:00', endTime: '17:00' },
                    { day: 'Saturday', startTime: '09:00', endTime: '17:00' }
                ]
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Auth Register Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            // Check if user belongs to a hospital and if it is suspended
            if (user.hospitalId) {
                const hospital = await Hospital.findById(user.hospitalId);
                if (hospital && hospital.status === 'Suspended') {
                    return res.status(403).json({ message: 'Your hospital account has been suspended. Please contact HealthRekha Administrator.' });
                }
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hospitalId: user.hospitalId,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        let query = {};
        if (req.user && req.user.role !== 'superadmin') {
            query.hospitalId = req.user.hospitalId;
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User unit not found' });
        
        await user.deleteOne();
        res.status(200).json({ message: 'Institutional access revoked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/auth/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User unit not found' });
        
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = (req.body.role || user.role).toLowerCase();
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();
        
        // Institutional Automation: If role is updated to doctor, ensure profile exists
        if (user.role === 'doctor') {
            const doctorExists = await Doctor.findOne({ user: user._id });
            if (!doctorExists) {
                await Doctor.create({
                    user: user._id,
                    specialization: 'General Physician',
                    fees: 500,
                    availability: [
                        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Friday', startTime: '09:00', endTime: '17:00' },
                        { day: 'Saturday', startTime: '09:00', endTime: '17:00' }
                    ]
                });
            }
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
    res.status(200).json({ message: 'User logged out successfully' });
};
