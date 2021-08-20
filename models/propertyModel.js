var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		location: { type: mongoose.Types.ObjectId, ref: "location" },
		address: { type: String, required: true },
		description: { type: String, required: true },
		rent: { type: Number, required: true },
		totalbeds: { type: Number, required: true },
		photos: { type: Array, required: true },
		amenities: { type: Array, ref: "amenity" },
		owner: { type: mongoose.Types.ObjectId, ref: "user" },
		gender: { type: String, required: true },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

PropertySchema.virtual("numreviews", {
	ref: "review",
	localField: "_id",
	foreignField: "property",
	count: true,
});

module.exports = mongoose.model("property", PropertySchema);
