const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const path = require('path');
const app = express();

const testimonialRoutes = require('./routes/testimonials.routes');
const concertRoutes = require('./routes/concerts.routes');
const seatRoutes = require('./routes/seats.routes');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cors());

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  console.log(db.seats);
  socket.emit('seatsUpdated', db.seats);
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', testimonialRoutes);
app.use('/api', concertRoutes);
app.use('/api', seatRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

