import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs, ContactCTA, PageIntro } from "@/components/site/PublicUI";
import { company } from "@/config/company";
import { publicCities, publicHubs } from "@/data/publicCatalog";
import { publicMetadata } from "@/lib/publicMetadata";
import { whatsappUrl } from "@/lib/whatsapp";

// Uma página por cidade atendida (138). As buscas que ela responde, pedidas
// pelo Nicolas em 08/10/2026: "carga rápida para <cidade>", "Rio Preto a
// <cidade>" e "transporte de <cidade> para <outra cidade>".
//
// A terceira é atendida aqui dentro, pela lista de destinos de cada cidade, e
// não por uma página para cada par: seriam quase 19 mil páginas iguais entre
// si, sem prazo próprio (a tabela só tem prazo a partir de Rio Preto), que é o
// que o Google trata como conteúdo em escala e pode derrubar o domínio inteiro.
//
// A cidade que dá nome a um polo mostra também as cidades do polo.
export const dynamicParams = false;
export function generateStaticParams() { return publicCities.map(({ slug }) => ({ slug })); }

const HOME_CITY = "São José do Rio Preto";

function texts(city: (typeof publicCities)[number]) {
  const prazo = city.deadline.toLowerCase();
  if (city.city === HOME_CITY) return {
    title: `Carga rápida em ${HOME_CITY}: coletas e entregas na cidade e região`,
    description: `Transporte de carga em ${HOME_CITY} (SP) com a Mello Transportes: coleta na sua empresa, entrega na cidade com prazo previsto de ${prazo} e saída para ${publicCities.length - 1} cidades da região.`,
    h1: `Carga rápida em ${HOME_CITY}`,
    intro: `A Mello Transportes fica em ${HOME_CITY}. Coleta na sua empresa, entrega dentro da cidade com prazo previsto de ${prazo} e leva sua carga para ${publicCities.length - 1} cidades da região.`,
    routeTitle: `Dentro de Rio Preto e para a região`,
    route: `Coletas e entregas dentro de ${HOME_CITY} saem da sede da Mello, na Quinta das Paineiras. Para as demais cidades, a carga segue pelos polos regionais, com prazo previsto de até 24h ou até 48h conforme a rota.`,
  };
  return {
    title: `Carga rápida para ${city.city}: transporte de Rio Preto a ${city.city}`,
    description: `Transporte de carga de São José do Rio Preto a ${city.city} (SP) com a Mello Transportes: prazo previsto de ${prazo}, coleta na sua empresa e entrega em ${city.city}. Peça uma cotação.`,
    h1: `Carga rápida para ${city.city}`,
    intro: `A Mello Transportes leva sua carga de Rio Preto a ${city.city} com prazo previsto de ${prazo}. Coleta na sua empresa, entrega em ${city.city} e atendimento pelo WhatsApp.`,
    routeTitle: `De Rio Preto a ${city.city}`,
    route: `A rota de São José do Rio Preto a ${city.city} é atendida pelo polo de ${city.hubName}, com prazo previsto de ${prazo}. O caminho de volta, de ${city.city} para Rio Preto, segue a mesma programação: a equipe confirma a coleta em ${city.city} e a data de entrega.`,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = publicCities.find((item) => item.slug === slug);
  if (!city) notFound();
  const text = texts(city);
  return publicMetadata(text.title, text.description, `/cidades/${slug}`);
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = publicCities.find((item) => item.slug === slug);
  if (!city) notFound();
  const text = texts(city);
  const hub = city.isHub ? publicHubs.find((item) => item.slug === city.slug) : undefined;
  const destinations = publicHubs
    .map((item) => ({ name: item.name, cities: publicCities.filter((other) => other.hubSlug === item.slug && other.slug !== city.slug) }))
    .filter((group) => group.cities.length > 0);

  return <>
    <Breadcrumbs items={[{ title: "Cidades", href: "/cidades" }, ...(city.isHub ? [] : [{ title: city.hubName, href: `/cidades/${city.hubSlug}` }]), { title: city.city }]} />
    <PageIntro label={city.isHub ? "Cidade atendida e polo regional" : "Cidade atendida"} title={text.h1} description={text.intro} />
    <dl className="ui-city-facts">
      <div><dt>Prazo previsto</dt><dd>{city.deadline}</dd></div>
      <div><dt>Polo regional</dt><dd>{city.isHub ? city.hubName : <Link href={`/cidades/${city.hubSlug}`}>{city.hubName}</Link>}</dd></div>
      <div><dt>Veículo habitual da rota</dt><dd>{city.vehicleSlug ? <Link href={`/frota/${city.vehicleSlug}`}>{city.vehicle}</Link> : city.vehicle}</dd></div>
    </dl>
    <div className="ui-actions ui-city-actions">
      <Link className="ui-button" href="/coleta">Solicitar coleta <ArrowUpRight size={18} /></Link>
      <Link className="ui-button ui-button-secondary" href="/cotacao">Pedir cotação</Link>
      <a className="ui-text-link" href={whatsappUrl(`Olá! Gostaria de enviar uma carga para ${city.city}.`)} target="_blank" rel="noopener noreferrer">Confirmar pelo WhatsApp <ArrowUpRight size={16} /></a>
    </div>

    <section className="ui-section ui-city-copy"><h2>{text.routeTitle}</h2><p>{text.route}</p>
      <p className="ui-note">Prazo e veículo são os da rota cadastrada e servem para planejamento. A equipe confirma a programação, a carga e as condições do endereço antes da coleta.</p>
    </section>

    {hub && <section className="ui-section"><h2>Cidades atendidas pelo polo de {hub.name}</h2><ul className="ui-city-list">{hub.areas.map((area) => { const page = publicCities.find((item) => item.city === area.city); return <li key={area.city}>{page && page.slug !== city.slug ? <Link href={`/cidades/${page.slug}`}>{area.city}</Link> : <span>{area.city}</span>}<small>{area.deadline}</small></li>; })}</ul></section>}

    <section className="ui-section ui-city-copy"><h2>Transporte de {city.city} para outras cidades</h2>
      <p>A Mello também coleta em {city.city} e entrega nas demais cidades atendidas. Escolha o destino para ver o prazo da rota, ou peça a cotação informando origem e destino.</p>
      {destinations.map((group) => <div key={group.name} className="ui-city-destinations"><h3>Transporte de {city.city} para a região de {group.name}</h3><p>{group.cities.map((other, index) => <span key={other.slug}>{index > 0 && ", "}<Link href={`/cidades/${other.slug}`}>{other.city}</Link></span>)}.</p></div>)}
    </section>

    <ContactCTA title={`Precisa enviar para ${city.city}?`} message={`Olá! Gostaria de confirmar uma coleta para ${city.city}.`} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Service", name: text.h1, serviceType: "Transporte rodoviário de carga fracionada", description: text.description, url: `${company.pagesUrl}cidades/${city.slug}`, provider: { "@type": "LocalBusiness", name: company.name, url: company.pagesUrl, telephone: company.phone }, areaServed: { "@type": "City", name: city.city, containedInPlace: { "@type": "State", name: "São Paulo" } } }) }} />
  </>;
}
