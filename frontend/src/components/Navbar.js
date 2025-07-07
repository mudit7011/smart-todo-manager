"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/add-task", label: "Add Task" },
  { href: "/context", label: "Add Context" },
  { href: "/context/history", label: "History" }, 
];

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start h-16 gap-8">
          {navItems.map((item) => {
            // THE FIX IS HERE: We now check for an exact match only.
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`
                  text-sm font-semibold transition-colors duration-200 relative
                  ${
                    isActive
                      ? "text-blue-600" // Style for the active link
                      : "text-slate-600 hover:text-blue-500" // Style for inactive links
                  }
                `}
              >
                {item.label}
                {/* The underline will also only show for the active link */}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}