import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// తాత్కాలికంగా స్క్రీన్స్ కోసం సింపుల్ కాంపోనెంట్స్ వాడదాం (తర్వాత రియల్ స్క్రీన్స్ పెడదాం)
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.center}>
      <Text>{t('welcome')}</Text>
    </View>
  );
};

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

