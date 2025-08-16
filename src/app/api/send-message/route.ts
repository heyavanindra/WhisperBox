import dbconnect from "@/lib/dbconnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbconnect();
  const { username, content } = await request.json();
  const paramUser = username
  
  
  try {
    const user = await UserModel.findOne({ username:paramUser });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user does not exist",
        },
        { status: 404 }
      );
    }

    if (!user?.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting messages",
        },
        {
          status: 402,
        }
      );
    }

    const newMessage = { content:content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    const isMessageSent = await user.save();
    if (!isMessageSent) {
      return Response.json(
        {
          success: false,
          message: "not Authenticated",
        },
        { status: 502 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error)
    console.error("something went wrong in send message route");
    return Response.json(
      {
        success: false,
        message: "error in send message",
      },
      { status: 508 }
    );
  }
}
