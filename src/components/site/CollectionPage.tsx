"use client";
import dynamic from "next/dynamic";
const CollectionCenter = dynamic(() => import("@/components/CollectionCenter").then((mod) => mod.CollectionCenter), { ssr: false, loading: () => <section className="central-page"><div className="central-head"><h1>Solicitar coleta</h1><p role="status">Carregando formulário de coleta…</p></div></section> });
export function CollectionPage() { return <div className="ui-collection"><CollectionCenter /></div>; }
