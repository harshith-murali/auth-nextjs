import nodemailer from "nodemailer";
import User from "@/models/userModel";
import crypto from "crypto";

const transport = nodemailer.createTransport({
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
  otp,
}: {
  email: string;
  emailType: "VERIFY" | "RESET" | "RESET_OTP";
  userId: string;
  otp?: string;
}) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    let htmlContent = "";
    let subject = "";

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // 🔥 VERIFY EMAIL (TOKEN)
    if (emailType === "VERIFY") {
      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.verifyToken = hashedToken;
      user.verifyTokenExpiry = Date.now() + 3600000;

      await user.save();

      const url = `${baseUrl}/verifyemail?token=${rawToken}`;

      subject = "Verify your email";

      htmlContent = `
        <h2>Verify Your Email</h2>
        <a href="${url}">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `;
    }

    // 🔥 RESET PASSWORD (TOKEN LINK)
    else if (emailType === "RESET") {
      const rawToken = crypto.randomBytes(32).toString("hex");

      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpiry = Date.now() + 3600000;

      await user.save();

      const url = `${baseUrl}/reset-password?token=${rawToken}`;

      subject = "Reset your password";

      htmlContent = `
        <h2>Reset Password</h2>
        <a href="${url}">Reset Password</a>
        <p>This link expires in 1 hour.</p>
      `;
    }

    // 🔥 OTP RESET
    else if (emailType === "RESET_OTP") {
      if (!otp) throw new Error("OTP not provided");

      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

      await user.save();

      subject = "Your OTP for Password Reset";

      htmlContent = `
        <div style="text-align:center">
          <h2>Password Reset OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This OTP expires in 10 minutes.</p>
        </div>
      `;
    }

    // 📤 send email
    const mailResponse = await transport.sendMail({
      from: "YourApp <noreply@yourapp.com>",
      to: email,
      subject,
      html: htmlContent,
    });

    console.log("Mail sent:", mailResponse.messageId);

    return mailResponse;
  } catch (error: any) {
    console.log("Error sending email:", error.message);
    throw new Error(error.message);
  }
};