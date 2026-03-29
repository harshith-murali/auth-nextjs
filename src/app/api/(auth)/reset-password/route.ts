import { connectToDb } from "@/db/dbConfig";
import { User } from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { NextResponse , NextRequest } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Hash the received token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching reset token and valid expiry
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

    // Update user's password and clear reset token fields
    user.password = newPassword;
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