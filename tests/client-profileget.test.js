const session = require("supertest-session");
const app = require("../app");

describe("GET /client-profile", () => {
  beforeEach(function () {
    testSession = session(app);
  });

  it("Should return a response code of 404 for profile not found", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 10000000000 })
      .expect(200);

    // Now make the GET request
    const response = await testSession.get("/client-profile");

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Client profile not found");
  }, 30000);
  it("Should return a response code of 200 for successful data retrieval", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 2997252 })
      .expect(200);

    // Now make the GET request
    const response = await testSession.get("/client-profile");

    expect(response.statusCode).toBe(200);
  }, 30000);
});
