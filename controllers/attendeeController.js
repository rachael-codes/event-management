const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import the database configuration

// Render the attendee registration form
router.get('/register', (req, res) => {
  res.render('attendee/register');
});

// Handle attendee registration
router.post('/', (req, res) => {
  const { name, email } = req.body;

  // Check if the 'name' field is empty or null
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const sql = 'INSERT INTO attendees (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error registering attendee:', err);
      res.status(500).json({ error: 'Could not register attendee' });
      return;
    }
    res.redirect(`/attendees/${result.insertId}`);
  });
});


// Route to display attendee details by ID
router.get('/:id', (req, res) => {
  const attendeeId = req.params.id;

  // Query the database to retrieve attendee details by ID
  const sql = 'SELECT * FROM attendees WHERE id = ?';
  db.query(sql, [attendeeId], (err, rows) => {
    if (err) {
      console.error('Error fetching attendee details:', err);
      res.status(500).json({ error: 'Could not fetch attendee details' });
      return;
    }

    if (rows.length === 0) {
      res.status(404).send('Attendee not found');
      return;
    }

    const attendee = rows[0];
    res.render('attendee/details', { attendee }); // Create a "details" view to display attendee information
  });
});



// Get list of all attendees
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM attendees';
  db.query(sql, (err, attendees) => {
    if (err) {
      console.error('Error getting attendee list:', err);
      res.status(500).json({ error: 'Could not get attendee list' });
      return;
    }

    // Retrieve events data here from the database
    const sqlEvents = 'SELECT * FROM events';
    db.query(sqlEvents, (err, events) => {
      if (err) {
        console.error('Error getting events list:', err);
        res.status(500).json({ error: 'Could not get events list' });
        return;
      }

      // Pass both attendees and events data to the view
      res.render('attendee/list', { attendees, events });
    });
  });
});

module.exports = router;
