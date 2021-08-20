const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the complaint APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store Complaint
 * (3) Get all Complaints
 * (4) Get Complaint by ID
 * (5) Get Complaint by Owner
 * (6) Update Complaint
 */

describe("Complaint", () => {
	const userTestData = {};
	const testData = constants.COMPLAINT_TEST_DATA;

	/*
   * Test the /GET Auth-token route
   */
	describe("/GET Auth-token", () => {
		it("it should do user Login for Complaint", done => {
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
	describe("/POST Complaint Store", () => {
		it("It should store complaint", done => {
			chai
				.request(server)
				.post("/api/complaints")
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
	describe("/GET All complaints", () => {
		it("it should GET all the complaints", done => {
			chai
				.request(server)
				.get("/api/complaints")
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
	describe("/GET/:id complaint", () => {
		it("it should GET the complaint", done => {
			chai
				.request(server)
				.get("/api/complaints/" + testData._id)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
	/*
   * Test the /GET/owner/:id route
   */
	describe("/GET/:id complaint", () => {
		it("it should GET the complaint", done => {
			chai
				.request(server)
				.get("/api/complaints/owner/" + testData.owner)
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
	describe("/PUT/:id complaint", () => {
		it("it should PUT the complaints", done => {
			chai
				.request(server)
				.put("/api/complaints/" + testData._id)
				.send({ status: "Resolved" })
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
