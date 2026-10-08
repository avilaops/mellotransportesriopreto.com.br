import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import "./landing.css";
import "./mobile.css";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false },
};

export default function NotFound() {
  return <div className="mello-shell"><SiteHeader /><main id="main-content" className="mello-main">
    <section className="ui-not-found">
      <p className="ui-kicker">Erro 404</p>
      <h1>Não encontramos esta página.</h1>
      <p>O endereço pode ter mudado ou sido digitado com algum erro. Estes são os caminhos mais usados do site:</p>
      <div className="ui-actions">
        <Link className="ui-button" href="/coleta">Solicitar coleta <ArrowUpRight size={18} /></Link>
        <Link className="ui-button ui-button-secondary" href="/cotacao">Pedir cotação</Link>
        <Link className="ui-text-link" href="/cidades">Cidades atendidas <ArrowUpRight size={16} /></Link>
        <Link className="ui-text-link" href="/">Página inicial <ArrowUpRight size={16} /></Link>
      </div>
    </section>
  </main><SiteFooter /></div>;
}
