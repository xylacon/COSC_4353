// login.test.js
const request = require("supertest");
const app = require("../app");

describe("POST /login", () => {
  it("should return 401 if password length is less than 8 characters", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "pass" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Password must be at least 8 characters long");
  });

  it("should return 401 if user not found", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "nonexistent@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("User does not exist!");
  });

  it("should return 401 if incorrect password", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Incorrect password, Please try again!");
  });

  it("should return 200 if login is successful", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("SUCCESS");
  });
});
