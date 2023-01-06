const Seat = require('../models/seat.model');
var sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch (err) {
    res.status(500).json({ message: 'dupa' });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Seat.findById(req.params.id);
    if(!data) res.status(404).json(`Element with id ${req.params.id} not found`)
    else res.json(data);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
}

exports.post = async (req, res) => {
  try {
    const { day, seat, client, email } = req.body;
    var sanitizedDay = sanitize(day);
    var sanitizedSeat = sanitize(seat);
    var sanitizedClient = sanitize(client);
    var sanitizedEmail = sanitize(email);

    const existingData = await Seat.findOne({ seat: sanitizedSeat, day: sanitizedDay });
    if (!existingData) {
      const newSeat = new Seat({ seat: sanitizedSeat, day: sanitizedDay, client: sanitizedClient, email: sanitizedEmail });
      const data = await newSeat.save();
      res.json(data);
    } else {
      res.status(400).json({ message: "The slot is already taken" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
  const seats = await Seat.find();
  req.io.emit('seatsUpdated', seats);
}

exports.put = async (req, res) => {
  try {
    const { seat, day, client, email } = req.body;

    var sanitizedDay = sanitize(day);
    var sanitizedSeat = sanitize(seat);
    var sanitizedClient = sanitize(client);
    var sanitizedEmail = sanitize(email);
    
    const existingData = await Seat.findById(req.params.id);
    if (existingData) {
      await Seat.updateOne({ _id: req.params.id }, { $set: { seat: sanitizedSeat, day: sanitizedDay, client: sanitizedClient, email: sanitizedEmail }});
      const data = await Seat.findById(req.params.id);
      res.json(data);
    } else {
      res.status(404).json(`Element with id ${req.params.id} not found`);
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
  const seats = await Seat.find();
  req.io.emit('seatsUpdated', seats);
}

exports.delete = async (req, res) => {
  try {
    const data = await Seat.findById(req.params.id);
    if (data) {
      await Seat.deleteOne({ _id: req.params.id });
      res.json(data);
    }
    res.status(404).json(`Element with id ${req.params.id} not found`);
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
  const seats = await Seat.find();
  req.io.emit('seatsUpdated', seats);
}