import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase();

    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const tokenData = {
      id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}