const express = require('express');
const router = express.Router()
const db = require('../db').seats;

const generateNextId = () => {
    return (db[db.length-1]).id + 1;
}

const getElementById = x => {
    return db.find(({id}) => id.toString() === x);
}

router.route('/seats').get((req, res) => {
    res.json(db);
});

router.route('/seats/:id').get((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`)
    }
});

router.route('/seats').post((req, res) => {
    const idx = generateNextId();
    const dayInt = parseInt(req.body.day);
    const seatInt = parseInt(req.body.seat);

    if (!db.some(({ seat, day }) => seat === seatInt && day === dayInt)) {
        db.push({
            id: idx, 
            day: dayInt, 
            seat: seatInt, 
            client: req.body.client,
            email: req.body.client
        });
        res.json(db.find(({ id }) => id === idx));
    } else {
        res.status(400).json({ message: "The slot is already taken" });
    }
});

router.route('/seats/:id').put((req, res) => {
    const entry = getElementById(req.params.id);
    if (entry) {
        entry.day = parseInt(req.body.day);
        entry.seat = req.body.performer;
        entry.client = req.body.genre;
        entry.email = parseInt(req.body.price);
        res.json(entry);
    } else {
        res.status(404).json(`Element with id ${req.params.id} not found`);
    }
});

router.route('/seats/:id').delete((req, res) => {
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