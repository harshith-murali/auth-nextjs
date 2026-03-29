import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import { rateLimit } from "@/utils/rateLimit";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { email, type = "LINK" } = await request.json();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const key = `${ip}-${email}`;

    const { success } = rateLimit(key, 3, 60 * 1000);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Try later." },
        { status: 429 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const validTypes = ["LINK", "OTP"];
    const resetType = validTypes.includes(type) ? type : "LINK";

    const user = await User.findOne({ email });

    // 🔐 Hide user existence
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If account exists, email sent",
      });
    }

    // 🔥 OTP FLOW
    if (resetType === "OTP") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await sendEmail({
        email: user.email,
        emailType: "RESET_OTP",
        userId: user._id.toString(),
        otp,
      });

      return NextResponse.json({
        success: true,
        message: "OTP sent if account exists",
      });
    }

    // 🔥 LINK FLOW
    await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id.toString(),
    });

    return NextResponse.json({
      success: true,
      message: "Reset link sent if account exists",
    });

  } catch (error: any) {
    console.log("Forgot password error:", error.message);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}