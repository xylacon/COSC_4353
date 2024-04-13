const session = require("supertest-session");
const app = require("../app")


describe("GET /fuelhistory", () => {
  beforeEach(function () {
    testSession = session(app);
  });

  it("Should return a response with an array of fuel quotes", async () => {
      // Set the session variable
      await testSession.post('/set-session')
        .send({ ClientInformationID: 2 })
        .expect(200);

      // Now make the GET request
      const response = await testSession.get("/fuelhistory");

      expect(response.statusCode).toBe(200);
      // Add more assertions here based on the expected response body
  }, 30000);
});