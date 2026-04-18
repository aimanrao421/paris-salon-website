import { Stack } from 'expo-router';
import { BookingProvider } from '../context/BookingContext';

export default function RootLayout() {
  return (
    <BookingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Start Screen */}
        <Stack.Screen name="index" />
        
        {/* Login/Signup */}
        <Stack.Screen name="(auth)" />
        
        {/* Main Tabs (Home, Services, etc.) */}
        <Stack.Screen name="(tabs)" />
        
        {/* Service Detail Page */}
        <Stack.Screen 
          name="service/[id]" 
          options={{ presentation: 'card', headerShown: false }} 
        />

        {/* ✅ FIX: Yahan se 'service/' hata diya kyunki file bahar padi hai */}
        <Stack.Screen 
          name="appointment" 
          options={{ presentation: 'card', headerShown: false }} 
        />
        
        {/* Receipt Screen */}
        <Stack.Screen 
          name="receipt" 
          options={{ gestureEnabled: false, headerShown: false }} 
        />
      </Stack>
    </BookingProvider>
  );
}