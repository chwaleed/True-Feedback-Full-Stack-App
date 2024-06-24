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
  // console.log(user);
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
  // const userId = new mongoose.Types.ObjectId(user._id);s
  console.log(userId);
  try {
    const user1 = await UserModel.aggregate([{ $match: { id: userId } }]);
    console.log(user1);
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    console.log(user);
    if (!user || user.length === 0) {
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
