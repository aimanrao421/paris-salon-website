import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('Pari');

  // --- User ka Naam Load Karna ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Agar naam hai to set karein, warna 'Pari' default rahega
          setUsername(parsedUser.username || 'Pari'); 
        }
      } catch (error) {
        console.log("Error loading name:", error);
      }
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* --- 1. TOP SECTION (Icon & Welcome) --- */}
      <View style={styles.headerSection}>
        {/* Scissors Icon */}
        <Ionicons name="cut" size={50} color="#e91e63" style={styles.icon} />
        
        <Text style={styles.brandName}>Pari's Salon</Text>
{/* Yahan hum {username} use kar rahe hain jo AsyncStorage se aaya hai */}
<Text style={styles.welcomeText}>Welcome, {username}! ✨💇‍♀️</Text>
      </View>

      {/* --- 2. MAIN IMAGE (Salon Photo) --- */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop' }} 
          style={styles.salonImage} 
        />
      </View>

      {/* --- 3. PROMO TEXT --- */}
      <View style={styles.textContainer}>
        <Text style={styles.promoTitle}>Discover Your Best Look ✨</Text>
        <Text style={styles.promoSubtitle}>
          Professional hair, makeup, and spa services waiting for you.
        </Text>
      </View>

      {/* --- 4. BOOK NOW BUTTON --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => router.push('/(tabs)/services')} // Ye Services tab par le jayega
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff0f5', // Halka Pink background
    alignItems: 'center',
    paddingTop: 50, // Upar se thori jagah
  },

  // Header Styles
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
    transform: [{ rotate: '-10deg' }] // Thora sa tircha stylish look ke liye
  },
  brandName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },

  // Image Styles
  imageContainer: {
    width: '90%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden', // Image ko golai mein rakhne ke liye
    marginBottom: 30,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  salonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // Black & White effect ke liye 'tintColor' use nahi karte, 
    // lekin original photo agar colored ho to wo colored hi dikhegi.
    // Agar black/white chahiye to filter lagana parta hai, 
    // filhal maine aik stylish salon ki photo lagayi hai.
  },

  // Text Styles
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e91e63', // Dark Pink
    marginBottom: 10,
    textAlign: 'center',
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Button Styles
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#000', // Black Button
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 50, // Pill shape
    elevation: 5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});