/**
 * Linha do tempo da carga na consulta pública.
 *
 * Os status são os do TMS (`COLLECTION_STATUSES` em avilaops/TMS,
 * src/lib/coletas.ts) e os rótulos seguem os de `COLLECTION_STATUS` em
 * src/lib/format.ts de lá. Mudou lá, mude aqui: um status que esta tela não
 * conhece aparece como "Em andamento", sem etapa marcada além da primeira.
 */

/** O que a rota pública `/api/rastreio` devolve. Nada além disto sai do servidor. */
export type MinutaPublica = {
  id: string;
  trackingCode: string | null;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  /** Trocas de status com a hora real. Coleta antiga pode vir sem histórico. */
  statusHistory?: { toStatus: string; createdAt: string }[];
  tenant?: { name: string } | null;
  manifest: { driver: { user: { name: string } } | null } | null;
};

export type TrackingTone = "progress" | "done" | "stopped";

export type TrackingStep = {
  status: string;
  label: string;
  detail: string;
  reached: boolean;
  /** Hora da troca, quando o TMS registrou. */
  at: string | null;
  tone: TrackingTone;
};

/** Caminho normal da carga, na ordem. */
const FLOW = [
  { status: "PENDING", label: "Solicitação recebida", detail: "O pedido de coleta foi registrado." },
  { status: "CONFIRMED", label: "Coleta confirmada", detail: "A equipe confirmou a coleta." },
  { status: "COLLECTED", label: "Carga coletada", detail: "A mercadoria foi retirada e está com a transportadora." },
  { status: "ROUTE", label: "Em rota de entrega", detail: "A carga saiu para entrega." },
  { status: "DELIVERED", label: "Entregue", detail: "A entrega foi finalizada no destino." },
] as const;

/** Fins de linha fora do caminho normal. */
const STOPPED: Record<string, { label: string; detail: string }> = {
  CANCELLED: { label: "Cancelada", detail: "Esta coleta foi cancelada. Fale com a equipe se precisar de uma nova." },
  REJECTED: { label: "Recusada", detail: "A coleta não pôde ser aceita. A equipe informa o motivo pelo WhatsApp." },
};

export function trackingStatusLabel(status: string): { label: string; tone: TrackingTone } {
  if (STOPPED[status]) return { label: STOPPED[status].label, tone: "stopped" };
  if (status === "DELIVERED") return { label: "Entregue", tone: "done" };
  const step = FLOW.find((item) => item.status === status);
  if (!step) return { label: "Em andamento", tone: "progress" };
  // "Solicitação recebida" é o nome da etapa; como situação atual, o que o
  // cliente precisa ler é que ainda falta a confirmação.
  return { label: status === "PENDING" ? "Aguardando confirmação" : step.label, tone: "progress" };
}

export function trackingSteps(minuta: Pick<MinutaPublica, "status" | "statusHistory" | "createdAt">): TrackingStep[] {
  const history = minuta.statusHistory ?? [];
  // Última vez que a carga entrou em cada status.
  const lastAt = new Map<string, string>();
  for (const entry of history) lastAt.set(entry.toStatus, entry.createdAt);

  const stopped = STOPPED[minuta.status];
  const currentIndex = FLOW.findIndex((item) => item.status === minuta.status);

  const steps: TrackingStep[] = FLOW.map((item, index) => {
    // Carga cancelada ou recusada: só conta como alcançada a etapa que o
    // histórico registrou. Sem histórico, sobra a primeira, que toda coleta teve.
    const reached = stopped ? lastAt.has(item.status) || index === 0 : currentIndex >= 0 ? index <= currentIndex : index === 0;
    return {
      status: item.status,
      label: item.label,
      detail: item.detail,
      reached,
      at: lastAt.get(item.status) ?? (index === 0 ? minuta.createdAt : null),
      tone: item.status === "DELIVERED" ? "done" : "progress",
    };
  });

  if (!stopped) return steps;
  // Depois de cancelada, as etapas que não aconteceram não vão acontecer: saem
  // da lista para não parecerem pendentes.
  return [
    ...steps.filter((step) => step.reached),
    { status: minuta.status, label: stopped.label, detail: stopped.detail, reached: true, at: lastAt.get(minuta.status) ?? null, tone: "stopped" },
  ];
}

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo",
});

/** Data e hora de Brasília, ou vazio quando a data não serve. */
export function formatTrackingDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateTime.format(date).replace(",", " às");
}
