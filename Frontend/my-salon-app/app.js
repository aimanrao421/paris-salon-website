import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens Import
import LoginScreen from './LoginScreen'; 
import ProfileScreen from './ProfileScreen'; // <--- Yahan se // hata diya hai

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        {/* Login Screen */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* Profile Screen (AB YEH ACTIVE HAI) */}
        <Stack.Screen 
          name="Profile" // <--- Ye naam zaroori hai navigation ke liye
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}