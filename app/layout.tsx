import type { Metadata } from "next";
import "./globals.css";
import HeaderNavbar from "@/components/layout/HeaderNavbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthRequiredModal from "@/components/modals/AuthRequiredModal";
import EditCompanyModal from "@/components/modals/EditCompanyModal";

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
      <body className="antialiased bg-gray-50 min-h-screen flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <HeaderNavbar />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
            <AuthRequiredModal />
            <EditCompanyModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
