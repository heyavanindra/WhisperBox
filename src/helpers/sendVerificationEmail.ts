import EmailTemplate from "@/emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to:email,
            subject: 'anonymous message email verification',
            react: EmailTemplate({username,verifyCode}),
          });
        return{
            
            success:true,
            message:"verificaton email send successfully"
        }
    } catch (emailerror) {
        console.log("error while sending email");
        console.error(emailerror)
        return{
            success:false,
            message:"failed to send verificaton email"
        }
        
    }
}
