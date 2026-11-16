# PantryShare 🥖

**PantryShare** is a hyper-local, community food-sharing app. Neighbors give away extra groceries, baking ingredients, and home-cooked meals before they go to waste. Local grocery stores, bakeries, and restaurants can donate surplus food too.

Built with **React Native**, **Expo**, and **TypeScript**. It's a UI prototype that runs on mock data, with no backend.

## Features

- **Discover:** browse nearby food in a two-column grid with search, category filters, and favorites, then reserve a pickup
- **Nearby:** a map of approximate pickup areas that keeps exact addresses private
- **AI Recipes:** recipe ideas built from the ingredients you've rescued
- **Share:** a step-by-step form for listing food
- **Profile:** PantryPoints rewards, badges, and community impact

There are two account types. **Personal** accounts can donate and receive food. **Business** accounts can only donate.

## React Native Skia

The app's custom graphics will be drawn with [React Native Skia](https://shopify.github.io/react-native-skia/):

- Food availability indicators
- Recipe-match and PantryPoints progress rings
- Pickup countdown graphics
- Community impact charts
- Animated gradients and decorative shapes

These components are in [`components/skia/`](components/skia/). Some are still placeholders while the Skia versions are being built.

## Run it

```bash
npm install
npx expo start
```

Press `i` to open the app in the iOS Simulator with Expo Go.
