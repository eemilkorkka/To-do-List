const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require("nodemailer");
const env = require("dotenv").config();
const connection = require("../database");
const crypto = require("crypto"); 
const signup = require("./signup");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

let resetCode = 0;

router.get("/", (req, res) => {
    res.render("forgotpassword", { errorMessage: null });
});

router.post("/", (req, res) => {
    let email = req.body.email;
    resetCode = Math.floor((Math.random() * 999999) + 100000);
    const expirationDate = Date.now() + 3600000;
    
   signup.emailExists(email, async (exists) => {
        if (exists) {
            var message = {
                from: "eemil.korkka@koudata.fi",
                to: email,
                subject: "Reset Password Code",
                text: "You can reset your password for the Todo List App using the following reset code: " + resetCode,
            }
            
            // Generate a password reset code and an expiration value for the user
            await connection.query("UPDATE Users SET ResetCodeExpiry = ?, ResetCode = ? WHERE Email = ?", [expirationDate, resetCode, email]);
        
            transporter.sendMail(message, (error, res) => {
                if (error) {
                    console.log(error);
                    res.render("forgotpassword", { errorMessage: "Failed to send password reset email" });
                } else {
                    // TODO: Fix a bug where the page just keeps loading and won't redirect after clicking on the send email button.
                    res.redirect("/reset-password");
                }
            });
        } else {
            res.render("forgotpassword", { errorMessage: "No account registered with the email you provided" });
        }
    });
});

module.exports = router;