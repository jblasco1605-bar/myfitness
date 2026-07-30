import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FlowProvider } from "@/lib/flow-context";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "MyFitness — Escanea, elige, cocina",
  description:
    "Sube el ticket de tu compra y recibe recetas personalizadas según tu objetivo: ganar músculo, perder grasa o mantenerte.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyFitness",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B0F14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="mx-auto min-h-dvh max-w-md antialiased">
        <FlowProvider>{children}</FlowProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
