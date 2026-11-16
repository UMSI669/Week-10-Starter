import { CHARACTER_PROFILES, houseLabel } from '../src/data/characterProfiles';
import { filterCharacters } from '../src/utils/search';

const names = (q: string) => filterCharacters(CHARACTER_PROFILES, q).map((p) => p.name);

describe('character search', () => {
  it('returns everyone for an empty or whitespace query', () => {
    expect(names('')).toHaveLength(7);
    expect(names('   ')).toHaveLength(7);
  });

  it('matches names case-insensitively and ignores surrounding whitespace', () => {
    expect(names('  hermione ')).toEqual(['Hermione Granger']);
    expect(names('LUNA')).toEqual(['Luna Lovegood']);
  });

  it('matches houses', () => {
    expect(names('slytherin')).toEqual(['Draco Malfoy']);
    expect(names('Gryffindor')).toEqual([
      'Harry Potter',
      'Hermione Granger',
      'Ron Weasley',
      'Neville Longbottom',
    ]);
  });

  it('finds Dobby by name and by "No Hogwarts house"', () => {
    expect(names('Dobby')).toEqual(['Dobby']);
    expect(names('no hogwarts house')).toEqual(['Dobby']);
  });

  it('handles null houses safely', () => {
    expect(houseLabel(null)).toBe('No Hogwarts house');
    expect(houseLabel('')).toBe('No Hogwarts house');
    expect(() => names('ravenclaw')).not.toThrow();
  });

  it('returns an empty list when nothing matches', () => {
    expect(names('basilisk')).toEqual([]);
  });
});
