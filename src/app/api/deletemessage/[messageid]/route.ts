import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";
import { authOption } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbconnect();
  const serverSession = await getServerSession(authOption);
  const _user: User = serverSession?.user as User;
  if (!serverSession || !_user) {
    return Response.json(
      {
        success: false,
        message: "Invalid session",
      },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      {
        _id: _user._id,
      },
      {
        $pull: { message: { _id: messageId } },
      }
    );

    if (updateResult.modifiedCount == 0) {
       return Response.json({
        success:false,
        message:"message not found or already deleted"
       },{status:401})
    }

    return Response.json({
        success:true,
        message:"Message Deleted"
       },{status:200})
  } catch (error) {
    console.log(error)
    return Response.json({
        success:false,
        message:"Error while deleting message"
       },{status:501})
  }
}
