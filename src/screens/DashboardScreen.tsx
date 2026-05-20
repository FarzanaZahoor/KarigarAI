import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { seedDatabase } from '../scripts/seedDatabase';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff' };
const { width } = Dimensions.get('window');

const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end * 10) / 10);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);
  return <Text>{count}{suffix}</Text>;
};

export default function DashboardScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue:1, duration:900, useNativeDriver:true }).start();
  }, []);

  const stats = [
    { icon:'🏠', label:'Bookings Completed', value:1247, color:C.navy },
    { icon:'👷', label:'Verified Providers',  value:50,   color:C.steel },
    { icon:'⭐', label:'Average Rating',      value:4.8,  color:'#c9993a' },
    { icon:'⚡', label:'Avg Response Time',   value:2, suffix:' min', color:C.steel },
  ];

  const services = [
    { icon:'🔌', name:'Electrician',   count:10 },
    { icon:'🔧', name:'Plumber',       count:10 },
    { icon:'❄️', name:'AC Technician', count:10 },
    { icon:'💄', name:'Beautician',    count:10 },
    { icon:'🪚', name:'Carpenter',     count:10 },
  ];

  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const handleSeed = async () => {
    Alert.alert(
      'Seed Firestore Database',
      'This will clear and re-upload all 70 mock providers to Firestore. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Seed Now', style: 'destructive',
          onPress: async () => {
            setSeeding(true);
            setSeedResult(null);
            const result = await seedDatabase();
            setSeeding(false);
            setSeedResult(result.message);
          },
        },
      ]
    );
  };

  const areas = ['Gulberg','DHA Phase 5','Johar Town','Model Town','Bahria Town','Garden Town','Iqbal Town','Wapda Town','Cavalry Ground','Cantt'];

  const activity = [
    { user:'Ahmad', service:'Electrician', loc:'Gulberg',    time:'2 min ago' },
    { user:'Sara',  service:'Beautician',  loc:'DHA',        time:'5 min ago' },
    { user:'Ali',   service:'Plumber',     loc:'Johar Town', time:'8 min ago' },
  ];

  return (
    <SafeAreaView style={S.container}>
      {/* Navy Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backButton}>
          <Text style={S.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={S.headerTitle}>Dashboard</Text>
          <Text style={S.headerSubtitle}>Live Statistics</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity:fadeAnim }}>

          {/* Stats 2×2 Grid */}
          <View style={S.statsGrid}>
            {stats.map((st, i) => (
              <View key={i} style={[S.statCard, { borderLeftColor:st.color }]}>
                <Text style={S.statIcon}>{st.icon}</Text>
                <Text style={[S.statNumber, { color:st.color }]}>
                  <CountUp end={st.value} suffix={st.suffix||''} />
                </Text>
                <Text style={S.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>

          {/* Services Distribution */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>SERVICES DISTRIBUTION</Text>
            <View style={S.listCard}>
              {services.map((s, i) => (
                <View key={i} style={[S.serviceRow, i < services.length-1 && S.serviceRowBorder]}>
                  <Text style={S.serviceIcon}>{s.icon}</Text>
                  <Text style={S.serviceName}>{s.name}</Text>
                  <View style={S.serviceCountBadge}>
                    <Text style={S.serviceCount}>{s.count} providers</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Areas Covered */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>📍 AREAS COVERED IN LAHORE</Text>
            <View style={S.tagCloud}>
              {areas.map((area, i) => (
                <View key={i} style={S.tag}>
                  <Text style={S.tagText}>{area}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>RECENT ACTIVITY</Text>
            <View style={S.listCard}>
              {activity.map((item, i) => (
                <View key={i} style={[S.activityItem, i < activity.length-1 && S.activityBorder]}>
                  <View style={S.activityDot} />
                  <View style={S.activityContent}>
                    <Text style={S.activityText}>
                      <Text style={S.boldText}>{item.user}</Text>
                      {' '}booked {item.service} in {item.loc}
                    </Text>
                    <Text style={S.activityTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Database Seed Section */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>🗄️ FIRESTORE DATABASE</Text>
            <View style={S.listCard}>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 13, fontFamily: 'DMSans', color: C.steel, marginBottom: 14 }}>
                  Upload all 70 mock providers to Firestore. Run this once to populate the live database.
                </Text>
                {seedResult && (
                  <View style={[S.seedResult, { borderColor: seedResult.startsWith('✅') ? '#2ecc71' : '#e74c3c' }]}>
                    <Text style={{ fontSize: 13, fontFamily: 'DMSans', color: seedResult.startsWith('✅') ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>{seedResult}</Text>
                  </View>
                )}
                <TouchableOpacity style={[S.seedBtn, seeding && { opacity: 0.6 }]} onPress={handleSeed} disabled={seeding}>
                  {seeding
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={S.seedBtnText}>⬆️  Seed Firestore Database</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:        { flex:1, backgroundColor:C.cream },
  header:           { flexDirection:'row', alignItems:'center', padding:20, backgroundColor:C.navy },
  backButton:       { width:40, height:40, justifyContent:'center', marginRight:4 },
  backIcon:         { fontSize:24, fontWeight:'700', color:C.cream },
  headerTitle:      { fontSize:20, fontWeight:'800', color:C.cream },
  headerSubtitle:   { fontSize:12, color:C.warmGrey, marginTop:2 },
  scrollContent:    { padding:20, paddingBottom:48 },

  // Stats Grid
  statsGrid:        { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', marginBottom:8 },
  statCard:         { width:(width-60)/2, backgroundColor:C.white, padding:18, borderRadius:16, marginBottom:16, borderLeftWidth:4, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.07, shadowRadius:14, elevation:3 },
  statIcon:         { fontSize:22, marginBottom:10 },
  statNumber:       { fontSize:26, fontWeight:'900', marginBottom:4 },
  statLabel:        { fontSize:11, fontWeight:'700', color:C.warmGrey },

  // Sections
  section:          { marginBottom:24 },
  sectionTitle:     { fontSize:11, fontWeight:'800', color:C.warmGrey, letterSpacing:1, marginBottom:14 },
  listCard:         { backgroundColor:C.white, borderRadius:16, overflow:'hidden', shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.07, shadowRadius:14, elevation:3 },

  // Services
  serviceRow:       { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:14 },
  serviceRowBorder: { borderBottomWidth:1, borderBottomColor:C.cream },
  serviceIcon:      { fontSize:20, marginRight:14 },
  serviceName:      { flex:1, fontSize:15, fontWeight:'700', color:C.navy },
  serviceCountBadge:{ backgroundColor:C.cream, paddingHorizontal:10, paddingVertical:4, borderRadius:10 },
  serviceCount:     { fontSize:12, color:C.steel, fontWeight:'700' },

  // Tags
  tagCloud:         { flexDirection:'row', flexWrap:'wrap' },
  tag:              { backgroundColor:C.white, paddingHorizontal:14, paddingVertical:7, borderRadius:20, marginRight:8, marginBottom:8, borderWidth:1.5, borderColor:C.navy },
  tagText:          { color:C.navy, fontSize:12, fontWeight:'700' },

  // Activity
  activityItem:     { flexDirection:'row', paddingHorizontal:16, paddingVertical:14, alignItems:'flex-start' },
  activityBorder:   { borderBottomWidth:1, borderBottomColor:C.cream },
  activityDot:      { width:8, height:8, borderRadius:4, backgroundColor:C.steel, marginTop:5, marginRight:12 },
  activityContent:  { flex:1 },
  activityText:     { fontSize:14, color:C.navy, lineHeight:20 },
  boldText:         { fontWeight:'800', color:C.navy },
  activityTime:     { fontSize:12, color:C.warmGrey, marginTop:3 },
  seedBtn:          { backgroundColor:C.navy, paddingVertical:14, borderRadius:14, alignItems:'center', marginTop:4 },
  seedBtnText:      { color:C.cream, fontSize:14, fontWeight:'bold', fontFamily:'DMSans' },
  seedResult:       { borderWidth: 1.5, borderRadius: 12, padding: 12, marginBottom: 14 },
});
