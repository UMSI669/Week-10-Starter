// React 19 needs this flag before any state update is flushed inside act().
global.IS_REACT_ACT_ENVIRONMENT = true;

// AsyncStorage ships a jest mock; AppState persistence is asserted against it.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// @expo/vector-icons pulls in font loading, which needs native asset modules that
// are not resolvable under Jest. Icons are decorative here, so render the name.
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name, ...rest }) => React.createElement(Text, rest, name);
  return new Proxy({}, { get: (_target, key) => (key === '__esModule' ? false : Icon) });
});
