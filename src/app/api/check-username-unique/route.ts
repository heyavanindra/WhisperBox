import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbconnect();

  try {
    const { searchParams } = new URL(request.url);
    const quetyParam = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = usernameQuerySchema.safeParse(quetyParam);


    if (!result.success) {

      return Response.json(
        {
          success: false,
          message: "invalid query params",
        },
        {
          status: 501,
        }
      );
    }
    const { username } = result.data;
 const existingVerifiedUser=  await UserModel.findOne({
        username,
        isVerified:true
    })
    if (existingVerifiedUser) {
        return Response.json(
            {
              success: false,
              message: "UserName is already taken",
            },
            {
              status: 502,
            }
          );
    }
    return Response.json(
        {
          success: true,
          message: "UserName is available",
        },
        {
          status: 200,
        }
      );
    
    
  } catch (error) {
    console.error("error in check username validation route", error);
    return Response.json(
      {
        success: false,
        message: "error in check username",
      },
      {
        status: 504,
      }
    );
  }
}
