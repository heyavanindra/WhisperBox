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
   
  const form = useForm<z.infer<typeof signInValidationSchema>>({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInValidationSchema>) => {
   try {
     const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });
    if (result?.error) {
      toast({
        title: "login failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    }
    if (result?.url) {
      router.push("/dashboard");
    }
   } catch (error) {
    toast({
      title:"Login failed",
      description:"Invalid credentials",
      variant:"destructive"
    })
    console.error(error)
   }finally {
   }
  };

  return (
    <div className="flex justify-center items-center min-h-screen dark:text-white">
      <div className="absolute inset-0 -z-10 bg-[image:radial-gradient(80%_50%_at_50%_-20%,hsl(206,81.9%,65.3%,0.5),rgba(255,255,255,0))]"></div>
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-black/5  dark:stroke-white/5 [mask-image:radial-gradient(75%_50%_at_top_center,white,transparent)]"
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
      <div className="w-full max-sm:mx-4 max-w-md p-10 space-y-8 bg-background border border-primary/20 rounded-2xl shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
            Sign in to start your anonymous adventure
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
                className="w-full rounded-xl py-2 font-medium"
              >
                 {form.formState.isSubmitting ?"Submitting...":"Sign Up"}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href={"/signup"}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
            Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
