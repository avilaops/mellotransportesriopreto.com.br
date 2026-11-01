"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { findServiceArea, suggestServiceAreas } from "@/data/serviceAreas";
import { routeSlug } from "@/data/publicCatalog";

/** Mesmo endereço para cidade e polo: /cidades/<nome>. */
const cityHref = (city: string) => `/cidades/${routeSlug(city)}`;
import { whatsappUrl } from "@/lib/whatsapp";

export function CityLookup({ prominent = false }: { prominent?: boolean }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const result = findServiceArea(query);
  return <div className={prominent ? "ui-city-lookup home-city-lookup" : "ui-city-lookup"}>
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      <label htmlFor={id}>Qual é a cidade de destino?</label>
      <div className="ui-search-field"><Search size={20} aria-hidden="true" /><input id={id} value={query} onChange={(event) => { setQuery(event.target.value); setSubmitted(false); }} list={`${id}-options`} placeholder={prominent ? "Digite o nome da sua cidade" : "Ex.: Mirassol"} autoComplete="off" required /><button type="submit" aria-label="Consultar cidade">{prominent ? <>Buscar <ArrowUpRight size={18} /></> : <ArrowUpRight size={22} />}</button></div>
      <datalist id={`${id}-options`}>{suggestServiceAreas(query).map((area) => <option key={area.city} value={area.city} />)}</datalist>
    </form>
    <div aria-live="polite">
      {result ? <div className="ui-city-result"><strong>{result.city} é atendida</strong><p>Prazo previsto: {result.deadline.toLowerCase()}. Confirme a programação com a equipe.</p><Link href={cityHref(result.city)}>Ver prazo e detalhes de {result.city} <ArrowUpRight size={16} /></Link><a href={whatsappUrl(`Olá! Gostaria de confirmar uma coleta para ${result.city}.`)} target="_blank" rel="noopener noreferrer">Confirmar pelo WhatsApp</a></div> : submitted && <div className="ui-city-result"><strong>Vamos confirmar essa cidade?</strong><p>A cidade informada não está na relação pública.</p><a href={whatsappUrl(`Olá! Vocês atendem a cidade de ${query.trim()}?`)} target="_blank" rel="noopener noreferrer">Consultar a equipe <ArrowUpRight size={16} /></a></div>}
    </div>
  </div>;
}
