import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Vefication email send successfuly" };
  } catch (emailError) {
    console.error("Error sending vefication email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
