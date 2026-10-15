import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: {
    default: "EyeShop — E-Commerce Platform for Local People & Businesses",
    template: "%s · EyeShop",
  },
  description:
    "An E-Commerce Platform for Local People and Businesses. Quality eyewear, precision prescription lenses, designer frames, and accessories.",
  keywords: [
    "authentication",
    "JWT",
    "OAuth2",
    "2FA",
    "Spring Boot",
    "Next.js",
    "RBAC",
    "rate limiting",
    "email verification",
  ],
  authors: [{ name: "Shahrayar Sahito" }],
  creator: "Shahrayar Sahito",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Universal Auth — Production-Grade Authentication",
    description:
      "A complete, production-ready authentication backend with 41 REST APIs. JWT, OAuth2, 2FA, RBAC — all included.",
    siteName: "Universal Auth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Auth — Production-Grade Authentication",
    description:
      "A complete, production-ready authentication backend with 41 REST APIs.",
    creator: "@shahrayar",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}