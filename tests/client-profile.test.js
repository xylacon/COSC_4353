const request = require("supertest");
const app = require("../app");

// describe("GET /client-profile", () => {
	
// })

describe("POST /client-profile", () => {
	it("should return 401 if name is greater than 50 characters", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
				address1: '123 Main St',
				address2: '',
				city: 'Houston',
				state: 'TX',
				zip: '77006'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("Name cannot exceed 50 characters.")
	})

	it("should return 401 if address1 is greater than 100 characters", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
				address2: '',
				city: 'Houston',
				state: 'TX',
				zip: '77006'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("Address 1 cannot exceed 100 characters.")
	})

	it("should return 401 if address2 is greater than 100 characters", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: '123 Main St',
				address2: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
				city: 'Houston',
				state: 'TX',
				zip: '77006'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("Address 2 cannot exceed 100 characters.")
	})

	it("should return 401 if city is greater than 100 characters", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: '123 Main St',
				address2: '',
				city: 'abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz abcdefghijklmnopqrstuvwxyz',
				state: 'TX',
				zip: '77006'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("City cannot exceed 100 characters.")
	})

	it("should return 401 if state is not given", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: '123 Main St',
				address2: '',
				city: 'Houston',
				state: '',
				zip: '77006'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("State must be specified.")
	})

	it("should return 401 if zip is not between 5-9 characters", async () => {
		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: '123 Main St',
				address2: '',
				city: 'Houston',
				state: 'TX',
				zip: '7700'
			})
		expect(response.status).toBe(401)
		expect(response.text).toBe("Zip must be between 5-9 numbers.")
	})

	it("should return 200 if update is successful", async () => {
		testSession = session(app);
		await testSession.post('/set-session')
        .send({ ClientInformationID: 2 })
        .expect(200);

		const response = await request(app)
			.post("/client-profile")
			.send({
				name: 'John Doe',
				address1: '123 Main St',
				address2: '',
				city: 'Houston',
				state: 'TX',
				zip: '77006'
			})
		expect(response.status).toBe(200)
		expect(response.text).toBe("Client information updated in database.")
	})
})