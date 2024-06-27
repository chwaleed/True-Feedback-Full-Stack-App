import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contaxt/AuthProvider";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "True Feedback",
  description: "Get anonymous feedbacks from the user with True Feedback",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
