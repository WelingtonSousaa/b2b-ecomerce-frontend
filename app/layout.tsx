import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import HeaderNavbar from "@/components/layout/HeaderNavbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import AuthRequiredModal from "@/components/modals/AuthRequiredModal";
import EditCompanyModal from "@/components/modals/EditCompanyModal";

// tipografia corporativa onesync
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OneSync B2B",
  description: "Plataforma de E-commerce B2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} antialiased bg-gray-50 min-h-screen flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <HeaderNavbar />
              <main className="flex-1 w-full flex flex-col">
                {children}
              </main>
              <Footer />
              <AuthRequiredModal />
              <EditCompanyModal />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

