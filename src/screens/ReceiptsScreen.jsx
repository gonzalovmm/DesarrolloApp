import { FlatList, Text, View, StyleSheet, ScrollView } from "react-native";
import { useGetReceiptsQuery } from "../services/receiptsService";
import { colors } from "../global/colors";

const ReceiptsScreen = () => {
  const { data: receipts, error, isLoading } = useGetReceiptsQuery();

  if (isLoading) return <Text style={styles.pedidoText}>Cargando recibos...</Text>;
  if (error) return <Text style={styles.pedidoText}>Error al cargar los recibos</Text>;
  if (!receipts || receipts.length === 0) return <Text style={styles.pedidoText}>No hay recibos disponibles</Text>;

  const dateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.receiptContainer}>
      <Text style={styles.orderText}>
        Nro. de pedido: {item.orderNumber || index + 1}
      </Text>
      <Text style={styles.dateText}>
        Fecha de creación:{" "}
        {new Date(item.createdAt).toLocaleString("es-Ar", dateOptions)} Hs.
      </Text>
      <FlatList
        data={item.cart}
        keyExtractor={(cartItem, index) =>
          cartItem.id ? cartItem.id.toString() : index.toString()
        }
        renderItem={({ item: cartItem }) => (
          <View style={styles.productContainer}>
            <Text style={styles.detalleText}>
              {cartItem.quantity} x {cartItem.title} (${cartItem.price} x{" "}
              {cartItem.quantity})
            </Text>
          </View>
        )}
      />
      <Text style={styles.totalText}>Total: ${item.total}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.pedidoText}>Tus pedidos:</Text>
      </View>
      <FlatList
        data={receipts}
        contentContainerStyle={{ paddingBottom: 80 }}
        style={styles.receiptsList}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
      />
    </>
  );
};

export default ReceiptsScreen;

const styles = StyleSheet.create({
  receiptsList: {
    backgroundColor: colors.verdeSuper,
  },
  headerContainer: {
    backgroundColor: colors.verdeSuper,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  receiptContainer: {
    backgroundColor: colors.verdeLight,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.verdeOscuro,
    borderRadius: 8,
  },
  orderText: {
    color: colors.negro,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateText: {
    color: colors.negro,
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detalleText: {
    color: colors.negro,
    fontSize: 12,
  },
  productContainer: {
    marginBottom: 8,
  },
  totalText: {
    color: colors.negro,
    marginTop: 14,
    fontSize: 15,
    fontWeight: "bold",
  },
  pedidoText: {
    color: colors.negro,
    fontSize: 15,
    marginVertical: 12,
    marginHorizontal: 10,
  },
});