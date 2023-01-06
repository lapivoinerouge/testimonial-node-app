const Concert = require('../models/concert.model');
var sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if(!concert) res.status(404).json(`Element with id ${req.params.id} not found`)
    else res.json(concert);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.getByPerformer = async (req, res) => {
  try {
    const concerts = await Concert.find({ performer: req.params.performer});
    if(concerts.length === 0) res.status(404).json('Not found')
    else res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.getByGenre = async (req, res) => {
  try {
    const concerts = await Concert.find({ genre: req.params.genre});
    if(concerts.length === 0) res.status(404).json('Not found')
    else res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.getByPriceRange = async (req, res) => {
  try {
    const concerts = await Concert.find({ $and: [{price: {$gt: req.params.price_min, $lt: req.params.price_max}}]});
    if(concerts.length === 0) res.status(404).json('Not found')
    else res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.getByDay = async (req, res) => {
  try {
    const concerts = await Concert.find({ day: req.params.day });
    if(concerts.length === 0) res.status(404).json('Not found')
    else res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.post = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;

    var sanitizedPerformer = sanitize(performer);
    var sanitizedGenre = sanitize(genre);
    var sanitizedPrice = sanitize(price);
    var sanitizedDay = sanitize(day);
    var sanitizedImage = sanitize(image);

    const existingData = await Concert.find({ performer: sanitizedPerformer, genre: sanitizedGenre, price: sanitizedPrice, day: sanitizedDay, image: sanitizedImage })
    if (!existingData) {
      const concert = new Concert({ performer: sanitizedPerformer, genre: sanitizedGenre, price: sanitizedPrice, day: sanitizedDay, image: sanitizedImage });
      const savedConcert = await concert.save();
      res.json(savedConcert);
    } else {
        res.status(400).json({ message: "Bad request"});
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.put = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;

    var sanitizedPerformer = sanitize(performer);
    var sanitizedGenre = sanitize(genre);
    var sanitizedPrice = sanitize(price);
    var sanitizedDay = sanitize(day);
    var sanitizedImage = sanitize(image);

    const existingData = await Concert.findById(req.params.id);

    if (existingData) {
      await Concert.updateOne({ _id: req.params.id }, { $set: { performer: sanitizedPerformer, genre: sanitizedGenre, price: sanitizedPrice, day: sanitizedDay, image: sanitizedImage }});
      const updatedConcert = await Concert.findById(req.params.id);
      res.json(updatedConcert);
    } else {
      res.status(400).json({ message: "Bad request"});
    }
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.delete = async (req, res) => {
  try {
    const deletedConcert = await Concert.findById(req.params.id);
    if(deletedConcert) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(deletedConcert);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}