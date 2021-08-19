var express = require('express');
var userRouter = require('./user');
var amenityRouter = require('./amenity');
var propertyRouter = require('./property');
var locationRouter = require('./location');
var reviewRouter = require('./review');
var complaintRouter = require('./complaint');
var paymentRouter = require('./payment');
var emailRouter = require('./email');

var app = express();

app.use('/users/', userRouter);
app.use('/amenities/', amenityRouter);
app.use('/properties/', propertyRouter);
app.use('/locations/', locationRouter);
app.use('/reviews/', reviewRouter);
app.use('/complaints/', complaintRouter);
app.use('/payments/', paymentRouter);
app.use('/emails/', emailRouter);


module.exports = app;
