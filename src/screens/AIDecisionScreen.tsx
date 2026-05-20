import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, TouchableOpacity, Platform, Linking } from 'react-native';
import { findBestProvider } from '../utils/aiMock';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8' };

const MapSection = ({ area }: { area: string }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ height:120, borderRadius:12, overflow:'hidden' }}>
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(area)}+Lahore+Pakistan&zoom=13&size=400x120&key=AIzaSyDjd7lrMn6TFg4Eo3p3exC0wpFzR5L_ZTo`}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(area)}+Lahore+Pakistan`)}
      style={{ backgroundColor:C.cream, padding:20, borderRadius:12, alignItems:'center', borderWidth:1, borderColor:C.warmGrey }}
    >
      <Text style={{ fontSize:32 }}>📍</Text>
      <Text style={{ fontSize:15, fontWeight:'600', marginTop:8, color:C.navy }}>{area}, Lahore</Text>
      <Text style={{ color:C.steel, marginTop:4, fontSize:13 }}>Tap to open Google Maps</Text>
    </TouchableOpacity>
  );
};

export default function AIDecisionScreen({ route, navigation }: any) {
  const { intent, requestText } = route.params;
  const [countdown, setCountdown] = useState(2);
  const fadeAnim = useMemo(() => new Animated.Value(0), []);

  const providers = useMemo(() => findBestProvider(intent), [intent]);
  const top3      = useMemo(() => providers.slice(0, 3), [providers]);
  const selected  = top3[0];

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:500, useNativeDriver:true }).start();
    const timer = setInterval(() => {
      setCountdown(prev => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) navigation.replace('Booking', { intent, provider:selected, requestText });
  }, [countdown]);

  return (
    <SafeAreaView style={S.container}>
      <Animated.View style={[S.inner, { opacity:fadeAnim }]}>
        {/* Header */}
        <View style={S.header}>
          <Text style={S.title}>AI Decision</Text>
          <Text style={S.subtitle}>Why we selected the best provider for you</Text>
        </View>

        {/* Top 3 Cards */}
        <View style={S.top3Container}>
          {top3.map((p, i) => (
            <View key={p.id} style={[S.providerCard, i === 0 && S.bestProviderCard]}>
              <View style={S.providerHeader}>
                <View style={[S.avatarWrap, i === 0 && { backgroundColor: C.white }]}>
                  <Text style={S.avatarEmoji}>{i === 0 ? '🏆' : '⭐'}</Text>
                </View>
                <View style={S.providerInfo}>
                  <Text style={[S.pName, i === 0 && { color: C.white }]}>{p.name}</Text>
                  <Text style={[S.pStatus, i === 0 ? { color: C.cream } : { color: C.steel }]}>
                    {i === 0 ? 'BEST MATCH' : 'Runner Up'}
                  </Text>
                </View>
                <View style={S.pStats}>
                  <Text style={[S.pMeta, i === 0 && { color: C.white }]}>⭐ {p.rating}</Text>
                  <Text style={[S.pMeta, i === 0 && { color: C.white }]}>📍 {p.distance}km</Text>
                </View>
              </View>
              {i === 0 && (
                <View style={S.reasoningList}>
                  {[
                    `Closest to you (${p.distance}km)`,
                    `Highest rated (${p.rating}⭐)`,
                    `Best value (Rs. ${p.price})`
                  ].map((r, idx) => (
                    <Text key={idx} style={S.reasonItem}>✅ {r}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Map Preview */}
        <View style={S.mapPreview}>
          <Text style={S.mapLabel}>Provider Location</Text>
          <MapSection area={selected.area} />
        </View>

        {/* Countdown */}
        <View style={S.footer}>
          <Text style={S.countdownText}>Booking in {countdown}...</Text>
          <View style={S.countdownTrack}>
            <Animated.View style={[S.countdownBar, { width:`${(countdown / 2) * 100}%` }]} />
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:      { flex:1, backgroundColor:C.bg },
  inner:          { flex:1, padding:24, paddingTop: 40 },
  header:         { marginBottom:24 },
  title:          { fontSize:32, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.navy },
  subtitle:       { fontSize:15, fontFamily:'DMSans', color:C.steel, marginTop:6 },
  
  top3Container:  { marginBottom: 20 },
  providerCard:   { backgroundColor:C.white, borderRadius:20, padding:16, marginBottom:12, shadowColor:C.navy, shadowOpacity:0.04, shadowRadius:12, shadowOffset:{width:0,height:4}, elevation:2 },
  bestProviderCard: { backgroundColor: C.navy, shadowOpacity: 0.15, transform: [{ scale: 1.02 }] },
  
  providerHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap:     { width: 44, height: 44, borderRadius: 22, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarEmoji:    { fontSize: 20 },
  providerInfo:   { flex: 1 },
  pName:          { fontSize: 16, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy },
  pStatus:        { fontSize: 11, fontFamily: 'DMSans', color: C.steel, fontWeight: '700', marginTop: 2, letterSpacing: 0.5 },
  pStats:         { alignItems: 'flex-end' },
  pMeta:          { fontSize: 13, fontFamily: 'DMSans', color: C.navy, fontWeight: 'bold', marginBottom: 2 },
  
  reasoningList:  { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  reasonItem:     { color: C.cream, fontFamily: 'DMSans', fontSize: 13, marginBottom: 8 },
  
  mapPreview:     { borderRadius:20, overflow:'hidden', marginBottom:16 },
  mapLabel:       { fontSize: 14, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy, marginBottom: 12 },
  
  footer:         { marginTop:'auto', marginBottom:12, alignItems:'center' },
  countdownText:  { fontSize:18, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.navy, marginBottom:12 },
  countdownTrack: { width:'100%', height:6, backgroundColor:C.warmGrey, borderRadius:3, overflow: 'hidden' },
  countdownBar:   { height:'100%', backgroundColor:C.steel, borderRadius:3 },
});
