"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-darkmode";

const Navbar = () => {
    const {data:session} = useSession()
    const user :User =session?.user as User
  return <nav className="p-4 md:p-6 shadow-md">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">Mystry Message</a>
        {
            session ? (
               <> <span className="mr-4">Welcome,{user.username}</span>
               <Button className="w-full md:w-auto" onClick={()=>signOut()
               }>Log out</Button>
               <ModeToggle></ModeToggle>
                 </>
            ) : (<><Link href={'signin'}><Button className="w-full md:m-auto ">Login</Button></Link> <ModeToggle></ModeToggle></>)
        }
    </div>
  </nav>
};

export default Navbar;
