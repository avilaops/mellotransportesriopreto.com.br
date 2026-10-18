import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/cotacoes/route";

const URL_TMS = "https://tms.exemplo.br/";

function requisicao(body: BodyInit, headers: HeadersInit = { "content-type": "application/json" }) {
  return new Request("https://mellotransportesriopreto.com.br/api/cotacoes", {
    method: "POST",
    headers,
    body,
  });
}

describe("POST /api/cotacoes", () => {
  beforeEach(() => {
    vi.stubEnv("TMS_API_URL", URL_TMS);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("força o tenant Mello e encaminha somente JSON e o primeiro IP", async () => {
    const fetchTms = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ id: "cotacao-1" }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchTms);

    const resposta = await POST(
      requisicao(JSON.stringify({ empresa: "outra", companyName: "Cliente" }), {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.10, 10.0.0.2",
        cookie: "sessao=nao-encaminhar",
        authorization: "Bearer nao-encaminhar",
      }),
    );

    expect(resposta.status).toBe(201);
    expect(await resposta.json()).toEqual({ id: "cotacao-1" });
    expect(fetchTms).toHaveBeenCalledTimes(1);

    const [url, init] = fetchTms.mock.calls[0];
    expect(String(url)).toBe("https://tms.exemplo.br/api/cotacoes");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({ empresa: "mello", companyName: "Cliente" });
    expect(Object.fromEntries(new Headers(init?.headers))).toEqual({
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.10",
    });
  });

  it("preserva o status, o corpo e o tipo de conteúdo devolvidos pelo TMS", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify({ error: "Empresa não encontrada." }), {
          status: 404,
          headers: { "content-type": "application/json; charset=utf-8" },
        }),
      ),
    );

    const resposta = await POST(requisicao(JSON.stringify({ companyName: "Cliente" })));

    expect(resposta.status).toBe(404);
    expect(resposta.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await resposta.json()).toEqual({ error: "Empresa não encontrada." });
  });

  it.each([204, 205, 304])("preserva resposta %i sem corpo", async (status) => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })));

    const resposta = await POST(requisicao(JSON.stringify({ companyName: "Cliente" })));

    expect(resposta.status).toBe(status);
    expect(await resposta.text()).toBe("");
  });

  it.each([undefined, "não é url", "ftp://tms.exemplo.br", "https://usuario:senha@tms.exemplo.br"])(
    "recusa TMS_API_URL inválida (%s) sem chamada externa",
    async (url) => {
      if (url === undefined) vi.stubEnv("TMS_API_URL", "");
      else vi.stubEnv("TMS_API_URL", url);
      const fetchTms = vi.fn<typeof fetch>();
      vi.stubGlobal("fetch", fetchTms);

      const resposta = await POST(requisicao(JSON.stringify({ companyName: "Cliente" })));

      expect(resposta.status).toBe(503);
      expect(await resposta.json()).toEqual({ error: "Serviço de cotações indisponível." });
      expect(fetchTms).not.toHaveBeenCalled();
    },
  );

  it("transforma falha de rede no TMS em 502 para acionar o fallback", async () => {
    vi.stubGlobal("fetch", vi.fn<typeof fetch>().mockRejectedValue(new TypeError("rede indisponível")));

    const resposta = await POST(requisicao(JSON.stringify({ companyName: "Cliente" })));

    expect(resposta.status).toBe(502);
    expect(await resposta.json()).toEqual({ error: "Não foi possível registrar a cotação." });
  });

  it("recusa JSON inválido sem chamada externa", async () => {
    const fetchTms = vi.fn<typeof fetch>();
    vi.stubGlobal("fetch", fetchTms);

    const resposta = await POST(requisicao("{incompleto"));

    expect(resposta.status).toBe(400);
    expect(await resposta.json()).toEqual({ error: "Pedido de cotação inválido." });
    expect(fetchTms).not.toHaveBeenCalled();
  });
});

describe("rewrites públicos", () => {
  it("deixa a cotação com a Route Handler e mantém somente lead e rastreio no proxy genérico", async () => {
    vi.resetModules();
    vi.stubEnv("TMS_API_URL", URL_TMS);
    const { default: nextConfig } = await import("../next.config");
    const config = nextConfig as { rewrites: () => Promise<Array<{ source: string }>> };
    const sources = (await config.rewrites()).map((rewrite) => rewrite.source);

    expect(sources).toEqual(["/api/leads", "/api/rastreio"]);
  });
});
