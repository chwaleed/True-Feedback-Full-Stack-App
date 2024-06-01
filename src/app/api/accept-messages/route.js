import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Falied to update status of user",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User status is updated",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "failed to update user status to accept message",
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }
    const userId = user._id;

    const foundUser = UserModel.findById(userId);
    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in getting messages status",
      },
      { status: 500 }
    );
  }
}
