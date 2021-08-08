var express = require("express");
var userRouter = require("./user");
var amenityRouter = require("./amenity");
var propertyRouter = require("./property");
var locationRouter = require("./location");
var reviewRouter = require("./review");
var complaintRouter = require("./complaint");
var paymentRouter = require("./payment");
var emailRouter = require("./email");
var app = express();

app.use("/users/", userRouter);
app.use("/amenity/", amenityRouter);
app.use("/property/", propertyRouter);
app.use("/location/", locationRouter);
app.use("/review/", reviewRouter);
app.use("/complaint/", complaintRouter);
app.use("/payment/", paymentRouter);
app.use("/email/", emailRouter);

module.exports = app;
