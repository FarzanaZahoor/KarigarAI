import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { parseServiceRequest, findBestProvider } from '../utils/aiMock';
import { saveTrace, LogEntry } from '../utils/agentLogger';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff' };

export default function ProcessingScreen({ route, navigation }: any) {
  const { requestText } = route.params;
  const [activeStep, setActiveStep]       = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [visibleSteps, setVisibleSteps]   = useState<string[]>([]);
  const progressAnim  = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    let isMounted = true;
    const runAI = async () => {
      const startTime = Date.now();
      const intent           = parseServiceRequest(requestText);
      const rankedProviders  = findBestProvider(intent);
      const topProvider      = rankedProviders[0];
      const bookingId        = `KGR-${Math.floor(10000 + Math.random() * 90000)}`;
      const trace: LogEntry[]= [];
      const getTime = () => new Date().toLocaleTimeString('en-GB');

      trace.push({ timestamp:getTime(), icon:'🎯', title:'REQUEST RECEIVED', tool:'Input Parser', input:requestText, result:'Processing started', status:'✅' });

      const steps: string[] = [
        '🔍 Request received...',
        '🧠 Analyzing intent with AI...',
        `✅ Service detected: ${intent.serviceType || 'General'}`,
        `📍 Location identified: ${intent.location || 'Nearby'}`,
        `🕐 Time extracted: ${intent.time || 'ASAP'}`,
        '🔎 Searching 50 providers in database...',
        '📊 Ranking by distance, rating & availability...',
        topProvider
          ? `⭐ Best match: ${topProvider.name} (${topProvider.rating}★, ${topProvider.distance}km away)`
          : '❌ No matching providers found.',
        '📋 Creating booking automatically...',
        `✅ Booking confirmed! ${bookingId}`,
        '📱 Notification sent to customer',
      ];

      trace.push({ timestamp:getTime(), icon:'🧠', title:'NLP ANALYSIS', tool:'Language Detector', result:`Detected: ${/[\u0600-\u06FF]/.test(requestText)?'Urdu':'English'} (Confidence: 94%)`, status:'✅' });
      trace.push({ timestamp:getTime(), icon:'🔍', title:'INTENT EXTRACTION', tool:'Intent Parser', result:`Svc: ${intent.serviceType}, Loc: ${intent.location}, Time: ${intent.time}`, status:'✅' });

      const progressMap = [10,15,25,30,40,50,60,70,80,90,100];

      for (let i = 0; i < steps.length; i++) {
        if (!isMounted) break;
        setActiveStep(i);
        setVisibleSteps(prev => [...prev, steps[i]]);
        Animated.timing(progressAnim, { toValue:progressMap[i], duration:600, useNativeDriver:false }).start();
        await new Promise(r => setTimeout(r, 800));
        setCompletedSteps(prev => [...prev, i]);
        scrollViewRef.current?.scrollToEnd({ animated:true });
        if (!topProvider && i === 7) break;
      }

      trace.push({ timestamp:getTime(), icon:'🗄️', title:'DATABASE QUERY', tool:'Provider Search Engine', result:`Query: ${intent.serviceType} in ${intent.location}. Found: ${rankedProviders.length}`, status:'✅' });
      trace.push({ timestamp:getTime(), icon:'📊', title:'RANKING ALGORITHM', tool:'AI Ranking Engine', result:`Top: ${topProvider?.name||'N/A'}. Score: 98.4`, status:'✅' });
      trace.push({ timestamp:getTime(), icon:'🤖', title:'AI DECISION', tool:'Decision Engine', result:`Selected: ${topProvider?.name}. Confidence: 97%`, status:'✅' });
      trace.push({ timestamp:getTime(), icon:'📋', title:'BOOKING CREATED', tool:'Booking Engine', result:`Conf: ${bookingId}. Sched: ${intent.time}`, status:'✅' });
      trace.push({ timestamp:getTime(), icon:'📱', title:'NOTIFICATION SENT', tool:'SMS Simulator', result:'Message: Booking confirmed', status:'✅' });
      trace.push({ timestamp:getTime(), icon:'✅', title:'WORKFLOW COMPLETE', tool:'System Orchestrator', result:`Total Time: ${((Date.now()-startTime)/1000).toFixed(1)}s`, status:'✅' });

      saveTrace(trace);

      if (topProvider && isMounted) {
        setTimeout(() => navigation.replace('AIDecision', { intent, provider:topProvider, requestText }), 1200);
      }
    };
    runAI();
    return () => { isMounted = false; };
  }, []);

  const getStepStyle = (i: number) => {
    if (completedSteps.includes(i)) return S.stepCompleted;
    if (activeStep === i)           return S.stepActive;
    return S.stepPending;
  };
  const getTextStyle = (i: number) => {
    if (completedSteps.includes(i)) return S.textCompleted;
    if (activeStep === i)           return S.textActive;
    return S.textPending;
  };

  return (
    <SafeAreaView style={S.container}>
      <View style={S.inner}>
        {/* Header */}
        <View style={S.header}>
          <View>
            <Text style={S.headerTitle}>KarigarAI Agent</Text>
            <Text style={S.headerSub}>Processing your request...</Text>
          </View>
          <ActivityIndicator size="small" color={C.steel} />
        </View>

        {/* Progress Bar */}
        <View style={S.progressWrap}>
          <View style={S.progressTrack}>
            <Animated.View style={[S.progressFill, { width: progressAnim.interpolate({ inputRange:[0,100], outputRange:['0%','100%'] }) }]} />
          </View>
          <Text style={S.progressLabel}>Analyzing...</Text>
        </View>

        {/* Steps Log */}
        <View style={S.logContainer}>
          <ScrollView ref={scrollViewRef} contentContainerStyle={{ paddingVertical:8 }} showsVerticalScrollIndicator={false}>
            {visibleSteps.map((step, i) => (
              <View key={i} style={[S.stepItem, getStepStyle(i)]}>
                <View style={S.stepMarker}>
                  {completedSteps.includes(i) ? (
                    <Text style={S.checkmark}>✓</Text>
                  ) : activeStep === i ? (
                    <ActivityIndicator size="small" color={C.steel} />
                  ) : (
                    <View style={S.dot} />
                  )}
                </View>
                <Text style={[S.stepText, getTextStyle(i)]}>{step}</Text>
              </View>
            ))}

            {/* No Providers Edge Case */}
            {visibleSteps.some(s => s.includes('❌')) && (
              <View style={S.noProvidersCard}>
                <Text style={S.noProvidersEmoji}>😔</Text>
                <Text style={S.noProvidersTitle}>Koi Provider Available Nahi</Text>
                <Text style={S.noProvidersSub}>Is waqt is service ke liye koi provider available nahi hai.</Text>
                <Text style={S.noProvidersQuestion}>Kya aap:</Text>
                <TouchableOpacity style={S.noProvidersBtn} onPress={() => navigation.goBack()}>
                  <Text style={S.noProvidersBtnText}>⏰ Doosra Waqt Try Karein</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.noProvidersBtn} onPress={() => navigation.goBack()}>
                  <Text style={S.noProvidersBtnText}>📍 Doosri Location Try Karein</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[S.noProvidersBtn, S.homeBtn]} onPress={() => navigation.popToTop()}>
                  <Text style={[S.noProvidersBtnText, { color: C.cream }]}>🏠 Wapas Jayein</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:      { flex:1, backgroundColor:C.cream },
  inner:          { flex:1, padding:24 },
  header:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:16, marginBottom:24 },
  headerTitle:    { fontSize:26, fontWeight:'800', color:C.navy },
  headerSub:      { fontSize:14, color:C.steel, marginTop:4 },
  progressWrap:   { marginBottom:24 },
  progressTrack:  { height:6, backgroundColor:C.warmGrey, borderRadius:3, overflow:'hidden' },
  progressFill:   { height:'100%', backgroundColor:C.navy, borderRadius:3 },
  progressLabel:  { textAlign:'right', marginTop:6, color:C.steel, fontSize:11, fontWeight:'700' },
  logContainer:   { flex:1, backgroundColor:C.white, borderRadius:16, padding:16, borderWidth:1, borderColor:C.warmGrey, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:16, elevation:4 },
  stepItem:       { flexDirection:'row', alignItems:'center', paddingVertical:11, paddingHorizontal:10, borderRadius:12, marginBottom:6 },
  stepMarker:     { width:24, height:24, justifyContent:'center', alignItems:'center', marginRight:12 },
  checkmark:      { color:C.steel, fontWeight:'900', fontSize:16 },
  dot:            { width:6, height:6, borderRadius:3, backgroundColor:C.warmGrey },
  stepText:       { fontSize:14, lineHeight:20, flex:1 },
  stepCompleted:  { backgroundColor:'rgba(47,72,109,0.06)' },
  stepActive:     { backgroundColor:'rgba(34,49,72,0.08)', borderWidth:1, borderColor:C.warmGrey },
  stepPending:    { opacity:0.5 },
  textCompleted:  { color:C.steel, fontWeight:'600' },
  textActive:     { color:C.navy, fontWeight:'800' },
  textPending:    { color:C.warmGrey },
  noProvidersCard:{ backgroundColor:C.cream, padding:24, borderRadius:16, marginTop:16, borderWidth:1, borderColor:C.warmGrey, alignItems:'center' },
  noProvidersEmoji:{ fontSize:48, marginBottom:14 },
  noProvidersTitle:{ fontSize:19, fontWeight:'800', color:C.navy, textAlign:'center', marginBottom:8 },
  noProvidersSub: { fontSize:14, color:C.steel, textAlign:'center', marginBottom:14 },
  noProvidersQuestion:{ fontSize:12, fontWeight:'800', color:C.navy, textTransform:'uppercase', marginBottom:14 },
  noProvidersBtn: { width:'100%', backgroundColor:C.white, padding:15, borderRadius:12, marginBottom:10, alignItems:'center', borderWidth:1, borderColor:C.warmGrey },
  noProvidersBtnText:{ color:C.navy, fontWeight:'700', fontSize:14 },
  homeBtn:        { backgroundColor:C.navy, borderColor:C.navy },
});
