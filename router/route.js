import express from "express";
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import { client } from '../index.js';
import { genhashpassword } from "./login.router.js";

const router = express.Router()
dotenv.config()

router.post("/dashboard/:id", function (request, response) {
    const { email, remainder, loanType } = request.body
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Hey there!  ${remainder} only to payment for ${loanType}`,
            html: `<h2>hello</h2>
            <p>I hope that you are well.
            I just want to let you know that ${remainder} only left 
            to complete your payment for your ${loanType}.
             </p>
            <p>Thank you</p>`

        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(info.response)
                response.status(201).json({ status: 201, info })
            }
        })
    }
    catch (error) {
        response.status(401).json({ status: 401, error })
    }
})

router.post("/forget-password", async (req, res) => {
    const { email } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Reset your password",
            text: "Click the link to reset your password: http://localhost:4004/reset-password",
        });
        res.send("An email has been sent to your email address with instructions to reset your password.");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post("/reset-password", async (req, res) => {
    const { email, password } = req.body;
    const hashpassword = await genhashpassword(password)
    const user = await client
        .db("workspace")
        .collection("signup")
        .updateOne({
            username: email
        }, { $set: { password: hashpassword } })

    //users.find((user) => user.email === email);
    if (!user) {
        res.status(404).send("User not found");
        return;
    }

    user.password = password;

    res.send("Password reset successfully");
});
export default router