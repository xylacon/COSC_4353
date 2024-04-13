const session = require("supertest-session");
const request = require("supertest");
const db = require("../db");
const app = require("../app");

// describe("GET /client-profile", () => {
	
// })

describe("POST /client-profile", () => {
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

	it("should return 401 if name is empty", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Name cannot be empty.");
  });
  it("should return 401 if name is greater than 50 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Name cannot exceed 50 characters.");
  });

	it("should return 401 if address1 is empty", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Address 1 cannot be empty.");
  });
  it("should return 401 if address1 is greater than 100 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1:
        "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Address 1 cannot exceed 100 characters.");
  });

  it("should return 401 if address2 is greater than 100 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2:
        "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Address 2 cannot exceed 100 characters.");
  });

	it("should return 401 if city is empty", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("City cannot be empty.");
  });
  it("should return 401 if city is greater than 100 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("City cannot exceed 100 characters.");
  });

  it("should return 401 if state is not given", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("State must be specified.");
  });
	it("should return 401 if state not two letters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "Texas",
      zip: "77006",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid state format.");
  });

	it("should return 401 if zip is empty", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Zip cannot be empty.");
  });
	it("should return 401 if zip is not at least 5 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "7700",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Zip must be at least 5 characters.");
  });
  it("should return 401 if zip is more than 9 characters", async () => {
    const response = await request(app).post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "1234567890",
    });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Zip cannot exceed 9 characters.");
  });

  it("should return 200 if update is successful", async () => {
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 2 })
      .expect(200);

    const response = await testSession.post("/client-profile").send({
      name: "John Doe",
      address1: "123 Main St",
      address2: "",
      city: "Houston",
      state: "TX",
      zip: "77006",
    });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Client information updated in database.");
  });
});
