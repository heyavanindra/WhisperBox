"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";


import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
import { signInValidationSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";



const Signin = () => {


  
 
  const { toast } = useToast();
  const router = useRouter();
  // zod implementation
  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  

  const onSubmit = async (data: z.infer<typeof signInValidationSchema>) => {
   const result=  await signIn('credentials',{
      redirect:false,
      username:data.username,
      password:data.password
    })
    if (result?.error) {
      toast({
        title:"login failed",
        description:"Incorrect username or password",
        variant:"destructive"
      })
    }

    if (result?.url) {
      router.push('/dashboard')
    }
    
  };
  return (
    <div className=" flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-white">
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UserName"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          
                        }}
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
                    <FormLabel>password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Sign In
              </Button>
            </form>
          </Form>

          <p>
            Don&apos;t have Account?{" "}
            <Link
              href={"/signup"}
              className="text-blue-500 hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
