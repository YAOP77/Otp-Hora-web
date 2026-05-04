import { CookieConsent } from "@/components/features/marketing/cookie-consent";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "OTP Hora",
    template: "%s · OTP Hora",
  },
  description:
    "Gérez votre compte OTP Hora : authentification, appareils et contacts depuis le navigateur.",
  openGraph: {
    title: "OTP Hora",
    description:
      "Interface web professionnelle pour votre compte OTP Hora.",
    type: "website",
  },
  icons: {
    icon: [{ url: "/assets/image%20app/Hora-Logo.png", type: "image/png" }],
    shortcut: "/assets/image%20app/Hora-Logo.png",
    apple: "/assets/image%20app/Hora-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <QueryProvider>
              <ToastProvider>
                {children}
                <CookieConsent />
              </ToastProvider>
            </QueryProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
