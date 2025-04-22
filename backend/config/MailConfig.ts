import nodemailer from "nodemailer"
import EnvVars from "./EnvVars";


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EnvVars.NODEMAILER_EMAIL_USER,
        pass: EnvVars.NODEMAILER_EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("Gmail Services Not Ready To Send Email")
    } else {
        console.log("Gmail Services Is Ready To Send Email")
    }
})

const sendEmail = async (to: string, subject: string, body: string) => {
    await transporter.sendMail({
        from: `"Your BookSell" ${EnvVars.NODEMAILER_EMAIL_USER}`,
        to,
        subject,
        html: body
    })
}

export const sendVerificationToEmail = async (to: string, token: string) => {
    const verificationUrl = `${EnvVars.FRONTEND_URI}/verify-email/${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #2c3e50;">Welcome to BookSell!</h2>
        <p>Thank you for registering with BookSell.</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a 
          href="${verificationUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        <p>If you did not create an account with us, you can safely ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `

    await sendEmail(to, "Please Verfiy Your Email To Access Your BookSell", html)
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
    const resetUrl = `${EnvVars.FRONTEND_URI}/reset-password/${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #2c3e50;">Reset Your Password</h2>
        <p>We received a request to reset your password for your BookSell account.</p>
        <p>You can reset your password by clicking the button below:</p>
        <a 
          href="${resetUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 5px;"
        >
          Reset Password
        </a>
        <p>If you did not request a password reset, please ignore this email. Your account is safe.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `;
    
    await sendEmail(to, "Reset Your Password - BookSell", html);
};
