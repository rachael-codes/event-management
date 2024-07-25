// controllers/eventController.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Import the database configuration

// Render the event creation form
router.get('/create', (req, res) => {
  res.render('event/create');
});

// Route to display all events
router.get('/', (req, res) => {
  // Query the database to retrieve all events
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, events) => {
    if (err) {
      console.error('Error getting events list:', err);
      res.status(500).json({ error: 'Could not get events list' });
      return;
    }

    // Render the view with the list of events
    res.render('event/list', { events });
  });
});

// Handle event creation
router.post('/', (req, res) => {
  const { name, date, location, description, capacity } = req.body;
  const sql = 'INSERT INTO events (name, date, location, description, capacity) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, date, location, description, capacity], (err, result) => {
    if (err) {
      console.error('Error creating event:', err);
      res.status(500).json({ error: 'Could not create the event' });
      return;
    }
    res.redirect(`/events/${result.insertId}`);
  });
});

// Get event details by ID
router.get('/:id', (req, res) => {
  const eventId = req.params.id;
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error('Error getting event details:', err);
      res.status(500).json({ error: 'Could not get event details' });
      return;
    }
    if (rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    const event = rows[0];
    res.render('event/details', { event });
  });
});

// Route to display the edit form for a specific event
router.get('/edit/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  // Fetch event details from the database based on eventId
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      console.error('Error fetching event details:', err);
      res.status(500).json({ error: 'Could not fetch event details' });
      return;
    }

    // Check if an event with the specified eventId exists
    if (rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Render the edit form view with the event details
    res.render('event/edit', { event: rows[0] });
  });
});

// Route to handle event edit form submission
router.post('/edit/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { name, date, description } = req.body;

  // Construct a SQL query to update the event in the database
  const sql = 'UPDATE events SET name = ?, date = ?, description = ? WHERE id = ?';

  // Execute the SQL query to update the event
  db.query(sql, [name, date, description, eventId], (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      res.status(500).json({ error: 'Could not update event' });
      return;
    }

    // Check if any rows were affected by the update (i.e., if the event with the specified eventId exists)
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Redirect to the event details page or display a success message
    res.redirect(`/events/${eventId}`);
  });
});

// Route to handle event update form submission (HTTP PUT)
router.put('/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { name, date, location, description, capacity } = req.body;

  const sql = 'UPDATE events SET name = ?, date = ?, location = ?, description = ?, capacity = ? WHERE id = ?';
  const values = [name, date, location, description, capacity, eventId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating event:', err);
      res.status(500).json({ error: 'Could not update event' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.redirect(`/events/${eventId}`);
  });
});

// Route to handle event deletion (HTTP DELETE)
router.delete('/:eventId', (req, res) => {
  const eventId = req.params.eventId;

  // Construct a SQL query to delete the event from the database based on eventId
  const sql = 'DELETE FROM events WHERE id = ?';

  // Execute the SQL query to delete the event
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error('Error deleting event:', err);
      res.status(500).json({ error: 'Could not delete event' });
      return;
    }

    // Check if any rows were affected by the delete (i.e., if the event with the specified eventId existed)
    if (result.affectedRows === 0) {
      console.error('Event not found for deletion');
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    // Respond with a success status code
    res.status(200).send('Event deleted');
  });
});


module.exports = router;
