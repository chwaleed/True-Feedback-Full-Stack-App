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
    console.log("Here is the result: ", result); // remove
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    console.log(existingVerifiedUser);

    if (existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        message: "User name already taken",
      });
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is Unique",
      },
      { status: 200 }
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
