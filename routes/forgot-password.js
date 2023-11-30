const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.get("/", (req, res) => {
    res.render("forgotpassword", { errorMessage: null });
});

router.post("/", passwordResetController.sendPasswordResetEmail);

module.exports = router;
