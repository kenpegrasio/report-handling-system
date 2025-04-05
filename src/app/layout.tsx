import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react"; // Using Lucide user icon as fallback

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Report Handling System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ModeToggle />
          <div className="fixed top-15 -mr-0.5 right-4 z-50">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm transition-all hover:scale-105 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:border-gray-700"
            >
              <Image
                src="/user-avatar.png"
                alt="User account"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Link>
          </div>

          <Toaster
            position="top-left"
            theme="light"
            toastOptions={{
              classNames: {
                toast:
                  "dark:!bg-gray-900 dark:!text-gray-100 dark:!border-gray-700",
                title: "dark:!text-white",
                description: "dark:!text-gray-300",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
