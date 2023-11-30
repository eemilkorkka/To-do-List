const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

router.get("/", (req, res) => {
    res.render("forgotpassword", { errorMessage: null });
});

router.post("/", async (req, res) => {
    const email = req.body.email;

    passwordResetController.sendPasswordResetEmail(email, (error, result) => {
        if (error) {
            console.log(error);
            res.render("forgotpassword", { errorMessage: error });
        } else {
            // TODO: Fix a bug where the page just keeps loading and won't redirect after clicking on the send email button.
            res.redirect("/reset-password");
        }
    });
});

module.exports = router;
