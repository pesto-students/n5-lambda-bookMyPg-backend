const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the email APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Email
 * (3) Get all Emails
 * (4) Get Email by ID
 * (5) Update Email
 * (6) Disable Email
 */

describe("Email", () => {
	const userTestData = {};
	const testData = constants.EMAIL_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Email", done => {
			chai
				.request(server)
				.get("/api/users/user/" + process.env.TEST_CASE_EMAIL)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					userTestData.token = res.body.data.token;
					done();
				});
		});
	});
	/*
   * Test the /POST route
   */
	describe("/POST Email Store", () => {
		it("It should store email", done => {
			chai
				.request(server)
				.post("/api/emails")
				.send(testData)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
