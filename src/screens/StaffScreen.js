import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  Appbar,
  Banner,
  Button,
  Card,
  Chip,
  DataTable,
  Dialog,
  Icon,
  IconButton,
  List,
  Portal,
  SegmentedButtons,
  Switch,
  Text,
  TextInput,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import { ANNOUNCEMENT_PRESETS, orderQty } from '../data/mockData';

const NEXT_ACTION = {
  Received: { label: 'Start', icon: 'play' },
  Preparing: { label: 'Mark ready', icon: 'bell-ring-outline' },
  Ready: { label: 'Hand off', icon: 'hand-extended-outline' },
};

const PAGE_SIZE = 5;

// Wide screens: let the table scroll sideways if needed. Phones: fit to width.
function TableWrapper({ compact, children }) {
  return compact ? (
    <View>{children}</View>
  ) : (
    <ScrollView horizontal contentContainerStyle={styles.tableScroll}>
      {children}
    </ScrollView>
  );
}

export default function StaffScreen({
  orders,
  oatMilkAvailable,
  announcement,
  onToggleOatMilk,
  onAdvanceOrder,
  onSetAnnouncement,
}) {
  const theme = useTheme();
  const compact = useWindowDimensions().width < 640; // phone layout
  const [filter, setFilter] = useState('active');
  const [page, setPage] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState('');

  const STATUS_COLOR = {
    Received: theme.colors.tertiary,
    Preparing: '#b26a00',
    Ready: '#2e7d32',
    Collected: theme.colors.outline,
    Cancelled: theme.colors.error,
  };

  const counts = useMemo(() => {
    const c = { Received: 0, Preparing: 0, Ready: 0 };
    orders.forEach((o) => {
      if (o.status in c) c[o.status] += 1;
    });
    return c;
  }, [orders]);

  const rows = useMemo(() => {
    const active = (o) => ['Received', 'Preparing', 'Ready'].includes(o.status);
    const filtered =
      filter === 'active' ? orders.filter(active) : filter === 'done' ? orders.filter((o) => !active(o)) : orders;
    return [...filtered].sort((a, b) => a.id - b.id);
  }, [orders, filter]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  useEffect(() => {
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [page, pageCount]);
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openEditor = () => {
    setDraft(announcement);
    setEditOpen(true);
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header elevated>
        <Appbar.Content title="Staff Dashboard" />
        <Appbar.Action icon="bullhorn-outline" onPress={openEditor} accessibilityLabel="Edit announcement" />
      </Appbar.Header>

      <Banner
        visible={!!announcement}
        icon="bullhorn"
        actions={[
          { label: 'Edit', onPress: openEditor },
          { label: 'Clear', onPress: () => onSetAnnouncement('') },
        ]}
      >
        {`Showing to customers: “${announcement}”`}
      </Banner>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inner}>
          {/* Queue summary */}
          <View style={styles.chipRow}>
            {Object.entries(counts).map(([status, n]) => (
              <Chip
                key={status}
                icon={({ size }) => <Icon source="circle" size={size - 6} color={STATUS_COLOR[status]} />}
                style={styles.chip}
                selectedColor={STATUS_COLOR[status]}
                onPress={() => setFilter('active')}
              >
                {status}: {n}
              </Chip>
            ))}
          </View>

          {/* Inventory */}
          <Card style={styles.section} mode="outlined">
            <List.Item
              title="Oat milk in stock"
              description={
                oatMilkAvailable
                  ? 'Oat milk drinks are available to customers'
                  : 'Oat milk drinks are disabled and customers see a banner'
              }
              left={(p) => <List.Icon {...p} icon="barley" />}
              right={() => <Switch value={oatMilkAvailable} onValueChange={onToggleOatMilk} />}
            />
          </Card>

          {/* Orders (DataTable) */}
          <Card style={styles.section} mode="elevated">
            <Card.Title title="Orders" subtitle="Advance each order: Received → Preparing → Ready" subtitleNumberOfLines={2} />
            <Card.Content>
              <SegmentedButtons
                value={filter}
                onValueChange={(v) => {
                  setFilter(v);
                  setPage(0);
                }}
                buttons={[
                  { value: 'active', label: 'Active', icon: 'progress-clock' },
                  { value: 'done', label: 'Done', icon: 'check-all' },
                  { value: 'all', label: 'All' },
                ]}
                style={{ marginBottom: 8 }}
              />
            </Card.Content>
            <TableWrapper compact={compact}>
              <DataTable style={compact ? styles.tableCompact : styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.colId}>{compact ? '#' : 'Order #'}</DataTable.Title>
                  <DataTable.Title style={styles.colDrink}>Drink</DataTable.Title>
                  <DataTable.Title numeric style={styles.colQty}>
                    Qty
                  </DataTable.Title>
                  <DataTable.Title style={styles.colStatus}>Status</DataTable.Title>
                  <DataTable.Title style={compact ? styles.colActionCompact : styles.colAction}>{compact ? '' : 'Action'}</DataTable.Title>
                </DataTable.Header>

                {pageRows.length === 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>No orders here yet.</DataTable.Cell>
                  </DataTable.Row>
                )}

                {pageRows.map((order) => {
                  const next = NEXT_ACTION[order.status];
                  return (
                    <DataTable.Row key={order.id}>
                      <DataTable.Cell style={styles.colId}>
                        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>
                          #{order.id}
                        </Text>
                      </DataTable.Cell>
                      <View style={[styles.colDrink, styles.drinkCell]}>
                        {order.items.map((i) => (
                          <Text key={i.drinkId} variant="bodyMedium" numberOfLines={1}>
                            {i.name}
                            {order.items.length > 1 ? ` ×${i.qty}` : ''}
                          </Text>
                        ))}
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          for {order.customer}
                        </Text>
                      </View>
                      <DataTable.Cell numeric style={styles.colQty}>
                        {orderQty(order)}
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.colStatus}>
                        <Text variant="labelLarge" style={{ color: STATUS_COLOR[order.status] }}>
                          {compact ? '' : '● '}
                          {order.status}
                        </Text>
                      </DataTable.Cell>
                      <View style={[compact ? styles.colActionCompact : styles.colAction, styles.actionCell]}>
                        {next && compact ? (
                          <Tooltip title={next.label}>
                            <IconButton
                              mode="contained"
                              size={18}
                              icon={next.icon}
                              accessibilityLabel={next.label}
                              style={{ margin: 0 }}
                              onPress={() => onAdvanceOrder(order.id)}
                            />
                          </Tooltip>
                        ) : next ? (
                          <Button
                            compact
                            mode={order.status === 'Preparing' ? 'contained' : 'contained-tonal'}
                            icon={next.icon}
                            onPress={() => onAdvanceOrder(order.id)}
                          >
                            {next.label}
                          </Button>
                        ) : (
                          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                            —
                          </Text>
                        )}
                      </View>
                    </DataTable.Row>
                  );
                })}

                <DataTable.Pagination
                  page={page}
                  numberOfPages={pageCount}
                  onPageChange={setPage}
                  label={rows.length ? `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, rows.length)} of ${rows.length}` : '0 of 0'}
                  showFastPaginationControls
                />
              </DataTable>
            </TableWrapper>
          </Card>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={editOpen} onDismiss={() => setEditOpen(false)} style={styles.dialog}>
          <Dialog.Title>Customer announcement</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Banner message"
              value={draft}
              onChangeText={setDraft}
              multiline
            />
            <Text variant="labelMedium" style={{ marginTop: 12, marginBottom: 4 }}>
              Quick picks
            </Text>
            <View style={styles.chipRow}>
              {ANNOUNCEMENT_PRESETS.map((p) => (
                <Chip key={p} compact style={styles.chip} onPress={() => setDraft(p)}>
                  {p}
                </Chip>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditOpen(false)}>Cancel</Button>
            <Button
              mode="contained"
              onPress={() => {
                onSetAnnouncement(draft.trim());
                setEditOpen(false);
              }}
            >
              Publish
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, alignItems: 'center' },
  inner: { width: '100%', maxWidth: 1100 },
  section: { marginBottom: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { marginBottom: 0 },
  tableScroll: { flexGrow: 1 },
  table: { minWidth: 600, flex: 1 },
  tableCompact: { flex: 1 },
  colId: { flex: 0.7 },
  colDrink: { flex: 2.2 },
  colQty: { flex: 0.6, paddingRight: 16 },
  colStatus: { flex: 1.3 },
  colAction: { flex: 1.5 },
  colActionCompact: { flex: 0, width: 44, alignItems: 'flex-end' },
  drinkCell: { justifyContent: 'center', paddingVertical: 8 },
  actionCell: { justifyContent: 'center', alignItems: 'flex-start' },
  dialog: { maxWidth: 520, width: '90%', alignSelf: 'center' },
});
