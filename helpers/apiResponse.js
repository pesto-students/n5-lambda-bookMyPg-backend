exports.successResponse = function (res, msg) {
  var data = {
    status: 1,
    message: msg,
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function (res, data, total_count) {
  var resData = {
    status: 1,
    message: 'Operation Success',
    data: data,
    total_count: total_count,
  };
  return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
  var data = {
    status: 0,
    message: msg,
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = function (res) {
  var data = {
    status: 0,
    message: 'No Record Found',
  };
  return res.status(404).json(data);
};

exports.validationErrorWithData = function (res, data) {
  var resData = {
    status: 0,
    message: 'Invalid Input',
    data: data,
  };
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  var data = {
    status: 0,
    message: msg,
  };
  return res.status(401).json(data);
};
