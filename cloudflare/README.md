# Cloudflare Pages

Projeto: `mellotransportesriopreto`. Saída pública: `out`. Fonte: este repositório.

O workflow `.github/workflows/cloudflare-pages.yml` publica cada push na main. O segredo `CLOUDFLARE_API_TOKEN` tem somente acesso ao Pages da conta Avila Ops.

Domínios e redirecionamento de www são configurados na zona Cloudflare. Não alterar MX, TXT nem subdomínios de outros aplicativos.

As cotações, leads e rastreio dependem do TMS externo. Configure `TMS_API_URL` nas variáveis de produção do Pages.
