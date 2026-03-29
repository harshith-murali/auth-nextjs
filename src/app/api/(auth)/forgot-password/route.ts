import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { email, type } = await request.json();
    // type = "LINK" | "OTP"

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // 🔥 OTP FLOW
    if (type === "OTP") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min

      await user.save();

      await sendEmail({
        email: user.email,
        emailType: "RESET_OTP",
        userId: user._id.toString(),
        otp, // 👈 pass OTP
      });

      return NextResponse.json({
        success: true,
        message: "OTP sent to email",
      });
    }

    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: "Reset link sent to email",
    });

  } catch (error: any) {
    console.log("Forgot password error:", error.message);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}