// Mock data for the café prototype. No backend — everything lives in React state.

const photo = (id) => `https://images.unsplash.com/${id}?w=600&q=70&auto=format&fit=crop`;

export const MENU = [
  {
    id: 'espresso',
    name: 'Espresso',
    price: 3.0,
    image: photo('photo-1510591509098-f4fdc6d0ff04'),
    dairy: false,
    caffeineMg: 75,
    vegan: true,
  },
  {
    id: 'latte',
    name: 'Café Latte',
    price: 4.5,
    image: photo('photo-1541167760496-1628856ab772'),
    dairy: true,
    caffeineMg: 130,
  },
  {
    id: 'oat-latte',
    name: 'Oat Milk Latte',
    price: 5.0,
    image: photo('photo-1572442388796-11668a67e53d'),
    dairy: false,
    caffeineMg: 130,
    vegan: true,
    needsOatMilk: true,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    price: 4.25,
    image: photo('photo-1534778101976-62847782c213'),
    dairy: true,
    caffeineMg: 130,
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    price: 4.0,
    image: photo('photo-1517701604599-bb29b565090c'),
    dairy: false,
    caffeineMg: 200,
    vegan: true,
  },
  {
    id: 'hot-chocolate',
    name: 'Hot Chocolate',
    price: 3.75,
    image: photo('photo-1542990253-0d0f5be5f0ed'),
    dairy: true,
    caffeineMg: 0,
  },
];

// Order lifecycle. The staff "advance" button moves an order one step forward.
export const STATUS_FLOW = ['Received', 'Preparing', 'Ready', 'Collected'];

export const STATUS_PROGRESS = {
  Received: 1 / 3,
  Preparing: 2 / 3,
  Ready: 1,
  Collected: 1,
  Cancelled: 0,
};

export const STATUS_ICON = {
  Received: 'receipt-text-outline',
  Preparing: 'coffee-maker-outline',
  Ready: 'bell-ring-outline',
  Collected: 'check-circle-outline',
  Cancelled: 'close-circle-outline',
};

const item = (drinkId, qty) => {
  const drink = MENU.find((d) => d.id === drinkId);
  return { drinkId, name: drink.name, price: drink.price, qty };
};

// A few orders from other customers so the staff table isn't empty on launch.
export const SEED_ORDERS = [
  { id: 101, customer: 'Maya', items: [item('latte', 2)], status: 'Preparing' },
  { id: 102, customer: 'Jordan', items: [item('cold-brew', 1), item('espresso', 1)], status: 'Received' },
  { id: 103, customer: 'Priya', items: [item('hot-chocolate', 1)], status: 'Ready' },
  { id: 100, customer: 'Sam', items: [item('cappuccino', 1)], status: 'Collected' },
];

export const ANNOUNCEMENT_PRESETS = [
  'Oat milk is unavailable today.',
  'Fresh pastries just came out of the oven!',
  'Card payments only this afternoon.',
];

export const formatPrice = (n) => `$${n.toFixed(2)}`;

export const orderQty = (order) => order.items.reduce((sum, i) => sum + i.qty, 0);

export const orderTotal = (order) => order.items.reduce((sum, i) => sum + i.qty * i.price, 0);

export const orderSummary = (order) => order.items.map((i) => `${i.qty}× ${i.name}`).join(', ');
