import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { GlobeProvider } from "@/contexts/globe-context";
import { LayoutWrapper } from "@/components/layout-wrapper";

export const metadata = {
  title: "Alpinesight - Interactive Globe Chat",
  description:
    "Chat with AI while exploring an interactive 3D globe. Built with FastAPI and Next.js.",
  openGraph: {
    images: [
      {
        url: "/og?title=Alpinesight",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/og?title=Alpinesight",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body className={cn(GeistSans.className, "antialiased dark")}>
        <GlobeProvider>
          <Toaster position="top-center" richColors />
          <Navbar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </GlobeProvider>
      </body>
    </html>
  );
}
