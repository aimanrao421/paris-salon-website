import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, TextInput, StatusBar, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Setting() {
  const router = useRouter();

  // --- States ---
  const [user, setUser] = useState({ username: '', email: '' });
  const [usernameInput, setUsernameInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 1. Load User Data ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('user');
        if (jsonValue) {
          const parsedUser = JSON.parse(jsonValue);
          setUser(parsedUser);
          if (parsedUser.username) setUsernameInput(parsedUser.username);
        }
      } catch (e) {
        console.log("Error loading user data", e);
      }
    };
    loadData();
  }, []);

  // --- 2. Save New Username ---
  const handleSaveUsername = async () => {
    const trimmed = usernameInput.trim();
    if (!trimmed) {
      Alert.alert('Validation', 'Please enter a valid username');
      return;
    }

    const newUser = { ...user, username: trimmed };
    setUser(newUser); 

    try {
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      Alert.alert('Success 🎉', 'Username updated successfully!');
    } catch {
      Alert.alert('Error', 'Failed to save username');
    }
  };

  // --- 3. Logout Logic ---
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.clear(); // Saara data clear ho jayega
          router.replace('/'); // Login ya Home par wapis bhej dega
        }
      }
    ]);
  };

  // --- Dynamic Theme Styles ---
  const theme = {
    bg: isDarkMode ? '#121212' : '#f8f9fa',
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#333333',
    subText: isDarkMode ? '#AAAAAA' : '#666666',
    border: isDarkMode ? '#333' : '#eee',
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <ScrollView>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.header, { color: theme.text }]}>Settings</Text>
          <Text style={[styles.subTitle, { color: theme.subText }]}>Manage your profile and preferences</Text>
        </View>

        {/* --- Edit Profile Card --- */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: '#e91e63' }]}>Profile Information</Text>
          
          <Text style={[styles.label, { color: theme.subText }]}>Username</Text>
          <View style={[styles.inputRow, { borderBottomColor: theme.border }]}>
            <TextInput 
              style={[styles.input, { color: theme.text }]}
              value={usernameInput}
              onChangeText={setUsernameInput}
              placeholder="Edit Name"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={handleSaveUsername} style={styles.saveBtn}>
               <Ionicons name="checkmark-done-circle" size={30} color="#4CAF50" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { color: theme.subText, marginTop: 15 }]}>Email Address</Text>
          <Text style={[styles.emailText, { color: theme.text }]}>
              {user?.email || "No email linked"}
          </Text>
        </View>

        {/* --- App Settings Card --- */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: '#e91e63' }]}>Preferences</Text>
          
          <View style={styles.row}>
            <View style={styles.iconLabelRow}>
              <Ionicons name="moon-outline" size={22} color={theme.text} />
              <Text style={[styles.optionText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch 
               value={isDarkMode} 
               onValueChange={setIsDarkMode}
               trackColor={{ false: "#767577", true: "#f48fb1" }}
               thumbColor={isDarkMode ? "#e91e63" : "#f4f3f4"}
            />
          </View>
          
          <TouchableOpacity style={styles.row} onPress={() => Alert.alert("Coming Soon", "Notification settings are being updated.")}>
            <View style={styles.iconLabelRow}>
              <Ionicons name="notifications-outline" size={22} color={theme.text} />
              <Text style={[styles.optionText, { color: theme.text }]}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* --- Logout Button --- */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={styles.version}>App Version 1.0.2</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  headerSection: { marginTop: 60, marginBottom: 30 },
  header: { fontSize: 32, fontWeight: 'bold' },
  subTitle: { fontSize: 16, marginTop: 5 },
  card: { borderRadius: 20, padding: 20, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 5 },
  input: { flex: 1, fontSize: 18, fontWeight: '500' },
  saveBtn: { marginLeft: 10 },
  emailText: { fontSize: 16, marginTop: 8, fontWeight: '400' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  iconLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionText: { fontSize: 16, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FFF5F5', padding: 18, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#FFEBEB' },
  logoutText: { color: '#FF5252', fontWeight: 'bold', fontSize: 16 },
  version: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 12, marginBottom: 50 }
});