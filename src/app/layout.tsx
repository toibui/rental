import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "My App",
  description: "Quản lý phòng trọ với Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        {/* Navbar sẽ hiển thị cho mọi page */}
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

