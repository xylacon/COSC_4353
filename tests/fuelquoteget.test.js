const session = require("supertest-session");
const app = require("../app");

describe("GET /fuelquote", () => {
  let testSession;

  beforeEach(function () {
    testSession = session(app);
  });

  it("Should return user information with status 200", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 6575978 })
      .expect(200);

    // Now make the GET request
    const response = await testSession.get("/fuelquote");

    // Check response
    expect(response.statusCode).toBe(200);
  });

  it("Should return 400 error if user is not found", async () => {
    // Set an invalid ClientInformationID to simulate user not found
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: -1 }) // Assuming this ID does not exist
      .expect(200);

    // Now make the GET request
    const response = await testSession.get("/fuelquote");

    // Check response
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("no quotes");
  });
});
