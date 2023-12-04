const { google } = require('googleapis');
const app = require('../../server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const supertest = require('supertest');

const {getData, setData} = require('./utils')

const user = {
  email: 'testing0123@gmail.com',
  name: 'Testing User',
};

module.exports = () => describe("Testing Google login POST through route /api/user/google_login", () => {
  it('Sending short google token', (done) => {
    const token = 'invalid_google_token';

    supertest(app)
      .post('/api/user/google_login')
      .send({ token: token })
      .expect(500)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(data.message).toBe("Wrong number of segments in token: invalid_google_token");

        done();
      })
  });

  it('Sending invalid token', (done) => {
    const errorMessage = "No pem found for envelope: {\"alg\":\"RS256\",\"kid\":\"5962e7a059c7f5c0c0d56cbad51fe64ceeca67c6\",\"typ\":\"JWT\"}";

    const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5NjJlN2EwNTljN2Y1YzBjMGQ1NmNiYWQ1MWZlNjRjZWVjYTY3YzYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2NzcwODc0NDMsImF1ZCI6Ijg2Mjk2ODU3MzMwMi03bTZhYzYxcTE0NGFvcWMxbzU5cG8yZGY2aHE1MGhmMC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMzg5MzgxNjY4MzcxNTMwNzgwMCIsImVtYWlsIjoibW9oYW1lZGFsaTAwOTQ5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhenAiOiI4NjI5Njg1NzMzMDItN202YWM2MXExNDRhb3FjMW81OXBvMmRmNmhxNTBoZjAuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJuYW1lIjoiTW9oYW1lZCBBbGkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WWljM2dyLTlSWHJTOEsxZ05fX1VCVTN1NmFKZVU0bXJRNklweS09czk2LWMiLCJnaXZlbl9uYW1lIjoiTW9oYW1lZCBBbGkiLCJpYXQiOjE2NzcwODc3NDMsImV4cCI6MTY3NzA5MTM0MywianRpIjoiMDVkNGNhMzE0MmExMDkwZDQyOGI3MmUzYzhmMzJkN2VlZGM1YmU2ZSJ9.EU9-xKVDtCHDTtZMu_b7xLP15RqUNUZZpP2L8CeVBZUCqSU7YBV7YPIagYHF0PVdOTKGLb6USYQThfPnVnEkoxmLkhDtRlfX3_pVVfw1L-C9BX21yDsOjcfEzw_hHe-BQJxtzwfNtgrUNQQH91irQw6YVzSycKlp3o3gtIJU-PTP7gvDowwr8pJX5xGk0nbx8ke__PljuCHHEBSEeWN-R9gt9AtqGu-MLElAsmegD-7IJUtwcpxI3LwI_6xI_b92o_tR0FjKPyZDOWxiPMNNnicaUdy0aIUBkmdBGo5yiOkhrLHbZNus3c3JTexBOxwVgId1wttD6Mkl-lK_yyT6Ww";

    supertest(app)
      .post('/api/user/google_login')
      .send({ token: token })
      .expect(500)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(data.message).toBe(errorMessage);

        done();
      })
  });

  it('Sending unverified email google account', (done) => {
    const payload = {
      email_verified: false,
      picture: 'https://example.com/picture.jpg',
      ...user
    };

    google.auth.OAuth2.prototype.verifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => payload,
    });

    // Make a request to your googleLogin endpoint with a valid token
    const validToken = 'valid_google_token';
    supertest(app)
      .post('/api/user/google_login')
      .send({ token: validToken })
      .expect(400)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(data.message).toBe("This email is not verify, verify it and try again later.");

        done();
      })
  });

  it('Sending valid google account', (done) => {
    const successPayload = {
      email_verified: true,
      picture: 'https://example.com/picture.jpg',
      ...user
    };

    google.auth.OAuth2.prototype.verifyIdToken = jest.fn().mockResolvedValue({
      getPayload: () => successPayload,
    });

    // Make a request to your googleLogin endpoint with a valid token
    const validToken = 'valid_google_token';
    supertest(app)
      .post('/api/user/google_login')
      .send({ token: validToken })
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        console.log(data);
        expect(data.message).toBe('Successful Login');
        expect(data.access_token).toBeDefined();

        if (data.access_token.length < 500) {
          const tokenData = jwt.verify(data.access_token, process.env.ACCESS_TOKEN_SECRET);
          expect(mongoose.Types.ObjectId.isValid(tokenData.id)).toBe(true);
        } else {
          const tokenData = jwt.decode(data.access_token);
          expect(mongoose.Types.ObjectId.isValid(tokenData.sub)).toBe(true);
        }

        setData("tokenAfterGoogleLogin", data.access_token);

        done();
      })
  });

  it('Get user info for google login', (done) => {
    const token = getData('tokenAfterGoogleLogin');
    supertest(app)
      .get('/api/user/user_info')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) throw err;

        const data = res.body;
        expect(mongoose.Types.ObjectId.isValid(data._id)).toBe(true);
        expect(data.name).toBe(user.name);
        expect(data.email).toBe(user.email);

        done();
      })
  })
})
