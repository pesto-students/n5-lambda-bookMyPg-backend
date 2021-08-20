const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the amenity APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Amenity
 * (3) Get all Amenities
 * (4) Get Amenity by ID
 * (5) Update Amenity
 * (6) Disable Amenity
 */

describe("Amenity", () => {
	const userTestData = {};
	const testData = constants.AMENITY_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Amenity", done => {
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
	describe("/POST Amenity Store", () => {
		it("It should store amenity", done => {
			chai
				.request(server)
				.post("/api/amenities")
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
	describe("/GET All amenities", () => {
		it("it should GET all the amenities", done => {
			chai
				.request(server)
				.get("/api/amenities")
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
	describe("/GET/:id amenity", () => {
		it("it should GET the amenity", done => {
			chai
				.request(server)
				.get("/api/amenities/" + testData._id)
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
	describe("/PUT/:id amenity", () => {
		it("it should PUT the amenities", done => {
			chai
				.request(server)
				.put("/api/amenities/" + testData._id)
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
	describe("/DELETE/:id amenity", () => {
		it("it should DELETE the amenities", done => {
			chai
				.request(server)
				.delete("/api/amenities/" + testData._id)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
