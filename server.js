const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const cors = require('cors'); 
const eventController = require('./controllers/eventController');
const attendeeController = require('./controllers/attendeeController');
const db = require('./config/db');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));
app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define the main route (index page)
app.get('/', (req, res) => {
  res.render('index');
});

// Event-related routes
app.use('/events', eventController);

// Attendee-related routes
app.use('/attendees', attendeeController);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Handle server errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
