const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the review APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Review
 * (3) Get all Reviews
 * (4) Get Review by Property ID
 *
 */

describe("Review", () => {
	const userTestData = {};
	const testData = constants.REVIEW_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Review", done => {
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
	describe("/POST Review Store", () => {
		it("It should store review", done => {
			chai
				.request(server)
				.post("/api/reviews")
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
	describe("/GET All reviews", () => {
		it("it should GET all the reviews", done => {
			chai
				.request(server)
				.get("/api/reviews")
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
	/*
   * Test the /GET/review/:id route
   */
	describe("/GET/property:id review", () => {
		it("it should GET the reviews for property", done => {
			chai
				.request(server)
				.get("/api/reviews/property/" + testData.property)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
