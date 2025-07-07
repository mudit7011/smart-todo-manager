import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Smart Todo with AI",
  description: "AI-powered intelligent task management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
      </body>
    </html>
  );
}
