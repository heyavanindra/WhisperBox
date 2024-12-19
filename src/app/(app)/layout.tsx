import Navbar from "../components/Navbar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
