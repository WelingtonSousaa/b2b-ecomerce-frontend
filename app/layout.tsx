import type { Metadata } from "next";
import "./globals.css";
import HeaderNavbar from "@/components/layout/HeaderNavbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CompareProvider } from "@/context/CompareContext";
import { ToastProvider } from "@/context/ToastContext";
import { StorefrontProvider } from "@/context/StorefrontContext";
import AuthRequiredModal from "@/components/modals/AuthRequiredModal";
import EditCompanyModal from "@/components/modals/EditCompanyModal";
import ProductComparatorModal from "@/components/modals/ProductComparatorModal";
import CompareFloatingBar from "@/components/layout/CompareFloatingBar";

export const metadata: Metadata = {
  title: "Shopcart B2B - Portal Corporativo de Vendas & Distribuição",
  description: "Plataforma e-commerce corporativa para compras por CNPJ, precificação fiscal automatizada por estado, estoque multi-CD e faturamento a prazo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-white text-gray-900 font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <StorefrontProvider>
            <ToastProvider>
              <CompareProvider>
                <HeaderNavbar />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
                <AuthRequiredModal />
                <EditCompanyModal />
                <ProductComparatorModal />
                <CompareFloatingBar />
              </CompareProvider>
            </ToastProvider>
          </StorefrontProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
