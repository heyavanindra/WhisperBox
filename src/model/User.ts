import mongoose, { Schema, Document, mongo } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: String,
  verifyCodeExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage:{
    type:Boolean,
    default:true
  },
  messages:[MessageSchema]
});

const UserModel= (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema));

export default UserModel
