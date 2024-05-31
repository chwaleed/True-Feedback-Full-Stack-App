import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";
import { usernameValidation } from "@/models/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); // remove
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json({
        success: false,
        message: "invalid Qory Parameters",
      });
    }

    const { username } = result.data;
    const existingVerifiedUser = UserModel.findOne({
      username,
      isVarified: true,
    });
    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "user name already taken",
      });
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is Unique",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in checking username",
      },
      { status: 500 }
    );
  }
}
