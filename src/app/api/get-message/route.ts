import dbconnect from "@/lib/dbconnect";
import { getServerSession, User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET() {
  await dbconnect();
  const session = await getServerSession(authOption);

  const user: User = session?.user as User;
 
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authentication",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$message", preserveNullAndEmptyArrays: true }},
      { $sort: { "message.createdAt": -1 } },
    ]);

    
    

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user not found in get message route",
        },
        {
          status: 402,
        }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "something went wrong in get message route",
      },
      {
        status: 402,
      }
    );
  }
}
