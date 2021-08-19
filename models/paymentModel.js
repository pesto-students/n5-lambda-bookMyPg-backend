var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema(
  {
    charge_id: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    raisedby: { type: mongoose.Types.ObjectId, ref: 'user' },
    property: { type: mongoose.Types.ObjectId, ref: 'property' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Payment', PaymentSchema);
