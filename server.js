const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const path = require('path');
const app = express();
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set("strictQuery", true);

const testimonialRoutes = require('./routes/testimonials.routes');
const concertRoutes = require('./routes/concerts.routes');
const seatRoutes = require('./routes/seats.routes');

const Seat = require('./models/seat.model');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cors());

const NODE_ENV = process.env.NODE_ENV;
let dbURI = '';
let isTestEnv = NODE_ENV === 'test';

if(NODE_ENV === 'production') dbURI = `mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@vcluster.wacbnbq.mongodb.net/?retryWrites=true&w=majority`;
else if(isTestEnv) dbURI = 'mongodb://localhost:27017/NewWaveDBtest';
else dbURI = 'mongodb://localhost:27017/NewWaveDB';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', async () => {
  if (!isTestEnv) {
    console.log('Connected to the database');
  }
});
db.on('error', err => console.log('Error ' + err));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  if (!isTestEnv) {
    console.log(`Server is running on port: ${port}`);
  }
});

module.exports = server;

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

io.on('connection', (socket) => {
  Seat.find().then((seats) => {
    socket.emit('seatsUpdated', seats);
  })
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

