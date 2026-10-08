import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, ContactCTA, PageIntro } from "@/components/site/PublicUI";
import { publicCities, publicHubs } from "@/data/publicCatalog";
import { publicMetadata } from "@/lib/publicMetadata";
import { whatsappUrl } from "@/lib/whatsapp";

// O mesmo endereço atende polo e cidade: /cidades/aracatuba é o polo (com a
// lista da região) e /cidades/birigui é a cidade. As nove cidades que dão nome
// a um polo ficam só com a página do polo.
export const dynamicParams = false;
export function generateStaticParams() { return [...publicHubs, ...publicCities].map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = publicHubs.find((item) => item.slug === slug);
  if (hub) return publicMetadata(`Transporte na região de ${hub.name}`, `Consulte as ${hub.areas.length} cidades atendidas pelo polo de ${hub.name}, os prazos previstos e solicite uma coleta.`, `/cidades/${slug}`);
  const city = publicCities.find((item) => item.slug === slug);
  if (!city) notFound();
  return publicMetadata(`Coletas e entregas em ${city.city}`, `A Mello Transportes atende ${city.city} (SP) pelo polo de ${city.hubName}, com prazo previsto de ${city.deadline.toLowerCase()}. Consulte a rota e solicite uma coleta.`, `/cidades/${slug}`);
}

export default async function CityOrHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = publicHubs.find((item) => item.slug === slug);
  if (hub) return <><Breadcrumbs items={[{ title: "Cidades", href: "/cidades" }, { title: hub.name }]} /><PageIntro label="Polo regional" title={hub.name} description={`${hub.areas.length} cidades atendidas neste polo. Confira seu destino e o prazo previsto.`} />
    <ul className="ui-city-list">{hub.areas.map((area) => { const page = publicCities.find((item) => item.city === area.city); return <li key={area.city}>{page ? <Link href={`/cidades/${page.slug}`}>{area.city}</Link> : <span>{area.city}</span>}<small>{area.deadline}</small></li>; })}</ul>
    <p className="ui-note">Os prazos da relação são estimativas de rota. Confirme a programação, a carga e as condições do destino antes do envio.</p><Link className="ui-text-link" href="/cidades">← Consultar outra região</Link>
    <ContactCTA title={`Precisa enviar para a região de ${hub.name}?`} message={`Olá! Gostaria de confirmar uma coleta para a região de ${hub.name}.`} />
  </>;

  const city = publicCities.find((item) => item.slug === slug);
  if (!city) notFound();
  const neighbors = publicCities.filter((item) => item.hubSlug === city.hubSlug && item.slug !== city.slug);
  return <><Breadcrumbs items={[{ title: "Cidades", href: "/cidades" }, { title: city.hubName, href: `/cidades/${city.hubSlug}` }, { title: city.city }]} />
    <PageIntro label="Cidade atendida" title={`Coletas e entregas em ${city.city}`} description={`${city.city} está na rota do polo de ${city.hubName}. A Mello coleta na sua empresa e entrega na região, com prazo previsto de ${city.deadline.toLowerCase()}.`} />
    <dl className="ui-city-facts">
      <div><dt>Prazo previsto</dt><dd>{city.deadline}</dd></div>
      <div><dt>Polo regional</dt><dd><Link href={`/cidades/${city.hubSlug}`}>{city.hubName}</Link></dd></div>
      <div><dt>Veículo habitual da rota</dt><dd>{city.vehicleSlug ? <Link href={`/frota/${city.vehicleSlug}`}>{city.vehicle}</Link> : city.vehicle}</dd></div>
    </dl>
    <p className="ui-note">Prazo e veículo são os da rota cadastrada e servem para planejamento. A equipe confirma a programação, a carga e as condições do endereço antes da coleta.</p>
    <div className="ui-actions ui-city-actions">
      <Link className="ui-button" href="/coleta">Solicitar coleta <ArrowUpRight size={18} /></Link>
      <Link className="ui-button ui-button-secondary" href="/cotacao">Pedir cotação</Link>
      <a className="ui-text-link" href={whatsappUrl(`Olá! Gostaria de confirmar uma coleta para ${city.city}.`)} target="_blank" rel="noopener noreferrer">Confirmar pelo WhatsApp <ArrowUpRight size={16} /></a>
    </div>
    {neighbors.length > 0 && <section className="ui-section"><h2>Outras cidades do polo de {city.hubName}</h2><ul className="ui-city-list">{neighbors.map((item) => <li key={item.slug}><Link href={`/cidades/${item.slug}`}>{item.city}</Link><small>{item.deadline}</small></li>)}</ul></section>}
    <ContactCTA title={`Precisa enviar para ${city.city}?`} message={`Olá! Gostaria de confirmar uma coleta para ${city.city}.`} />
  </>;
}
