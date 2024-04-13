const session = require("supertest-session");
const app = require("../app")

describe("POST /fuelquote", () => {
  beforeEach(function () {
    testSession = session(app);
  });

  it("Should return 400 if gallons request is not numeric", async () => {
    const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "fifty", deliveryAddress: '1900 Coco Drive. Houston, TX 77882', deliveryDate: '2022-04-10', suggestedPrice: 3.14});

    expect(response.status).toBe(400);
    expect(response.text).toBe("error gallons requested is not a number");
  });

  it("Should return 400 if there is no delivery address or its invalid", async () => {
    const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "50", deliveryAddress: "", deliveryDate: '2022-04-10', suggestedPrice: 3.14});

    expect(response.status).toBe(400);
    expect(response.text).toBe("delivery address is empty or invalid");
  });

  it("Should return 400 if there is no delivery date or its invalid", async () => {
    const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "50", deliveryAddress: '1900 Coco Drive. Houston, TX 77882', deliveryDate: "", suggestedPrice: 3.14});

    expect(response.status).toBe(400);
    expect(response.text).toBe("delivery date is empty or invalid");
  });

  if("Should return 400 if the delivery date is not a valid date in yyyy-mm-dd format", async () => {
    const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "50", deliveryAddress: '1900 Coco Drive. Houston, TX 77882', deliveryDate: "!!-asbb-s", suggestedPrice: 3.14});

    expect(response.status).toBe(400);
    expect(response.text).toBe('invalid date format, date is not in yyyy-mm-dd form');
  })

  it("Should return 400 if suggested price is not numeric", async () => {
    const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "50", deliveryAddress: '1900 Coco Drive. Houston, TX 77882', deliveryDate: '2022-04-10', suggestedPrice: "3 dollars and 14 cents"});

    expect(response.status).toBe(400);
    expect(response.text).toBe("error suggested price is not a number");
  });

  it("Should return the total price along with a 200 status code", async () => {
      // Set the session variable
      await testSession.post('/set-session')
        .send({ ClientInformationID: 2 })
        .expect(200);

      // Now make the GET request
      const response = await testSession
      .post("/fuelquote")
      .send({gallonsRequested: "50", deliveryAddress: '1900 Coco Drive. Houston, TX 77882', deliveryDate: '2022-04-10', suggestedPrice: 3.14});;
      

      expect(response.statusCode).toBe(200);
  }, 30000);
});