import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
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
  const userId = mongoose.Types.ObjectId.createFromHexString(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    // console.log();

    if (!user || user.length === 0) {
      if (user[0] === undefined) {
        return NextResponse.json(
          {
            success: true,
            message: "No message found!",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "User not found ",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in gettting Messages",
      },
      { status: 401 }
    );
  }
}
