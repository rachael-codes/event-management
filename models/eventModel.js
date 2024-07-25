// models/eventModel.js
const db = require('../config/db'); // Import the database configuration

// Create a new event
const createEvent = (eventData, callback) => {
  const { name, date, location, description, capacity } = eventData;
  const sql = 'INSERT INTO events (name, date, location, description, capacity) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, date, location, description, capacity], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, { id: result.insertId, ...eventData });
  });
};

// Get event details by ID
const getEventById = (eventId, callback) => {
  const sql = 'SELECT * FROM events WHERE id = ?';
  db.query(sql, [eventId], (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    if (rows.length === 0) {
      return callback(null, null); // Event not found
    }
    const event = rows[0];
    callback(null, event);
  });
};

// Get list of all events
const getAllEvents = (callback) => {
  const sql = 'SELECT * FROM events';
  db.query(sql, (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, rows);
  });
};

// Add more model functions for event editing, attendee registration, etc.

module.exports = { createEvent, getEventById, getAllEvents };
