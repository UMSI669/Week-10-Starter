import { useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Badge,
  Banner,
  Button,
  Card,
  Dialog,
  Divider,
  FAB,
  IconButton,
  List,
  Modal,
  Portal,
  ProgressBar,
  Snackbar,
  Text,
  useTheme,
} from 'react-native-paper';
import DrinkCard from '../components/DrinkCard';
import {
  formatPrice,
  MENU,
  orderSummary,
  orderTotal,
  STATUS_ICON,
  STATUS_PROGRESS,
} from '../data/mockData';

export default function CustomerScreen({
  cart,
  myOrders,
  oatMilkAvailable,
  announcement,
  onAddToCart,
  onChangeQty,
  onPlaceOrder,
  onCancelOrder,
  onCollectOrder,
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 560 ? 2 : 1;
  const cardWidth = { 1: '100%', 2: '48.5%', 3: '32%' }[columns];

  const [cartOpen, setCartOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [snack, setSnack] = useState('');
  const [hiddenBanners, setHiddenBanners] = useState([]); // ids of dismissed banners

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);
  const cartTotal = cart.reduce((n, i) => n + i.qty * i.price, 0);
  const activeOrders = myOrders.filter((o) => o.status !== 'Collected' && o.status !== 'Cancelled');
  const readyOrder = activeOrders.find(
    (o) => o.status === 'Ready' && !hiddenBanners.includes(`ready-${o.id}`)
  );
  const showAnnouncement = !!announcement && !hiddenBanners.includes(`ann-${announcement}`);

  const hideBanner = (key) => setHiddenBanners((prev) => [...prev, key]);

  const handleAdd = (drink) => {
    onAddToCart(drink);
    setSnack(`${drink.name} added to cart`);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const order = await onPlaceOrder();
    setSubmitting(false);
    setConfirmOpen(false);
    setSnack(`Order #${order.id} placed — we'll let you know when it's ready.`);
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Bean There Café" />
        <View>
          <Appbar.Action icon="cart-outline" onPress={() => setCartOpen(true)} accessibilityLabel="Open cart" />
          <Badge visible={cartCount > 0} style={styles.cartBadge}>
            {cartCount}
          </Badge>
        </View>
      </Appbar.Header>

      {/* Banners: staff announcement + pickup notice */}
      <Banner
        visible={!!readyOrder}
        icon="bell-ring"
        actions={[
          { label: 'Later', onPress: () => hideBanner(`ready-${readyOrder.id}`) },
          { label: 'Collect now', onPress: () => onCollectOrder(readyOrder.id) },
        ]}
      >
        {readyOrder ? `Your order #${readyOrder.id} is ready for pickup at the counter!` : ''}
      </Banner>
      <Banner
        visible={showAnnouncement}
        icon="bullhorn-outline"
        actions={[{ label: 'Got it', onPress: () => hideBanner(`ann-${announcement}`) }]}
      >
        {announcement}
      </Banner>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          {activeOrders.length > 0 && (
            <Card style={styles.section} mode="contained">
              <Card.Title title="Your orders" left={(p) => <List.Icon {...p} icon="clipboard-text-clock-outline" />} />
              <Card.Content>
                {activeOrders.map((order, idx) => (
                  <View key={order.id}>
                    {idx > 0 && <Divider style={{ marginVertical: 8 }} />}
                    <OrderStatusRow
                      order={order}
                      onCancel={() => setCancelTarget(order)}
                      onCollect={() => onCollectOrder(order.id)}
                    />
                  </View>
                ))}
              </Card.Content>
            </Card>
          )}

          <Text variant="titleLarge" style={styles.heading}>
            Menu
          </Text>
          <View style={styles.grid}>
            {MENU.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                style={{ width: cardWidth }}
                unavailable={drink.needsOatMilk && !oatMilkAvailable}
                inCart={cart.find((i) => i.drinkId === drink.id)?.qty ?? 0}
                onAdd={handleAdd}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <FAB
        icon="cart-arrow-right"
        label={`Checkout · ${formatPrice(cartTotal)}`}
        visible={cartCount > 0}
        style={styles.fab}
        onPress={() => setCartOpen(true)}
      />

      <Portal>
        {/* Cart (List) */}
        <Modal
          visible={cartOpen}
          onDismiss={() => setCartOpen(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
        >
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            Your cart
          </Text>
          {cart.length === 0 ? (
            <Text style={{ marginVertical: 24, color: theme.colors.onSurfaceVariant }}>
              Your cart is empty. Add a drink from the menu.
            </Text>
          ) : (
            <List.Section style={{ marginVertical: 0 }}>
              {cart.map((i) => (
                <List.Item
                  key={i.drinkId}
                  title={i.name}
                  description={`${formatPrice(i.price)} each · ${formatPrice(i.price * i.qty)}`}
                  left={(p) => <List.Icon {...p} icon="coffee" />}
                  right={() => (
                    <View style={styles.qtyRow}>
                      <IconButton icon="minus" size={18} onPress={() => onChangeQty(i.drinkId, -1)} />
                      <Text variant="titleMedium">{i.qty}</Text>
                      <IconButton icon="plus" size={18} onPress={() => onChangeQty(i.drinkId, 1)} />
                    </View>
                  )}
                />
              ))}
              <Divider />
              <List.Item title="Total" right={() => <Text variant="titleMedium">{formatPrice(cartTotal)}</Text>} />
            </List.Section>
          )}
          <View style={styles.modalActions}>
            <Button onPress={() => setCartOpen(false)}>Keep browsing</Button>
            <Button
              mode="contained"
              disabled={cart.length === 0}
              onPress={() => {
                setCartOpen(false);
                setConfirmOpen(true);
              }}
            >
              Place order
            </Button>
          </View>
        </Modal>

        {/* Confirm order (Dialog + ActivityIndicator while submitting) */}
        <Dialog visible={confirmOpen} onDismiss={() => !submitting && setConfirmOpen(false)} style={styles.dialog}>
          <Dialog.Icon icon={submitting ? 'progress-clock' : 'coffee-to-go'} />
          <Dialog.Title style={{ textAlign: 'center' }}>
            {submitting ? 'Sending to the barista…' : 'Confirm your order'}
          </Dialog.Title>
          <Dialog.Content>
            {submitting ? (
              <ActivityIndicator size="large" style={{ marginVertical: 16 }} />
            ) : (
              <>
                {cart.map((i) => (
                  <Text key={i.drinkId} variant="bodyLarge">
                    {i.qty}× {i.name} — {formatPrice(i.qty * i.price)}
                  </Text>
                ))}
                <Text variant="titleMedium" style={{ marginTop: 12 }}>
                  Total: {formatPrice(cartTotal)}
                </Text>
              </>
            )}
          </Dialog.Content>
          {!submitting && (
            <Dialog.Actions>
              <Button onPress={() => setConfirmOpen(false)}>Back</Button>
              <Button mode="contained" onPress={handleConfirm}>
                Confirm order
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>

        {/* Cancel order (Dialog) */}
        <Dialog visible={!!cancelTarget} onDismiss={() => setCancelTarget(null)} style={styles.dialog}>
          <Dialog.Icon icon="alert-circle-outline" />
          <Dialog.Title style={{ textAlign: 'center' }}>Cancel order #{cancelTarget?.id}?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {cancelTarget && orderSummary(cancelTarget)}. The barista hasn't started yet, so you won't be charged.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelTarget(null)}>Keep order</Button>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                onCancelOrder(cancelTarget.id);
                setSnack(`Order #${cancelTarget.id} cancelled`);
                setCancelTarget(null);
              }}
            >
              Cancel order
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={2500}>
        {snack}
      </Snackbar>
    </View>
  );
}

function OrderStatusRow({ order, onCancel, onCollect }) {
  const theme = useTheme();
  const steps = ['Received', 'Preparing', 'Ready'];
  const current = steps.indexOf(order.status);

  return (
    <View>
      <List.Item
        style={{ paddingHorizontal: 0 }}
        title={`Order #${order.id} · ${formatPrice(orderTotal(order))}`}
        description={orderSummary(order)}
        left={(p) => <List.Icon {...p} icon={STATUS_ICON[order.status]} color={theme.colors.primary} />}
        right={() =>
          order.status === 'Received' ? (
            <Button compact onPress={onCancel} textColor={theme.colors.error}>
              Cancel
            </Button>
          ) : order.status === 'Ready' ? (
            <Button compact mode="contained" onPress={onCollect}>
              Collect
            </Button>
          ) : (
            <ActivityIndicator size="small" style={{ marginRight: 8 }} />
          )
        }
      />
      {/* Fixed-height wrapper: ProgressBar's container can stretch on web otherwise. */}
      <View style={styles.progressWrap}>
        <ProgressBar progress={STATUS_PROGRESS[order.status]} style={styles.progress} />
      </View>
      <View style={styles.stepRow}>
        {steps.map((s, i) => (
          <Text
            key={s}
            variant="labelMedium"
            style={{
              color: i <= current ? theme.colors.primary : theme.colors.outline,
              fontWeight: i === current ? 'bold' : 'normal',
            }}
          >
            {s}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 96, alignItems: 'center' },
  inner: { width: '100%', maxWidth: 1100 },
  section: { marginBottom: 16 },
  heading: { marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cartBadge: { position: 'absolute', top: 4, right: 4 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  modal: { margin: 20, padding: 20, borderRadius: 16, maxWidth: 520, width: '90%', alignSelf: 'center' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  dialog: { maxWidth: 480, width: '90%', alignSelf: 'center' },
  progressWrap: { height: 8 },
  progress: { height: 8, borderRadius: 4 },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});
