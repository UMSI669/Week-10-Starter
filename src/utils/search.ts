import { houseLabel } from '../data/characterProfiles';
import type { CharacterProfile } from '../types';

/**
 * Case-insensitive search across character name and house label.
 * A null house is searchable as "No Hogwarts house".
 */
export function filterCharacters(
  profiles: CharacterProfile[],
  query: string,
): CharacterProfile[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return profiles;
  return profiles.filter((profile) => {
    const haystacks = [profile.name, houseLabel(profile.house)];
    return haystacks.some((text) => text.toLowerCase().includes(needle));
  });
}
