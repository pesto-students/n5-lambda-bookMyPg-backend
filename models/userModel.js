var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ['admin', 'user', 'owner'],
      required: true,
      default: 'user',
    },
    property: { type: mongoose.Types.ObjectId, ref: 'property' },
    isactive: { type: Boolean, required: true, default: 1 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('user', UserSchema);
