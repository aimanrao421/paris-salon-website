import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ✅ IP Address (Check karein ke ye wahi ho jo abhi chal rahi hai)
export const API_URL = 'http://192.168.125.133:1337';


export default function SignupScreen() {
  const router = useRouter();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Ruk Jayein!", "Please saare fields bharein.");
      return;
    }

    setLoading(true);

    try {
      // 1. Register API Call
      const response = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        // ✅ SUCCESS
        Alert.alert("Mubarak Ho! 🎉", "Account ban gaya hai. Ab Login karein.");
        
        // Auto-Login band hai
        // await AsyncStorage.setItem('jwt', data.jwt);

        // ✅ SAHI RASTA (Fix)
        // (auth) hata diya kyunki wo URL mein count nahi hota
        router.replace('/login'); 

      } else {
        Alert.alert("Error", data.error?.message || "Signup nahi ho saka.");
      }

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Network Error. IP check karein.");
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

      <Text style={styles.title}>Create Account ✨</Text>
      <Text style={styles.subtitle}>Sign up to get started!</Text>

      {/* Username Input */}
      <View style={styles.inputBox}>
        <Ionicons name="person-outline" size={20} color="#666" style={{marginRight: 10}} />
        <TextInput 
          style={styles.input} 
          placeholder="Full Name (Username)" 
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={20} color="#666" style={{marginRight: 10}} />
        <TextInput 
          style={styles.input} 
          placeholder="Email Address" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={{marginRight: 10}} />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={styles.btn} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? <Text style={{color: '#e91e63', fontWeight: 'bold'}}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff0f5' },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 5, color: '#e91e63', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 40, textAlign: 'center' },
  
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  input: { flex: 1, fontSize: 16 },

  btn: { backgroundColor: '#e91e63', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, elevation: 3 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#666', fontSize: 15 }
});