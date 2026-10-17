# Cotação do site vinculada ao tenant Mello

## Intenção

Toda solicitação enviada pelo formulário público de cotação da Mello deve entrar na área de Cotações do TMS pertencente à Mello Transportes. O vínculo não pode depender do tenant padrão do ambiente, pois esse padrão pode mudar quando outras transportadoras passarem a usar o mesmo TMS.

## Escopo aprovado

- O site `mellotransportesriopreto.com.br` envia `empresa: "mello"` em toda chamada de cotação.
- O navegador continua chamando `POST /api/cotacoes` no domínio do site; o rewrite existente continua encaminhando a chamada ao TMS.
- O usuário não escolhe nem altera a empresa pela interface.
- O fallback por WhatsApp, as mensagens, o analytics e os demais campos permanecem iguais.
- Nenhuma alteração é feita diretamente em servidor, banco ou configuração de produção.

## Arquitetura

O rewrite genérico de `POST /api/cotacoes` será substituído por uma Route Handler do próprio site. Essa rota recebe o formulário, descarta qualquer valor `empresa` enviado pelo navegador, acrescenta o slug constante `mello` no servidor e encaminha o JSON para a rota pública do TMS. Os rewrites de lead e rastreio permanecem iguais.

O TMS já valida o slug, resolve somente empresas ativas e executa a gravação dentro do contexto RLS do tenant encontrado; portanto, não precisa de mudança. A URL do TMS continua vindo de `TMS_API_URL`, validada como origem HTTP/HTTPS sem credenciais; sem configuração válida, a rota responde `503` e o formulário oferece o fallback por WhatsApp.

## Segurança e falhas

- O slug é fixo na rota do servidor do site, não vem de campo, query string ou dado do visitante.
- Mesmo que uma requisição manual envie outro campo `empresa`, a rota o substitui por `mello` antes de chamar o TMS.
- A rota encaminha o primeiro endereço de `x-forwarded-for` para manter o limite de tentativas baseado no visitante, sem repassar cookies ou cabeçalhos arbitrários.
- Uma empresa Mello inexistente ou desativada continua recebendo a resposta neutra `404` do TMS, sem gravação em outro tenant.
- Falhas `5xx` ou de rede continuam oferecendo o pedido pronto pelo WhatsApp.
- Uma resposta `4xx`, inclusive tenant inexistente, continua exibindo o erro retornado pela API.

## Não objetivos

- Criar ou alterar o tenant Mello.
- Publicar ou fazer deploy.
- Alterar o formulário visualmente.
- Mudar o contrato das rotas públicas do TMS.
- Permitir que o visitante escolha uma transportadora.

## Verificação

- Testes da Route Handler comprovam que o payload encaminhado sempre contém `empresa: "mello"`, substituindo qualquer valor homônimo vindo dos dados de entrada; que status e corpo do TMS são preservados; e que configuração ausente ou inválida responde `503` sem chamada externa.
- Lint, typecheck e build do site precisam passar.
- O diff final deve se limitar ao repositório do site e à documentação/testes desta integração.

## Decisões do implementador

- O slug `mello` foi confirmado pelo contrato/documentação atual do TMS.
- O teste usa Vitest, já adotado no repositório do TMS e suficiente para testar a Route Handler sem navegador nem chamada remota.
- O slug `mello` é o identificador documentado pelo TMS; se o cadastro de produção divergir, a própria API recusará a integração com `404`, sem cair em outro tenant.
