import {
  loadCharacterMetadata,
  normalizeRecord,
  requestCharacterMetadata,
  resetMetadataCache,
} from '../src/services/characterApi';
import { API_SAMPLE } from '../test-utils/fixtures';

const okFetch = (body: unknown) =>
  jest.fn(async () => ({ ok: true, status: 200, json: async () => body }));

describe('normalizeRecord', () => {
  it('validates and normalizes fields', () => {
    expect(normalizeRecord(API_SAMPLE[1])).toEqual({
      apiId: '0d8ea37f-35c4-4c7d-9dd2-8ccd96b0a2b3',
      name: 'Dobby',
      house: null,
      species: 'house-elf',
      imageUrl: null,
    });
    expect(normalizeRecord({ name: 'X', image: 'http://a/b.jpg' })!.imageUrl).toBeNull();
    expect(normalizeRecord({ name: '  ' })).toBeNull();
    expect(normalizeRecord(null)).toBeNull();
    expect(normalizeRecord(42)).toBeNull();
  });
});

describe('requestCharacterMetadata', () => {
  it('matches by verified id, then by exact name, and skips bad records', async () => {
    const result = await requestCharacterMetadata(okFetch(API_SAMPLE));
    expect(result.status).toBe('success');
    expect(Object.keys(result.byProfileId).sort()).toEqual(['dobby', 'harry', 'luna']);
    expect(result.byProfileId.dobby.house).toBeNull();
    expect(result.byProfileId.luna.imageUrl).toBeNull();
    expect(result.byProfileId.hermione).toBeUndefined();
  });

  it('reports HTTP errors', async () => {
    const fetchImpl = jest.fn(async () => ({ ok: false, status: 503, json: async () => ({}) }));
    const result = await requestCharacterMetadata(fetchImpl);
    expect(result).toEqual({ status: 'error', byProfileId: {}, errorMessage: 'HTTP 503' });
  });

  it('reports malformed responses', async () => {
    const result = await requestCharacterMetadata(okFetch({ characters: [] }));
    expect(result.status).toBe('error');
  });

  it('reports network failures', async () => {
    const result = await requestCharacterMetadata(jest.fn(async () => Promise.reject(new Error('offline'))));
    expect(result).toMatchObject({ status: 'error', errorMessage: 'offline' });
  });

  it('times out', async () => {
    const never = jest.fn(() => new Promise<never>(() => undefined));
    const result = await requestCharacterMetadata(never, 20);
    expect(result.status).toBe('error');
    expect(result.errorMessage).toMatch(/timed out/);
  });
});

describe('loadCharacterMetadata cache', () => {
  beforeEach(() => resetMetadataCache());

  it('fetches once per session after a success', async () => {
    const fetchImpl = okFetch(API_SAMPLE);
    await loadCharacterMetadata(fetchImpl);
    await loadCharacterMetadata(fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('retries after a failure', async () => {
    const failing = jest.fn(async () => Promise.reject(new Error('offline')));
    await loadCharacterMetadata(failing);
    await loadCharacterMetadata(failing);
    expect(failing).toHaveBeenCalledTimes(2);
  });
});
