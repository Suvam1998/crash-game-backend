const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const gameSocket = require('./sockets/gameSocket');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from /public
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// MongoDB connect
connectDB();

// Routes
app.use('/api/wallet', require('./routes/walletRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// WebSocket game logic
gameSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
