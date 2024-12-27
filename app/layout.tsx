// "use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import { Toaster as Sonner } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: WEBSITE_NAME,
  description: `${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ช่วยเพิ่มประสิทธิภาพการทำงานเป็นทีม ด้วยฟีเจอร์ที่ครบครัน เช่น การติดตามงาน การจัดการทรัพยากร การกำหนดเวลา และการรายงานผล รองรับการทำงานแบบเรียลไทม์ พร้อมปรับแต่งได้ตามความต้องการ เพื่อสนับสนุนความสำเร็จของโครงการทุกขนาดและทุกอุตสาหกรรม`,
  metadataBase: new URL("https://it-udvc-pms.vercel.app/"),
  twitter: {
    card: "summary_large_image",
    site: "it-udvc-pms.vercel.app",
    title: WEBSITE_NAME,
    description: `${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ครบครันและปรับแต่งได้`,
    images: ["https://it-udvc-pms.vercel.app/images/og-image.jpg"],
  },
  openGraph: {
    title: WEBSITE_NAME,
    description: `${WEBSITE_NAME} ระบบบริหารจัดการโครงการที่ครบครันและปรับแต่งได้`,
    images: ["https://it-udvc-pms.vercel.app/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};
import dynamic from "next/dynamic";
import { WEBSITE_NAME } from "@/constants";
import { PHProvider } from "@/components/posthog-provider";

const PostHogPageView = dynamic(() => import("@/components/PostHogPageView"), {
  ssr: false,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PHProvider>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <Toaster position="top-center" reverseOrder={false} />
              <Sonner />
              <PostHogPageView />
              {children}
            </Providers>
          </ThemeProvider>
        </PHProvider>
      </body>
    </html>
  );
}
