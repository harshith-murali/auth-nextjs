import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { token, email, otp, password } = await request.json();

    // 🔒 basic validation
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    let user;

    // 🔥 TOKEN FLOW (link reset)
    if (token) {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() },
      });
    }

    // 🔥 OTP FLOW
    else if (email && otp) {
      user = await User.findOne({
        email,
        resetPasswordOtp: otp,
        resetPasswordOtpExpiry: { $gt: Date.now() },
      });
    }

    // ❌ invalid request
    else {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // ❌ no user found
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired credentials" },
        { status: 400 }
      );
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // 🧹 clear ALL reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error: any) {
    console.log("Reset password error:", error.message);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}