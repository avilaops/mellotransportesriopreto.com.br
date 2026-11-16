import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pushDataLayer } from '../src/lib/analytics.ts';
test('confirmed quote response emits only its fixed form type', () => {
  const calls = [];
  globalThis.window = { __avilaMeasurement: { track: (...args) => calls.push(args) } };
  pushDataLayer({ event: 'generate_lead', lead_subject: 'cotacao', email: 'private@example.com' });
  assert.deepEqual(calls, [['form_submitted', { form_type: 'cotacao' }]]);
  assert.equal(window.dataLayer, undefined);
  delete globalThis.window;
});
