import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

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