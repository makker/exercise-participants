'use strict';

var mongoose = require('mongoose'),
    Participant = mongoose.model('Participants');

exports.list_all_participants = function(req, res) {
  Participant.find({}, function(err, participant) {

    if (err)
      res.send(err);
    else
      res.json(participant);
  });
};

exports.create_a_participant = function(req, res) {
  var new_participant = new Participant(req.body);
  new_participant.save(function(err, participant) {

    if (err)
      res.send(err);
    else
      res.json(participant);
  });
};

exports.read_a_participant = function(req, res) {
  Participant.findById(req.params.participantId, function(err, participant) {

    if (err)
      res.send(err);
    else
      res.json(participant);
  });
};

exports.update_a_participant = function(req, res) {
  console.log("update_a_participant", req.params.participantId);
  Participant.findOneAndUpdate({_id: req.params.participantId}, req.body, {new: false}, function(err, participant) {

    if (err)
      res.send(err);
    else
      res.json(participant);
  });
};

exports.delete_a_participant = function(req, res) {
  Participant.remove({
    _id: req.params.participantId
  }, function(err, participant) {

    if (err)
      res.send(err);
    else
      res.json({ message: 'Participant successfully deleted' });
  });
};