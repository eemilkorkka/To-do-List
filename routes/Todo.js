const express = require("express")
//const { isLoggedIn } = require("../server")
const router = express.Router()

router.get("/", (req, res) => {
    /*if (isLoggedIn) {
        res.render("todo")
    } else {
        res.redirect("/login")
    }*/
    res.redirect("/login")
})

module.exports = router