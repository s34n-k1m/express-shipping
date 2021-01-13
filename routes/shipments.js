"use strict";

const express = require("express");
const router = new express.Router();

const { shipProduct } = require("../shipItApi");

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/order.json");
const {BadRequestError} = require("../expressError");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {

  try {
    const result = jsonschema.validate(req.body, orderSchema);
    if (!result.valid) {
      // pass validation errors to error handler
      //  (the "stack" key is generally the most useful)
      let errs = result.errors.map(err => err.stack);
      throw new BadRequestError(errs);
    }
    
    const { productId, name, addr, zip } = req.body;
    const shipId = await shipProduct({ productId, name, addr, zip });
    console.log("shipId:", shipId);
    return res.json({ shipped: shipId });

  } catch (err) {
    return next(err);
  }
  
});


module.exports = router;