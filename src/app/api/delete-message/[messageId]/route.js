import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user;
  if (!session || !_user) {
    return NextResponse.json(
      {
        message: "Not authenticated",
        success: false,
      },
      { status: 401 }
    );
  }
  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { message: { _id: messageId } } }
    );
    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        {
          message: "Message not found or already Deleted",
          success: false,
        },
        { status: 404 }
      );
    }
  } catch (error) {}
}
