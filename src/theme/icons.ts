/**
 * React Native Elements 5 looks for icons in the modular
 * `@react-native-vector-icons/*` packages. Expo already bundles the same icon
 * fonts in `@expo/vector-icons`, so we register those with RNE's documented
 * `registerCustomIconType` hook instead of adding more native dependencies.
 */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { registerCustomIconType } from '@rneui/themed';

registerCustomIconType('material', MaterialIcons);
registerCustomIconType('material-community', MaterialCommunityIcons);
registerCustomIconType('material-design', MaterialCommunityIcons);
registerCustomIconType('font-awesome', FontAwesome);
