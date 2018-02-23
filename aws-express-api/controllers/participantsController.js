'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const PARTICIPANTS_TABLE = process.env.PARTICIPANTS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

const params = {
  TableName: PARTICIPANTS_TABLE
}
const paramsKeyId = (_id) => {
  return Object.assign(params, {
    Key: {
        "_id": _id
    }
  });
}
const paramsItem = (_id, name, email, phone) => {
  return Object.assign(params, {
    Item: {
        name: name,
        email: email,
        phone: phone,
        _id: _id
    }
  });
};

let dynamoDb;
if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })/*
    console.log(dynamoDb);  */
} else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
};

/*dynamoDb.service.describeTable({TableName: "participants-table-dev"}, (err, data) => {
  console.log("data: ", data.Table.KeySchema);
})*/

exports.list_all_participants = function (req, res) {
  dynamoDb.scan(Object.assign(params, { Limit: 500}), (error, result) => {
      if (error) {
          console.log(error);
          res.status(400).json({ error: 'Could not get participants' });
      } else if (result) {
          res.json(result.Items);
      }
  });
};

exports.create_a_participant = function (req, res) {
  const { name, email, phone } = req.body;
  if (typeof name !== 'string') {
      res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof email !== 'string') {
      res.status(400).json({ error: '"email" must be a string' });
  } else if (typeof phone !== 'string') {
      res.status(400).json({ error: '"phone" must be a string' });
  }

  const _id = uuid.v1();

  dynamoDb.put(paramsItem(_id, name, email, phone), (error, data) => {
    if (error) {
        console.log(error);
        res.status(400).json({ error: 'Could not create new participant' });
    } else {
        res.json({ _id, name, email, phone });
    }
  });
};

exports.read_a_participant = function (req, res) {
  dynamoDb.get(paramsKeyId(req.params.participantId), (error, result) => {
      if (error) {
          console.log(error);
          res.status(400).json({ error: 'Could not get participant' });
      }
      if (result.Item) {
          const { _id, name, email, phone } = result.Item;
          res.json({ _id, name, email, phone });
      } else {
          res.status(404).json({ error: "Participant not found" });
      }
  });
};

exports.update_a_participant = function (req, res) {
  const { name, email, phone } = req.body;
  const _id = req.params.participantId;
  if (typeof name !== 'string') {
      res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof email !== 'string') {
      res.status(400).json({ error: '"email" must be a string' });
  } else if (typeof phone !== 'string') {
      res.status(400).json({ error: '"phone" must be a string' });
  }

  dynamoDb.put(paramsItem(_id, name, email, phone), (error) => {
      if (error) {
        console.log(error);
        res.status(400).json({ error: 'Could not get participant' });
      } else {
        res.json({ _id, name, email, phone });
      }
  });
};

exports.delete_a_participant = function (req, res) {
  dynamoDb.delete(paramsKeyId(req.params.participantId), (error) => {
      if (error) {
          console.log(error);
          res.status(400).json({ error: 'Could not delete participant' });
      } else {
          res.send("Delete participant succeeded");
      }
  });
};