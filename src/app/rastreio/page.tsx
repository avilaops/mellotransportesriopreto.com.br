"use client";

import { useState } from "react";
import { Search, Truck, Box, Loader2 } from "lucide-react";
import { TrackingResult } from "@/components/site/TrackingResult";
import { takeTrackingCodeDigits } from "@/lib/tracking";
import type { MinutaPublica } from "@/lib/trackingTimeline";
import { whatsappUrl } from "@/lib/whatsapp";

export default function RastreioPage() {
  const [doc, setDoc] = useState("");
  const [codigo, setCodigo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [resultados, setResultados] = useState<MinutaPublica[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [indisponivel, setIndisponivel] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc || !codigo) return;

    setIsSearching(true);
    setErro(null);
    setIndisponivel(false);
    try {
      const params = new URLSearchParams({ cnpj: doc, codigo });
      const res = await fetch(`/api/rastreio?${params}`);
      if (res.ok) {
        setResultados(await res.json());
      } else if (res.status === 429) {
        // Unica mensagem diferente da generica, e ela nao fala de dado nenhum:
        // e sobre o volume de tentativas, nao sobre o que existe no banco.
        setResultados(null);
        setErro("Muitas consultas seguidas. Aguarde alguns minutos e tente de novo.");
      } else if (res.status >= 500) {
        // Falha nossa, não ausência de carga: dizer "não localizada" aqui faria
        // o cliente achar que o código está errado.
        setResultados(null);
        setIndisponivel(true);
      } else {
        setResultados([]);
      }
    } catch (error) {
      console.error("Erro na busca", error);
      setResultados(null);
      setIndisponivel(true);
    } finally {
      setIsSearching(false);
    }
  };

  const somenteDigitos = (value: string) => value.replace(/\D/g, "");


  return (
    <div className="min-h-[65vh] bg-gray-50 flex flex-col items-center pt-16 px-4">
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="w-16 h-16 bg-[#f28a00] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-600/20">
          <Truck className="w-8 h-8 text-gray-950" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Rastreamento de cargas</h1>
        <p className="text-gray-500">Informe o CNPJ ou CPF do contratante e o código de rastreio da carga.</p>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 mb-8 border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="rastreio-doc" className="block text-sm font-medium text-gray-700 mb-1.5">
                CNPJ ou CPF do contratante
              </label>
              {/* inputMode numérico abre o teclado de números no celular; sem
                  máscara, para o cliente poder colar o documento como vier. */}
              <input
                id="rastreio-doc"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={doc}
                onChange={(e) => setDoc(somenteDigitos(e.target.value))}
                placeholder="Somente números"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="rastreio-codigo" className="block text-sm font-medium text-gray-700 mb-1.5">
                Código de rastreio
              </label>
              <input
                id="rastreio-codigo"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={codigo}
                onChange={(e) => setCodigo(takeTrackingCodeDigits(e.target.value))}
                placeholder="10 números"
                aria-describedby="rastreio-ajuda"
                className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 font-mono tracking-wider"
              />
            </div>
          </div>
          <p id="rastreio-ajuda" className="text-xs text-gray-500">
            O código de 10 números está na minuta da coleta. Se não tiver em mãos, peça à
            equipe da Mello pelo WhatsApp ou pelo telefone do rodapé.
          </p>
          <button
            type="submit"
            disabled={isSearching || !doc || !codigo}
            className="w-full sm:w-auto sm:self-end bg-[#f28a00] hover:bg-orange-700 disabled:bg-orange-400 text-gray-950 px-8 py-4 rounded-xl font-medium shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5 mr-2" /> Buscar</>}
          </button>
        </form>
      </div>

      {indisponivel && (
        <div role="alert" className="w-full max-w-2xl mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm text-center">
          <p className="font-semibold mb-1">A consulta está indisponível no momento.</p>
          <p className="mb-3">Isso não quer dizer que a carga não existe. A equipe informa o andamento pelo WhatsApp.</p>
          <a
            href={whatsappUrl(`Olá! Gostaria de saber o andamento da carga com código de rastreio ${codigo}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#f28a00] text-gray-950 font-bold px-5 py-3 rounded-xl hover:bg-orange-700 transition"
          >
            Consultar pelo WhatsApp
          </a>
        </div>
      )}

      {erro && (
        <div className="w-full max-w-2xl mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center">
          {erro}
        </div>
      )}

      {resultados !== null && (
        <div className="w-full max-w-2xl space-y-6">
          {resultados.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                Não foi possível localizar uma carga com os dados informados.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Confira o documento e o código de rastreio e tente novamente.
              </p>
            </div>
          ) : (
            resultados.map((minuta) => <TrackingResult key={minuta.id} minuta={minuta} />)
          )}
        </div>
      )}
    </div>
  );
}
