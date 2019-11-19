const request = require('request');

describe("GIF Controller", () => {
    let server;

    beforeAll(() => {
        server = require('../index');
    });

    afterAll(() => {
        server.close();
    });

    const baseUrl = 'http://localhost:3000';

    describe("create gif", () => {
        const data = {
            title: 'Fail Image',
            userId: 1
        }

        it("Unauthenticated. Should Return 401", (done) => {
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({ userId: 1, jobRole: "employee" }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
            const queryString = require('querystring');
            const postData = queryString.stringify(data);
            request.post(
                `${baseUrl}/api/gifs`,
                {
                    data: postData, headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Bearer ${token}`,
                        'Content-Length': postData.length
                    }
                },
                (error, response, body) => {
                    expect(response.statusCode).toBe(401);
                    done();
                });
        });
    });
});
