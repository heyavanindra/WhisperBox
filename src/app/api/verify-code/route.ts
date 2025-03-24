import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";



export async function POST(request: Request) {
  await dbconnect();
  try {
    const { username, code } = await request.json();
   
    const DecodedUsername = decodeURIComponent(username);
    
    const user = await UserModel.findOne({ username:DecodedUsername });
    
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 503 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    }else if(!isCodeExpired){
        return Response.json(
            {
              success: false,
              message: "Verification code has expired, please signup again",
            },
            { status: 501 }
          )
    }else{
        return Response.json(
            {
              success: false,
              message: "incorrect verification code",
            },
            { status: 501 }
          )
    }


  } catch (error) {
    console.error("Error varifying user", error);
    return Response.json(
        {
          success: false,
          message: "error in verification code route",
        },
        { status: 501 }
      )
  }
}
