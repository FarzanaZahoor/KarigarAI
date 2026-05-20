import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

const C = {
  navy: '#223148',
  steel: '#2f486d',
  cream: '#f3eae0',
  warmGrey: '#d2c7b8',
  white: '#ffffff',
  bg: '#f0f4f8',
};

export default function ProfileScreen({ navigation }: any) {
  return (
    <SafeAreaView style={S.container}>
      <View style={S.header}>
        <Text style={S.headerTitle}>👤 My Profile</Text>
      </View>

      <View style={S.inner}>
        {/* Avatar Circle */}
        <View style={S.avatarCircle}>
          <Text style={S.avatarText}>JD</Text>
        </View>

        <Text style={S.name}>John Doe</Text>
        <Text style={S.phone}>+92 300 1234567</Text>
        
        {/* Profile details card */}
        <View style={S.card}>
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Account Type</Text>
            <Text style={S.detailValue}>Customer</Text>
          </View>
          <View style={S.divider} />
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Default Location</Text>
            <Text style={S.detailValue}>Gulberg, Lahore</Text>
          </View>
          <View style={S.divider} />
          <View style={S.detailRow}>
            <Text style={S.detailLabel}>Completed Bookings</Text>
            <Text style={S.detailValue}>3 Services</Text>
          </View>
        </View>

        <TouchableOpacity style={S.primaryBtn} onPress={() => navigation.navigate('Auth')}>
          <Text style={S.primaryBtnText}>🔑 Switch / Log in Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream },
  header: { padding: 20, backgroundColor: C.navy },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.cream },
  inner: { padding: 24, alignItems: 'center' },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: C.navy, justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: C.cream, fontFamily: 'DMSans' },
  name: { fontSize: 24, fontWeight: 'bold', color: C.navy, fontFamily: 'CormorantGaramond', marginBottom: 4 },
  phone: { fontSize: 14, color: C.steel, fontFamily: 'DMSans', marginBottom: 28 },
  card: { width: '100%', backgroundColor: C.white, borderRadius: 16, padding: 20, shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, marginBottom: 28 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  detailLabel: { fontSize: 13, color: C.steel, fontFamily: 'DMSans', fontWeight: '500' },
  detailValue: { fontSize: 14, color: C.navy, fontFamily: 'DMSans', fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.bg, marginVertical: 4 },
  primaryBtn: { backgroundColor: C.navy, paddingVertical: 16, borderRadius: 12, alignItems: 'center', width: '100%', shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: C.cream, fontSize: 14, fontWeight: '700', fontFamily: 'DMSans' },
});
