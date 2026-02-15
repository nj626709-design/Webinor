const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Email transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact API
app.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await transporter.sendMail({
            from: `"Webinor Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `New Client Inquiry from ${name}`,
            html: `
                <h3>New Inquiry Received</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/> ${message}</p>
            `
        });

        res.status(200).json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Something went wrong." });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
