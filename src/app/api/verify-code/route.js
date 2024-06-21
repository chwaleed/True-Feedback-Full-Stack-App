import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const { verifyCode, username } = reqBody;

    const decodedUsername = decodeURIComponent(username); // NOt needed but for info if we are extracting from url (username)
    const user = await UserModel.findOne({ username: decodedUsername });
    // console.log(user);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 500 }
      );
    }
    const isCodeValid = user.verifyCode === verifyCode;
    // console.log(isCodeValid);
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    console.log(isCodeNotExpired);
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          success: true,
          message: "User Verified",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: false,
          message: "Code is Expired",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect Code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in Verifing User",
      },
      { status: 500 }
    );
  }
}
