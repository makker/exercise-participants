'use strict';
module.exports = function(app) {
  var participants = require('../controllers/participantsController');

  // Participants Routes
  app.route('/api/participants')
    .get(participants.list_all_participants)
    .post(participants.create_a_participant);


  app.route('/api/participants/:participantId')
    .get(participants.read_a_participant)
    .put(participants.update_a_participant)
    .delete(participants.delete_a_participant);
};