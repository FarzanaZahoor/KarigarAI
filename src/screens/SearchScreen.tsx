import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8' };

export default function SearchScreen() {
  return (
    <SafeAreaView style={S.container}>
      <View style={S.inner}>
        <Text style={S.title}>Search</Text>
        <Text style={S.subtitle}>Find your required service...</Text>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  inner: { padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 },
  title: { fontSize: 28, fontFamily: 'CormorantGaramond', color: C.navy, fontWeight: 'bold' },
  subtitle: { fontSize: 16, fontFamily: 'DMSans', color: C.steel, marginTop: 8 },
});
