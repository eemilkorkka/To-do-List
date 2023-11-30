const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.get("/", (req, res) => {
    res.render("resetpassword", { errorMessage: null });
});

router.post("/", passwordResetController.resetPassword);

module.exports = router;