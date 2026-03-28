import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER!,
    pass: process.env.MAILTRAP_PASS!,
  },
});

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    const token = crypto.randomBytes(32).toString("hex");

    // store token
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const url =
      emailType === "VERIFY"
        ? `${baseUrl}/verifyemail?token=${token}`
        : `${baseUrl}/resetpassword?token=${token}`;

    // styled email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <h2 style="color: #1f2937; margin-bottom: 10px;">
            ${emailType === "VERIFY" ? "Verify Your Email" : "Reset Your Password"}
          </h2>

          <p style="color: #6b7280; font-size: 14px; margin-bottom: 25px;">
            ${
              emailType === "VERIFY"
                ? "Thanks for signing up! Please confirm your email address."
                : "We received a request to reset your password."
            }
          </p>

          <a href="${url}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
            ${
              emailType === "VERIFY"
                ? "Verify Email"
                : "Reset Password"
            }
          </a>

          <p style="margin-top: 25px; font-size: 12px; color: #9ca3af;">
            This link will expire in 1 hour.
          </p>

          <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 12px; color: #9ca3af;">
            If the button doesn’t work, copy and paste this link:
          </p>

          <p style="word-break: break-all; font-size: 12px; color: #2563eb;">
            ${url}
          </p>

        </div>
      </div>
    `;

    const mailResponse = await transport.sendMail({
      from: "YourApp <noreply@yourapp.com>",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : "Reset your password",
      html: htmlContent,
    });

    return mailResponse;
  } catch (error: any) {
    console.log("Error sending email: ", error.message);
    throw new Error(error.message);
  }
};