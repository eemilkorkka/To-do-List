const express = require("express")
const router = express.Router()
const authenticationController = require("../controllers/authenticationController");

router.get("/", (req, res) => {
    res.render("signup", { errorMessage: null });
}); 

router.post("/", authenticationController.signup);

module.exports = router;