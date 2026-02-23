const express = require("express");
const router = express.Router();

const { homePage } = require("../controllers/userControllers");

router.get("/", homePage);

module.exports = router;