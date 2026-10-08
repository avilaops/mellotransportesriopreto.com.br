import type { NextConfig } from "next";

/**
 * Endereco do TMS (sistema de gestao), sem barra no final.
 *
 * O site nao tem banco: cotacao, lead e consulta de rastreio sao atendidos pelo
 * TMS. O navegador continua chamando /api/... neste mesmo dominio e o servidor
 * do site repassa, entao nao ha CORS nem endereco do sistema exposto na pagina.
 */
const tmsApiUrl = process.env.TMS_API_URL?.replace(/\/+$/, "") ?? "";

/** As unicas rotas do TMS que o site publico usa. Nada alem disto e repassado. */
const tmsPublicRoutes = ["/api/cotacoes", "/api/leads", "/api/rastreio"];

/**
 * Redirecionamentos do site antigo (Redehost, PHP) para o site novo.
 *
 * As 16 URLs abaixo estavam no sitemap.xml publicado em
 * www.mellotransportesriopreto.com.br e ja estao indexadas. Quando o DNS do
 * dominio apontar para o nosso servidor, cada uma precisa cair na secao
 * equivalente da pagina nova, senao vira 404 e o ranking se perde.
 *
 * O www e redirecionado para o apex pelo Caddy, entao aqui so tratamos o path.
 */
const legacyRedirects = [
  { source: "/empresa", destination: "/#inicio" },
  
  { source: "/nossa-frota", destination: "/frota" },
  { source: "/cidades-atendidas", destination: "/cidades" },
  { source: "/faca-um-orcamento", destination: "/cotacao" },
  { source: "/contato", destination: "/coleta" },
  { source: "/entregas-express", destination: "/servicos" },
  // Paginas de servico do CMS antigo: /13/servico/motofrete e afins.
  { source: "/:id/servico/:slug", destination: "/servicos" },
  // Painel administrativo do CMS antigo, que deixa de existir na migracao.
  // O login agora mora no TMS; sem o endereco configurado, cai na home.
  { source: "/painel", destination: tmsApiUrl ? `${tmsApiUrl}/login` : "/" },
  { source: "/painel/:path*", destination: tmsApiUrl ? `${tmsApiUrl}/login` : "/" },
];

const nextConfig: NextConfig = {
  // Gera .next/standalone para rodar em container no Hetzner (node server.js).
  output: "standalone",
  async redirects() {
    // 301 e nao 308: as URLs vem de um CMS de 2015 e de ferramentas de SEO
    // antigas, que lidam melhor com o codigo classico.
    return legacyRedirects.map((rule) => ({ ...rule, statusCode: 301 }));
  },
  async rewrites() {
    if (!tmsApiUrl) return [];
    return tmsPublicRoutes.map((route) => ({
      source: route,
      destination: `${tmsApiUrl}${route}`,
    }));
  },
};

export default nextConfig;
