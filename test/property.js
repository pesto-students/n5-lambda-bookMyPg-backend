const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the property APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Property
 * (3) Get all Properties
 * (4) Get Property by ID
 * (5) Update Property
 * (6) Disable Property
 */

describe("Property", () => {
	const userTestData = {};
	const testData = constants.PROPERTY_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Property", done => {
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
	describe("/POST Property Store", () => {
		it("It should store property", done => {
			chai
				.request(server)
				.post("/api/properties")
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
	describe("/GET All properties", () => {
		it("it should GET all the properties", done => {
			chai
				.request(server)
				.get("/api/properties")
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});

	/*
   * Test the /GET/:id route
   */
	describe("/GET/:id property", () => {
		it("it should GET the property", done => {
			chai
				.request(server)
				.get("/api/properties/" + testData._id)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
	/*
   * Test the /PUT/:id route
   */
	describe("/PUT/:id property", () => {
		it("it should PUT the properties", done => {
			chai
				.request(server)
				.put("/api/properties/" + testData._id)
				.send(testData)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});

	/*
   * Test the /DELETE/:id route
   */
	describe("/DELETE/:id property", () => {
		it("it should DELETE the properties", done => {
			chai
				.request(server)
				.delete("/api/properties/" + testData._id)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
