import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, SafeAreaView, Alert
} from 'react-native';
import { getProvidersByService } from '../services/providerService';
import { Provider } from '../data/mockProviders';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8', error:'#c0392b' };

const SERVICE_ICONS: Record<string, string> = {
  'Electrician': '🔌',
  'Plumber': '🔧',
  'AC Technician': '❄️',
  'Beautician': '💄',
  'Carpenter': '🪚',
  'Painter': '🎨',
};

export default function ProviderListScreen({ route, navigation }: any) {
  const service = route.params?.service || 'Providers';

  const [providers, setProviders]   = useState<Provider[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProvidersByService(service);
      setProviders(data);
    } catch (err: any) {
      setError('Could not load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const handleBook = (provider: Provider) => {
    navigation.navigate('Booking', {
      provider,
      intent: { serviceType: provider.service, location: null, time: null },
      requestText: `Manual booking for ${provider.name}`,
    });
  };

  return (
    <SafeAreaView style={S.container}>
      <View style={S.navyHeaderBg}>
        <View style={S.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={S.backBtn}>
            <Text style={S.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={S.title}>{service}s</Text>
        </View>
      </View>

      {loading ? (
        <View style={S.centeredState}>
          <ActivityIndicator size="large" color={C.navy} />
          <Text style={S.stateText}>Finding providers near you...</Text>
        </View>
      ) : error ? (
        <View style={S.centeredState}>
          <Text style={S.errorEmoji}>⚠️</Text>
          <Text style={S.errorText}>{error}</Text>
          <TouchableOpacity style={S.retryBtn} onPress={fetchProviders}>
            <Text style={S.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : providers.length === 0 ? (
        <View style={S.centeredState}>
          <Text style={S.errorEmoji}>🔍</Text>
          <Text style={S.stateText}>No {service} providers found near you.</Text>
          <TouchableOpacity style={S.retryBtn} onPress={() => navigation.goBack()}>
            <Text style={S.retryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={S.listContent} showsVerticalScrollIndicator={false}>
          <Text style={S.resultsCount}>{providers.length} providers found near you</Text>

          {providers.map((p) => (
            <View key={p.id} style={S.card}>
              <View style={S.avatarWrap}>
                <Text style={S.avatarEmoji}>{SERVICE_ICONS[service] ?? '🔧'}</Text>
              </View>
              <View style={S.cardInfo}>
                <Text style={S.pName}>{p.name}</Text>
                <View style={S.pMetaRow}>
                  <Text style={S.pMetaText}>⭐ {p.rating}</Text>
                  <Text style={S.pMetaDot}>•</Text>
                  <Text style={S.pMetaText}>📍 {p.distance} km</Text>
                  <Text style={S.pMetaDot}>•</Text>
                  <Text style={S.pMetaText}>{p.area}</Text>
                </View>
                <Text style={S.pPrice}>Rs. {p.price} <Text style={S.pPriceUnit}>/{p.priceUnit}</Text></Text>
              </View>
              <TouchableOpacity style={S.bookBtn} onPress={() => handleBook(p)}>
                <Text style={S.bookBtnText}>Book</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:    { flex: 1, backgroundColor: C.bg },
  navyHeaderBg: { backgroundColor: C.navy, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 16 },
  header:       { padding: 20, paddingTop: 16, flexDirection: 'row', alignItems: 'center' },
  backBtn:      { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  backBtnText:  { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  title:        { fontSize: 28, fontFamily: 'CormorantGaramond', color: '#fff', fontWeight: 'bold' },

  centeredState:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  stateText:    { marginTop: 16, fontSize: 15, fontFamily: 'DMSans', color: C.steel, textAlign: 'center' },
  errorEmoji:   { fontSize: 48 },
  errorText:    { marginTop: 16, fontSize: 15, fontFamily: 'DMSans', color: C.error, textAlign: 'center' },
  retryBtn:     { marginTop: 24, backgroundColor: C.navy, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  retryBtnText: { color: C.cream, fontFamily: 'DMSans', fontWeight: 'bold', fontSize: 15 },

  listContent:  { padding: 20, paddingBottom: 100 },
  resultsCount: { fontSize: 13, fontFamily: 'DMSans', color: C.steel, marginBottom: 16, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  card:         { flexDirection: 'row', backgroundColor: C.white, borderRadius: 20, padding: 16, marginBottom: 16, alignItems: 'center', shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  avatarWrap:   { width: 56, height: 56, backgroundColor: C.bg, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarEmoji:  { fontSize: 28 },
  cardInfo:     { flex: 1 },
  pName:        { fontSize: 16, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy, marginBottom: 4 },
  pMetaRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  pMetaText:    { fontSize: 12, fontFamily: 'DMSans', color: C.steel, fontWeight: '600' },
  pMetaDot:     { color: C.warmGrey, marginHorizontal: 5, fontSize: 10 },
  pPrice:       { fontSize: 14, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy },
  pPriceUnit:   { fontSize: 11, color: C.warmGrey, fontWeight: 'normal' },
  bookBtn:      { backgroundColor: C.navy, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  bookBtnText:  { color: '#fff', fontFamily: 'DMSans', fontWeight: 'bold', fontSize: 13 },
});
