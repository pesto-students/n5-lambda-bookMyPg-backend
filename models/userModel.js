var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: Number },
		role: {
			type: String,
			enum: ["admin", "user", "owner"],
			required: true,
			default: "user",
		},
		image: { type: String, required: true },
		property: { type: mongoose.Types.ObjectId, ref: "property" },
		onboardedAt: { type: Date },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("user", UserSchema);
