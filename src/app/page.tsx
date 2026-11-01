import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Ribbon } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";
import { ShortCard, ContactCTA } from "@/components/site/PublicUI";
import { CityLookup } from "@/components/site/CityLookup";
import { LegacyHashRedirect } from "@/components/site/LegacyHashRedirect";
import { publicFleet, publicServices } from "@/data/publicCatalog";
import { totalServiceAreas } from "@/data/serviceAreas";
import { faqs } from "@/data/faq";
import { testimonials } from "@/data/testimonials";
import { company } from "@/config/company";
import "./landing.css";
import "./mobile.css";

export default function HomePage() {
  return <div className="mello-shell"><LegacyHashRedirect /><SiteHeader /><main id="main-content" className="mello-main">
    <section className="ui-home-hero"><div><p className="ui-kicker">Perto da sua empresa. Perto do destino.</p><h1>Coletas e entregas em Rio Preto e região.</h1><p>Atendimento em {totalServiceAreas} cidades. Consulte sua rota e conte com a Mello para o próximo envio.</p><div className="ui-actions"><Link className="ui-button" href="/coleta">Solicitar coleta <ArrowUpRight size={18} /></Link><Link className="ui-button ui-button-secondary" href="/cotacao">Pedir cotação</Link></div></div><figure className="ui-home-photo"><Image src="/images/van-mello.webp" alt="Van de carga com a logo da Mello Transportes" width={1536} height={1024} fetchPriority="high" loading="eager" sizes="(max-width: 760px) 100vw, 50vw" /></figure></section>
    <section aria-labelledby="novembro-azul-title" style={{ background: "linear-gradient(120deg, #082f59, #075985)", color: "#fff", borderRadius: 20, padding: "clamp(24px, 4vw, 44px)", margin: "24px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
      <Ribbon size={56} strokeWidth={1.6} aria-hidden="true" style={{ color: "#7dd3fc", flexShrink: 0 }} />
      <div style={{ flex: "1 1 260px" }}>
        <p style={{ color: "#7dd3fc", fontWeight: 700, letterSpacing: "0.14em", fontSize: 12, margin: "0 0 8px" }}>NOVEMBRO AZUL · A MELLO APOIA</p>
        <h2 id="novembro-azul-title" style={{ color: "#fff", fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.2, margin: "0 0 12px" }}>Cuidar da saúde também faz parte do caminho.</h2>
        <p style={{ color: "#e0f2fe", margin: 0, maxWidth: 640, lineHeight: 1.6 }}>Reserve um tempo para você. Cuide do seu bem-estar e procure orientação de um profissional de saúde.</p>
      </div>
      <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-do-homem/novembro-azul/novembro-azul" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", border: "1px solid #7dd3fc", borderRadius: 999, padding: "12px 20px", fontWeight: 600, textDecoration: "none" }}>Saiba mais sobre o cuidado <ArrowUpRight size={16} aria-hidden="true" style={{ display: "inline", verticalAlign: "middle" }} /></a>
    </section>
    <ul className="ui-trust" aria-label="A Mello em números">
      {company.foundedYear && <li><strong>Desde {company.foundedYear}</strong><span>em São José do Rio Preto</span></li>}
      <li><strong>{totalServiceAreas} cidades</strong><span>atendidas na região</span></li>
      {company.googleRating && <li><a href={company.googleProfileUrl} target="_blank" rel="noopener noreferrer"><strong>{company.googleRating} no Google</strong><span>{company.googleReviewCount} avaliações de clientes <ArrowUpRight size={12} aria-hidden="true" /></span></a></li>}
    </ul>
    <section className="ui-city-block"><h2>A Mello atende sua cidade?</h2><CityLookup /><Link className="ui-text-link" href="/cidades">Ver todas as regiões <ArrowUpRight size={16} /></Link></section>
    <section className="ui-section"><div className="ui-section-heading"><h2>Como podemos ajudar</h2></div><div className="ui-card-list">{publicServices.map((item) => <ShortCard key={item.slug} href={`/servicos/${item.slug}`} title={item.title} />)}</div></section>
    <section className="ui-section"><div className="ui-section-heading"><h2>Conheça a frota</h2><Link className="ui-text-link" href="/frota">Ver opções <ArrowUpRight size={16} /></Link></div><div className="ui-fleet-list">{publicFleet.map((item) => <ShortCard key={item.slug} href={`/frota/${item.slug}`} title={item.title} image={item.image} />)}</div></section>
    <section className="ui-section"><div className="ui-section-heading"><h2>Antes de enviar</h2><Link className="ui-text-link" href="/duvidas">Ver dúvidas <ArrowUpRight size={16} /></Link></div><div className="ui-faq">{faqs.slice(0,3).map(([question,answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>
    {testimonials.length > 0 && <section className="ui-section"><div className="ui-section-heading"><h2>Quem envia com a Mello</h2><a className="ui-text-link" href={company.googleProfileUrl} target="_blank" rel="noopener noreferrer">Ver no Google <ArrowUpRight size={16} /></a></div><div className="ui-testimonials">{testimonials.map((item) => <figure key={item.name + item.quote}><blockquote>{item.quote}</blockquote><figcaption><strong>{item.name}</strong>{item.company && <span>{item.company}</span>}</figcaption></figure>)}</div></section>}
    <ContactCTA />
  </main><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", name: company.name, url: company.pagesUrl, telephone: company.phone, email: company.email, address: { "@type": "PostalAddress", streetAddress: "Rua Bonsucesso, 695 - Quinta das Paineiras", addressLocality: "São José do Rio Preto", addressRegion: "SP", postalCode: company.postalCode, addressCountry: "BR" }, geo: { "@type": "GeoCoordinates", latitude: company.latitude, longitude: company.longitude }, hasMap: company.googleProfileUrl, openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "18:00" }], image: `${company.pagesUrl}preview-whatsapp-v2.png`, ...(company.cnpj ? { taxID: company.cnpj } : {}), ...(company.foundingDate ? { foundingDate: company.foundingDate } : {}), areaServed: company.serviceRegion, makesOffer: publicServices.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.title, description: service.description, url: `${company.pagesUrl}servicos/${service.slug}` } })) }) }} /></div>;
}
