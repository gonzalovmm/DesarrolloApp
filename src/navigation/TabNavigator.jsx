import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'

import ShopNavigator from "./ShopNavigator";
import CartNavigator from "./CartNavigator";
import ReceiptsNavigator from "./ReceiptsNavigator";
import ProfileNavigator from "./ProfileNavigator";
import MyPlacesNavigator from "./MyPlacesNavigator";
import { colors } from "../global/colors";


const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
        <Tab.Navigator
            initialRouteName="Shop"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar
            }}
        >
            <Tab.Screen 
                name="Shop" 
                component={ShopNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="storefront" size={32} color={focused?colors.verdeClaro:colors.verdeSuper} />)
                }}
            />
            <Tab.Screen 
                name="Cart" 
                component={CartNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="shopping-cart" size={32} color={focused?colors.verdeClaro:colors.verdeSuper} />)
                }}
            />
            <Tab.Screen 
                name="Receipts"
                component={ReceiptsNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="receipt-long" size={32} color={focused?colors.verdeClaro:colors.verdeSuper} />)
                }}
            />
            <Tab.Screen 
                name="Profile"
                component={ProfileNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="account-circle" size={32} color={focused?colors.verdeClaro:colors.verdeSuper} />)
                }}
            />
            <Tab.Screen 
                name="Places"
                component={MyPlacesNavigator} 
                options={{
                    tabBarIcon: ({focused})=>(<Icon name="location-on" size={32} color={focused?colors.verdeClaro:colors.verdeSuper} />)
                }}
            />
        </Tab.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({
    tabBar:{
        height: 60,
        backgroundColor: colors.verdeOscuro,
        borderRadius: 35,
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        elevation: 0,
        shadowColor: colors.verdeOscuro,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,}
})