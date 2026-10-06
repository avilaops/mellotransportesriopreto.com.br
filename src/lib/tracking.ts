/**
 * Normalizacao do codigo publico de rastreio, para o formulario de /rastreio.
 * A geracao do codigo e a consulta ficam no TMS: aqui so entra o que roda no
 * navegador.
 */
export const TRACKING_CODE_LENGTH = 10;

/**
 * Digitos do codigo enquanto a pessoa digita ou cola, cortados no comprimento.
 *
 * Existe porque o caminho obvio — `maxLength={10}` no input — corta o texto
 * BRUTO: colar "9184-726.350" (12 caracteres) virava "9184-726.3" e, depois de
 * tirar a pontuacao, chegava como 8 digitos e nao achava a carga. O corte tem
 * de vir depois da normalizacao, nunca antes.
 */
export function takeTrackingCodeDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, TRACKING_CODE_LENGTH);
}
