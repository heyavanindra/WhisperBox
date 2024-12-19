import dbconnect from "@/lib/dbconnect";
import { getServerSession, User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET(request: Request) {
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
      { $match: { id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
    ]);

    if (!user || user.length === 0) {
      Response.json(
        {
          success: false,
          message: "user not found in get message route",
        },
        {
          status: 402,
        }
      );
    }

    Response.json(
      {
        success: true,
        message: user[0].message,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    Response.json(
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