const session = require("supertest-session");
const app = require("../app");

describe("GET /fuelhistory", () => {
  beforeEach(function () {
    testSession = session(app);
  });

  it("Should return a response used to prepopulate fields in fuel quote", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 6575978 })
      .expect(200);

    // Now make the GET request
    const response = await testSession.get("/fuelhistory");

    expect(response.statusCode).toBe(200);
    // Add more assertions here based on the expected response body
  }, 30000);
});
