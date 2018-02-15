
var express = require('express'),
app = express(),
port = process.env.PORT || 3001,
mongoose = require('mongoose'),
Participant = require('./api/models/participantsModel'), //created model loading here
bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Participantsdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* // MIDDLEWARE NOT WORKING
app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
//  .status(200).send('found')
}); */

var routes = require('./api/routes/participantsRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Participants RESTful API server started on: ' + port);