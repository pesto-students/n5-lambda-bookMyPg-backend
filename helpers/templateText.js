exports.visitTemplate = function (data) {
	let text = "";
	var emailReplacements = {
		subject: "Greetings! New Visit Scheduled",
		notification_text: text.concat(
			"New visit is scheduled for <i>",
			data.property_name,
			"</i> on <i>",
			data.date,
			"</i>. Kindly note, the property can be visited at any time between <i>",
			data.fromtime,
			" to ",
			data.totime,
			"</i>.<br />Please visit your <i><a href=",
			`${process.env.S3_DEPLOYMENT_LINK_DEV}`,
			" style=\"color: #ffffff\">BookMyPG</a></i> account for more details",
		),
	};
	return emailReplacements;
};

exports.userratingTemplate = function (data) {
	let text = "";
	var emailReplacements = {
		subject: "Greetings! Your Profile is Rated",
		notification_text: text.concat(
			data.owner,
			" - Owner of <i>",
			data.property_name,
			"</i> has rated your profile with <i>",
			data.rating,
			" stars </i> on <i> ",
			data.date,
			"</i>.<br />Please visit your <i><a href=",
			`${process.env.S3_DEPLOYMENT_LINK_DEV}`,
			" style=\"color: #ffffff\">BookMyPG</a></i> account for more details",
		),
	};
	return emailReplacements;
};

exports.propertyratingTemplate = function (data) {
	let text = "";
	var emailReplacements = {
		subject: "Greetings! Your Property is Rated",
		notification_text: text.concat(
			"Tenant <i>",
			data.user,
			"</i> from property <i>",
			data.property_name,
			"</i> has rated your property with <i>",
			data.rating,
			" stars ",
			data.description ? " and " + data.description + " " : "",
			"</i> on <i>",
			data.date,
			"</i>.<br />Please visit your <i><a href=",
			`${process.env.S3_DEPLOYMENT_LINK_DEV}`,
			" style=\"color: #ffffff\">BookMyPG</a></i> account for more details",
		),
	};
	return emailReplacements;
};

exports.queryTemplate = function (data) {
	let text = "";
	var emailReplacements = {
		subject: "Greetings! New Query Received",
		notification_text: text.concat(
			"New Query is received: ",
			data.description,
			" from <i>",
			data.name,
			"</i>, email: <i>",
			data.email,
			"</i> and contact no: ",
			data.contactno,
			" on <i>",
			data.date,
			"</i>.<br />Please visit your <i><a href=",
			`${process.env.S3_DEPLOYMENT_LINK_DEV}`,
			" style=\"color: #ffffff\">BookMyPG</a></i> account for more details",
		),
	};
	return emailReplacements;
};

exports.paymentTemplate = function (data) {
	let text = "";
	var emailReplacements = {
		subject: "Greetings! New Payment Received",
		notification_text: text.concat(
			"New Payment of Rs.",
			data.amount,
			" is received from <i>",
			data.name,
			"</i>, for property <i>",
			data.property_name,
			"</i> on <i>",
			data.date,
			"</i>.<br />Please visit your <i><a href=",
			`${process.env.S3_DEPLOYMENT_LINK_DEV}`,
			" style=\"color: #ffffff\">BookMyPG</a></i> account for more details",
		),
	};
	return emailReplacements;
};
