import type { ServiceArea } from "../types/logistics";
import { normalizeText } from "../lib/normalization";

const csvData = `Cidade;Polo Regional;Prazo de Entrega;Veículo de Rota
Américo Brasiliense;São Carlos;Até 24h;Frota Leve
Araraquara;São Carlos;Até 24h;Frota Leve
Araçatuba;Araçatuba;Até 24h;Frota Leve
Ariranha;Catanduva;Até 24h;Van de Carga
Aspásia;Santa Fé do Sul;Até 24h;Van de Carga
Auriflama;Araçatuba;Até 24h;Frota Leve
Barbosa;Penápolis;Até 24h;Caminhão 3/4 (VUC)
Barretos;Barretos;Até 24h;Frota Leve
Barrinha;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Bebedouro;Barretos;Até 24h;Frota Leve
Bilac;Araçatuba;Até 48h;Frota Leve
Birigui;Araçatuba;Até 24h;Frota Leve
Borborema;Catanduva;Até 24h;Van de Carga
Brasitânia;Santa Fé do Sul;Até 24h;Van de Carga
Buritama;Araçatuba;Até 24h;Frota Leve
Bálsamo;Santa Fé do Sul;Até 24h;Van de Carga
Cajobi;Barretos;Até 24h;Frota Leve
Candido Rodrigues;São Carlos;Até 24h;Frota Leve
Catanduva;Catanduva;Até 24h;Van de Carga
Catiguá;Catanduva;Até 24h;Van de Carga
Cedral;Catanduva;Até 24h;Van de Carga
Colina;Barretos;Até 24h;Frota Leve
Coroados;Penápolis;Até 24h;Caminhão 3/4 (VUC)
Cosmorama;Santa Fé do Sul;Até 24h;Van de Carga
Cravinhos;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Dirce Reis;Santa Fé do Sul;Até 24h;Van de Carga
Dobrada;São Carlos;Até 24h;Frota Leve
Dolcinópolis;Santa Fé do Sul;Até 24h;Van de Carga
Dumont;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Ecatu;Santa Fé do Sul;Até 24h;Van de Carga
Elisiário;Catanduva;Até 24h;Van de Carga
Embaúba;São Carlos;Até 24h;Frota Leve
Estrela d'Oeste;Santa Fé do Sul;Até 24h;Van de Carga
Fernando Prestes;São Carlos;Até 24h;Frota Leve
Fernandópolis;Santa Fé do Sul;Até 24h;Van de Carga
Floreal;Araçatuba;Até 24h;Frota Leve
Gastão Vidigal;Araçatuba;Até 24h;Frota Leve
General Salgado;Araçatuba;Até 24h;Frota Leve
Glicério;Araçatuba;Até 24h;Frota Leve
Guapiaçu;Barretos;Até 24h;Frota Leve
Guarani d'Oeste;Santa Fé do Sul;Até 48h;Van de Carga
Guararapes;Araçatuba;Até 48h;Frota Leve
Guariba;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Ibaté;São Carlos;Até 24h;Frota Leve
Ibirá;Catanduva;Até 24h;Van de Carga
Ibitinga;Catanduva;Até 24h;Van de Carga
Ida Iolanda;Araçatuba;Até 24h;Frota Leve
Indiaporã;Santa Fé do Sul;Até 48h;Van de Carga
Irapuã;Catanduva;Até 24h;Van de Carga
Itaiúba;Araçatuba;Até 24h;Frota Leve
Itajobi;Catanduva;Até 24h;Van de Carga
Itápolis;Catanduva;Até 24h;Van de Carga
Jaborandi;Barretos;Até 24h;Frota Leve
Jaboticabal;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Jaci;São José Do Rio Preto;Até 24h;Caminhão 3/4 (VUC)
Jales;Santa Fé do Sul;Até 24h;Van de Carga
Jardinópolis;Ribeirão Preto;Até 48h;Caminhão 3/4 (VUC)
José Bonifácio;Lins;Até 24h;Caminhão 3/4 (VUC)
Lins;Lins;Até 24h;Caminhão 3/4 (VUC)
Macaubal;Araçatuba;Até 24h;Frota Leve
Macedônia;Santa Fé do Sul;Até 48h;Van de Carga
Magda;Araçatuba;Até 24h;Frota Leve
Marapoama;Catanduva;Até 24h;Van de Carga
Matão;São Carlos;Até 24h;Frota Leve
Mendonça;Lins;Até 48h;Caminhão 3/4 (VUC)
Meridiano;Santa Fé do Sul;Até 24h;Van de Carga
Mira Estrela;Santa Fé do Sul;Até 48h;Van de Carga
Mirassol;São José Do Rio Preto;Até 24h;Caminhão 3/4 (VUC)
Monte Alto;São Carlos;Até 24h;Frota Leve
Monte Aprazível;Araçatuba;Até 24h;Frota Leve
Monte Azul Paulista;Barretos;Até 24h;Frota Leve
Monções;Araçatuba;Até 24h;Frota Leve
Neves Paulista;Araçatuba;Até 24h;Frota Leve
Nhandeara;Araçatuba;Até 24h;Frota Leve
Nipoã;Araçatuba;Até 24h;Frota Leve
Nova Aliança;Lins;Até 24h;Caminhão 3/4 (VUC)
Novais;São Carlos;Até 24h;Frota Leve
Novo Horizonte;Catanduva;Até 24h;Van de Carga
Olímpia;Barretos;Até 24h;Frota Leve
Ouroeste;Santa Fé do Sul;Até 48h;Van de Carga
Palmares Paulista;São Carlos;Até 24h;Frota Leve
Palmeira d'Oeste;Santa Fé do Sul;Até 48h;Van de Carga
Paranapuã;Santa Fé do Sul;Até 24h;Van de Carga
Paraíso;São Carlos;Até 24h;Frota Leve
Parisi;Santa Fé do Sul;Até 24h;Van de Carga
Pedranópolis;Santa Fé do Sul;Até 24h;Van de Carga
Penápolis;Penápolis;Até 24h;Caminhão 3/4 (VUC)
Pindorama;Catanduva;Até 24h;Van de Carga
Pirangi;São Carlos;Até 24h;Frota Leve
Pitangueiras;Barretos;Até 24h;Frota Leve
Planalto;Araçatuba;Até 24h;Frota Leve
Poloni;Araçatuba;Até 24h;Frota Leve
Pontal;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Pontalinda;Santa Fé do Sul;Até 48h;Van de Carga
Populina;Santa Fé do Sul;Até 48h;Van de Carga
Potirendaba;Catanduva;Até 24h;Van de Carga
Pradópolis;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Promissão;Lins;Até 24h;Caminhão 3/4 (VUC)
Ribeirão Preto;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Rubinéia;Santa Fé do Sul;Até 48h;Van de Carga
Santa Adélia;Catanduva;Até 24h;Van de Carga
Santa Albertina;Santa Fé do Sul;Até 48h;Van de Carga
Santa Clara d'Oeste;Santa Fé do Sul;Até 48h;Van de Carga
Santa Ernestina;São Carlos;Até 24h;Frota Leve
Santa Fé do Sul;Santa Fé do Sul;Até 24h;Van de Carga
Santa Rita d'Oeste;Santa Fé do Sul;Até 48h;Van de Carga
Santa Salete;Santa Fé do Sul;Até 24h;Van de Carga
Santana da Ponte Pensa;Santa Fé do Sul;Até 24h;Van de Carga
Santo Antônio do Aracanguá;Araçatuba;Até 24h;Frota Leve
Serrana;Ribeirão Preto;Até 48h;Caminhão 3/4 (VUC)
Sertãozinho;Ribeirão Preto;Até 24h;Caminhão 3/4 (VUC)
Severínia;Barretos;Até 24h;Frota Leve
Simonsen;Santa Fé do Sul;Até 24h;Van de Carga
São Carlos;São Carlos;Até 24h;Frota Leve
São Francisco;Santa Fé do Sul;Até 48h;Van de Carga
São José do Rio Preto;São José Do Rio Preto;Até 24h;Caminhão 3/4 (VUC)
São João das Duas Pontes;Santa Fé do Sul;Até 24h;Van de Carga
São Luís de Japiúba;Araçatuba;Até 24h;Frota Leve
Tabapuã;São Carlos;Até 24h;Frota Leve
Tabatinga;Catanduva;Até 48h;Van de Carga
Tanabi;Santa Fé do Sul;Até 24h;Van de Carga
Taquaritinga;São Carlos;Até 24h;Frota Leve
Terra Roxa;Barretos;Até 24h;Frota Leve
Três Fronteiras;Santa Fé do Sul;Até 24h;Van de Carga
Turiúba;Araçatuba;Até 24h;Frota Leve
Turmalina;Santa Fé do Sul;Até 48h;Van de Carga
Ubarana;Lins;Até 48h;Caminhão 3/4 (VUC)
Uchoa;São Carlos;Até 24h;Frota Leve
União Paulista;Araçatuba;Até 24h;Frota Leve
Urupês;Catanduva;Até 24h;Van de Carga
Urânia;Santa Fé do Sul;Até 24h;Van de Carga
Valentim Gentil;Santa Fé do Sul;Até 24h;Van de Carga
Viradouro;Barretos;Até 24h;Frota Leve
Vista Alegre do Alto;São Carlos;Até 24h;Frota Leve
Vitória Brasil;Santa Fé do Sul;Até 24h;Van de Carga
Votuporanga;Santa Fé do Sul;Até 24h;Van de Carga
Zacarias;Araçatuba;Até 24h;Frota Leve
Álvares Florence;Santa Fé do Sul;Até 24h;Van de Carga`;

const [, ...rows] = csvData.trim().split(/\r?\n/);

export const serviceAreas: ServiceArea[] = rows.map((row) => {
  const [city, hub, deadline, vehicle] = row.split(";");
  const typedDeadline = deadline === "Até 48h" ? "Até 48h" : "Até 24h";
  return { city, hub, deadline: typedDeadline, vehicle, isExtendedDeadline: typedDeadline === "Até 48h" };
});

export const totalServiceAreas = serviceAreas.length;

export function findServiceArea(city: string) {
  const wanted = normalizeText(city);
  return serviceAreas.find((area) => normalizeText(area.city) === wanted);
}

export function suggestServiceAreas(query: string, limit = 8) {
  const wanted = normalizeText(query);
  if (wanted.length < 2) return [];
  return serviceAreas.filter((area) => normalizeText(area.city).includes(wanted)).slice(0, limit);
}

export const hubs = Array.from(new Set(serviceAreas.map((area) => area.hub))).sort();
