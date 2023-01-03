const Concert = require('../models/concert.model');

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
    const data = await Concert.findById(req.params.id);
    if(!data) res.status(404).json(`Element with id ${req.params.id} not found`)
    else res.json(data);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.post = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    // day = parseInt(day);
    // price = parseInt(price);
    const existingData = await Concert.find({ performer: performer, genre: genre, price: price, day: day, image: image })
    if (!existingData) {
      const concert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
      const data = await concert.save();
      res.json(data);
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
    // day = parseInt(day);
    // price = parseInt(price);

    const existingData = await Concert.findById(req.params.id);

    if (existingData) {
      await Concert.updateOne({ _id: req.params.id }, { $set: { performer: performer, genre: genre, price: price, day: day, image: image  }});
      const data = await Concert.findById(req.params.id);
      res.json(data);
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
    const data = await Concert.findById(req.params.id);
    if(data) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json(data);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}