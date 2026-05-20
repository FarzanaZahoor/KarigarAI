import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, ScrollView, Vibration, Alert, Platform, Linking } from 'react-native';
import { addBooking } from '../utils/bookingStore';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8' };

const MapSection = ({ area }: { area: string }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ height:200, borderRadius:20, overflow:'hidden' }}>
        <img
          src={`https://maps.googleapis.com/maps/api/staticmap?center=${area}+Lahore+Pakistan&zoom=14&size=400x200&key=AIzaSyDjd7lrMn6TFg4Eo3p3exC0wpFzR5L_ZTo`}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(area)}+Lahore+Pakistan`)}
      style={{ backgroundColor:C.bg, padding:24, borderRadius:20, alignItems:'center', borderWidth:1, borderColor:'transparent' }}
    >
      <Text style={{ fontSize:36 }}>📍</Text>
      <Text style={{ fontSize:16, fontFamily:'DMSans', fontWeight:'bold', marginTop:8, color:C.navy }}>{area}, Lahore</Text>
      <Text style={{ color:C.steel, fontFamily:'DMSans', marginTop:4, fontSize:13 }}>Tap to open Google Maps</Text>
    </TouchableOpacity>
  );
};

export default function BookingConfirmationScreen({ route, navigation }: any) {
  const { provider, intent, requestText } = route.params;
  const bookingId  = `KGR-${Math.floor(10000 + Math.random() * 90000)}`;
  const basePrice  = parseInt(provider.price) || 1500;
  const totalCost  = basePrice;
  const arrivalTime = intent?.time || 'ASAP';

  const [statusIndex, setStatusIndex] = useState(0);
  const [countdown, setCountdown]     = useState('23h 45m');
  const scaleAnim  = useRef(new Animated.Value(0)).current;
  const notifyAnim = useRef(new Animated.Value(-150)).current;

  const statuses = [
    { label:'🟡 Provider notified about your booking', color:'#e6a817' },
    { label:'✅ Provider has accepted your booking',   color:'#3a9e6a' },
    { label:'🚗 Provider is getting ready',            color:C.steel  },
    { label:'📍 Provider is on the way to you',        color:C.navy   },
  ];

  useEffect(() => {
    addBooking({ id:bookingId, provider, serviceType:provider.service, date:`${new Date().toLocaleDateString()}, ${arrivalTime}`, status:'Confirmed', cost:totalCost.toString(), requestText:requestText||'' });

    Animated.spring(scaleAnim, { toValue:1, friction:4, useNativeDriver:true }).start();

    setTimeout(() => {
      Vibration.vibrate(400);
      Animated.sequence([
        Animated.spring(notifyAnim, { toValue:20, friction:5, useNativeDriver:true }),
        Animated.delay(4000),
        Animated.timing(notifyAnim, { toValue:-150, duration:500, useNativeDriver:true }),
      ]).start();
    }, 2000);

    const statusInterval = setInterval(() => setStatusIndex(p => p < statuses.length-1 ? p+1 : p), 3000);
    const countdownInterval = setInterval(() => setCountdown(p => {
      const parts = p.match(/(\d+)h (\d+)m/);
      if (!parts) return p;
      let h = parseInt(parts[1]), m = parseInt(parts[2]);
      if (m > 0) m--; else if (h > 0) { h--; m = 59; }
      return `${h}h ${m}m`;
    }), 60000);

    return () => { clearInterval(statusInterval); clearInterval(countdownInterval); };
  }, []);

  const handleCall   = () => Alert.alert('Calling Provider', `Connecting you to ${provider.name} at ${provider.phone}...`);
  const handleCancel = () => Alert.alert('Cancel Booking', 'Are you sure you want to cancel?', [{ text:'No' }, { text:'Yes', onPress:()=>navigation.popToTop() }]);
  const handleTrack  = () => Alert.alert('Live Tracking', `📍 Provider is 2.3 km away\n⏱ Estimated arrival: 25 minutes`);

  return (
    <SafeAreaView style={S.container}>
      {/* WhatsApp Notification */}
      <Animated.View style={[S.whatsappPopup, { transform:[{ translateY:notifyAnim }] }]}>
        <View style={S.whatsappHeader}>
          <View style={S.whatsappIcon}><Text style={S.whatsappIconText}>W</Text></View>
          <Text style={S.whatsappAppName}>WHATSAPP</Text>
          <Text style={S.whatsappTime}>now</Text>
        </View>
        <Text style={S.whatsappSender}>KarigarAI Business</Text>
        <Text style={S.whatsappMessage}>Booking Confirmed! {provider.name} will arrive at {arrivalTime}.</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navy Header Band */}
        <View style={S.navyHeader}>
          <Animated.View style={[S.successIcon, { transform:[{ scale:scaleAnim }] }]}>
            <Text style={S.checkMark}>✓</Text>
          </Animated.View>
          <Text style={S.title}>Booking Confirmed!</Text>
          <Text style={S.headerSub}>Your request has been processed successfully.</Text>
        </View>

        <View style={S.body}>
          {/* Live Status */}
          <View style={S.card}>
            <Text style={S.sectionLabel}>LIVE STATUS</Text>
            <View style={[S.statusBubble, { backgroundColor:statuses[statusIndex].color+'18', borderColor:statuses[statusIndex].color }]}>
              <Text style={[S.statusText, { color:statuses[statusIndex].color }]}>{statuses[statusIndex].label}</Text>
            </View>
            <View style={S.stepDots}>
              {statuses.map((st, i) => (
                <View key={i} style={[S.dot, { backgroundColor: i <= statusIndex ? st.color : C.warmGrey }]} />
              ))}
            </View>
          </View>

          {/* Booking Card */}
          <View style={S.card}>
            <Text style={S.sectionLabel}>CONFIRMATION NUMBER</Text>
            <Text style={S.bookingId}>{bookingId}</Text>
            <View style={S.divider} />
            <View style={S.detailRow}><Text style={S.dLabel}>Provider</Text><Text style={S.dValue}>{provider.name}</Text></View>
            <View style={S.detailRow}><Text style={S.dLabel}>Service</Text><Text style={S.dValue}>{provider.service}</Text></View>
            <View style={S.detailRow}><Text style={S.dLabel}>Arrival Time</Text><Text style={[S.dValue,{color:C.steel}]}>{arrivalTime}</Text></View>
          </View>

          {/* Time & Reminder Row */}
          <View style={S.infoRow}>
            <View style={[S.infoBox]}>
              <Text style={S.infoLabel}>TIME UNTIL APPOINTMENT</Text>
              <Text style={S.countdown}>{countdown}</Text>
              <Text style={S.remaining}>remaining</Text>
            </View>
            <View style={[S.infoBox, S.reminderBox]}>
              <View style={S.reminderHeader}>
                <View style={S.bellIcon}><Text>🔔</Text></View>
                <Text style={S.reminderTitle}>REMINDER</Text>
              </View>
              <Text style={S.reminderText}>Notified 1hr before</Text>
              <Text style={S.reminderTime}>{arrivalTime}</Text>
            </View>
          </View>

          {/* Map */}
          <View style={S.card}>
            <Text style={S.sectionLabel}>📍 PROVIDER LOCATION</Text>
            <MapSection area={provider.area} />
          </View>

          {/* Actions */}
          <TouchableOpacity style={S.primaryBtn} onPress={handleTrack}>
            <Text style={S.primaryBtnText}>📍 Track Provider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.primaryBtn, { backgroundColor:C.steel, marginTop:10 }]} onPress={() => navigation.navigate('Rating', { bookingId, provider })}>
            <Text style={S.primaryBtnText}>⭐ Rate Your Experience</Text>
          </TouchableOpacity>
          <View style={S.secondaryRow}>
            <TouchableOpacity style={S.callBtn} onPress={handleCall}>
              <Text style={S.callBtnText}>📞 Call {provider.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.cancelBtn} onPress={handleCancel}>
              <Text style={S.cancelBtnText}>❌ Cancel</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={S.homeBtn} onPress={() => navigation.popToTop()}>
            <Text style={S.homeBtnText}>🏠 Return to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:      { flex:1, backgroundColor:C.bg },
  scrollContent:  { paddingBottom:60 },
  whatsappPopup:  { position:'absolute', top:0, left:12, right:12, backgroundColor:C.white, borderRadius:20, padding:16, zIndex:999, elevation:10, shadowColor:C.navy, shadowOpacity:0.08, shadowRadius:16, shadowOffset:{width:0,height:4} },
  whatsappHeader: { flexDirection:'row', alignItems:'center', marginBottom:6 },
  whatsappIcon:   { width:22, height:22, backgroundColor:'#25D366', borderRadius:6, justifyContent:'center', alignItems:'center', marginRight:8 },
  whatsappIconText:{ color:C.white, fontSize:12, fontFamily:'DMSans', fontWeight:'bold' },
  whatsappAppName:{ fontSize:11, color:C.warmGrey, fontFamily:'DMSans', fontWeight:'bold', letterSpacing:0.5 },
  whatsappTime:   { fontSize:11, color:C.warmGrey, fontFamily:'DMSans', marginLeft:'auto' },
  whatsappSender: { fontSize:14, fontFamily:'DMSans', fontWeight:'bold', color:C.navy },
  whatsappMessage:{ fontSize:13, fontFamily:'DMSans', color:C.steel, marginTop:4 },
  navyHeader:     { backgroundColor:C.navy, paddingTop:40, paddingBottom:40, paddingHorizontal:24, alignItems:'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  successIcon:    { width:72, height:72, backgroundColor:C.steel, borderRadius:36, alignItems:'center', justifyContent:'center', marginBottom:16, borderWidth:4, borderColor:'rgba(243,234,224,0.15)' },
  checkMark:      { color:C.cream, fontSize:36, fontWeight:'bold' },
  title:          { fontSize:28, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.cream },
  headerSub:      { fontSize:14, fontFamily:'DMSans', color:C.warmGrey, marginTop:8 },
  body:           { padding:20, marginTop: -20 },
  card:           { backgroundColor:C.white, borderRadius:20, padding:20, marginBottom:16, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.05, shadowRadius:12, elevation:2 },
  sectionLabel:   { fontSize:12, fontFamily:'DMSans', fontWeight:'bold', color:C.warmGrey, letterSpacing:1, marginBottom:16 },
  statusBubble:   { padding:16, borderRadius:16, borderWidth:1, alignItems:'center', marginBottom:12 },
  statusText:     { fontSize:14, fontFamily:'DMSans', fontWeight:'bold' },
  stepDots:       { flexDirection:'row', justifyContent:'center', marginTop:4 },
  dot:            { width:40, height:4, borderRadius:2, marginHorizontal:4 },
  bookingId:      { fontSize:32, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.navy, textAlign:'center', marginBottom:4 },
  divider:        { height:1, backgroundColor:C.bg, marginVertical:16 },
  detailRow:      { flexDirection:'row', justifyContent:'space-between', marginBottom:12 },
  dLabel:         { fontSize:15, fontFamily:'DMSans', color:C.warmGrey },
  dValue:         { fontSize:15, fontFamily:'DMSans', fontWeight:'bold', color:C.navy },
  infoRow:        { flexDirection:'row', justifyContent:'space-between', marginBottom:16 },
  infoBox:        { flex:0.48, backgroundColor:C.white, borderRadius:20, padding:16, shadowColor:C.navy, shadowOpacity:0.04, shadowRadius:12, elevation:2 },
  infoLabel:      { fontSize:10, fontFamily:'DMSans', fontWeight:'bold', color:C.warmGrey, marginBottom:8 },
  countdown:      { fontSize:22, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.navy },
  remaining:      { fontSize:12, fontFamily:'DMSans', color:C.steel, marginTop:2 },
  reminderBox:    { backgroundColor:C.bg },
  reminderHeader: { flexDirection:'row', alignItems:'center', marginBottom:8 },
  bellIcon:       { width:26, height:26, backgroundColor:C.steel, borderRadius:13, justifyContent:'center', alignItems:'center', marginRight:8 },
  reminderTitle:  { fontSize:11, fontFamily:'DMSans', fontWeight:'bold', color:C.navy },
  reminderText:   { fontSize:12, fontFamily:'DMSans', color:C.steel, fontWeight:'600' },
  reminderTime:   { fontSize:14, fontFamily:'DMSans', fontWeight:'bold', color:C.navy, marginTop:4 },
  primaryBtn:     { backgroundColor:C.navy, paddingVertical:16, borderRadius:16, alignItems:'center', marginBottom:0, shadowColor:C.navy, shadowOpacity:0.1, shadowRadius:12, elevation:2 },
  primaryBtnText: { color:C.cream, fontFamily:'DMSans', fontSize:15, fontWeight:'bold' },
  secondaryRow:   { flexDirection:'row', justifyContent:'space-between', marginTop:12, marginBottom:12 },
  callBtn:        { flex:0.65, backgroundColor:C.white, borderWidth:1, borderColor:C.warmGrey, paddingVertical:14, borderRadius:16, alignItems:'center' },
  callBtnText:    { color:C.navy, fontFamily:'DMSans', fontWeight:'bold' },
  cancelBtn:      { flex:0.32, backgroundColor:C.white, borderWidth:1, borderColor:'#f0d0cc', paddingVertical:14, borderRadius:16, alignItems:'center' },
  cancelBtnText:  { color:'#c0392b', fontFamily:'DMSans', fontWeight:'bold' },
  homeBtn:        { backgroundColor:C.cream, borderWidth:1, borderColor:C.navy, paddingVertical:16, borderRadius:16, alignItems:'center' },
  homeBtnText:    { color:C.navy, fontFamily:'DMSans', fontSize:15, fontWeight:'bold' },
});
