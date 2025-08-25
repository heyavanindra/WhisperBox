"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { signupValidaton } from "@/schemas/signUpSchema";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [usernameMesssage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setCheckingUsername] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 1000);
  const { toast } = useToast();
  const router = useRouter();
  // zod implementation
  const form = useForm<z.infer<typeof signupValidaton>>({
    resolver: zodResolver(signupValidaton),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setCheckingUsername(true);
        setUsernameMessage("");
      }
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "error checking username"
        );
      } finally {
        setCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupValidaton>) => {
    setIsSubmiting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmiting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "signup failed ",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmiting(false);
    }
  };
  return (
  <div className=" flex justify-center items-center min-h-screen dark:text-white">
  <div className="absolute inset-0 -z-10 bg-[image:radial-gradient(80%_50%_at_50%_-20%,hsl(206,81.9%,65.3%,0.5),rgba(255,255,255,0))]"></div>
  <svg
    className="absolute inset-0 -z-10 h-full w-full dark:stroke-white/5 stroke-black/5 [mask-image:radial-gradient(75%_50%_at_top_center,white,transparent)]"
    aria-hidden="true"
  >
    <defs>
      <pattern
        id="hero"
        width="80"
        height="80"
        x="50%"
        y="-1"
        patternUnits="userSpaceOnUse"
      >
        <path d="M.5 200V.5H200" fill="none"></path>
      </pattern>
    </defs>
    <rect width="100%" height="100%" strokeWidth="0" fill="url(#hero)"></rect>
  </svg>

  {/* Signup Card */}
  <div className="w-full max-sm:mt-20 max-w-md p-10 max-sm:mx-3 space-y-8 bg-background border border-primary/20 rounded-2xl shadow-xl backdrop-blur-sm">
    <div className="text-center">
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
        Sign up to start your anonymous adventure
      </h1>
    </div>

    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                    className="rounded-xl"
                  />
                </FormControl>
                {isCheckingUsername && (
                  <Loader2 className="animate-spin mt-1 h-4 w-4 text-muted-foreground" />
                )}
                <p
                  className={`text-sm mt-1 ${
                    usernameMesssage === "UserName is available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameMesssage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    type="password"
                    className="rounded-xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmiting}
            className="w-full rounded-xl py-2 font-medium"
          >
            {isSubmiting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already a member?{" "}
        <Link
          href={"/signin"}
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          {isSubmiting?"Submitting":"Sign In"}
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default Signup;
