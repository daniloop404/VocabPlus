import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import WordSelectionScreen from './src/screens/WordSelectionScreen';
import ToolScreen from './src/screens/ToolScreen';
import { RootStackParamList } from './src/constants/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home"
          screenOptions={{
            headerShown: false // Oculta el header de todas las pantallas
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="WordSelection" component={WordSelectionScreen} />
          <Stack.Screen name="Tool" component={ToolScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}