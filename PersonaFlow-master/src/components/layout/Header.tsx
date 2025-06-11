
"use client";

import Link from "next/link";
import { Users, Workflow, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/personas", label: "Personas", icon: Users },
  { href: "/content-journeys", label: "Content Journeys", icon: Workflow },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Workflow className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline">PersonaFlow</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
