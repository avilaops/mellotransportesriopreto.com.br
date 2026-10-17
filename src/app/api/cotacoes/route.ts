const TENANT_MELLO = "mello";
const STATUS_SEM_CORPO = new Set([204, 205, 304]);

const erroJson = (status: number, error: string) => Response.json({ error }, { status });

function endpointDoTms(): URL | null {
  const configurada = process.env.TMS_API_URL?.trim();
  if (!configurada) return null;

  try {
    const origem = new URL(configurada);
    if (!['http:', 'https:'].includes(origem.protocol)) return null;
    if (origem.username || origem.password) return null;
    return new URL("/api/cotacoes", origem);
  } catch {
    return null;
  }
}

function primeiroIp(req: Request): string | null {
  const primeiro = req.headers.get("x-forwarded-for")?.split(",", 1)[0].trim();
  return primeiro || null;
}

export async function POST(req: Request): Promise<Response> {
  const endpoint = endpointDoTms();
  if (!endpoint) return erroJson(503, "Serviço de cotações indisponível.");

  const recebido = await req.json().catch(() => null);
  if (!recebido || typeof recebido !== "object" || Array.isArray(recebido)) {
    return erroJson(400, "Pedido de cotação inválido.");
  }

  const headers = new Headers({ "content-type": "application/json" });
  const ip = primeiroIp(req);
  if (ip) headers.set("x-forwarded-for", ip);

  try {
    const resposta = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...recebido, empresa: TENANT_MELLO }),
      redirect: "manual",
    });
    const respostaHeaders = new Headers();
    const contentType = resposta.headers.get("content-type");
    if (contentType) respostaHeaders.set("content-type", contentType);

    const corpo = STATUS_SEM_CORPO.has(resposta.status) ? null : await resposta.arrayBuffer();
    return new Response(corpo, {
      status: resposta.status,
      headers: respostaHeaders,
    });
  } catch {
    return erroJson(502, "Não foi possível registrar a cotação.");
  }
}
