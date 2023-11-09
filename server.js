const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))

app.set("view engine", "ejs")

//let isLoggedIn = false;

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

const todoRouter = require("./routes/Todo")

app.use("/", todoRouter)

//module.exports.isLoggedIn = isLoggedIn

app.listen(5500, console.log("App listening on port 5500"))