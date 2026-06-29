import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "KnowUrCollege",
  description: "Discover and learn more about colleges",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col animate-gradient-bg text-theme transition-colors duration-500">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
