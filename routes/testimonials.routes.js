const express = require('express');
const router = express.Router()
const db = require('../db').testimonials;

const generateNextId = () => {
    return (db[db.length-1]).id + 1;
}

const getElementById = x => {
    return db.find(({id}) => id.toString() === x);
}

router.route('/testimonials').get((req, res) => {
    res.json(db);
});

router.route('/testimonials/random').get((req, res) => {
    if (db.length === 0) {
        res.status(404).send();
    }
    const idx = Math.floor(Math.random() * db.length + 1)
    res.json(db.find(({ id }) => id === idx));
});

router.route('/testimonials/:id').get((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`)
    }
});

router.route('/testimonials').post((req, res) => {
    if (req.body.author && req.body.text) {
        const idx = generateNextId();
        db.push({id: idx, ...req.body });
        res.json(db.find(({ id }) => id === idx));
    } else {
        res.status(400).json({ message: "Bad request"});
    }
});

router.route('/testimonials/:id').put((req, res) => {
    const entry = getElementById(req.params.id);
    if (!(req.body.author || req.body.text)) {
        res.status(400).json({ message: "Bad request"});
    } else if (entry) {
        entry.author = req.body.author;
        entry.text = req.body.text;
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`);
    }
});

router.route('/testimonials/:id').delete((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        const idx = db.indexOf(entry);
        db.splice(idx, 1);
        res.status(204).json({ message: "No content"});
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`);
    }
});

module.exports = router;