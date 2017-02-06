const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var pushSchema = new Schema({
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

const Push = mongoose.model('Push', pushSchema);

module.exports = Push;
