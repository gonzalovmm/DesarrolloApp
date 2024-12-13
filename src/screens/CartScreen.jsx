import { FlatList, StyleSheet, Text, View, Image, Pressable, Alert, ScrollView} from "react-native";
import React from "react";
import { colors } from "../global/colors";
import FlatCard from "../components/FlatCard";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from "react-redux";
import { usePostReceiptMutation } from "../services/receiptsService";
import { clearCart, removeItem } from "../features/cart/cartSlice";

const CartScreen = ({ navigation }) => {
  const cart = useSelector((state) => state.cartReducer.value.cartItems);
  const total = useSelector((state) => state.cartReducer.value.total);
  const [triggerPost, result] = usePostReceiptMutation();

  const cartLength = useSelector((state) => state.cartReducer.value.cartLenght);

  const dispatch = useDispatch();

  const FooterComponent = () => (
    <View style={styles.footerContainer} >
      <Text style={styles.footerTotal}>
        Total: $
        {total.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>
      <Pressable
        style={styles.confirmButton}
        onPress={async () => {
          try {
            const result = await triggerPost({
              cart,
              total,
              createdAt: Date.now(),
            });

            if (result.error) {
              console.error("Error al enviar el recibo:", result.error);
            } else {
              dispatch(clearCart());
              navigation.navigate("Receipts");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }}
      >
        <Text style={styles.confirmButtonText}>Confirmar compra</Text>
      </Pressable>
    </View>
  );

  const handleRemove = (id) => {
    Alert.alert(
      "Eliminar artículo",
      "¿Estás seguro de que deseas eliminar este artículo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => dispatch(removeItem(id)),
        },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <FlatCard style={styles.cartContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.mainImage }}
          style={styles.cartImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cartDescription}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.brand}</Text>
        <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
        <Text style={styles.price}>Precio unitario: ${item.price.toLocaleString()}</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>
          ${((item.quantity * item.price) * (1 - item.discount / 100)).toLocaleString()}
          </Text>
          {item.discount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>-{item.discount}%</Text>
            </View>
          )}
        </View>
        
        <Pressable onPress={() => handleRemove(item.id)}>
          <Icon
            name="delete"
            size={24}
            color="#FFFFFF"
            style={styles.trashIcon}
          />
        </Pressable>
      </View>
    </FlatCard>
  );
  

  return (
    <>
      {cartLength > 0 ? (
          <FlatList
          contentContainerStyle={{ paddingBottom:20 }}
          style={styles.cartList}
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          ListHeaderComponent={
            <Text style={styles.cartScreenTitle}>Artículos en tu carrito:</Text>
          }
          ListFooterComponent={<FooterComponent />}
        />
      ) : (
        <View style={styles.cartEmpty}>
          <Text style={styles.cartEmptyText}>
            Aún no hay productos en el carrito
          </Text>
        </View>
      )}
    </>
  );
};


export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  cartContainer: {
    flexDirection: "row",
    padding: 4,
    justifyContent: "flex-start",
    margin: 16,
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.verdeOscuro,
  },
  cartImage: {
    width: 80,
    height: 80,
  },
  cartDescription: {
    width: "80%",
    padding: 20,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    color: colors.blanco,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.blanco,
  },
  subtitle: {
    fontSize: 14,
    color: colors.blanco,
  },
  badge: {
    backgroundColor: colors.naranjaBrillante,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 10, 
  },
  badgeText: {
    color: colors.blanco,
    fontSize: 12,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 16,
    color: colors.blanco,
  },
  price: {
    fontSize: 14,
    color: colors.blanco,
  },
  quantity: {
    fontSize: 14,
    color: colors.blanco,
  },
  total: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: colors.blanco,
  },
  trashIcon: {
    alignSelf: "flex-end",
    marginRight: 16,
  },
  footerContainer: {
    padding: 32,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footerTotal: {
    color: colors.verdeClaro,
    fontSize: 16,
    fontWeight: "700",
  },
  confirmButton: {
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.verdeOscuro,
    borderRadius: 16,
    marginBottom: 24,
  },
  confirmButtonText: {
    color: colors.blanco,
    fontSize: 16,
    fontWeight: "700",
  },
  cartScreenTitle: {
    color: colors.verdeClaro,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "start",
    padding: 8,
  },
  cartEmpty: {
    backgroundColor: colors.verdeSuper,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartEmptyText: {
    color: colors.blanco,
    fontSize: 16,
  },
  cartList: {
    backgroundColor: colors.verdeSuper,
  }
});