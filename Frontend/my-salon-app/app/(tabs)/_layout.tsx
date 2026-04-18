import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#e91e63', headerShown: false }}>
      <Tabs.Screen name="home" options={{ tabBarLabel: 'Home', tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="services" options={{ tabBarLabel: 'Services', tabBarIcon: ({color}) => <Ionicons name="grid" size={24} color={color} /> }} />
      <Tabs.Screen name="history" options={{ tabBarLabel: 'Bookings', tabBarIcon: ({color}) => <Ionicons name="time" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ tabBarLabel: 'Profile', tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}