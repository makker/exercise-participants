'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ParticipantSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the participant'
  },
  email: {
    type: String,
    required: 'Kindly enter the email address of the participant'
  },
  phone: {
    type: String,
    required: 'Kindly enter the phone number of the participant'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Participants', ParticipantSchema);