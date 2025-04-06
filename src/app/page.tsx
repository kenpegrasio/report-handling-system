"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const { theme, systemTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const currentTheme = theme === "system" ? systemTheme : theme;

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          setIsLoggedIn(true);
          setUserEmail(data.email || "");
          setIsAdmin(data.role === "admin" || false);
        } else {
          setIsLoggedIn(false);
          setUserEmail("");
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      setUserEmail("");
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.message === "Approved" || data.message === "Prohibited") {
        window.location.href = "/";
      } else {
        router.push("/?userNotFound=true");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUserEmail("");
        toast.info("Logout Successful!", {
          position: "top-left",
          style: {
            background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "white",
            color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
            borderColor:
              theme === "dark"
                ? "hsl(217.2 32.6% 17.5%)"
                : "hsl(214.3 31.8% 91.4%)",
          },
        });
      } else {
        setError("Failed to logout. Please try again.");
        toast.error("Failed to logout. Please try again.", {
          position: "top-left",
          style: {
            background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "white",
            color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
            borderColor:
              theme === "dark"
                ? "hsl(217.2 32.6% 17.5%)"
                : "hsl(214.3 31.8% 91.4%)",
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (mounted && searchParams.get("unauthorized") === "true") {
      toast.error("Please visit the homepage first!", {
        position: "top-left",
        style: {
          background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "white",
          color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
          borderColor:
            theme === "dark"
              ? "hsl(217.2 32.6% 17.5%)"
              : "hsl(214.3 31.8% 91.4%)",
        },
      });
      window.history.replaceState(null, "", "/");
    }

    if (searchParams.get("userNotFound") === "true") {
      toast.error("User not found!", {
        position: "top-left",
        style: {
          background: theme === "dark" ? "hsl(222.2 84% 4.9%)" : "white",
          color: theme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)",
          borderColor:
            theme === "dark"
              ? "hsl(217.2 32.6% 17.5%)"
              : "hsl(214.3 31.8% 91.4%)",
        },
      });
      window.history.replaceState(null, "", "/");
    }
  }, [searchParams, theme, mounted]);

  if (!mounted || checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        currentTheme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {isLoggedIn ? `Welcome back, ${userEmail}` : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {isLoggedIn
              ? "You are currently logged in"
              : "Enter your email to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You can access your account or logout below
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => router.push("/user")}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  Submit a Report
                </Button>
                {isAdmin && (
                  <Button
                    onClick={() => router.push("/admin")}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    Go to Admin Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Continue with Email"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
