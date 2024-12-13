import {
    StyleSheet,
    Text,
    View,
    Pressable,
    useWindowDimensions,
    Image,
    FlatList,
    ScrollView,
    ActivityIndicator,
    Alert,
  } from "react-native";
  import Icon from "react-native-vector-icons/MaterialIcons";
  import { colors } from "../global/colors";
  import { useDispatch, useSelector } from "react-redux";
  import { addItem } from "../features/cart/cartSlice";
  import { useGetProductQuery } from "../services/shopService";
  import Toast from "react-native-toast-message";
  
  const ProductScreen = ({ route, navigation }) => {
    const productId = useSelector((state) => state.shopReducer.value.productId);
  
    const { width, height } = useWindowDimensions();
  
    const {
      data: productFound,
      error,
      isLoading,
    } = useGetProductQuery(productId);
  
    const dispatch = useDispatch();
  
    return (
      <>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.verdeLight} />
        ) : error ? (
          <Text>Error al cargar el producto</Text>
        ) : (
          <ScrollView style={styles.productContainer} contentContainerStyle={{ paddingBottom: 60 }}>
            <Pressable onPress={() => navigation.goBack()}>
              <Icon style={styles.goBack} name="arrow-back-ios" size={24} />
            </Pressable>
            <Text style={styles.textTitle}>{productFound.title}</Text>
            <Text style={styles.textBrand}>{productFound.brand}</Text>
            <Image
              source={{ uri: productFound.mainImage }}
              alt={productFound.title}
              width="100%"
              height={width * 0.7}
              resizeMode="contain"
            />
            <Text style={styles.longDescription}>
              {productFound.longDescription}
            </Text>
            {productFound.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{productFound.discount}%</Text>
              </View>
            )}
            {productFound.stock <= 0 && (
              <Text style={styles.noStockText}>Sin Stock</Text>
            )}
            {productFound.discount > 0 ? (
              <>
                <Text style={styles.price}>${productFound.price}</Text>
                <Text style={styles.priceDto}>
                  {" "}
                  Precio: ${" "}
                  {productFound.price * (1 - productFound.discount / 100)}
                </Text>
              </>
            ) : (
              <Text style={styles.priceDto}>
                {" "}
                Precio: $ {productFound.price * (1 - productFound.discount / 100)}
              </Text>
            )}
  
            <Pressable
              style={({ pressed }) => [
                { opacity: pressed ? 0.95 : 1 },
                styles.addToCartButton,
              ]}
              onPress={() => {
                dispatch(addItem({ ...productFound, quantity: 1 }));
            
                Toast.show({
                  type: 'success',
                  text1: 'Producto añadido al carrito',
                  text2: `${productFound.title} ha sido agregado con éxito.`,
                  visibilityTime: 2000,
                });
            
                navigation.goBack();
              }}
            >
              <Text style={styles.textAddToCart}>Añadir</Text>
              <Icon name="shopping-cart" size={24} color={colors.blanco} />
            </Pressable>
          </ScrollView>
        )}
      </>
    );
  };
  
  export default ProductScreen;
  
  const styles = StyleSheet.create({
    goBack: {
      padding: 8,
      color: colors.grisMedio,
    },
    productContainer: {
      paddingHorizontal: 16,
      backgroundColor: colors.verdeSuper,
      height: "100%",
    },
    textBrand: {
      fontSize: 15,
      color: colors.negro,
      marginBottom: 5,
    },
    textTitle: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.negro,
      marginBottom: 10,
    },
    productImage: {
      width: "100%",
      marginBottom: 15,
    },
    longDescription: {
      fontSize: 14,
      color: colors.negro,
      textAlign: "justify",
      paddingVertical: 8,
    },
    discountBadge: {
      position: "absolute",
      top: 80,
      right: 10,
      backgroundColor: colors.naranjaBrillante,
      padding: 10,
      borderRadius: 30,
    },
    discountText: {
      color: colors.negro,
      fontWeight: "bold",
    },
    noStockText: {
      color: "red",
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
    },
    price: {
      fontSize: 16,
      color: colors.naranjaBrillante,
      textDecorationLine: "line-through",
    },
    priceDto: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.negro,
    },
    addToCartButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      backgroundColor: colors.verdeOscuro,
      borderRadius: 16,
      marginVertical: 16,
    },
    textAddToCart: {
      color: colors.blanco,
      fontSize: 18,
      textAlign: "center",
      marginRight: 10,
    },
  });
  
  const smallStyles = StyleSheet.create({});