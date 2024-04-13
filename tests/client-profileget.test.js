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

// it("should return 404 if client profile does not exist", async () => {
//     await testSession
//       .post("/set-session")
//       .send({ ClientInformationID: 1000000000000 })
//       .expect(200);

//     const response = await testSession.post("/client-profile").send({
//       name: "John Doe",
//       address1: "123 Main St",
//       address2: "",
//       city: "Houston",
//       state: "TX",
//       zip: "77006",
//     });
//     expect(response.status).toBe(404);
//     expect(response.text).toBe("Client profile not found");
//   });
