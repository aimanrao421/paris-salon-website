import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// ✅ IP Address (Make sure ye abhi bhi same ho)
export const API_URL = 'http://192.168.125.133:1337';


export default function AppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 

  const serviceName = params.serviceName || 'General Service'; 
  const price = params.price || '0'; 

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // --- 📅 DATE PICKER LOGIC ---
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'ios') setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const showAndroidDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      onChange: (event: any, selectedDate?: Date) => {
        if (selectedDate) setDate(selectedDate);
      },
    });
  };

  const showAndroidTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'time',
      is24Hour: false,
      onChange: (event: any, selectedDate?: Date) => {
        if (selectedDate) setDate(selectedDate);
      },
    });
  };

  // --- BOOKING FUNCTION ---
  const handleConfirmBooking = async () => {
    if (!name.trim()) {
      Alert.alert("Ruk Jayein!", "Please apna naam likhein.");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = date.toISOString().split('T')[0]; 
      const formattedTime = date.toLocaleTimeString();

      // ✅ FINAL FIX: Strapi Fields ke mutabiq sab Capital Letters mein
      const bookingData = {
        data: {
          CustomerName: name,       // ✅ Capital C
          Service: serviceName,     // ✅ Capital S
          Date: formattedDate,      // ✅ Capital D
          Time: formattedTime,      // ✅ Capital T
          
          Price: Number(price),     // ✅ Capital P aur Number conversion
          
          BookingStatus: 'pending', // ✅ Capital B
          
          // Note: description      // ⚠️ Note ko comment kiya hai taake error na aye (Strapi ma field nahi thi)
        }
      };

      console.log("🚀 Sending Data:", bookingData); 

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Mubarak Ho! 🎉", "Booking Confirm ho gayi hai.");
        
        router.replace({
          pathname: '/receipt',
          params: {
            customer: name,
            service: serviceName,
            date: formattedDate,
            time: formattedTime,
            price: price,
            id: json.data?.id 
          }
        });
      } else {
        console.log("Server Error:", json);
        const errorMsg = json.error?.message || "Booking nahi ho saki.";
        Alert.alert("Failed", `Error: ${errorMsg}`);
      }

    } catch (error) {
      console.log("Network Error:", error);
      Alert.alert("Network Error", "Backend connect nahi ho raha.\nIP Address check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Fill Details</Text>
        <View style={{width: 24}} />
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Booking For:</Text>
        <Text style={styles.serviceTitle}>{serviceName}</Text>
        <Text style={styles.priceTag}>Rs. {price}</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your name" 
          value={name} 
          onChangeText={setName} 
        />

        <Text style={styles.inputLabel}>Date & Time</Text>
        <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity style={styles.dateBtn} onPress={Platform.OS === 'android' ? showAndroidDatePicker : () => setShowPicker(true)}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dateBtn} onPress={Platform.OS === 'android' ? showAndroidTimePicker : () => {}}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.dateText}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
            </TouchableOpacity>
        </View>

        {showPicker && Platform.OS === 'ios' && (
            <DateTimePicker value={date} mode="date" display="spinner" onChange={onDateChange} />
        )}

        <Text style={styles.inputLabel}>Special Note (Optional)</Text>
        <TextInput 
          style={[styles.input, {height: 80}]} 
          placeholder="Koi khas request?" 
          multiline
          textAlignVertical="top"
          value={description} 
          onChangeText={setDescription} 
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleConfirmBooking} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Confirm Booking ✅</Text>}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff0f5', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#e91e63' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  label: { fontSize: 14, color: '#666' },
  serviceTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 5 },
  priceTag: { fontSize: 18, fontWeight: 'bold', color: '#e91e63', marginTop: 5 },
  form: { marginBottom: 30 },
  inputLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  dateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', gap: 10 },
  dateText: { fontSize: 15, color: '#333' },
  btn: { backgroundColor: '#e91e63', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 5 },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});