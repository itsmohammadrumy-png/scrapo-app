import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

// రియల్ హోమ్ స్క్రీన్ ఇంపోర్ట్
import HomeScreen from '../screens/HomeScreen';

// తాత్కాలికంగా మిగతా స్క్రీన్స్ కోసం సింపుల్ కాంపోనెంట్స్
const MarketplaceScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Text>{t('marketplace')}</Text>
    </View>
  );
};

const SellScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Text>{t('sellScrap')}</Text>
    </View>
  );
};

const ChatScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Text>{t('chats')}</Text>
    </View>
  );
};

const ProfileScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Text>{t('profile')}</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
        <Tab.Screen name="Sell" component={SellScreen} />
        <Tab.Screen name="Chats" component={ChatScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

