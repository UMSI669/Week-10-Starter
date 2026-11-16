import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isDaytime } from '../src/daylight.ts';
test('local daytime is 07:00 inclusive through 19:00 exclusive', () => {
  for (const hour of [0, 6, 19, 23]) assert.equal(isDaytime(hour), false);
  for (const hour of [7, 11, 18]) assert.equal(isDaytime(hour), true);
});
