"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyValidationSchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifyAccount = () => {
  const route = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifyValidationSchema>>({
    resolver: zodResolver(verifyValidationSchema),
  });

  const onSubmit = async (data: z.infer<typeof verifyValidationSchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "success",
        description: response.data.message,
      });
      route.push("/signin");
    } catch (error) {
      console.error("error in verify code", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return <div className=" flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-white">
  <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-black  rounded-lg shadow-md">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        {" "}
        sign in to start your anomynous Adventure
      </h1>
    </div>
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
          
         
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="code"
                    {...field}
                   
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
             Submit
          </Button>
        </form>
      </Form>

      <p>
        Already a member?{" "}
        <Link
          href={"/signin"}
          className="text-blue-500 hover:text-blue-800"
        >
          Sign In
        </Link>
      </p>
    </div>
  </div>
</div>;
};

export default verifyAccount;
