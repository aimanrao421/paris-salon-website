import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Receipt() {
  const router = useRouter();
  
  // ✅ FIX: Parameters wahi rakhein jo AppointmentScreen bhej raha hai
  // (Wahan humne 'service', 'date', 'time', 'price', 'customer' bheja tha)
  const { service, price, date, time, customer, id } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.iconContainer}>
         <Ionicons name="checkmark-done-circle" size={80} color="#4CAF50" />
      </View>
      <Text style={styles.success}>Booking Successful!</Text>
      
      {/* --- RECEIPT CARD --- */}
      <View style={styles.receiptCard}>
        <Text style={styles.headerTitle}>PAYMENT RECEIPT</Text>
        <Text style={styles.shopName}>Pari's Salon</Text>
        
        {/* Booking ID */}
        <Text style={{textAlign:'center', color:'#888', fontSize:12}}>Booking ID: #{id}</Text>

        <View style={styles.dashedLine} />

        <View style={styles.row}>
          <Text style={styles.label}>Customer:</Text>
          <Text style={styles.value}>{customer}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Service:</Text>
          {/* ✅ Yahan 'service' use kiya */}
          <Text style={styles.value}>{service}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Time:</Text>
          {/* ✅ Yahan 'time' use kiya */}
          <Text style={styles.value}>{time}</Text>
        </View>

        <View style={styles.dashedLine} />
        
        <View style={styles.row}>
          <Text style={[styles.label, {fontWeight:'bold', color:'#000'}]}>TOTAL:</Text>
          <Text style={[styles.value, {fontSize: 22, color: '#e91e63'}]}>Rs. {price}</Text>
        </View>

        <Text style={styles.status}>Paid & Verified ✅</Text>
      </View>

      {/* Back to Home Logic */}
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.btnText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', backgroundColor: '#e91e63', padding: 20, paddingTop: 60 },
  iconContainer: { backgroundColor: '#fff', borderRadius: 50, padding: 5, marginBottom: 10 },
  success: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  receiptCard: { backgroundColor: '#fff', width: '100%', padding: 25, borderRadius: 10, elevation: 10, marginBottom: 30 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#888', letterSpacing: 2 },
  shopName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 5 },
  dashedLine: { height: 1, borderWidth: 1, borderColor: '#ddd', borderStyle: 'dashed', marginVertical: 15, borderRadius: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#000', flex: 1, textAlign: 'right', marginLeft: 10 },
  status: { textAlign: 'center', marginTop: 15, color: '#4CAF50', fontWeight: 'bold', borderWidth: 1, borderColor: '#4CAF50', padding: 5, borderRadius: 5, alignSelf: 'center' },
  btn: { backgroundColor: '#333', paddingVertical: 15, paddingHorizontal: 60, borderRadius: 30, elevation: 5 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});