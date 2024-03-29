const request = require("supertest");
const app = require("../app")

describe("GET /fuelhistory", () => {
  it("Should return a response with an array of fuel quotes", async () => {
    const response = await request(app).get("/fuelhistory");

    expect(response.statusCode).toBe(200);

  });
})