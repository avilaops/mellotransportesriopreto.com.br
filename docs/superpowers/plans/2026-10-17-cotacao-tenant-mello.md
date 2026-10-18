# Cotação do tenant Mello Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Garantir no servidor do site que toda cotação pública seja encaminhada exclusivamente ao tenant `mello` do TMS.

**Architecture:** Uma Route Handler local assume `/api/cotacoes`, força o slug `mello` e atua como proxy estreito para a mesma rota no TMS. Os rewrites de lead e rastreio continuam no `next.config.ts`; o TMS e seus dados não mudam.

**Tech Stack:** Next.js 16 Route Handlers, TypeScript, Vitest, Node.js 22+

**Spec:** `docs/superpowers/specs/2026-10-17-cotacao-tenant-mello-design.md`

## Global Constraints

- Nenhuma chamada de teste pode alcançar o TMS real.
- Nenhum servidor, banco ou configuração de produção pode ser alterado diretamente.
- O tenant é sempre `mello`, definido no servidor e impossível de sobrescrever pelo corpo recebido.
- Mensagens, analytics, fallback de WhatsApp e campos visuais permanecem inalterados.
- O proxy não encaminha cookies nem cabeçalhos arbitrários.

## Review Focus

- Corpo malformado ou não objeto deve receber resposta controlada, sem derrubar a Route Handler.
- Campo `empresa` adulterado deve ser substituído por `mello` no corpo encaminhado.
- `TMS_API_URL` ausente, inválida, com protocolo não HTTP ou credenciais deve falhar sem chamada externa.
- Status e JSON de erro do TMS devem chegar intactos ao formulário para preservar o comportamento atual.
- Falha de rede no TMS deve virar erro `502`, permitindo o fallback por WhatsApp.

---

### Task 1: Contrato testável da rota exclusiva da Mello

**Files:**

- Create: `src/app/api/cotacoes/route.ts`
- Create: `tests/cotacoes-route.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**

- Consumes: `process.env.TMS_API_URL`, `Request` e `globalThis.fetch`.
- Produces: `POST(req: Request): Promise<Response>` para o formulário existente.

- [ ] **Step 1: Instalar Vitest e registrar `npm test` como `vitest run`**

Run: `npm install --save-dev vitest`

Expected: `package.json` e `package-lock.json` incluem Vitest; nenhum outro pacote direto é alterado.

- [ ] **Step 2: Escrever os testes falhos da Route Handler**

Cobrir em `tests/cotacoes-route.test.ts`:

- um corpo com `empresa: "outra"` chama `${TMS_API_URL}/api/cotacoes` com `empresa: "mello"`;
- somente `content-type` e o primeiro IP de `x-forwarded-for` são encaminhados;
- status e corpo retornados pelo TMS são preservados;
- URL ausente, `ftp:`, credenciais ou URL inválida respondem `503` sem chamar `fetch`;
- rejeição de `fetch` responde `502`;
- JSON inválido responde `400` sem chamar `fetch`.

- [ ] **Step 3: Executar os testes e confirmar RED**

Run: `npm test -- tests/cotacoes-route.test.ts`

Expected: FAIL porque `src/app/api/cotacoes/route.ts` ainda não existe.

- [ ] **Step 4: Implementar a Route Handler mínima**

Criar `POST(req: Request): Promise<Response>` com helpers privados para validar a origem HTTP/HTTPS sem credenciais, ler um objeto JSON, forçar `empresa: "mello"`, encaminhar o IP e traduzir falha de rede em `502`.

- [ ] **Step 5: Executar os testes e confirmar GREEN**

Run: `npm test -- tests/cotacoes-route.test.ts`

Expected: todos os testes passam e nenhuma chamada externa ocorre.

- [ ] **Step 6: Commit**

Run: `git add package.json package-lock.json src/app/api/cotacoes/route.ts tests/cotacoes-route.test.ts && git commit -m "feat(cotacao): vincula pedidos ao tenant Mello"`

### Task 2: Retirar a colisão com rewrite e documentar o fluxo

**Files:**

- Modify: `next.config.ts`
- Modify: `README.md`
- Test: `tests/cotacoes-route.test.ts`

**Interfaces:**

- Consumes: `POST /api/cotacoes` da Task 1.
- Produces: rewrites somente para `/api/leads` e `/api/rastreio`, e documentação do proxy exclusivo da cotação.

- [ ] **Step 1: Escrever teste falho para a configuração de rewrites**

Adicionar teste que importa `next.config.ts`, executa `rewrites()` e prova que `/api/cotacoes` não está na lista, enquanto `/api/leads` e `/api/rastreio` continuam presentes.

- [ ] **Step 2: Executar o teste e confirmar RED**

Run: `npm test -- tests/cotacoes-route.test.ts`

Expected: FAIL porque `/api/cotacoes` ainda é um rewrite.

- [ ] **Step 3: Remover somente `/api/cotacoes` de `tmsPublicRoutes` e atualizar comentários**

Não alterar redirects, headers ou os outros dois rewrites.

- [ ] **Step 4: Atualizar o README**

Documentar que a cotação passa pela Route Handler que força `mello`, enquanto lead e rastreio usam rewrite; manter `TMS_API_URL` como único endereço do TMS.

- [ ] **Step 5: Executar testes e confirmar GREEN**

Run: `npm test -- tests/cotacoes-route.test.ts`

Expected: todos os testes passam.

- [ ] **Step 6: Commit**

Run: `git add next.config.ts README.md tests/cotacoes-route.test.ts && git commit -m "docs(cotacao): registra proxy exclusivo da Mello"`

### Task 3: Verificação integral e entrega no GitHub

**Files:**

- Verify: all changed files

**Interfaces:**

- Consumes: Tasks 1–2 completas.
- Produces: branch publicável e pull request ligado à issue #14.

- [ ] **Step 1: Executar a suíte**

Run: `npm test`

Expected: todos os testes passam.

- [ ] **Step 2: Executar lint**

Run: `npm run lint`

Expected: zero erros.

- [ ] **Step 3: Executar typecheck**

Run: `npm run typecheck`

Expected: zero erros.

- [ ] **Step 4: Executar build**

Run: `npm run build`

Expected: build termina com código 0 e lista `/api/cotacoes` como rota dinâmica.

- [ ] **Step 5: Revisar diff, histórico e ausência de segredos**

Run: `git diff origin/main...HEAD && git status --short && git log --oneline origin/main..HEAD`

Expected: somente integração, testes e documentação; worktree limpo.

- [ ] **Step 6: Publicar branch e abrir PR**

Run: `git push -u origin feat/cotacao-tenant-mello` e `gh pr create --repo avilaops/mellotransportesriopreto.com.br --base main --head feat/cotacao-tenant-mello --title "feat(cotacao): vincula site ao tenant Mello" --body <resumo>`

Expected: PR aberto com `Closes #14`, evidências dos quatro comandos de verificação e declaração explícita de que nenhum servidor foi alterado.
