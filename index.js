const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Basic route
app.get('/', (req, res) => {
    res.send('Hospital Management System API is running...');
});

// Mount routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));
app.use('/api/patients', require('./src/routes/patientRoutes'));
app.use('/api/doctors', require('./src/routes/doctorRoutes'));
app.use('/api/appointments', require('./src/routes/appointmentRoutes'));
app.use('/api/billing', require('./src/routes/billRoutes'));
app.use('/api/pharmacy', require('./src/routes/medicineRoutes'));
app.use('/api/lab', require('./src/routes/labRoutes'));
app.use('/api/beds', require('./src/routes/bedRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));
app.use('/api/payments', require('./src/routes/paymentRoutes'));

// Socket.io Real-time Hub
io.on('connection', (socket) => {
    console.log('Operational Terminal Linked:', socket.id);

    // Join departmental radio channels
    socket.on('join_department', (dept) => {
        socket.join(dept);
        console.log(`Command Terminal joined channel: ${dept}`);
    });

    // Broadcast institutional alerts
    socket.on('send_alert', (data) => {
        // data: { department, message, priority, type }
        if (data.department === 'global') {
            io.emit('new_alert', data);
        } else {
            io.to(data.department).emit('new_alert', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('Operational Terminal Delinked');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Institutional Core running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
