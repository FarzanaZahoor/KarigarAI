import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated } from 'react-native';

const C = {
  navy: '#223148',
  steel: '#2f486d',
  cream: '#f3eae0',
  warmGrey: '#d2c7b8',
  white: '#ffffff',
  bg: '#f0f4f8',
};

const ROADMAP_ITEMS = [
  {
    phase: 'Phase 1: Foundation',
    status: 'Completed',
    statusIcon: '✅',
    title: 'AI Intent Orchestrator',
    desc: 'Simulated multi-lingual NLP intent parser with detailed reasoning logs, provider rankings, and mock checkout flow.',
  },
  {
    phase: 'Phase 2: Mobile Core',
    status: 'In Progress',
    statusIcon: '⚡',
    title: 'Native Voice Assistant & Live DB',
    desc: 'Integration of React Native Voice for Roman Urdu/Punjabi speech recognition, and live Firestore database syncing.',
  },
  {
    phase: 'Phase 3: Real-Time Services',
    status: 'Planned',
    statusIcon: '📅',
    title: 'Secure Chats & Verified Badges',
    desc: 'In-app provider messaging with real-time translation, SMS/OTP registration, and a custom rating verify workflow.',
  },
  {
    phase: 'Phase 4: Transactions',
    status: 'Planned',
    statusIcon: '🔒',
    title: 'Digital Payments & Tracking',
    desc: 'Integration of local digital wallets (JazzCash, EasyPaisa) and real-time provider location tracking on native maps.',
  },
];

export default function RoadmapScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={S.container}>
      {/* Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backButton}>
          <Text style={S.backIcon}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={S.headerTitle}>🗺️ Product Roadmap</Text>
          <Text style={S.headerSubtitle}>Future of KarigarAI</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={S.introText}>
            Our vision is to build Pakistan's most accessible, voice-driven AI service orchestrator. Here is our plan to scale:
          </Text>

          <View style={S.timeline}>
            {ROADMAP_ITEMS.map((item, i) => {
              const isCompleted = item.status === 'Completed';
              const isInProgress = item.status === 'In Progress';
              
              return (
                <View key={i} style={S.timelineItem}>
                  {/* Left line structure */}
                  <View style={S.lineWrapper}>
                    <View style={[S.bullet, isCompleted && S.bulletCompleted, isInProgress && S.bulletProgress]}>
                      <Text style={S.bulletIcon}>{item.statusIcon}</Text>
                    </View>
                    {i < ROADMAP_ITEMS.length - 1 && <View style={S.connectorLine} />}
                  </View>

                  {/* Right card content */}
                  <View style={[S.card, isInProgress && S.cardProgress]}>
                    <View style={S.cardHeader}>
                      <Text style={S.phaseText}>{item.phase}</Text>
                      <View style={[S.statusBadge, isCompleted && S.statusBadgeCompleted, isInProgress && S.statusBadgeProgress]}>
                        <Text style={[S.statusText, isCompleted && S.statusTextCompleted, isInProgress && S.statusTextProgress]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={S.titleText}>{item.title}</Text>
                    <Text style={S.descText}>{item.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.cream },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: C.navy },
  backButton: { width: 40, height: 40, justifyContent: 'center', marginRight: 4 },
  backIcon: { fontSize: 24, fontWeight: '700', color: C.cream },
  headerTitle: { fontSize: 20, fontWeight: '800', color: C.cream },
  headerSubtitle: { fontSize: 12, color: C.warmGrey, marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 48 },
  introText: { fontSize: 15, fontFamily: 'DMSans', color: C.steel, lineHeight: 22, marginBottom: 24, fontWeight: '500' },
  
  timeline: { paddingLeft: 8 },
  timelineItem: { flexDirection: 'row', marginBottom: 12 },
  lineWrapper: { alignItems: 'center', marginRight: 16 },
  bullet: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.white, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: C.warmGrey, zIndex: 2, shadowColor: C.navy, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bulletCompleted: { backgroundColor: '#e2f9eb', borderColor: '#2ecc71' },
  bulletProgress: { backgroundColor: '#eef5fc', borderColor: C.steel },
  bulletIcon: { fontSize: 16 },
  connectorLine: { width: 2, flex: 1, backgroundColor: C.warmGrey, marginVertical: 4 },
  
  card: { flex: 1, backgroundColor: C.white, borderRadius: 16, padding: 16, shadowColor: C.navy, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, borderLeftWidth: 4, borderLeftColor: C.warmGrey },
  cardProgress: { borderLeftColor: C.steel },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  phaseText: { fontSize: 11, fontFamily: 'DMSans', fontWeight: '800', color: C.warmGrey, textTransform: 'uppercase', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: C.bg },
  statusBadgeCompleted: { backgroundColor: 'rgba(46, 204, 113, 0.12)' },
  statusBadgeProgress: { backgroundColor: 'rgba(47, 72, 109, 0.12)' },
  statusText: { fontSize: 10, fontFamily: 'DMSans', fontWeight: 'bold', color: C.steel },
  statusTextCompleted: { color: '#27ae60' },
  statusTextProgress: { color: C.steel },
  titleText: { fontSize: 16, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy, marginBottom: 6 },
  descText: { fontSize: 13, fontFamily: 'DMSans', color: C.steel, lineHeight: 18 },
});
