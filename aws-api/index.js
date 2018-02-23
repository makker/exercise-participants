
'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

const PARTICIPANTS_TABLE = process.env.PARTICIPANTS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE;

// declare Dynamo query base params
const params = {
  TableName: PARTICIPANTS_TABLE
}
const paramsKeyId = (_id) => {
  return Object.assign({
    Key: { "_id": _id }
  },
  params);
}
const paramsItem = (_id, name, email, phone) => {
  return Object.assign({
    Item: {
        name: name,
        email: email,
        phone: phone,
        _id: _id
    }
  }, params );
};

// Declare http response bases
const corsHeader = { 
  headers: { 'Access-Control-Allow-Origin': '*' } 
};
const responseOK = Object.assign( { statusCode: 200 }, corsHeader );
const responseNotFound = Object.assign( { statusCode: 404 }, corsHeader);
const responseBad = (error) => {
  return Object.assign( {
    statusCode: 400,
    body: JSON.stringify({ error })
  }, corsHeader);
};

// Set up DynamoDB
let dynamoDb;

if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    })
    // console.log(dynamoDb);
} else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
};

/*dynamoDb.service.describeTable({TableName: "participants-table-dev"}, (err, data) => {
  console.log("data: ", data.Table.KeySchema);
})*/

// Set up end point handlers
module.exports.helloRoot = function (event, context, callback) {
  const res = Object.assign( { body: "Hello!" }, responseOK );
  res.headers["Content-Type"] = "text/html";
  callback(null, res);
};

module.exports.list_all_participants = function (event, context, callback) {
  dynamoDb.scan(Object.assign( { Limit: 500 }, params))
    .promise()
    .then((result) => { 
      const res = Object.assign({ 
          body: JSON.stringify(result.Items)
        }, 
        responseOK);
      //const res = Object.assign( { body: "TESTING" }, responseOK);
      //res.headers["Content-Type"] = "text/html";
      callback(null, res);
    })
    .catch(error => {
      console.log(error);
      callback(null, responseBad("Could not get participants"));
    });
};

module.exports.create_a_participant = function (event, context, callback) {
  const { name, email, phone } = JSON.parse(event.body);

  if (typeof name !== 'string') {
    callback(null, responseBad('"name" must be a string'));
  } else if (typeof email !== 'string') {
    callback(null, responseBad('"email" must be a string'));
  } else if (typeof phone !== 'string') {
    callback(null, responseBad('"phone" must be a string'));
  }

  const _id = uuid.v4();
  dynamoDb.put(paramsItem(_id, name, email, phone))
    .promise()
    .then((result) => { 
      callback(null, Object.assign( 
        { body: JSON.stringify({ _id, name, email, phone }) }, 
        responseOK ));
    })
    .catch(error => {
      console.log(error);
      callback(null, responseBad("Could not create new participant"));
    });
};

module.exports.read_a_participant = function (event, context, callback) {
  dynamoDb.get(paramsKeyId(event.pathParameters.participantId))
    .promise()
    .then((result) => {
      let res;
      if (result.Item) {
        res = Object.assign( { body: JSON.stringify(result.Item) }, responseOK);
      } else {
        res = Object.assign( 
          { body: JSON.stringify({ error: "Participant not found" }) }, 
          responseNotFound );
      }
      callback(null, res);
    })
    .catch((error) => {
      console.log(error);
      callback(null, responseBad("Could not get participant"));
    });
};

module.exports.update_a_participant = function (event, context, callback) {
  const { name, email, phone } = JSON.parse(event.body);
  const _id = event.pathParameters.participantId;

  if (typeof name !== 'string') {
    callback(null, responseBad('"name" must be a string'));
  } else if (typeof email !== 'string') {
    callback(null, responseBad('"email" must be a string'));
  } else if (typeof phone !== 'string') {
    callback(null, responseBad('"phone" must be a string'));
  }

  dynamoDb.put(paramsItem(_id, name, email, phone))
    .promise()
    .then((result) => {
      callback(null, Object.assign( { 
          body: JSON.stringify( { _id, name, email, phone } )
        }, responseOK ));
      })
    .catch((error) => {
      console.log(error);
      callback(null, responseBad("Could not update participant"));
    });
};

module.exports.delete_a_participant = function (event, context, callback) {
  dynamoDb.delete(paramsKeyId(event.pathParameters.participantId))
  .promise()
  .then((result) => {
    callback(null, Object.assign( 
      { body: JSON.stringify( { result: "Delete participant succeeded" } ) }, 
      responseOK ));
    })
  .catch((error) => {
    console.log(error);
    callback(null, responseBad("Could not delete participant"));
  });
};