import dbconnect from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest } from "next/server";
export async function POST(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOption);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 405,
      }
    );
  }

  const userId = user._id;

  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findById(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update the user",
        },
        {
          status: 500,
        }
      );
    }

   return Response.json({
      success: true,
      message: "message accept status updated successfully",
    });
  } catch (error) {
    console.log("failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

export async function name(request: Request) {
  dbconnect();
  const session = await getServerSession(authOption);
  const user: User = session?.user as User;
  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 500,
      }
    );
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId, {});
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      {
        status: 500,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");

    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}
