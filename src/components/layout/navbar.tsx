"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Plus, Moon, Sun, Menu, X, Package, LogOut, Settings, User, LayoutDashboard, Shield,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/bundles", label: "Bundles" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(search.trim())}`;
      setSearchOpen(false);
    }
  };

  // Type-safe session user access with fallbacks
  const user = session?.user as Record<string, unknown> | undefined;
  const avatarUrl = (user?.["avatarUrl"] as string) || "";
  const displayName = (user?.["displayName"] as string) || (user?.["name"] as string) || "";
  const username = (user?.["username"] as string) || "";
  const userRole = (user?.["role"] as string) || "";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass border-b border-border/50 shadow-sm" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Agent<span className="gradient-text">Hub</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === link.href ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSearchOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {session?.user ? (
              <>
                <Link href="/publish">
                  <Button size="sm" variant="gradient" className="hidden sm:flex">
                    <Plus className="mr-1 h-4 w-4" />
                    Publish
                  </Button>
                </Link>

                <Link href="/notifications" className="relative">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Bell className="h-4 w-4" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-accent">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarUrl} alt={displayName} />
                        <AvatarFallback>
                          {(displayName || "U")[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{displayName}</p>
                        <p className="text-xs text-muted-foreground">@{username}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/@${username}`} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="gradient">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            <Button variant="ghost" size="icon" className="h-9 w-9 md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 pt-20 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="w-full max-w-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search agents, publishers, categories..."
                  className="h-14 rounded-2xl border-0 bg-card pl-12 pr-12 text-base shadow-2xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
              <div className="mt-2 rounded-2xl bg-card p-4 shadow-2xl">
                <p className="text-sm text-muted-foreground">
                  Press Enter to search or Esc to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            <div className="flex items-center justify-between p-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">AgentHub</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {session?.user ? (
                <>
                  <Link
                    href="/publish"
                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    Publish Agent
                  </Link>
                  <Link
                    href="/dashboard"
                    className="rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button variant="gradient" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}