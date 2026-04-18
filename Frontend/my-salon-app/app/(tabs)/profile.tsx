import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  
  // --- States ---
  // ✅ Isay change kar dein taake kisi aur ka naam na dikhe
const [user, setUser] = useState({ username: 'Loading...', email: '' });
  const [image, setImage] = useState<string | null>(null);

  // --- 1. Data Load Karna (Naam aur Photo) ---
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          // User Data Load
          const userData = await AsyncStorage.getItem('user');
          if (userData) setUser(JSON.parse(userData));

          // Image Load
          const savedImage = await AsyncStorage.getItem('profileImage');
          if (savedImage) setImage(savedImage);

        } catch (error) {
          console.log(error);
        }
      };
      loadData();
    }, [])
  );

  // --- 2. Gallery Se Photo Lena (SIMPLE VERSION) ---
  const pickImage = async () => {
    // 1. Permission Maango
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert("Permission Error", "Gallery ki ijazat dein.");
      return;
    }

    // 2. Gallery Kholo
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // 3. Agar User ne Cancel nahi kiya
    if (!result.canceled) {
      // Yahan hum seedha rasta apna rahe hain taake error na aaye
      const photoUri = result.assets[0].uri; 
      
      setImage(photoUri); // Screen par lagao
      await AsyncStorage.setItem('profileImage', photoUri); // Save kar lo
    }
  };

  // --- 3. Logout Function ---
  const handleLogout = async () => {
    Alert.alert("Logout", "Kya aap logout karna chahti hain?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/');
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      
      {/* --- HEADER --- */}
      <View style={styles.pinkHeader}>
        <View style={styles.navRow}>
          <Text style={styles.screenTitle}>My Profile</Text>
          <TouchableOpacity onPress={() => router.push('/setting')}> 
            <Ionicons name="settings-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Image Area */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
            {image ? (
              // Agar image hai to wo dikhao
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              // Agar image nahi hai to Placeholder dikhao
              <View style={[styles.profileImage, styles.placeholder]}>
                 <Text style={styles.avatarText}>
                    {user.username ? user.username[0].toUpperCase() : 'G'}
                 </Text>
              </View>
            )}
            
            {/* Camera Icon */}
            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#E91E63" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.userName}>{user.username || 'Guest'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      {/* --- MENU --- */}
      <View style={styles.whiteBody}>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/history')}>
          <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}> 
            <Ionicons name="calendar" size={22} color="#2196F3" />
          </View>
          <Text style={styles.menuText}>Booking History</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/setting')}>
          <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}> 
            <Ionicons name="options" size={22} color="#FF9800" />
          </View>
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}> 
            <Ionicons name="log-out" size={22} color="#D32F2F" />
          </View>
          <Text style={[styles.menuText, { color: '#D32F2F' }]}>Logout</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E91E63' },
  pinkHeader: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, alignItems: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  screenTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  profileContainer: { alignItems: 'center', marginBottom: 10 },
  imageWrapper: { position: 'relative', marginBottom: 15 },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: '#fff' },
  placeholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF80AB' },
  avatarText: { fontSize: 40, color: 'white', fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 5, backgroundColor: '#fff', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  whiteBody: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 10 },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#333' },
});