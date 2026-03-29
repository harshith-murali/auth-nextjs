import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { email } = await request.json();

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