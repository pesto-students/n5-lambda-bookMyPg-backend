var mongoose = require("mongoose");

var ComplaintSchema = new mongoose.Schema(
	{
		status: { type: String, required: true, default: "Pending" },
		description: { type: String, required: true },
		raisedby: { type: mongoose.Types.ObjectId, ref: "user" },
		property: { type: mongoose.Types.ObjectId, ref: "property" },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("complaint", ComplaintSchema);
