const nodemailer = require("nodemailer");
const connection = require("../database");
const bcrypt = require("bcryptjs");
const env = require("dotenv").config();
const authenticationContoller = require("./authenticationController");

/* For this to work, you need to have a brevo account that is used to send password reset emails in this project */

// See https://www.programonaut.com/how-to-send-an-email-in-node-js-using-an-smtp-step-by-step/ for more information

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendPasswordResetEmail = async (req, res) => {
    const email = req.body.email;

    // Reset code will expire within an hour
    const expirationDate = Date.now() + 3600000;
    const resetCode = Math.floor((Math.random() * 999999) + 100000);

    authenticationContoller.emailExists(email, async (exists) => {
        if (exists) {
            const message = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Password Code",
                text: "You can reset your password for the Todo List App using the following reset code: " + resetCode,
            };

            // Insert a password reset code and an expiration date value into the database
            await connection.query("UPDATE Users SET ResetCodeExpiry = ?, ResetCode = ? WHERE Email = ?", [expirationDate, resetCode, email]);

            transporter.sendMail(message, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("An error occurred whilst trying to send email.");
                } else {
                    
                    // Email sent successfully
                    res.redirect("/reset-password");
                }
            });
        } else {
            res.render("forgotpassword", { errorMessage: "No account registered with the email you provided" });
        }
    });
}

const resetPassword = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const verificationCode = req.body.verificationCode;

    connection.query("SELECT ResetCode, ResetCodeExpiry FROM Users WHERE Username = ?", [username], async (error, results) => {
        if (error) {
            res.status(500).send("An error occurred whilst executing SQL query.");
        } else {
            if (results.length > 0) {
                const resetCode = results[0].ResetCode;
                const resetCodeExpiry = results[0].ResetCodeExpiry;

                if (resetCodeExpiry < Date.now()) {
                    res.render("resetpassword", { errorMessage: "Password reset code expired" });
                } else {
                    if (verificationCode == resetCode) {
                        const salt = await bcrypt.genSalt(10);
                        const secretPass = await bcrypt.hash(password, salt);
                        
                        connection.query("UPDATE Users SET Password = ? WHERE Username = ?", [secretPass, username]);

                        // Password reset was successful
                        res.redirect("/");
                    } else {
                        res.render("resetpassword", { errorMessage: "Invalid verification code "});
                    }
                }
            }
        }
    });
}

module.exports = { sendPasswordResetEmail, resetPassword };
