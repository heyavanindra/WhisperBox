import dbconnect from "@/lib/dbconnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbconnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      Response.json(
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

    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessage as Message);
    const isMessageSent = await user.save();
    if (!isMessageSent) {
      Response.json({
        success: false,
        message: "not Authenticated",
      },{status:502});
    }
    Response.json(
      {
        success: false,
        message: "message sent successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log('something went wrong in send message route')

  }
}
