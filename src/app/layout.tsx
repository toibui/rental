import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./providers";

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
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
