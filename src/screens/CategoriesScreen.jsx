import { StyleSheet, Text, View, FlatList, Image, Pressable, useWindowDimensions, ActivityIndicator, ScrollView } from 'react-native'
//import categories from "../data/categories.json"
import FlatCard from '../components/FlatCard'
import { useEffect, useState } from 'react'
import { colors } from '../global/colors'
import { useSelector, useDispatch } from 'react-redux'
import { setCategory } from '../features/shop/shopSlice'
import { useGetCategoriesQuery } from '../services/shopService'
import { autoBatchEnhancer } from '@reduxjs/toolkit'
import MontserratText from '../components/MontserratText'

const CategoriesScreen = ({ navigation }) => {
    const { width, height } = useWindowDimensions()
    const [isPortrait, setIsPortrait] = useState(true)

    const { data: categories, error, isLoading } = useGetCategoriesQuery()

    const dispatch = useDispatch()

    useEffect(() => {
        if (width > height) {
            setIsPortrait(false)
        } else {
            setIsPortrait(true)
        }
    },[width, height])

    const renderCategoryItem = ({ item, index }) => {
        return (
                <Pressable onPress={() => {
                dispatch(setCategory(item.title))
                navigation.navigate('Productos')
            }}>
                <View style={width > 400 ? styles.categoryItemContainer : stylesSmall.categoryItemContainer} >
                    <View style={styles.imageContainer} >
                        <Image
                        source={{ uri: item.image }}
                        style={width > 400 ? styles.image : stylesSmall.image}
                        />
                    </View>
                    <MontserratText style={width > 400 ? styles.categoryTitle : stylesSmall.categoryTitle}>{item.title}</MontserratText>
                </View>
            </Pressable>            
        )
    }


    return (
        <View style={styles.container}>
            {
                isLoading
                ?
                <ActivityIndicator size="large" color={colors.verdeNeon} />
                :
                error
                ?
                <Text>Error al cargar las categorías</Text>
                :
                <FlatList
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderCategoryItem}
                numColumns={3}
                contentContainerStyle={styles.flatListContainer}
            />
            }
        </View>
    )
}

export default CategoriesScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.verdeSuper,
        height: "100%",
        paddingBottom:45
    },
    categoryItemContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 4,
        width: 120,
        height: 150,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: 'center',
        color: colors.negro,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40, 
        overflow: 'hidden',
        marginBottom: 5,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
    },
    flatListContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    }
})

const stylesSmall = StyleSheet.create({
    categoryItemContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        padding: 4,
        width: 110,
        height: 150,
    },
    categoryTitle: {
        fontSize: 16,
        fontFamily: "BebasNeue",
        textAlign: 'center',
        color: colors.negro,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: 'cover',
    },
})

