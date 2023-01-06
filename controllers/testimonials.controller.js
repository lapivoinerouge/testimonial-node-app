const Testimonial = require('../models/testimonial.model');
var sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Testimonial.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Testimonial.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const data = await Testimonial.findOne().skip(rand);
    if(!data) res.status(404).json({ message: 'Not found' });
    else res.json(data);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Testimonial.findById(req.params.id);
    if(!data) res.status(404).json({ message: 'Not found' });
    else res.json(data);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}

exports.post = async (req, res) => {
  try {
    if (req.body.author && req.body.text) {
      const { author, text } = req.body;

      var sanitizedAuthor = sanitize(author);
      var sanitizedText = sanitize(text);

      const testimonial = new Testimonial({ author: sanitizedAuthor, text: sanitizedText });
      const data = await testimonial.save();
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
    if (req.body.author && req.body.text) {
      const { author, text } = req.body;

      var sanitizedAuthor = sanitize(author);
      var sanitizedText = sanitize(text);

      await Testimonial.updateOne({ _id: req.params.id }, { $set: { author: sanitizedAuthor, text: sanitizedText }});
      const data = await Testimonial.findById(req.params.id);
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
    const data = await Testimonial.findById(req.params.id);
    if(data) {
      await Testimonial.deleteOne({ _id: req.params.id });
      res.json(data);
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
}