import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Sahi IP Address
 export const API_URL = 'http://192.168.125.133:1337';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please email aur password likhein.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        // Token save karein
        await AsyncStorage.setItem('jwt', data.jwt);
        await AsyncStorage.setItem('user', JSON.stringify(data.user)); 
        
        Alert.alert("Success", "Login Ho Gaya! 🎉");
        
        // ✅ Login ke baad Home par le jayen
        router.replace('/(tabs)/home'); 
      } else {
        Alert.alert("Failed", "Email ya Password ghalat hai.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Server connect nahi hua. IP check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome Back! 👋</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      {/* Email Input */}
      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}} />
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          value={email} 
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      {/* Signup Link */}
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.linkText}>Don't have an account? <Text style={{color: '#E91E63', fontWeight: 'bold'}}>Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff0f5' },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#E91E63' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  input: { flex: 1, fontSize: 16 },
  btn: { backgroundColor: '#E91E63', padding: 15, borderRadius: 10, alignItems: 'center', elevation: 3 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  linkText: { marginTop: 20, textAlign: 'center', color: '#666', fontSize: 15 }
});