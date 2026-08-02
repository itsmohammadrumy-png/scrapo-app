import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/localization/i18n'; // i18n ఇనిషియలైజేషన్
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

