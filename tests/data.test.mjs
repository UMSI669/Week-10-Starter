import { test } from 'node:test';
import assert from 'node:assert/strict';
import { artists, concerts, toggleFavorite } from '../src/data.ts';

test('each concert has its own valid lineup, ticket, and upcoming date', () => {
  assert.equal(new Set(concerts.map(c => c.reference)).size, concerts.length);
  for (const concert of concerts) {
    assert.ok(concert.lineup.includes(concert.artistId));
    assert.ok(['A', 'B', 'C'].includes(concert.section));
    assert.ok(Number(concert.row) > 0 && Number(concert.seat) > 0);
    assert.ok(new Date(concert.date) > new Date('2026-11-16'));
    for (const id of concert.lineup) {
      const artist = artists.find(a => a.id === id);
      assert.ok(artist, `Unknown artist ${id}`);
      assert.ok(artist.setlist.length > 0);
      assert.ok(artist.time < artist.end);
      assert.ok(concert.doors < artist.time);
    }
  }
});
test('saving and removing artists never mutates or duplicates the schedule', () => {
  const original = ['sol'];
  const added = toggleFavorite(original, 'nova');
  assert.deepEqual(original, ['sol']);
  assert.deepEqual(added, ['sol', 'nova']);
  assert.deepEqual(toggleFavorite(added, 'nova'), ['sol']);
});
test('concert schedule filters do not leak artists from other shows', () => {
  const saved = ['nova', 'peach'];
  const sol = concerts.find(c => c.artistId === 'sol');
  assert.deepEqual(saved.filter(id => sol.lineup.includes(id)), ['peach']);
});
