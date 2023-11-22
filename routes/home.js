const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        res.render("home");
    } else {
        res.redirect("/");
    }
});

module.exports = router