const Seat = require('../models/seat.model');

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
    const existingData = await Seat.findOne({ seat: seat, day: day });
    if (!existingData) {
      const newSeat = new Seat({ seat: seat, day: day, client: client, email: email });
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
    // day = parseInt(day);
    const existingData = await Seat.findById(req.params.id);
    if (existingData) {
      await Seat.updateOne({ _id: req.params.id }, { $set: { seat: seat, day: day, client: client, email: email }});
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