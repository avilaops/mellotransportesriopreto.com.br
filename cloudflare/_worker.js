const TENANT_MELLO = "mello";
const STATUS_SEM_CORPO = new Set([204, 205, 304]);

const erroJson = (status, error) => Response.json({ error }, { status });

function endpointDoTms(env) {
  const configurada = env.TMS_API_URL?.trim();
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

function primeiroIp(req) {
  const primeiro = req.headers.get("x-forwarded-for")?.split(",", 1)[0].trim();
  return primeiro || null;
}

async function POST(req, env) {
  const endpoint = endpointDoTms(env);
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

export default { async fetch(request, env) {
 const url = new URL(request.url);
 if (url.hostname.startsWith('www.')) { url.hostname = 'mellotransportesriopreto.com.br'; return Response.redirect(url, 301); }
 if (url.pathname === '/api/cotacoes') return request.method === 'POST' ? POST(request, env) : new Response(null,{status:405});
 if (['/api/leads','/api/rastreio'].includes(url.pathname)) {
  if (!env.TMS_API_URL) return Response.json({error:'Serviço indisponível.'},{status:503});
  const target = new URL(url.pathname + url.search, env.TMS_API_URL);
  try { return await fetch(new Request(target,request),{redirect:'manual'}); } catch { return Response.json({error:'Serviço temporariamente indisponível.'},{status:502}); }
 }
 return env.ASSETS.fetch(request);
}};
