import dbconnect from "@/lib/dbconnect";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";
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
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,{
        isAcceptingMessage:acceptMessages
      },
      {new:true}
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
    console.log(error);
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



export async function GET(request: Request) {
  await dbconnect();

  const session = await getServerSession(authOption);
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

  const user: User = session?.user as User;
  try {
    const userFound = await UserModel.findById(user?._id);
    const isAcceptingMessage = userFound?.isAcceptingMessage;
    return Response.json(
      {
        success: true,
        isAcceptingMessages: isAcceptingMessage,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error)
    return Response.json({
      success:500,
      message:"Error in accept message route",
    })
  }

}
