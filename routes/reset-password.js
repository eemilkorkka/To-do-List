const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.get("/", (req, res) => {
    res.render("resetpassword", { errorMessage: null });
});

router.post("/", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let verificationCode = req.body.verificationCode;

    passwordResetController.resetPassword(username, password, verificationCode, (error, results) => {
        if (error) {
            console.log(error);
            res.render("resetpassword", { errorMessage: error });
        } else {
            res.redirect("/");
        }
    });
});

module.exports = router;