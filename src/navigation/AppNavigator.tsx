import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import SellScrapScreen from '../screens/SellScrapScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MobileLoginScreen from '../screens/MobileLoginScreen';

import ScrapUploadScreen from '../screens/ScrapUploadScreen';
import AdPostScreen from '../screens/AdPostScreen';
import AdDetailScreen from '../screens/AdDetailScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import ScrapListingsScreen from '../screens/ScrapListingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import SavedAddressesScreen from '../screens/SavedAddressesScreen';
import MyFavoritesScreen from '../screens/MyFavoritesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#999',
        tabBarIcon: ({ color, size }) => {
          const icons: any = {
            Home: 'home',
            Marketplace: 'cart',
            Sell: 'add-circle',
            Chats: 'chatbubbles',
            Profile: 'person',
          };
          return <Icon name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') || 'Home' }} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ title: t('marketplace') || 'Marketplace' }} />
      <Tab.Screen name="Sell" component={SellScrapScreen} options={{ title: t('sellScrap') || 'Sell' }} />
      <Tab.Screen name="Chats" component={ChatScreen} options={{ title: t('chats') || 'Chats' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') || 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2e7d32' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen name="ScrapUpload" component={ScrapUploadScreen} options={{ headerShown: true, title: 'Upload Scrap' }} />
            <Stack.Screen name="AdPost" component={AdPostScreen} options={{ headerShown: true, title: 'Post Ad' }} />
            <Stack.Screen name="AdDetail" component={AdDetailScreen} options={{ headerShown: true, title: 'Details' }} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ headerShown: true }} />
            <Stack.Screen name="ScrapListings" component={ScrapListingsScreen} options={{ headerShown: true, title: 'Scrap Listings' }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, title: "Settings" }} />
            <Stack.Screen name="MyBookings" component={MyBookingsScreen} options={{ headerShown: true, title: "My Bookings" }} />
            <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} options={{ headerShown: true, title: "Saved Addresses" }} />
            <Stack.Screen name="MyFavorites" component={MyFavoritesScreen} options={{ headerShown: true, title: "My Favorites" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="MobileLogin" component={MobileLoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
