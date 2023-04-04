import express from "express";
import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'


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
export default router