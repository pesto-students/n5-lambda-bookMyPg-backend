const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the location APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Location
 * (3) Get all Locations
 * (4) Get Location by ID
 * (5) Update Location
 * (6) Disable Location
 */

describe("Location", () => {
	const userTestData = {};
	const testData = constants.LOCATION_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Location", done => {
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
	describe("/POST Location Store", () => {
		it("It should store location", done => {
			chai
				.request(server)
				.post("/api/locations")
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
	describe("/GET All locations", () => {
		it("it should GET all the locations", done => {
			chai
				.request(server)
				.get("/api/locations")
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
