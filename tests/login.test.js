// login.test.js
const session = require("supertest-session");
const request = require("supertest");
const db = require("../db");
const app = require("../app");

describe("POST /login", () => {
  beforeEach(function () {
    testSession = session(app);
  });

  afterAll(() => {
    db.end((err) => {
      if (err) {
        console.error("Error closing MySQL connection:", err);
        return;
      }
    });
  });
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
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 1323346 })
      .expect(200);
    const response = await request(app)
      .post("/login")
      .send({ email: "xyz@email.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.text).toBe("SUCCESS");
  });
});
