# Mello Transportes Rio Preto: site

Site institucional da **Mello Transportes Rio Preto**, transportadora de cargas fracionadas com sede em São José do Rio Preto/SP e atendimento em mais de 130 cidades da região.

- Site: https://mellotransportesriopreto.com.br
- Sistema de gestão (painel, motorista, portal do cliente): https://tms.avilaops.com, repositório [avilaops/TMS](https://github.com/avilaops/TMS)

Este repositório nasceu em 06/10/2026 da separação do `avilaops/TMS` (antigo `Mello`), a partir do commit `3412b08`. O histórico anterior do site está lá.

## O que tem aqui

| Rota | O que faz |
| --- | --- |
| `/` | Landing: serviços, frota, cidades atendidas, central de coleta e cotação rápida pelo WhatsApp |
| `/cotacao` | Formulário de cotação |
| `/rastreio` | Consulta pública de carga por CNPJ/CPF + código de rastreio |
| `/blog`, `/blog/<slug>` | Matérias |
| `/sitemap.xml`, `/robots.txt` | SEO |

O site não tem banco, login nem dado de cliente. Tudo que precisa de banco é atendido pelo TMS.

## Como o site fala com o TMS

O navegador chama três rotas neste mesmo domínio, e o servidor do site repassa cada uma para o TMS (rewrite em [next.config.ts](next.config.ts)):

| Rota | Quem chama | O que o TMS faz |
| --- | --- | --- |
| `POST /api/cotacoes` | `/cotacao` | Registra a cotação |
| `POST /api/leads` | Cotação rápida e central de coleta da home | Registra o lead no CRM |
| `GET /api/rastreio` | `/rastreio` | Consulta a carga |

O endereço do TMS vem de `TMS_API_URL` e é lido **no build**. Em produção é `https://tms.avilaops.com`, que já é o padrão do [Dockerfile](Dockerfile). Sem a variável, o site abre normalmente, mas esses três envios respondem 404; o WhatsApp continua funcionando, porque não depende da API.

Nenhuma outra rota é repassada. O `x-forwarded-for` do visitante segue junto, e é ele que o TMS usa no limite de tentativas do rastreio: o proxy na frente do site (Caddy, Cloudflare) precisa continuar enviando esse cabeçalho.

## Stack

- **Next.js 16** (App Router, `output: "standalone"`), **React 19**, **TypeScript**
- **Tailwind CSS 4**
- **Leaflet** para o mapa de cidades, **Zod** e **React Hook Form** para formulários

> Esta versão do Next.js tem mudanças de API em relação a versões anteriores. Antes de mexer, consulte `node_modules/next/dist/docs/`.

## Rodando localmente

Requisito: Node 22+.

```bash
npm install
cp .env.example .env    # opcional: TMS_API_URL para testar cotação, lead e rastreio
npm run dev
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção (standalone) |
| `npm start` | Sobe o build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (há erros antigos herdados; o CI ainda não roda lint) |

## Estrutura

```text
src/
  app/            landing, cotacao, rastreio, blog, sitemap
  components/     central de coleta, mapa, cabeçalho e rodapé, analytics
  config/         dados da empresa (company.ts)
  content/        matérias do blog (blog.ts)
  data/           cidades, frota, serviços, FAQ, marca
  lib/            WhatsApp, analytics, normalização
  services/       mensagens e protocolos da central de coleta
public/           ícones, manifesto, capas do blog, manual de marca
assets/           logos em alta
Criativos/        artes e vídeos de anúncio
docs/             manual de marca (texto)
```

## Como atualizar o conteúdo

| O quê | Onde |
| --- | --- |
| Telefone, WhatsApp, e-mail, endereço | [src/config/company.ts](src/config/company.ts) |
| Cidades, polos, prazos e veículos por rota | [src/data/serviceAreas.csv](src/data/serviceAreas.csv) |
| Frota | [src/data/fleet.ts](src/data/fleet.ts) |
| Serviços | [src/data/services.ts](src/data/services.ts) |
| FAQ | [src/data/faq.ts](src/data/faq.ts) |
| Depoimentos | [src/data/testimonials.ts](src/data/testimonials.ts) |
| Mensagens e protocolos de coleta | [src/services/collectionService.ts](src/services/collectionService.ts) |
| Identidade visual e paleta | [src/data/brand.ts](src/data/brand.ts) |

**Não publique** depoimentos, número de entregas, nomes de clientes ou tempo de mercado sem confirmação comercial.

A lista de cidades também existe no TMS (mapa do motorista). Ao mudar aqui, mude lá.

## Blog

As matérias ficam em [src/content/blog.ts](src/content/blog.ts) como blocos tipados. Para publicar, acrescente um objeto em `posts` com `slug`, `title`, `description`, `excerpt`, `category`, `publishedAt`, `readingMinutes` e `body` (opcionalmente `coverImage` e `coverImageAlt`).

A matéria entra sozinha no índice `/blog`, ganha a página `/blog/<slug>` pré-renderizada, aparece no `sitemap.xml` e recebe os dados estruturados de `Article`.

Blocos aceitos no `body`: `p`, `h2`, `h3`, `ul`, `ol`, `note` e `table`. Dentro dos textos, `**assim**` vira negrito. As capas vão em [public/blog-capas/](public/blog-capas/README.md).

## Deploy

O site roda no servidor `applications`, em `/opt/mellotransportesriopreto-com-br`, atrás do Caddy, e segue a Norma de Plataforma da Ávila Ops (`avilaops/infra`, `NORMA-PLATAFORMA.md`): todo nome sai do domínio e nenhuma porta é publicada no host.

| Recurso | Nome |
| --- | --- |
| Diretório | `/opt/mellotransportesriopreto-com-br` |
| Projeto compose | `mellotransportesriopreto-com-br` |
| Container | `mellotransportesriopreto-com-br-web` (rede `edge`, `172.31.0.12:3000`) |
| Imagem | `ghcr.io/avilaops/mellotransportesriopreto.com.br`, por digest |

[.github/workflows/deploy-production.yml](.github/workflows/deploy-production.yml):

- Todo push e PR em `main` roda o typecheck e constrói a imagem Docker, o que inclui o build do site. Fora de PR, a imagem é publicada no GHCR.
- O deploy por SSH só roda na `main`, com a variável `DEPLOY_ENABLED` do repositório em `true` e os segredos `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` e `DEPLOY_KNOWN_HOSTS`. A chave só tem permissão para publicar a aplicação `mellotransportesriopreto.com.br`.
- No servidor, o deploy baixa a imagem pelo digest, troca o container e confere a home; se a versão nova não responder, volta para a anterior.

O site não tem banco nem `.env` em produção. O endereço do TMS (`https://tms.avilaops.com`) é gravado na imagem durante o build; trocar o endereço exige gerar a imagem de novo.

- **DNS:** o domínio do cliente fica na Redehost, com e-mail (MX/SPF) intocado.
- **SEO:** as URLs do site antigo (`/empresa`, `/servicos`, `/faca-um-orcamento` etc.) redirecionam com 301 em [next.config.ts](next.config.ts). `www` redireciona para o apex no Caddy.
- **Voltar versão:** republicar o commit anterior pela `main`. Não há cópia de código nem de build guardada no servidor.

---

Desenvolvido e mantido por [Ávila Ops](https://avilaops.com).
