import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { lable: "username", type: "text", placeholder: "avi" },
      },
     
      async authorize(credentials: any): Promise<any> {
        await dbconnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.username },
            ],
          });
          if (!user) {
            throw new Error("no user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("please verify your account first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("incorrect password");
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptionMessage;

      }
      return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user._id=token._id
            session.user.username=token.username
            session.user.isVerified=token.isVerified
            session.user.isAcceptionMessage=token.isAcceptionMessage
        }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  
  
};
