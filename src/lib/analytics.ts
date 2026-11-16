type MeasurementWindow = Window & {
  __avilaMeasurement?: { track: (name: string, parameters: Record<string, string>) => boolean };
};

/** Called only after the quote API confirms receipt. Never forwards form fields. */
export function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === 'undefined' || payload.event !== 'generate_lead' || payload.lead_subject !== 'cotacao') return;
  (window as MeasurementWindow).__avilaMeasurement?.track('form_submitted', { form_type: 'cotacao' });
}
