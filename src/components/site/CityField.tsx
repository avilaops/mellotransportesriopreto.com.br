import { findServiceArea, serviceAreas } from "@/data/serviceAreas";

/** Um `<datalist>` só por página; os campos de cidade apontam para ele. */
export const CITY_OPTIONS_ID = "cidades-atendidas-mello";

export function CityOptions() {
  return <datalist id={CITY_OPTIONS_ID}>{serviceAreas.map((area) => <option key={area.city} value={area.city} />)}</datalist>;
}

/**
 * Campo de cidade que sugere as cidades atendidas enquanto a pessoa digita e
 * diz, logo abaixo, se a cidade está na relação, com o polo e o prazo.
 *
 * Cidade fora da lista continua aceita: o pedido segue e a equipe confirma.
 * Precisa de um `<CityOptions />` na mesma página.
 */
export function CityField({ label, value, onChange, hint = true }: { label: string; value: string; onChange: (value: string) => void; hint?: boolean }) {
  const area = findServiceArea(value);
  return <label className="field">
    <span>{label}</span>
    <input type="text" value={value} list={CITY_OPTIONS_ID} autoComplete="off" placeholder="Comece a digitar a cidade" onChange={(event) => onChange(event.target.value)} />
    {hint && value.trim().length > 2 && (area
      ? <small className="route-ok">Atendida pelo polo de {area.hub.replace(" Do ", " do ")}, prazo {area.deadline.toLowerCase()}.</small>
      : <small className="route-warn">Fora da relação de cidades atendidas. Pode seguir: a equipe confirma.</small>)}
  </label>;
}
