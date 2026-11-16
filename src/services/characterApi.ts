/**
 * HP-API adapter (https://hp-api.onrender.com, source: github.com/KostaSav/hp-api).
 *
 * The API supplies character METADATA only (name, house, species, image).
 * Personality scores always come from our local profiles, and quiz results
 * never depend on this request succeeding.
 */
import { CHARACTER_PROFILES } from '../data/characterProfiles';
import type { CharacterMetadata, CharacterProfile, MetadataResult } from '../types';

export const HP_API_CHARACTERS_URL = 'https://hp-api.onrender.com/api/characters';
export const REQUEST_TIMEOUT_MS = 8000;

type FetchLike = (input: string, init?: { signal?: AbortSignal }) => Promise<{
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}>;

function cleanString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanImageUrl(value: unknown): string | null {
  const url = cleanString(value);
  return url && /^https:\/\//i.test(url) ? url : null;
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Validate one raw API record. Returns null if it is unusable. */
export function normalizeRecord(raw: unknown): CharacterMetadata | null {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;
  const name = cleanString(record.name);
  if (!name) return null;
  return {
    apiId: cleanString(record.id),
    name,
    house: cleanString(record.house),
    species: cleanString(record.species),
    imageUrl: cleanImageUrl(record.image),
  };
}

/** Match API records to local profiles: verified id first, then exact name/alias. */
export function matchRecordsToProfiles(
  records: CharacterMetadata[],
  profiles: CharacterProfile[] = CHARACTER_PROFILES,
): Record<string, CharacterMetadata> {
  const result: Record<string, CharacterMetadata> = {};
  for (const profile of profiles) {
    const byId = records.find((r) => r.apiId === profile.apiId);
    const names = [profile.name, ...profile.apiAliases].map(normalizeName);
    const byName = byId ? undefined : records.find((r) => names.includes(normalizeName(r.name)));
    const match = byId ?? byName;
    if (match) result[profile.id] = match;
  }
  return result;
}

export async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  fetchImpl: FetchLike,
): Promise<unknown> {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller?.abort();
      reject(new Error(`Request timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });
  try {
    const response = await Promise.race([
      fetchImpl(url, controller ? { signal: controller.signal } : undefined),
      timeout,
    ]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await Promise.race([response.json(), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function requestCharacterMetadata(
  fetchImpl: FetchLike,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<MetadataResult> {
  try {
    const body = await fetchWithTimeout(HP_API_CHARACTERS_URL, timeoutMs, fetchImpl);
    if (!Array.isArray(body)) throw new Error('Unexpected response format');
    const records = body
      .map(normalizeRecord)
      .filter((r): r is CharacterMetadata => r !== null);
    return { status: 'success', byProfileId: matchRecordsToProfiles(records) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { status: 'error', byProfileId: {}, errorMessage: message };
  }
}

// In-memory, per-session cache. Only successful responses are cached so a
// later submission can retry after a network failure.
let cached: Promise<MetadataResult> | null = null;

export function loadCharacterMetadata(
  fetchImpl: FetchLike = (url, init) => fetch(url, init),
): Promise<MetadataResult> {
  if (!cached) {
    cached = requestCharacterMetadata(fetchImpl).then((result) => {
      if (result.status !== 'success') cached = null;
      return result;
    });
  }
  return cached;
}

/** Test helper. */
export function resetMetadataCache(): void {
  cached = null;
}
