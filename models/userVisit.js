const mongoose = require('mongoose');

const userVisitSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  lastVisit: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('UserVisit', userVisitSchema);