import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetail() {
  const router = useRouter();
  const { serviceName, price, duration, description } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* Header Image Area */}
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Text style={{fontSize: 50}}>💅</Text> 
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Name & Details */}
        <Text style={styles.title}>{serviceName || "Service Detail"}</Text>
        
        <View style={styles.row}>
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={18} color="#e91e63" />
            <Text style={styles.badgeText}>{duration}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="pricetag-outline" size={18} color="#e91e63" />
            <Text style={styles.badgeText}>Rs. {price}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About Service</Text>
        <Text style={styles.description}>
          {description || "No description available."}
        </Text>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={() => {
            // Appointment screen par jane ke liye
            router.push({
              pathname: '/appointment',
              params: { serviceName, price }
            });
          }}
        >
          <Text style={styles.btnText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 180, backgroundColor: '#ffeef2', justifyContent: 'center', alignItems: 'center' },
  iconBox: { padding: 15, backgroundColor: '#fff', borderRadius: 50, elevation: 5 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  row: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff0f3', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, gap: 5 },
  badgeText: { color: '#e91e63', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  description: { fontSize: 16, color: '#666', lineHeight: 24 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  bookBtn: { backgroundColor: '#e91e63', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});