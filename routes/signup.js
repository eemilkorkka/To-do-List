const express = require("express")
const router = express.Router()
const authenticationController = require("../controllers/authenticationController");

router.get("/", (req, res) => {
    res.render("signup", { errorMessage: null });
}); 

router.post("/", (req, res) => {
    try {
        let name = req.body.name;
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

        authenticationController.emailExists(email, async (exists) => {
            if (exists) {
                res.render("signup", { errorMessage: "An account with the email you entered already exists. Use a different email." });
            } else {
                authenticationController.signup(name, email, username, password, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.redirect("/");
                    }
                });
            }
        });

    } catch {
        res.redirect("/signup");
    }
});

module.exports = router;