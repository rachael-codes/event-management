// models/attendeeModel.js
const db = require('../config/db'); // Import the database configuration

// Register an attendee
const registerAttendee = (name, email, callback) => {
  const sql = 'INSERT INTO attendees (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, { id: result.insertId, name, email });
  });
};

// Get list of all attendees
const getAllAttendees = (callback) => {
  const sql = 'SELECT * FROM attendees';
  db.query(sql, (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, rows);
  });
};

// Add more model functions for attendee details, editing, etc.

module.exports = { registerAttendee, getAllAttendees };
