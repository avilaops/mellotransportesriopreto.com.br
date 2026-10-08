import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import "../landing.css";

export const metadata: Metadata = {
  title: "Rastreamento de cargas",
  description: "Consulte o andamento da sua carga com a Mello Transportes. Informe o CPF ou CNPJ do contratante e o código de rastreio da carga.",
  alternates: { canonical: "/rastreio" },
  openGraph: { type: "website", locale: "pt_BR", url: "/rastreio", title: "Rastreamento de cargas | Mello Transportes", description: "Consulte o andamento da sua carga com a Mello Transportes. Informe o CPF ou CNPJ do contratante e o código de rastreio da carga.", images: [{ url: "/preview-whatsapp-v2.png", width: 1200, height: 630, alt: "Mello Transportes" }] },
  twitter: { card: "summary_large_image", title: "Rastreamento de cargas | Mello Transportes", description: "Consulte o andamento da sua carga com a Mello Transportes. Informe o CPF ou CNPJ do contratante e o código de rastreio da carga.", images: ["/preview-whatsapp-v2.png"] },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main id="main-content" className="public-service">{children}</main><SiteFooter /></>;
}
