# Mello Transportes Rio Preto: site

Site institucional da **Mello Transportes Rio Preto**, transportadora de cargas fracionadas com sede em São José do Rio Preto/SP e atendimento em mais de 130 cidades da região.

- Site: https://mellotransportesriopreto.com.br
- Sistema de gestão (painel, motorista, portal do cliente): https://tms.avilaops.com, repositório [avilaops/TMS](https://github.com/avilaops/TMS)

Este repositório nasceu em 06/10/2026 da separação do `avilaops/TMS` (antigo `Mello`), a partir do commit `3412b08`. O histórico anterior do site está lá.

## O que tem aqui

| Rota | O que faz |
| --- | --- |
| `/` | Home: abertura, números da empresa, busca de cidade, serviços, frota, dúvidas e depoimentos |
| `/servicos`, `/servicos/<servico>` | Os quatro serviços e o detalhe de cada um |
| `/frota`, `/frota/<veiculo>` | Frota Leve, van de carga e Caminhão 3/4 (VUC) |
| `/cidades` | Busca de cidade, polos e mapa |
| `/cidades/<nome>` | Página do polo (nove) ou da cidade atendida (129), no mesmo endereço |
| `/coleta` | Central de coleta: monta o pedido e envia pelo WhatsApp |
| `/cotacao` | Formulário de cotação |
| `/rastreio` | Consulta pública de carga por CNPJ/CPF + código de rastreio |
| `/mercadorias`, `/duvidas`, `/marca` | Preparo da carga, FAQ e identidade visual |
| `/blog`, `/blog/<slug>` | Matérias |
| `/sitemap.xml`, `/robots.txt` | SEO |

Endereço que não existe cai em [src/app/not-found.tsx](src/app/not-found.tsx).

O site não tem banco, login nem dado de cliente. Tudo que precisa de banco é atendido pelo TMS.

## Como o site fala com o TMS

O navegador chama três rotas neste mesmo domínio, e o servidor do site repassa cada uma para o TMS (rewrite em [next.config.ts](next.config.ts)):

| Rota | Quem chama | O que o TMS faz |
| --- | --- | --- |
| `POST /api/cotacoes` | `/cotacao` | Registra a cotação |
| `POST /api/leads` | Central de coleta (`/coleta`) | Registra o lead no CRM |
| `GET /api/rastreio` | `/rastreio` | Consulta a carga |

O endereço do TMS vem de `TMS_API_URL` e é lido **no build**. Em produção é `https://tms.avilaops.com`, que já é o padrão do [Dockerfile](Dockerfile). Sem a variável, o site abre normalmente, mas esses três envios respondem 404; o WhatsApp continua funcionando, porque não depende da API.

Quando o TMS não responde (erro 5xx ou sem conexão), a cotação e o rastreio mostram um aviso com o pedido já montado para seguir pelo WhatsApp. A coleta abre o WhatsApp de qualquer jeito.

Nenhuma outra rota é repassada. O `x-forwarded-for` do visitante segue junto, e é ele que o TMS usa no limite de tentativas do rastreio: o proxy na frente do site (Caddy, Cloudflare) precisa continuar enviando esse cabeçalho.

## Stack

- **Next.js 16** (App Router, `output: "standalone"`), **React 19**, **TypeScript**
- **Tailwind CSS 4**
- **Leaflet** para o mapa de cidades

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
| `npm run lint` | ESLint (roda no CI junto com o typecheck) |

## Estrutura

```text
src/
  app/            home, páginas de seção, serviço, veículo e cidade, cotacao, rastreio, blog, sitemap
  components/     central de coleta, mapa, cabeçalho e rodapé, busca de cidade, analytics
  config/         dados da empresa (company.ts)
  content/        matérias do blog (blog.ts)
  data/           cidades, catálogo público (serviços, frota, polos e cidades), FAQ, depoimentos, marca
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
| Telefone, WhatsApp, e-mail, endereço, horário, CNPJ, ano de fundação, nota e link do Google | [src/config/company.ts](src/config/company.ts) |
| Cidades, polos, prazos e veículos por rota | [src/data/serviceAreas.ts](src/data/serviceAreas.ts) |
| Serviços e páginas de veículo | [src/data/publicCatalog.ts](src/data/publicCatalog.ts) |
| Lista de veículos do formulário de coleta | [src/data/fleet.ts](src/data/fleet.ts) |
| FAQ | [src/data/faq.ts](src/data/faq.ts) |
| Depoimentos | [src/data/testimonials.ts](src/data/testimonials.ts) |
| Mensagens e protocolos de coleta | [src/services/collectionService.ts](src/services/collectionService.ts) |
| Identidade visual e paleta | [src/data/brand.ts](src/data/brand.ts) |

**Não publique** depoimentos, número de entregas ou nomes de clientes sem confirmação comercial. O que está no ar foi confirmado em 08/10/2026: CNPJ e início de atividade pela Receita, nota, horário e os dois depoimentos pelo Perfil da Empresa no Google.

Decisões do Nicolas em 08/10/2026 que valem para o conteúdo:

- Os veículos se chamam **Frota Leve**, **Van de carga** e **Caminhão 3/4 (VUC)**.
- **RNTRC/ANTT não fica exposto** no site.
- A Mello **não faz motofrete nem malote**. O CNAE, o site antigo e avaliações antigas citam esses serviços; são histórico, não oferta.
- A nota do Google (`googleRating`, `googleReviewCount`) é fixa no código: confira no perfil antes de alterar.

As fotos de frota são ilustrações geradas por IA. O Nicolas mandou tirar do site os avisos de "imagem ilustrativa" em 08/10/2026; não recolocar. Trocar por fotos reais quando a Mello enviar.

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

- Todo push e PR em `main` roda o typecheck e o lint e constrói a imagem Docker, o que inclui o build do site. Fora de PR, a imagem é publicada no GHCR.
- O deploy por SSH só roda na `main`, com a variável `DEPLOY_ENABLED` do repositório em `true` e os segredos `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` e `DEPLOY_KNOWN_HOSTS`. A chave só tem permissão para publicar a aplicação `mellotransportesriopreto.com.br`. Está ligado desde 08/10/2026: merge na `main` publica sozinho, e o passo tenta até três vezes, porque o GHCR às vezes demora a servir a imagem recém-enviada.
- No servidor, o deploy baixa a imagem pelo digest, troca o container e confere a home; se a versão nova não responder, volta para a anterior.

O site não tem banco nem `.env` em produção. O endereço do TMS (`https://tms.avilaops.com`) é gravado na imagem durante o build; trocar o endereço exige gerar a imagem de novo.

- **DNS:** o domínio do cliente fica na Redehost, com e-mail (MX/SPF) intocado.
- **SEO:** as URLs do site antigo (`/empresa`, `/servicos`, `/faca-um-orcamento` etc.) redirecionam com 301 em [next.config.ts](next.config.ts). `www` redireciona para o apex no Caddy.
- **Voltar versão:** republicar o commit anterior pela `main`. Não há cópia de código nem de build guardada no servidor.

---

Desenvolvido e mantido por [Ávila Ops](https://avilaops.com).
