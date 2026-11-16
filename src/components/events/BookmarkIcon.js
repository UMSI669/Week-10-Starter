import Svg, { Path } from 'react-native-svg';

// Bookmark drawn as an SVG path so the saved state is a solid fill
// and the unsaved state is the same outline, at any size.
const BOOKMARK_PATH =
  'M6.5 2.75h11c.97 0 1.75.78 1.75 1.75v16.2a.9.9 0 0 1-1.38.76L12 17.62l-5.87 3.84a.9.9 0 0 1-1.38-.76V4.5c0-.97.78-1.75 1.75-1.75z';

export default function BookmarkIcon({ filled = false, color, size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d={BOOKMARK_PATH}
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}
