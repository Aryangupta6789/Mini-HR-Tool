const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
};

/**
 * Send email utility function
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text version
 * @param {string} html - HTML version (optional)
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        // Check if email credentials are configured
        if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
            console.warn('Email credentials not configured. Skipping email send.');
            return;
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: `"HR Management System" <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            text: text, // Plain text fallback
            html: html || `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>`
        };

        // Send email asynchronously without blocking
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        // Log error but don't throw - we don't want email failures to break the API
        console.error('Error sending email:', error.message);
    }
};

module.exports = { sendEmail };
