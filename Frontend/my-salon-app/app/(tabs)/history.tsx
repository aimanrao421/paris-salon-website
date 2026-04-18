import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ✅ Apna sahi IP aur Port check karlein
const API_URL = 'http://192.168.125.133:1337';

export default function HistoryScreen() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  const fetchHistory = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (!userString) {
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userString);
      setUserName(user.username);

      console.log("Fetching bookings for:", user.username);

      // ✅ FIX 1: populate=* lagaya taake saari fields milein
      const response = await fetch(`${API_URL}/api/bookings?populate=*`);
      const json = await response.json();

      if (json.data) {
        // ✅ FIX 2: Case-insensitive filter (lowercase)
        const myBookings = json.data.filter((item: any) => 
          item.attributes?.CustomerName?.toString().toLowerCase() === user.username.toLowerCase()
        );
        
        setBookings(myBookings.reverse());
      }
    } catch (error) {
      console.log("Network Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }: { item: any }) => {
    const data = item.attributes || {}; 

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.serviceName}>{data.Service || "Service Name"}</Text>
          {/* ✅ FIX 3: data.Status ki jagah data.BookingStatus use kiya */}
          <View style={[
            styles.statusBadge, 
            { backgroundColor: data.BookingStatus === 'confirmed' ? '#4CAF50' : '#FFC107' }
          ]}>
            <Text style={styles.statusText}>{data.BookingStatus || 'pending'}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{data.Date || "N/A"}</Text>
          
          <Ionicons name="time-outline" size={16} color="#666" style={{marginLeft: 15}} />
          <Text style={styles.infoText}>{data.Time || "N/A"}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.priceLabel}>Total Price:</Text>
          <Text style={styles.priceValue}>Rs. {data.Price || 0}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking History</Text>
        <View style={{width: 24}} /> 
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No history found for {userName}</Text>
          <TouchableOpacity style={styles.bookBtn} onPress={() => router.push('/services')}>
            <Text style={styles.bookBtnText}>Book a Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item: any) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#E91E63']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#E91E63', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listContent: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  infoText: { marginLeft: 5, color: '#666', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  priceLabel: { fontSize: 16, color: '#666' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#E91E63', marginLeft: 'auto' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#999', marginBottom: 20 },
  bookBtn: { backgroundColor: '#E91E63', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  bookBtnText: { color: 'white', fontWeight: 'bold' }
});