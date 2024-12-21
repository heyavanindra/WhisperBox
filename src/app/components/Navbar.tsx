"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-darkmode";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Logo */}
        <a
          className="text-xl font-bold text-gray-900 dark:text-white"
          href="#"
        >
          Mystry Message
        </a>

        {/* Middle Section: Welcome Message */}
        <div className="hidden md:block text-center">
          {session && (
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {user.username}
            </span>
          )}
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="md:hidden text-gray-700 dark:text-gray-300">
                Welcome, {user.username}
              </span>
              <Button
                className="w-full md:w-auto"
                onClick={() => signOut()}
              >
                Log out
              </Button>
            </>
          ) : (
            <Link href={"signin"}>
              <Button className="w-full md:w-auto">Login</Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
