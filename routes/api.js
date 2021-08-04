var express = require("express");
var userRouter = require("./user");
var amenityRouter = require("./amenity");
var propertyRouter = require("./property");
var locationRouter = require("./location");
var reviewRouter = require("./review");
var complaintRouter = require("./complaint");
var paymentRouter = require("./payment");
var app = express();

app.use("/user/", userRouter);
app.use("/amenity/", amenityRouter);
app.use("/property/", propertyRouter);
app.use("/location/", locationRouter);
app.use("/review/", reviewRouter);
app.use("/complaint/", complaintRouter);
app.use("/payment/", paymentRouter);

module.exports = app;
