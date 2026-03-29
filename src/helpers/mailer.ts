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

// ─── Shared Layout Wrapper ────────────────────────────────────────────────────
const wrapLayout = (body: string, previewText: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>${previewText}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #f0ede8;
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .email-wrapper {
      background-color: #f0ede8;
      padding: 48px 16px;
    }

    .email-container {
      max-width: 520px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      margin-bottom: 8px;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .logo-mark {
      width: 32px;
      height: 32px;
      background: #1a1a1a;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-size: 15px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.3px;
    }

    /* Card */
    .card {
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid #e8e4de;
      margin-top: 20px;
    }

    .card-accent {
      height: 4px;
      width: 100%;
    }

    .card-body {
      padding: 40px 40px 36px;
    }

    /* Icon badge */
    .icon-badge {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      font-size: 24px;
    }

    /* Typography */
    .heading {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.5px;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .subtext {
      font-size: 15px;
      color: #6b6560;
      line-height: 1.6;
      margin-bottom: 32px;
    }

    /* Button */
    .btn-wrapper {
      margin-bottom: 32px;
    }

    .btn {
      display: inline-block;
      padding: 13px 28px;
      border-radius: 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: -0.2px;
    }

    /* OTP Block */
    .otp-wrapper {
      margin-bottom: 32px;
    }

    .otp-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #9e9890;
      margin-bottom: 12px;
    }

    .otp-code {
      font-family: 'DM Mono', 'Courier New', monospace;
      font-size: 38px;
      font-weight: 500;
      letter-spacing: 10px;
      color: #1a1a1a;
      background: #f7f5f2;
      border: 1px solid #e8e4de;
      border-radius: 12px;
      padding: 18px 24px;
      display: inline-block;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid #ede9e3;
      margin: 0 0 24px;
    }

    /* Expiry notice */
    .notice {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #9e9890;
      margin-bottom: 24px;
    }

    .notice-icon {
      font-size: 15px;
    }

    /* Fallback URL */
    .fallback-url {
      font-size: 12px;
      color: #b5b0a8;
      word-break: break-all;
      line-height: 1.5;
    }

    .fallback-url a {
      color: #b5b0a8;
    }

    /* Footer */
    .footer {
      padding: 24px 0 0;
      text-align: center;
    }

    .footer-text {
      font-size: 12px;
      color: #b5b0a8;
      line-height: 1.6;
    }

    .footer-text a {
      color: #9e9890;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- Header -->
      <div class="header">
        <span class="logo">
          <span class="logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="white" fill-opacity="0.9"/>
            </svg>
          </span>
          <span class="logo-text">YourApp</span>
        </span>
      </div>

      <!-- Card -->
      <div class="card">
        ${body}
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text">
          You received this email because an action was requested on your account.<br/>
          If you didn't request this, you can safely ignore it.<br/><br/>
          <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>
`;

// ─── Template: Verify Email ───────────────────────────────────────────────────
const verifyEmailTemplate = (url: string) =>
  wrapLayout(
    `
    <div style="height:4px; background: linear-gradient(90deg, #4f46e5, #7c3aed);"></div>
    <div class="card-body">
      <div class="icon-badge" style="background:#eef2ff;">
        <span>✉️</span>
      </div>
      <h1 class="heading">Confirm your email address</h1>
      <p class="subtext">
        Thanks for signing up! Click below to verify your email and activate your account.
        This keeps your account secure.
      </p>
      <div class="btn-wrapper">
        <a href="${url}" class="btn" style="background:#4f46e5; color:#ffffff;">
          Verify Email Address →
        </a>
      </div>
      <hr class="divider"/>
      <div class="notice">
        <span class="notice-icon">⏱</span>
        <span>This link expires in <strong>1 hour</strong>.</span>
      </div>
      <p class="fallback-url">
        Or paste this URL in your browser:<br/>
        <a href="${url}">${url}</a>
      </p>
    </div>
  `,
    "Verify your email address"
  );

// ─── Template: Reset Password (Link) ─────────────────────────────────────────
const resetPasswordTemplate = (url: string) =>
  wrapLayout(
    `
    <div style="height:4px; background: linear-gradient(90deg, #f59e0b, #ef4444);"></div>
    <div class="card-body">
      <div class="icon-badge" style="background:#fff7ed;">
        <span>🔑</span>
      </div>
      <h1 class="heading">Reset your password</h1>
      <p class="subtext">
        We received a request to reset the password for your account.
        Click the button below to choose a new password.
      </p>
      <div class="btn-wrapper">
        <a href="${url}" class="btn" style="background:#1a1a1a; color:#ffffff;">
          Reset Password →
        </a>
      </div>
      <hr class="divider"/>
      <div class="notice">
        <span class="notice-icon">⏱</span>
        <span>This link expires in <strong>1 hour</strong>.</span>
      </div>
      <p class="fallback-url">
        Or paste this URL in your browser:<br/>
        <a href="${url}">${url}</a>
      </p>
    </div>
  `,
    "Reset your password"
  );

// ─── Template: OTP Reset ──────────────────────────────────────────────────────
const resetOtpTemplate = (otp: string) =>
  wrapLayout(
    `
    <div style="height:4px; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
    <div class="card-body">
      <div class="icon-badge" style="background:#ecfdf5;">
        <span>🔐</span>
      </div>
      <h1 class="heading">Your one-time passcode</h1>
      <p class="subtext">
        Use the code below to reset your password. Don't share this with anyone —
        our team will never ask for it.
      </p>
      <div class="otp-wrapper">
        <p class="otp-label">Verification Code</p>
        <div class="otp-code">${otp}</div>
      </div>
      <hr class="divider"/>
      <div class="notice">
        <span class="notice-icon">⏱</span>
        <span>This code expires in <strong>10 minutes</strong>.</span>
      </div>
    </div>
  `,
    "Your password reset code"
  );

// ─── Main sendEmail Function ──────────────────────────────────────────────────
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
      subject = "Verify your email address";
      htmlContent = verifyEmailTemplate(url);
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
      htmlContent = resetPasswordTemplate(url);
    }

    // 🔥 OTP RESET
    else if (emailType === "RESET_OTP") {
      if (!otp) throw new Error("OTP not provided");

      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
      await user.save();

      subject = "Your one-time passcode";
      htmlContent = resetOtpTemplate(otp);
    }

    // 📤 Send email
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