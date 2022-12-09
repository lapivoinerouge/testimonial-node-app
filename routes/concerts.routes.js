const express = require('express');
const router = express.Router()
const db = require('../db').concerts;

const generateNextId = () => {
    return (db[db.length-1]).id + 1;
}

const getElementById = x => {
    return db.find(({id}) => id.toString() === x);
}

router.route('/concerts').get((req, res) => {
    res.json(db);
});

router.route('/concerts/:id').get((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`)
    }
});

router.route('/concerts').post((req, res) => {
    const idx = generateNextId();
    const day = parseInt(req.body.day);
    const price = parseInt(req.body.price);

    db.push({id: idx, day: day, price: price, performer: req.body.performer, genre: req.body.genre, image: req.body.image });

    res.json(db.find(({ id }) => id === idx));
});

router.route('/concerts/:id').put((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        entry.performer = req.body.performer;
        entry.genre = req.body.genre;
        entry.price = parseInt(req.body.price);
        entry.day = parseInt(req.body.day);
        entry.image = req.body.image;
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`);
    }
});

router.route('/concerts/:id').delete((req, res) => {
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