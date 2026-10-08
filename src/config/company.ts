export const company = {
  name: "Mello Transportes Rio Preto",
  shortName: "Mello Transportes",
  tagline: "Rio Preto e região",
  phone: "(17) 3308-0878",
  phoneHref: "tel:+551733080878",
  whatsapp: "(17) 99714-9702",
  whatsappNumber: "5517997149702",
  email: "comercial@mellotransportesriopreto.com.br",
  website: "www.mellotransportesriopreto.com.br",
  address: "Rua Bonsucesso, nº 695 - Quinta das Paineiras - São José do Rio Preto/SP",
  serviceRegion: "São José do Rio Preto e mais de 130 cidades da região (SP)",
  pagesUrl: "https://mellotransportesriopreto.com.br/",
  // Credenciais exibidas no rodapé. Só entra o que a Mello confirmar: campo
  // vazio não aparece no site, e número inventado aqui é informação falsa
  // publicada em nome do cliente. RNTRC/ANTT não entra: o Nicolas decidiu em
  // 08/10/2026 que esse registro não fica exposto no site.
  cnpj: "03.824.172/0001-78",
  cargoInsurance: "",
  foundedYear: "2000",
  // Início de atividade no CNPJ (Receita Federal).
  foundingDate: "2000-05-15",
  // Nota do Perfil da Empresa no Google, lida em 08/10/2026 no perfil que o
  // Nicolas administra. Não se atualiza sozinha: conferir no perfil antes de
  // mexer, e apagar os dois valores se não der para manter.
  googleRating: "4,7",
  googleReviewCount: 84,
  // Perfil da Empresa no Google, link enviado pelo Nicolas. Horário, CEP e
  // coordenadas lidos nesse perfil em 08/10/2026.
  googleProfileUrl: "https://maps.app.goo.gl/ugNpWf72zQgBH2Bc9",
  openingHours: "Segunda a sexta, das 8h às 18h",
  postalCode: "15080-430",
  latitude: -20.838373,
  longitude: -49.3694865,
};

/** Credenciais preenchidas, já com o rótulo que vai para a tela. */
export const companyCredentials = [
  company.cnpj && `CNPJ ${company.cnpj}`,
  company.cargoInsurance && `Seguro de carga: ${company.cargoInsurance}`,
  company.foundedYear && `Desde ${company.foundedYear}`,
].filter((item): item is string => Boolean(item));
