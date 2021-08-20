const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the payment APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Payment
 * (3) Get all Payments
 * (4) Get Payment by ID
 * (5) Update Payment
 * (6) Disable Payment
 */

describe("Payment", () => {
	const userTestData = {};
	const testData = constants.PAYMENT_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Payment", done => {
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
	describe("/POST Payment Store", () => {
		it("It should store payment", done => {
			chai
				.request(server)
				.post("/api/payments")
				.send(testData)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					testData._id = res.body.data._id;
					done();
				});
		});
	});
	/*
   * Test the /GET route
   */
	describe("/GET All payments", () => {
		it("it should GET all the payments", done => {
			chai
				.request(server)
				.get("/api/payments/tenant/" + testData.raisedby)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
