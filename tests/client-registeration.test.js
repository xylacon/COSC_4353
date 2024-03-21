// client-registeration.test.js
const request = require("supertest");
const app = require("../app");

describe("POST /client-registration", () => {
  it("should return 401 if password length is less than 8 characters", async () => {
    const response = await request(app)
      .post("/client-registration")
      .send({ email: "test@example.com", password: "pass" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Password must be at least 8 characters long");
  });

  it("should return 401 if user already exists", async () => {
    const response = await request(app)
      .post("/client-registration")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.text).toBe(
      "FAILURE, account already exists. Please log in instead"
    );
  });

  it("should return 200 if registeration is successful", async () => {
    const response = await request(app)
      .post("/client-registration")
      .send({ email: "newuser@example.com", password: "newuser1234" });

    expect(response.status).toBe(200);
    expect(response.text).toBe(
      "USER WILL BE ADDED TO THE DATABASE, REGISTERATION SUCCESS"
    );
  });
});
