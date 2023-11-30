const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const signupRouter = require("./routes/signup");
const homeRouter = require("./routes/home");
const loginRouter = require("./routes/login");
const forgotPasswordRouter = require("./routes/forgot-password");
const resetPasswordRouter = require("./routes/reset-password");
const session = require("express-session");

app.use(session({
    secret: "fkAKGHarhgpHFIMVncgs823GJhs6fk0jgpXcv532",
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
        res.render("login", { errorMessage: null });
    }
});

app.get("/logout", (req, res) => {
    req.session.isLoggedIn = false;
    req.session.username = null;
    res.redirect("/");
});

app.use("/", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);
app.use("/forgot-password", forgotPasswordRouter);
app.use("/reset-password", resetPasswordRouter);

app.listen(3000, console.log("App listening on port 3000"));