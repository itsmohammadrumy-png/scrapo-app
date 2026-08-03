
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import MobileLoginScreen from '../screens/MobileLoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import SellScreen from '../screens/SellScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScrapUploadScreen from '../screens/ScrapUploadScreen';
import AdPostScreen from '../screens/AdPostScreen';
import AdDetailScreen from '../screens/AdDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="Sell" component={SellScreen} />
      <Tab.Screen name="Chats" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MobileLogin" component={MobileLoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="ScrapUpload" component={ScrapUploadScreen} />
        <Stack.Screen name="AdPost" component={AdPostScreen} />
        <Stack.Screen name="AdDetail" component={AdDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

