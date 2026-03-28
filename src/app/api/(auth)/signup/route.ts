import { connectToDb } from "@/db/dbConfig";
import User from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectToDb();

    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const emailLower = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: emailLower,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
