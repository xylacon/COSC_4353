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

  it("should return 500 if error checking userexistence", async () => {
    const response = await request(app)
      .post("/client-registration")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "User with this email already exists, Please login instead!"
    );
  });

  it("should return 401 if user already exists", async () => {
    const response = await request(app)
      .post("/client-registration")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.text).toBe(
      "User with this email already exists, Please login instead!"
    );
  });
});
