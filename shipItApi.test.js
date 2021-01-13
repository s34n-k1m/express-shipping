"use strict";

const {
  shipProduct,
} = require("./shipItApi");
const axios = require("axios");
const AxiosMockAdapter = require(
  "axios-mock-adapter");
const axiosMock = new AxiosMockAdapter(axios);

test("shipProduct", async function () {
  axiosMock.onPost("http://localhost:3001/ship")
    .reply(200, {
      "receipt": {
        "itemId": 123,
        "name": "name",
        "addr": "addr",
        "zip": "zip",
        "shipId": 10534
      }
    });
  const shipId = await shipProduct({
    productId: 1000,
    name: "Test Tester",
    addr: "100 Test St",
    zip: "12345-6789",
  });

  expect(shipId).toEqual(10534);
});
