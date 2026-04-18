// FILE: app/index.tsx
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Check karein token mojood hai ya nahi
        const token = await AsyncStorage.getItem('jwt');
        
        if (token) {
          // Agar token hai, to Home par bhejen
          router.replace('/(tabs)/home');
        } else {
          // Agar token nahi hai, to Login par bhejen
          router.replace('/login');
        }
      } catch (e) {
        // Error aaye to bhi Login par bhejen
        router.replace('/login');
      } finally {
        setIsChecked(true);
      }
    };

    checkUser();
  }, []);

  // Jab tak check ho raha hai, loading dikhayein
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#e91e63" />
    </View>
  );
}