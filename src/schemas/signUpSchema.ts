import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(20, "Username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]{3,20}$/, "username must not contain special character");

export const signupValidaton = z.object({
  username: usernameValidation,
  email: z
    .string()
    .email()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
  password:z.string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/\d/, { message: "Password must contain at least one number." })
  .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@$!%*?&)." })
});
