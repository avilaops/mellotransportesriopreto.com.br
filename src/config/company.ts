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
  // publicada em nome do cliente.
  cnpj: "",
  rntrc: "",
  cargoInsurance: "",
  foundedYear: "",
};

/** Credenciais preenchidas, já com o rótulo que vai para a tela. */
export const companyCredentials = [
  company.cnpj && `CNPJ ${company.cnpj}`,
  company.rntrc && `RNTRC/ANTT ${company.rntrc}`,
  company.cargoInsurance && `Seguro de carga: ${company.cargoInsurance}`,
  company.foundedYear && `Desde ${company.foundedYear}`,
].filter((item): item is string => Boolean(item));
