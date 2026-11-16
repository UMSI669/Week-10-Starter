/**
 * @rneui/base 5 imports its Icon prop types from 'react-native-vector-icons/Icon'.
 * We use Expo's bundled icons instead (see src/theme/icons.ts), so this small
 * declaration supplies just the props RNE's types reference.
 */
declare module 'react-native-vector-icons/Icon' {
  import type { StyleProp, TextStyle } from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: StyleProp<TextStyle>;
  }
  export type IconButtonProps = IconProps;
}
