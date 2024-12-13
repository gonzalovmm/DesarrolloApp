import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import { colors } from '../global/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Search from '../components/Search';
import { useSelector, useDispatch } from 'react-redux';
import { useGetProductsByCategoryQuery } from '../services/shopService';
import { setProductId } from '../features/shop/shopSlice';
import Toast from 'react-native-toast-message';

const ProductsScreen = ({ navigation, route }) => {
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [search, setSearch] = useState("");

    const category = useSelector(state => state.shopReducer.value.categorySelected);
    const { data: productsFilteredByCategory, error, isLoading } = useGetProductsByCategoryQuery(category);

    const dispatch = useDispatch();

    useEffect(() => {
        setProductsFiltered(productsFilteredByCategory);
        if (search) {
            setProductsFiltered(productsFilteredByCategory.filter(product => product.title.toLowerCase().includes(search.toLowerCase())));
        }
    }, [search, productsFilteredByCategory]);

    const renderProductItem = ({ item }) => {
        return (
            <Pressable onPress={() => {
                dispatch(setProductId(item.id));
                navigation.navigate("Producto");
            }}>
                <View style={styles.productContainer}>
                    {
                        item.discount > 0 && (
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>-{item.discount}%</Text>
                            </View>
                        )
                    }
                    <Image
                        source={{ uri: item.mainImage }}
                        style={styles.productImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.productTitle}>{item.title}</Text>
                    {
                        item.discount > 0 ? (
                            <>
                                <Text style={styles.price}>${item.price}</Text>
                                <Text style={styles.priceDto}>$ {item.price * (1 - item.discount / 100)}</Text>
                            </>
                            ): 
                            <Text style={styles.priceDto}>$ {item.price * (1 - item.discount / 100)}</Text>
                    }
                    
                    
                </View>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color={colors.verdeOscuro} />
            ) : error ? (
                <Text style={styles.errorText}>Error al cargar los productos</Text>
            ) : (
                <>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Icon style={styles.goBack} name="arrow-back-ios" size={24} />
                    </Pressable>
                    <Search setSearch={setSearch} />
                    <FlatList
                        data={productsFiltered}
                        keyExtractor={item => item.id}
                        renderItem={renderProductItem}
                        numColumns={2}
                        contentContainerStyle={styles.flatListContainer}
                    />
                </>
            )}
            <Toast />
        </View>
    );
};

export default ProductsScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.verdeSuper,
        flex: 1,
        padding: 10,
        paddingBottom:80
    },
    errorText: {
      color: colors.negro,
      fontSize: 16,
      fontWeight: 'bold',  
    },
    productContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: colors.verdeLight,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150, 
        height: 200,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        position: 'relative',
    },
    productImage: {
        width: 100,
        height: 100,
        marginBottom: 5,
    },
    productTitle: {
        fontSize: 12,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.negro,
    },
    price: {
        fontSize: 11,
        color: colors.naranjaBrillante,
        textDecorationLine: 'line-through',
    },
    priceDto: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.negro,
    },
    discountBadge: {
        position: 'absolute',
        top: 3,
        left: 3,
        backgroundColor: colors.naranjaBrillante,
        padding: 2,
        borderRadius: 5,
    },
    discountText: {
        color: colors.negro,
        fontWeight: 'bold',
    },
    flatListContainer: {
        paddingHorizontal: 10,
    },
    goBack: {
        padding: 10,
        color: colors.grisMedio,
    },
});