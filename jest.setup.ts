// Safe-area insets are unavailable in Jest; use the library's official mock.
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

// Icon fonts load asynchronously; report them as already loaded in tests so
// icon components don't update state outside act().
jest.mock('expo-font', () => {
  const actual = jest.requireActual('expo-font');
  return { ...actual, isLoaded: () => true, loadAsync: jest.fn(async () => undefined) };
});
