const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const signupRouter = require("./routes/signup");
const homeRouter = require("./routes/home");
const loginRouter = require("./routes/login");
const connection = require("./database");
const session = require("express-session");

app.use(session({
    secret: "your_secret",
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    if (req.session.isLoggedIn) {
        res.redirect("/home");
    } else {
        res.render("login");
    }
});

app.get("/logout", (req, res) => {
    req.session.isLoggedIn = false;
    res.redirect("/");
});

app.use("/", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);

app.listen(5500, console.log("App listening on port 5500"));