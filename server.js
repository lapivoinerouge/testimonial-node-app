const express = require('express');
const cors = require('cors');
const app = express();
const port = '8000';

const testimonialRoutes = require('./routes/testimonials.routes');
const concertRoutes = require('./routes/concerts.routes');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cors());

app.use('/api', testimonialRoutes);
app.use('/api', concertRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  })

app.listen(port, () => {
    console.log("Server is running on port " + port);
});