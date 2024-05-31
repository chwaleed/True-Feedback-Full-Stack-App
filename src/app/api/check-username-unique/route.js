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
