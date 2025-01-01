import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "./AuthProvider";
import Navbar from "./components/Navbar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* If you have any custom meta tags or links, add them here */}
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            
          <Navbar></Navbar>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
