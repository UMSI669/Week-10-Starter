import { useCallback, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation, MD3LightTheme, PaperProvider } from 'react-native-paper';
import CustomerScreen from './src/screens/CustomerScreen';
import StaffScreen from './src/screens/StaffScreen';
import { SEED_ORDERS, STATUS_FLOW } from './src/data/mockData';

// Warm coffee-toned Material 3 theme.
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7b4a2e',
    onPrimary: '#ffffff',
    primaryContainer: '#ffdbc9',
    onPrimaryContainer: '#2f1406',
    secondary: '#765848',
    secondaryContainer: '#ffdbc9',
    onSecondaryContainer: '#2b160a',
    tertiary: '#5f6135',
    background: '#fffbf8',
    surface: '#fffbf8',
    surfaceVariant: '#f4ded3',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#f9efe9',
      level2: '#f6e9e1',
      level3: '#f3e3da',
    },
  },
};

const OAT_MILK_NOTICE = 'Oat milk is unavailable today. Oat milk lattes are paused.';
const ME = 'You';

export default function App() {
  const [index, setIndex] = useState(0);
  const [cart, setCart] = useState([]); // [{ drinkId, name, price, qty }]
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [oatMilkAvailable, setOatMilkAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const nextId = useRef(Math.max(...SEED_ORDERS.map((o) => o.id)) + 1);

  // ---- Cart ----
  const addToCart = useCallback((drink) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.drinkId === drink.id);
      if (existing) {
        return prev.map((i) => (i.drinkId === drink.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { drinkId: drink.id, name: drink.name, price: drink.price, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((drinkId, delta) => {
    setCart((prev) =>
      prev.map((i) => (i.drinkId === drinkId ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  }, []);

  // ---- Orders ----
  // Simulates a network request so the UI can show a loading indicator.
  const placeOrder = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const order = { id: nextId.current++, customer: ME, items: cart, status: 'Received' };
    setOrders((prev) => [...prev, order]);
    setCart([]);
    return order;
  }, [cart]);

  const setStatus = (id, status) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const advanceOrder = useCallback((id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const i = STATUS_FLOW.indexOf(o.status);
        return i >= 0 && i < STATUS_FLOW.length - 1 ? { ...o, status: STATUS_FLOW[i + 1] } : o;
      })
    );
  }, []);

  // ---- Inventory / announcements ----
  const toggleOatMilk = useCallback((available) => {
    setOatMilkAvailable(available);
    if (!available) {
      setAnnouncement(OAT_MILK_NOTICE);
      // Remove any oat lattes already sitting in the cart.
      setCart((prev) => prev.filter((i) => i.drinkId !== 'oat-latte'));
    } else {
      setAnnouncement((a) => (a === OAT_MILK_NOTICE ? '' : a));
    }
  }, []);

  // ---- Navigation ----
  const myOrders = useMemo(() => orders.filter((o) => o.customer === ME), [orders]);
  const myReadyCount = myOrders.filter((o) => o.status === 'Ready').length;
  const waitingCount = orders.filter((o) => o.status === 'Received').length;

  const routes = [
    { key: 'customer', title: 'Customer', focusedIcon: 'coffee', unfocusedIcon: 'coffee-outline' },
    { key: 'staff', title: 'Staff', focusedIcon: 'account-tie', unfocusedIcon: 'account-tie-outline' },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'customer':
        return (
          <CustomerScreen
            cart={cart}
            myOrders={myOrders}
            oatMilkAvailable={oatMilkAvailable}
            announcement={announcement}
            onAddToCart={addToCart}
            onChangeQty={changeQty}
            onPlaceOrder={placeOrder}
            onCancelOrder={(id) => setStatus(id, 'Cancelled')}
            onCollectOrder={(id) => setStatus(id, 'Collected')}
          />
        );
      case 'staff':
        return (
          <StaffScreen
            orders={orders}
            oatMilkAvailable={oatMilkAvailable}
            announcement={announcement}
            onToggleOatMilk={toggleOatMilk}
            onAdvanceOrder={advanceOrder}
            onSetAnnouncement={setAnnouncement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          getBadge={({ route }) =>
            route.key === 'customer'
              ? myReadyCount || false
              : waitingCount || false
          }
        />
        <StatusBar style="dark" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
