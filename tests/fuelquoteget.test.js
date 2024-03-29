const request = require("supertest");
const app = require("../app")

describe("GET /fuelquote", () => {
  it("Should return a response used to prepopulate fields in fuel quote", async () => {
    const response = await request(app).get("/fuelquote");

    expect(response.statusCode).toBe(200);
  });
})