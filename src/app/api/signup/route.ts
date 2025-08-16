import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  await dbconnect();

  try {
    const { username, email, password } = await request.json();

    const existingUserIsVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserIsVerified) {
      return Response.json({
        success: false,
        message: "username is already taken",
      });
    }
    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = await uuidv4();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "user already exist in email",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });
       await newUser.save();
    }
    // Send Verification Email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "error while sending email",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Email send successfully",
    });
  } catch {
    console.error("error in sign up section");
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
