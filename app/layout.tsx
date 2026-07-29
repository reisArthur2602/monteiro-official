import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider, ThemeProvider } from "@/integrations";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Monteiro",
    template: "%s | Monteiro",
  },
  description:
    "Plataforma de gestão jurídica para clientes, processos, prazos, documentos e modelos do escritório.",
  applicationName: "Monteiro",
  generator: "Next.js",
  keywords: [
    "gestão jurídica",
    "escritório de advocacia",
    "processos jurídicos",
    "clientes",
    "prazos processuais",
    "documentos jurídicos",
    "modelos de documentos",
  ],
  authors: [
    {
      name: "Monteiro",
    },
  ],
  creator: "Monteiro",
  publisher: "Monteiro",
  category: "business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Monteiro",
    title: "Monteiro",
    description:
      "Plataforma de gestão jurídica para clientes, processos, prazos, documentos e modelos do escritório.",
  },
  twitter: {
    card: "summary",
    title: "Monteiro",
    description:
      "Plataforma de gestão jurídica para clientes, processos, prazos, documentos e modelos do escritório.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#edf1f6",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#0b1220",
    },
  ],
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          ibmPlexMono.variable,
          sourceSerif.variable,
          inter.variable,
        )}
      >
        <ThemeProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
