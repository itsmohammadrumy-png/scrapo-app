import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// పాత / ఇప్పటికే ఉన్న స్క్రీన్స్ (మార్కెట్‌ప్లేస్ మొదలైనవి) ఇక్కడ ఉంటాయి
// (మీ ప్రాజెక్ట్ బట్టి అవసరమైనవి ఇక్కడ ఇంపోర్ట్ చేసుకోవచ్చు)

// కొత్తగా మనం యాడ్ చేసిన స్క్రాప్ & పిక్‌అప్ స్క్రీన్స్
import ScrapPricingScreen from '../screens/ScrapPricingScreen';
import PickupRequestScreen from '../screens/PickupRequestScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="ScrapPricing">
      {/* స్క్రాప్ మార్కెట్ మరియు ప్రైసింగ్ స్క్రీన్ */}
      <Stack.Screen 
        name="ScrapPricing" 
        component={ScrapPricingScreen} 
        options={{ title: 'Scrap Market & Rates' }} 
      />
      
      {/* పిక్‌అప్ రిక్వెస్ట్ స్క్రీన్ */}
      <Stack.Screen 
        name="PickupRequest" 
        component={PickupRequestScreen} 
        options={{ title: 'Schedule Pickup' }} 
      />
    </Stack.Navigator>
  );
}
