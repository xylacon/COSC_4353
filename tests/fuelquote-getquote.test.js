const session = require("supertest-session");
const app = require("../app");

describe("POST /fuelquote/getquote", () => {
  let testSession;

  beforeEach(function () {
    testSession = session(app);
  });

  it("Should calculate the correct suggested price based on factors", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 6575978 })
      .expect(200);

    // Now make the POST request
    const response = await testSession.post("/fuelquote/getquote").send({
      gallonsRequested: 500, // Assume gallons requested is numeric
      state: "TX",
    });

    // Calculate expected suggested price
    const pricePerGallon = 1.5;
    const locationFactor = 0.02; // Assuming state is TX
    const historyFactor = 0; // Assuming numQuotes < 1
    const requestedFactor = 0.03; // Assuming gallonsRequested <= 1000
    const profitFactor = 0.1;
    const expectedMargin =
      pricePerGallon *
      (locationFactor - historyFactor + requestedFactor + profitFactor);
    const expectedSuggestedPrice = pricePerGallon + expectedMargin;

    // Check response
    expect(response.statusCode).toBe(200);
    expect(response.body.clientSuggestedPrice).toBe(expectedSuggestedPrice);
  });

  it("Should calculate the correct total price based on suggested price and gallons requested", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 6575978 })
      .expect(200);

    // Now make the POST request
    const response = await testSession.post("/fuelquote/getquote").send({
      gallonsRequested: 750, // Assume gallons requested is numeric
      state: "TX",
    });

    // Calculate expected total price
    const pricePerGallon = 1.5;
    const locationFactor = 0.02; // Assuming state is TX
    const historyFactor = 0; // Assuming numQuotes < 1
    const requestedFactor = 0.03; // Assuming gallonsRequested > 1000
    const profitFactor = 0.1;
    const expectedMargin =
      pricePerGallon *
      (locationFactor - historyFactor + requestedFactor + profitFactor);
    const expectedSuggestedPrice = pricePerGallon + expectedMargin;
    const expectedTotalPrice = (750 * expectedSuggestedPrice).toFixed(2);

    // Check response
    expect(response.statusCode).toBe(200);
    expect(response.body.clientTotalPrice).toBe(expectedTotalPrice);
  });

  it("Should return 500 error if there is an error fetching quote data", async () => {
    // Set the session variable
    await testSession
      .post("/set-session")
      .send({ ClientInformationID: 6575978 })
      .expect(200);

    // Mock an error scenario by passing invalid data
    const response = await testSession.post("/fuelquote/getquote").send({
      gallonsRequested: "invalid", // Invalid gallonsRequested
      state: "TX",
    });

    // Check response
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("error gallons requested is not a number");
  });
});
