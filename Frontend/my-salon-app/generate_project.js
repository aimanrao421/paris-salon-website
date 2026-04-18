const fs = require('fs');
const path = require('path');

console.log('🚀 Starting to build Pari\'s Salon App Structure...');

const files = {
  // 1. DATA FILE
  'constants/servicesData.ts': `
export const SERVICES = [
  { id: '1', name: 'Haircut', price: 1500, duration: '45 mins', desc: 'Professional styling and cutting.', image: '✂️' },
  { id: '2', name: 'Facial', price: 3000, duration: '60 mins', desc: 'Deep cleansing and glow facial.', image: '✨' },
  { id: '3', name: 'Makeup', price: 5000, duration: '90 mins', desc: 'Party and bridal makeup services.', image: '💄' },
  { id: '4', name: 'Hair Spa', price: 2500, duration: '50 mins', desc: 'Relaxing spa for healthy hair.', image: '🧖‍♀️' },
];
`,

  // 2. CONTEXT FILE
  'context/BookingContext.tsx': `
import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState({ name: 'Pari User', email: 'pari@example.com' });

  const addBooking = (booking) => {
    setBookings([booking, ...bookings]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, user, setUser }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
`,

  // 3. MAIN LAYOUT
  'app/_layout.tsx': `
import { Stack } from 'expo-router';
import { BookingProvider } from '../context/BookingContext';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  return (
    <BookingProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="service/[id]" options={{ presentation: 'modal', title: 'Details' }} />
        <Stack.Screen name="appointment" options={{ title: 'Book Appointment', headerShown: true }} />
        <Stack.Screen name="receipt" options={{ gestureEnabled: false, headerShown: false }} />
      </Stack>
    </BookingProvider>
  );
}
`,

  // 4. INDEX FILE
  'app/index.tsx': `
import { Redirect } from 'expo-router';
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
`,

  // 5. LOGIN SCREEN
  'app/(auth)/login.tsx': `
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Salon App 💇‍♀️</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
        <Text style={styles.link}>New here? Signup</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', color: '#e91e63' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#e91e63', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 15, textAlign: 'center', color: '#666' }
});
`,

  // 6. SIGNUP SCREEN
  'app/(auth)/signup.tsx': `
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput placeholder="Full Name" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.btnText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, color: '#e91e63' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#e91e63', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 15, textAlign: 'center', color: '#666' }
});
`,

  // 7. TABS LAYOUT
  'app/(tabs)/_layout.tsx': `
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
`,

  // 8. HOME SCREEN
  'app/(tabs)/home.tsx': `
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cut" size={50} color="#e91e63" />
        <Text style={styles.logoText}>Pari's Salon</Text>
        <Text style={styles.welcome}>Welcome back, Pari! 👋</Text>
      </View>
      <Image source={{ uri: 'https://img.freepik.com/free-photo/beauty-salon-interior_1098-15462.jpg' }} style={styles.heroImage} />
      <View style={styles.section}>
        <Text style={styles.subTitle}>Ready for a new look?</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.push('/(tabs)/services')}>
          <Text style={styles.btnText}>View Services</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  logoText: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 10 },
  welcome: { fontSize: 18, color: '#666', marginTop: 5 },
  heroImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 30 },
  section: { alignItems: 'center' },
  subTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  btn: { backgroundColor: '#e91e63', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
`,

  // 9. SERVICES SCREEN
  'app/(tabs)/services.tsx': `
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SERVICES } from '../../constants/servicesData';

export default function Services() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Services</Text>
      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(\`/service/\${item.id}\`)}>
            <Text style={styles.icon}>{item.image}</Text>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>Rs. {item.price}</Text>
            </View>
            <Text style={styles.arrow}>➜</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 3 },
  icon: { fontSize: 40, marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#e91e63', fontWeight: '600' },
  arrow: { marginLeft: 'auto', fontSize: 20, color: '#ccc' }
});
`,

  // 10. HISTORY SCREEN
  'app/(tabs)/history.tsx': `
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useBooking } from '../../context/BookingContext';

export default function History() {
  const { bookings } = useBooking();
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking History</Text>
      {bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.service}>{item.serviceName}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.price}>Rs. {item.price}</Text>
                <Text style={styles.status}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  empty: { textAlign: 'center', marginTop: 50, color: '#999', fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#e91e63' },
  service: { fontSize: 18, fontWeight: 'bold' },
  date: { color: '#666', marginTop: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  status: { color: '#4CAF50', fontWeight: 'bold', marginTop: 5 }
});
`,

  // 11. PROFILE SCREEN
  'app/(tabs)/profile.tsx': `
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBooking } from '../../context/BookingContext';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const { user } = useBooking();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <Ionicons name="settings-outline" size={24} color="black" />
      </View>
      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}><Text style={{fontSize:40}}>👩</Text></View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <TouchableOpacity style={styles.optionBtn} onPress={() => router.push('/(tabs)/history')}>
        <Text style={styles.optionText}>📅 Booking History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.optionBtn, {marginTop: 'auto', backgroundColor: '#ffebee'}]} onPress={() => router.replace('/(auth)/login')}>
        <Text style={[styles.optionText, {color: 'red'}]}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', marginBottom: 40 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { color: 'gray' },
  optionBtn: { padding: 15, borderRadius: 10, backgroundColor: '#f8f9fa', marginBottom: 10 },
  optionText: { fontSize: 16, fontWeight: '600' }
});
`,

  // 12. SERVICE DETAIL
  'app/service/[id].tsx': `
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SERVICES } from '../../constants/servicesData';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const service = SERVICES.find(s => s.id === id);

  if (!service) return <Text>Service not found</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{service.image}</Text>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.desc}>{service.desc}</Text>
      <Text style={styles.details}>Duration: {service.duration}</Text>
      <Text style={styles.price}>Price: Rs. {service.price}</Text>
      <TouchableOpacity 
        style={styles.btn} 
        onPress={() => router.push({ pathname: '/appointment', params: { serviceId: id } })}
      >
        <Text style={styles.btnText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  desc: { textAlign: 'center', color: '#666', marginBottom: 20, fontSize: 16 },
  details: { fontSize: 16, marginBottom: 5 },
  price: { fontSize: 22, color: '#e91e63', fontWeight: 'bold', marginBottom: 30 },
  btn: { backgroundColor: '#e91e63', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
`,

  // 13. APPOINTMENT (With Notification)
  'app/appointment.tsx': `
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useBooking } from './context/BookingContext';
import { SERVICES } from './constants/servicesData';
import * as Notifications from 'expo-notifications';

export default function Appointment() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();
  const { addBooking } = useBooking();
  const service = SERVICES.find(s => s.id === serviceId);
  const [date, setDate] = useState(new Date());

  async function scheduleNotification(triggerDate, serviceName) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Appointment Reminder! 💇‍♀️",
          body: \`Aapka \${serviceName} appointment hai aaj!\`,
          sound: true,
        },
        trigger: { date: triggerDate },
      });
    } catch (error) {
      console.log("Notification Error:", error);
    }
  }

  const handleConfirm = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Notifications enable karein.');
      return;
    }
    const newBooking = {
      id: Math.random().toString(),
      serviceName: service?.name,
      price: service?.price,
      date: date.toLocaleString(),
      status: 'Confirmed'
    };
    addBooking(newBooking);
    await scheduleNotification(date, service?.name);
    router.replace({ 
      pathname: '/receipt', 
      params: { serviceName: service?.name, price: service?.price, date: date.toLocaleString(), duration: service?.duration } 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date & Time for {service?.name}</Text>
      <DateTimePicker
        value={date}
        mode="datetime"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(e, d) => setDate(d || date)}
        minimumDate={new Date()}
      />
      <TouchableOpacity style={styles.btn} onPress={handleConfirm}>
        <Text style={styles.btnText}>Confirm & Notify Me</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  label: { fontSize: 20, marginBottom: 30, fontWeight: 'bold', textAlign: 'center' },
  btn: { backgroundColor: '#e91e63', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 30 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
`,

  // 14. RECEIPT
  'app/receipt.tsx': `
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Receipt() {
  const router = useRouter();
  const { serviceName, price, date, duration } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
      <Text style={styles.success}>Booking Confirmed!</Text>
      <View style={styles.card}>
        <Text style={styles.row}>Service: <Text style={styles.bold}>{serviceName}</Text></Text>
        <Text style={styles.row}>Date: <Text style={styles.bold}>{date}</Text></Text>
        <Text style={styles.row}>Duration: <Text style={styles.bold}>{duration}</Text></Text>
        <View style={styles.divider} />
        <Text style={[styles.row, {fontSize: 20, color: '#e91e63'}]}>Total: Rs. {price}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa', padding: 20 },
  success: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginTop: 10, marginBottom: 40 },
  card: { backgroundColor: '#fff', width: '100%', padding: 25, borderRadius: 15, elevation: 5, marginBottom: 40 },
  row: { fontSize: 18, marginBottom: 15, color: '#333' },
  bold: { fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  btn: { backgroundColor: '#333', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
`
};

// ---------------------------------------------------------
// SCRIPT LOGIC
// ---------------------------------------------------------
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  const dirName = path.dirname(fullPath);

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
    console.log('📁 Created Folder:', dirName);
  }

  fs.writeFileSync(fullPath, content.trim());
  console.log('✅ Created File:', filePath);
}

console.log('🎉 Pura Setup Complete! Ab run karein: npx expo start');