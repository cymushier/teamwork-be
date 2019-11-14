const request = require('request');

describe("Auth Controller", () => {
    let server;

    beforeAll(() => {
        server = require('../index');
    });

    afterAll(() => {
        server.close();
    });

    const baseUrl = 'http://localhost:3000';

    describe("create-user", () => {
        const data = {
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'One',
            department: 'IT',
            jobRole: 'employee',
            address: 'Home 254',
            userId: 1,
            password: '123456789'
        }

        it("Unauthenticated. Should Return 401", (done) => {
            request.post(`${baseUrl}/api/auth/create-user`, { body: JSON.stringify(data) }, (error, response, body) => {
                expect(response.statusCode).toBe(401);
                done();
            });
        });

        it("Authorized. Should Return 400", (done) => {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ userId: 1, jobRole: "admin" }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
            request.post(
                `${baseUrl}/api/auth/create-user`, {
                body: JSON.stringify(data), method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type' : 'application/json' }
            }, (error, response, body) => {
                expect(response.statusCode).toBe(400);
                done();
            });
        });
    });
});
