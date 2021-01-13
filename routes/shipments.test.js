"use strict";

const request = require("supertest");
const app = require("../app");


describe("POST /", function () {
  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  });

  test("invalid product id", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId must be greater than or equal to 1000"
        ],
        "status": 400
      }
    });
  });

  test("invalid zip, less than 5 characters", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "1",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.zip does not meet minimum length of 5"
        ],
        "status": 400
      }
    });
  });

  test("invalid zip, more than 10 characters", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-67890000000",
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.zip does not meet maximum length of 10"
        ],
        "status": 400
      }
    });
  });

  test("invalid body passed, invalid data types", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: "wrongId",
      name: 12512,
      addr: 111111,
      zip: 123456
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance.productId is not of a type(s) integer",
          "instance.name is not of a type(s) string",
          "instance.addr is not of a type(s) string",
          "instance.zip is not of a type(s) string"
        ],
        "status": 400
      }
    });
  });

  test("invalid body passed, missing required property", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      zip: "12345-1234"
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance requires property \"addr\""
        ],
        "status": 400
      }
    });
  });

  test("invalid body passed, added extra property", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-1234",
      extraProperty: "I should not be here"
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body).toEqual({
      "error": {
        "message": [
          "instance is not allowed to have the additional property \"extraProperty\""
        ],
        "status": 400
      }
    });
  });
});
