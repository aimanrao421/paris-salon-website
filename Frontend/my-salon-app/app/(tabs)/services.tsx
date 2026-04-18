import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.125.133:1337';
// ✅ STEP 1: TypeScript ko batana parta hai ke data kaisa dikhta hai
interface Service {
  id: number;
  name: string;
  price: number;
  duration: string;
  desc: string;
  image: string;
}

export default function Services() {
  const router = useRouter();
  
  // ✅ STEP 2: Yahan <Service[]> likhna zaroori hai
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services?populate=*`);
      const json = await response.json();
      
      if (json.data) {
        setServices(json.data);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Backend connect nahi hua.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Services</Text>
      <Text style={styles.subHeader}>Select a service to book</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#e91e63" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop: 20}}>No services found.</Text>}
          
          renderItem={({ item }) => {
            // ✅ Ab TypeScript error nahi dega kyunke humne upar Interface bana diya hai
            const serviceName = item.name || "Unnamed Service"; 
            const price = item.price || 0;
            const duration = item.duration || "30 min";
            const description = item.desc || "No details available."; 

            return (
              <TouchableOpacity 
                style={styles.card} 
                onPress={() => {
                  console.log("Navigating to:", serviceName);
                  router.push({
                    pathname: '/service/[id]', 
                    params: { 
                      id: item.id, // Ab 'id' par error nahi ayega
                      serviceName: serviceName, 
                      price: price.toString(), // Params ma string bhejna safe hota hai
                      duration: duration,
                      description: description
                    }
                  });
                }}
              >
                <View style={styles.iconBox}>
                  <Text style={styles.emoji}>{item.image || "💅"}</Text> 
                </View>
                
                <View style={styles.info}>
                  <Text style={styles.name}>{serviceName}</Text>
                  <Text style={styles.details}>
                    {duration} • Rs. {price}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#f4f6f8' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  iconBox: { width: 50, height: 50, backgroundColor: '#ffeef2', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  details: { fontSize: 14, color: '#e91e63', marginTop: 4 }
});