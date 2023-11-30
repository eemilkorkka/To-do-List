const express = require("express")
const router = express.Router()
const authenticationController = require("../controllers/authenticationController");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", authenticationController.login);

module.exports = router