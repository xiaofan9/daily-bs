const request = require("supertest");
const app = require("../app");
const assert = require("assert");

request(app.listen())
  .get("/test")
  .expect("Content-Type", /json/)
  .expect("Content-Length", "15")
  .expect(200)
  .end(function(err, res) {
    assert.strict.equal(2, 2);
    if (err) throw err;
  });
