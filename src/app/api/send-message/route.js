import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const reqBody = await request.json();
  const { username, content } = reqBody;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    // is user accepting message
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "message sent successfuly",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "unexpected error ",
      },
      { status: 500 }
    );
  }
}
