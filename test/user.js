const { chai, server } = require("./testConfig");
const constants = require("./constants");

/**
 * Test cases to test all the user APIs
 * Covered Routes:
 * (1) Get Token
 * (2) Store User
 * (3) Get all Users
 * (4) Get User by ID
 * (5) Update User
 * (6) Disable User
 */

describe("User", () => {
	const userTestData = {};
	const testData = constants.USER_TEST_DATA;

	/*
   * Test the /POST route
   */
	describe("/GET Login", () => {
		it("it should do user Login for User", done => {
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
	describe("/POST User Store", () => {
		it("It should store user", done => {
			chai
				.request(server)
				.post("/api/users")
				.send(testData)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					if (err) {
						console.log(err);
					}
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
	describe("/GET All users", () => {
		it("it should GET all the users", done => {
			chai
				.request(server)
				.get("/api/users")
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
	describe("/GET/:id user", () => {
		it("it should GET the user", done => {
			chai
				.request(server)
				.get("/api/users/" + testData._id)
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
	describe("/PUT/:id user", () => {
		it("it should PUT the users", done => {
			chai
				.request(server)
				.put("/api/users/" + testData._id)
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
	describe("/DELETE/:id user", () => {
		it("it should DELETE the users", done => {
			chai
				.request(server)
				.delete("/api/users/" + testData._id)
				.set("x-auth-token", userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation Success");
					done();
				});
		});
	});
});
