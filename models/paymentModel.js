var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema(
  {
    charge_id: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Payment', PaymentSchema);
