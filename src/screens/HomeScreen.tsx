import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, KeyboardAvoidingView, Platform,
  Easing, ScrollView, Modal, Alert
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { parseServiceRequest, ParsedIntent } from '../utils/aiMock';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8' };
type Language = 'english' | 'urdu' | 'punjabi';

const translations = {
  english: { placeholder:'What service do you need?', button:'Find Providers', hint:'Try: "I need a plumber in Gulberg tomorrow morning"', label:'What do you need help with?', listening:'Listening...', speak:'Speak now', langCode:'en-US', emptyError:'Please type your need first!', noVoice:"Voice assistant is available on web version. Please type your request on mobile." },
  urdu:    { placeholder:'آپ کو کیا سروس چاہیے؟', button:'کاریگر ڈھونڈیں', hint:'آزمائیں: "کل صبح G-9 میں پلمبر چاہیے"', label:'آپ کو کس طرح کی مدد چاہیے؟', listening:'سن رہا ہے...', speak:'آواز سے بولیں', langCode:'ur-PK', emptyError:'پہلے اپنی ضرورت لکھیں!', noVoice:'وائس اسسٹنٹ صرف ویب ورژن پر دستیاب ہے۔ براہ کرم موبائل پر ٹائپ کریں۔' },
  punjabi: { placeholder:'تہانوں کی سروس چاہیدی اے؟', button:'کاریگر لبھو', hint:'آزماؤ: "مینوں kal subah bijli wala chahida"', label:'تہانوں کی مدد چاہیدی اے؟', listening:'سن رہیا اے...', speak:'بول کے دسو', langCode:'ur-PK', emptyError:'پہلے اپنی ضرورت لکھیں!', noVoice:'وائس اسسٹنٹ صرف ویب ورژن تے دستیاب اے۔ براہ کرم موبائل تے ٹائپ کرو۔' },
};

type GridService = {
  id: string;
  icon: string;
  label: string;
  color: string;
  isNav?: boolean;
};

const GRID_SERVICES: GridService[] = [
  { id: 'Electrician', icon: '🔌', label: 'Electrician', color: '#f3eae0' },
  { id: 'Plumber', icon: '🔧', label: 'Plumber', color: '#e0f3f3' },
  { id: 'AC Technician', icon: '❄️', label: 'AC Tech', color: '#e0eaf3' },
  { id: 'Beautician', icon: '💄', label: 'Beautician', color: '#f3e0e9' },
  { id: 'Carpenter', icon: '🪚', label: 'Carpenter', color: '#f3ede0' },
  { id: 'Roadmap', icon: '🗺️', label: 'Roadmap', color: '#e0e0f3', isNav: true },
];

const LOCATIONS = ['Gulberg','DHA Phase 5','Johar Town','Model Town','Bahria Town','Garden Town','Iqbal Town','Wapda Town','Cavalry Ground','Cantt'];

const HINTS = [
  'Try: "I need a plumber in Gulberg tomorrow morning at 9 AM"',
  'Try: "Mujhe aaj raat 8 baje electrician chahiye DHA mein"',
  'Try: "AC technician kal subah 10 baje Model Town mein"',
  'Try: "Beauty wali chahiye parson shaam 5 baje Johar Town"',
  'Try: "Carpenter chahiye kal dopahar 2 baje Bahria Town mein"',
  'Try: "مجھے کل صبح 9 بجے Cantt میں پلمبر چاہیے"',
];

export default function HomeScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const [language, setLanguage]           = useState<Language>('english');
  const [requestText, setRequestText]     = useState('');
  const [isListening, setIsListening]     = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [showServiceModal, setShowServiceModal]   = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTimeModal, setShowTimeModal]         = useState(false);
  const [showMissingTimeModal, setShowMissingTimeModal] = useState(false);
  const [pendingIntent, setPendingIntent] = useState<ParsedIntent | null>(null);
  const [hintIndex, setHintIndex]         = useState(0);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const micScale  = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const hintFade  = useRef(new Animated.Value(1)).current;
  const recognitionRef = useRef<any>(null);
  const t = translations[language];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue:1, duration:800, useNativeDriver:true }),
      Animated.timing(slideAnim, { toValue:0, duration:800, easing:Easing.out(Easing.exp), useNativeDriver:true }),
    ]).start();
    const isVS = Platform.OS === 'web' && typeof globalThis !== 'undefined' && ('webkitSpeechRecognition' in globalThis || 'SpeechRecognition' in globalThis);
    setVoiceSupported(isVS);
    if (isVS) {
      const SR = (globalThis as any).webkitSpeechRecognition || (globalThis as any).SpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (e: any) => {
        let tr = ''; for (let i = e.resultIndex; i < e.results.length; ++i) tr += e.results[i][0].transcript;
        setRequestText(tr);
        if (e.results[0].isFinal) { setIsListening(false); handleProcess(tr); }
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend   = () => setIsListening(false);
    }

    const hintInterval = setInterval(() => {
      Animated.timing(hintFade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setHintIndex(prev => (prev + 1) % HINTS.length);
        Animated.timing(hintFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 3000);

    return () => clearInterval(hintInterval);
  }, []);

  useEffect(() => {
    if (route.params?.prefill) {
      setRequestText(route.params.prefill);
    }
  }, [route.params?.prefill]);

  useEffect(() => { if (recognitionRef.current) recognitionRef.current.lang = t.langCode; }, [language]);

  const shake = () => Animated.sequence([
    Animated.timing(shakeAnim,{toValue:10,duration:80,useNativeDriver:true}),
    Animated.timing(shakeAnim,{toValue:-10,duration:80,useNativeDriver:true}),
    Animated.timing(shakeAnim,{toValue:0,duration:80,useNativeDriver:true}),
  ]).start();

  const handleProcess = (text: string) => {
    if (!text.trim()) { shake(); Alert.alert('Notice', t.emptyError); return; }
    const intent = parseServiceRequest(text);
    if (!intent.serviceType) { setPendingIntent(intent); setShowServiceModal(true); return; }
    if (intent.isPastTime)   { setPendingIntent(intent); setShowTimeModal(true);    return; }
    if (intent.isMissingTime){ setPendingIntent(intent); setShowMissingTimeModal(true); return; }
    if (!intent.location)    { setPendingIntent(intent); setShowLocationModal(true);return; }
    navigation.navigate('Processing', { requestText: text });
  };

  const handleServiceSelect  = (s: string) => { setShowServiceModal(false);  const u=`${requestText} ${s}`;      setRequestText(u); handleProcess(u); };
  const handleLocationSelect = (l: string) => { setShowLocationModal(false); const u=`${requestText} in ${l}`;   setRequestText(u); handleProcess(u); };
  const handleTimeSelect     = (ok: boolean) => { setShowTimeModal(false); if(ok){ const u=requestText.replace(/(today|aaj)/i,'').trim()+' tomorrow'; setRequestText(u); handleProcess(u); } };
  const handleMissingTimeSelect = (timeLabel: string) => {
    setShowMissingTimeModal(false);
    const u = `${requestText} ${timeLabel}`;
    setRequestText(u);
    handleProcess(u);
  };
  const toggleListening = () => { if(!voiceSupported) return Alert.alert('Notice', t.noVoice); if(isListening) recognitionRef.current.stop(); else { setIsListening(true); recognitionRef.current.start(); } };

  return (
    <SafeAreaView style={S.container} edges={['bottom']}>
      {/* Navy Header - respects status bar via paddingTop: insets.top */}
      <View style={[S.navyHeaderBg, { paddingTop: insets.top }]}>
        <View style={S.navHeader}>
          <Text style={S.navLogo}>Karigar<Text style={S.navAI}>AI</Text></Text>
          <View style={S.headerButtonsRow}>
            <TouchableOpacity style={S.loginHeaderBtn} onPress={() => navigation.navigate('Auth')}>
              <Text style={S.loginHeaderText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.headerBtn} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={S.headerBtnIcon}>📊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.headerBtn} onPress={() => navigation.navigate('AgentLogs')}>
              <Text style={S.headerBtnIcon}>🤖</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View style={[S.langRow,{opacity:fadeAnim,transform:[{translateY:slideAnim}]}]}>
          {(['urdu','english','punjabi'] as Language[]).map(l=>(
            <TouchableOpacity key={l} style={[S.langBtn,language===l&&S.langBtnActive]} onPress={()=>setLanguage(l)}>
              <Text style={[S.langText,language===l&&S.langTextActive]}>{l==='urdu'?'اردو':l==='english'?'English':'پنجابی'}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={S.inner}>
        
        {/* Search Bar */}
        <Animated.View style={[S.searchCard,{opacity:fadeAnim,transform:[{translateY:slideAnim},{translateX:shakeAnim}]}]}>
          <Text style={S.label}>{t.label}</Text>
          
          <View style={S.searchRow}>
            <View style={S.inputWrapper}>
              <TextInput style={S.input} placeholder={t.placeholder} placeholderTextColor={C.warmGrey} value={requestText} onChangeText={setRequestText} />
              {voiceSupported&&(
                <TouchableOpacity style={[S.micButton,isListening&&S.micButtonActive]} onPress={toggleListening}>
                  <Animated.View style={{transform:[{scale:micScale}]}}><Text style={S.micIcon}>{isListening?'⏺':'🎤'}</Text></Animated.View>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={[S.findButton,!requestText.trim()&&S.findButtonDisabled]} onPress={()=>handleProcess(requestText)}>
              <Text style={S.findButtonText}>Find</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* AI Suggestion Hint */}
        <Animated.View style={{opacity:fadeAnim}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => {
            const text = HINTS[hintIndex].replace(/^.*?:\s*"/, '').replace(/"$/, '');
            setRequestText(text);
          }}>
            <View style={S.hintBox}>
              <Text style={S.hintIcon}>💡</Text>
              <Animated.Text style={[S.hintText, { opacity: hintFade }]} numberOfLines={1}>{HINTS[hintIndex]}</Animated.Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* 3x2 Quick Service Grid */}
        <Animated.View style={[S.gridSection,{opacity:fadeAnim}]}>
          <Text style={S.sectionTitle}>Quick Services</Text>
          <View style={S.grid}>
            {GRID_SERVICES.map(s => (
              <TouchableOpacity 
                key={s.id} 
                style={S.gridCard} 
                onPress={() => {
                  if (s.id === 'Roadmap') navigation.navigate('Roadmap');
                  else if (s.isNav) navigation.navigate('BookingsTab');
                  else navigation.navigate('ProviderList', { service: s.id });
                }}
              >
                <View style={[S.gridIconWrapper, { backgroundColor: s.color }]}>
                  <Text style={S.gridIcon}>{s.icon}</Text>
                </View>
                <Text style={S.gridLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

      </KeyboardAvoidingView>

      <Modal visible={showServiceModal} transparent animationType="fade">
        <View style={S.overlay}><View style={S.modal}>
          <Text style={S.modalEmoji}>🤔</Text>
          <Text style={S.modalTitle}>Kaunsi Service Chahiye?</Text>
          <Text style={S.modalSub}>Hum samajh nahi paaye. Please service chunein:</Text>
          <View style={S.modalGrid}>{GRID_SERVICES.filter(s => !s.isNav).map(s=>(
            <TouchableOpacity key={s.id} style={S.modalBtn} onPress={()=>handleServiceSelect(s.id)}>
              <Text style={S.modalBtnText}>{s.label}</Text>
            </TouchableOpacity>
          ))}</View>
        </View></View>
      </Modal>

      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={S.overlay}><View style={S.modal}>
          <Text style={S.modalEmoji}>📍</Text>
          <Text style={S.modalTitle}>Aap Ki Location?</Text>
          <Text style={S.modalSub}>Behtar service ke liye apna area batayein:</Text>
          <ScrollView style={{maxHeight:280}}>
            <View style={S.modalGrid}>{LOCATIONS.map(l=>(
              <TouchableOpacity key={l} style={S.modalBtn} onPress={()=>handleLocationSelect(l)}>
                <Text style={S.modalBtnText}>{l}</Text>
              </TouchableOpacity>
            ))}</View>
          </ScrollView>
        </View></View>
      </Modal>

      <Modal visible={showTimeModal} transparent animationType="fade">
        <View style={S.overlay}><View style={S.modal}>
          <Text style={S.modalEmoji}>⚠️</Text>
          <Text style={S.modalTitle}>Yeh Waqt Guzar Chuka Hai</Text>
          <Text style={S.modalSub}>Aap ne {pendingIntent?.time?.split(',')[1]} ka waqt manga hai jo pehle ho chuka hai.</Text>
          <TouchableOpacity style={[S.modalBtn,S.modalPrimaryBtn]} onPress={()=>handleTimeSelect(true)}>
            <Text style={S.modalPrimaryText}>✅ Haan, Kal Ke Liye Book Karein</Text>
          </TouchableOpacity>
          <TouchableOpacity style={S.modalBtn} onPress={()=>setShowTimeModal(false)}>
            <Text style={S.modalBtnText}>✏️ Waqt Badlein</Text>
          </TouchableOpacity>
        </View></View>
      </Modal>

      <Modal visible={showMissingTimeModal} transparent animationType="fade">
        <View style={S.overlay}><View style={S.modal}>
          <Text style={S.modalEmoji}>🕐</Text>
          <Text style={S.modalTitle}>Aap Kis Waqt Service Chahte Hain?</Text>
          <Text style={S.modalSub}>Please apna waqt chunein:</Text>
          <View style={S.modalGrid}>
            <TouchableOpacity style={[S.modalBtn,S.modalPrimaryBtn]} onPress={()=>handleMissingTimeSelect('abhi')}>
              <Text style={S.modalPrimaryText}>⚡ Abhi (ASAP)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.modalBtn} onPress={()=>handleMissingTimeSelect('aaj shaam')}>
              <Text style={S.modalBtnText}>🌆 Aaj Shaam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.modalBtn} onPress={()=>handleMissingTimeSelect('kal subah')}>
              <Text style={S.modalBtnText}>🌅 Kal Subah</Text>
            </TouchableOpacity>
            <TouchableOpacity style={S.modalBtn} onPress={()=>handleMissingTimeSelect('kal shaam')}>
              <Text style={S.modalBtnText}>🌇 Kal Shaam</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[S.modalBtn,{borderColor:C.navy}]} onPress={()=>setShowMissingTimeModal(false)}>
              <Text style={[S.modalBtnText,{color:C.steel}]}>✏️ Waqt Badlein</Text>
            </TouchableOpacity>
          </View>
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:      { flex:1, backgroundColor:C.bg },
  navyHeaderBg:   { backgroundColor:'#1a2744', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, paddingBottom: 15 },
  navHeader:      { paddingHorizontal:20, paddingTop:10, paddingBottom: 5, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  navLogo:        { fontSize:28, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.cream, letterSpacing:-0.5 },
  navAI:          { color:C.steel },
  headerButtonsRow: { flexDirection: 'row', alignItems: 'center' },
  loginHeaderBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  loginHeaderText: { color: C.cream, fontFamily: 'DMSans', fontSize: 13, fontWeight: 'bold' },
  headerBtn:      { backgroundColor:'rgba(255,255,255,0.1)', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 6 },
  headerBtnIcon:  { fontSize: 14 },
  inner:          { flex:1, paddingHorizontal: 16 },
  langRow:        { flexDirection:'row', paddingHorizontal: 20, marginTop: 5 },
  langBtn:        { paddingHorizontal:12, paddingVertical:4, borderRadius:16, backgroundColor:'rgba(255,255,255,0.1)', marginRight:8 },
  langBtnActive:  { backgroundColor:C.cream },
  langText:       { fontSize:12, fontFamily:'DMSans', fontWeight:'700', color:C.white },
  langTextActive: { color:'#1a2744' },
  searchCard:     { backgroundColor:C.white, borderRadius:20, padding:16, shadowColor:'#1a2744', shadowOffset:{width:0,height:4}, shadowOpacity:0.05, shadowRadius:16, elevation:4, marginTop: 16, marginBottom: 12 },
  label:          { fontSize:16, fontFamily:'DMSans', fontWeight:'bold', color:'#1a2744', marginBottom:10 },
  searchRow:      { flexDirection: 'row', alignItems: 'center' },
  inputWrapper:   { flex: 1, flexDirection:'row', backgroundColor:C.bg, borderRadius:12, alignItems: 'center', paddingRight: 5, marginRight: 10 },
  input:          { flex:1, height:50, paddingHorizontal:12, fontSize:14, fontFamily:'DMSans', color:'#1a2744' },
  micButton:      { width:36, height:36, backgroundColor:'#1a2744', borderRadius:18, justifyContent:'center', alignItems:'center' },
  micButtonActive:{ backgroundColor:'#c0392b' },
  micIcon:        { fontSize:14, color: C.white },
  findButton:     { backgroundColor:'#1a2744', paddingHorizontal: 16, height: 50, borderRadius:12, justifyContent: 'center' },
  findButtonDisabled:{ backgroundColor:C.warmGrey },
  findButtonText: { color:C.cream, fontSize:14, fontFamily:'DMSans', fontWeight:'bold' },
  hintBox:        { flexDirection: 'row', backgroundColor: '#fffdf0', padding: 10, borderRadius: 12, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f5ecd5' },
  hintIcon:       { fontSize: 16, marginRight: 8 },
  hintText:       { fontSize: 12, fontFamily: 'DMSans', color: C.steel, fontStyle: 'italic', flex: 1, fontWeight: '500' },
  gridSection:    { flex: 1 },
  sectionTitle:   { fontSize:18, fontFamily:'CormorantGaramond', fontWeight:'bold', color:'#1a2744', marginBottom: 10 },
  grid:           { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', flex: 1, alignContent: 'flex-start' },
  gridCard:       { width: '31%', backgroundColor: C.white, borderRadius: 16, padding: 12, alignItems: 'center', marginBottom: 10, shadowColor:'#1a2744', shadowOffset:{width:0,height:2}, shadowOpacity:0.03, shadowRadius:8, elevation:2 },
  gridIconWrapper:{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gridIcon:       { fontSize: 20 },
  gridLabel:      { fontSize: 11, fontFamily:'DMSans', fontWeight: 'bold', color: '#1a2744', textAlign: 'center' },
  noVoiceText:    { color:'#c0392b', fontSize:12, fontFamily:'DMSans', textAlign:'center', marginBottom:5 },
  overlay:        { flex:1, backgroundColor:'rgba(34,49,72,0.6)', justifyContent:'center', alignItems:'center', padding:20 },
  modal:          { backgroundColor:C.white, borderRadius:24, padding:24, width:'100%', alignItems:'center' },
  modalEmoji:     { fontSize:40, marginBottom:14 },
  modalTitle:     { fontSize:22, fontFamily:'CormorantGaramond', fontWeight:'bold', color:C.navy, marginBottom:8, textAlign:'center' },
  modalSub:       { fontSize:14, fontFamily:'DMSans', color:C.steel, textAlign:'center', marginBottom:20 },
  modalGrid:      { width:'100%' },
  modalBtn:       { backgroundColor:C.bg, padding:16, borderRadius:16, marginBottom:10, alignItems:'center' },
  modalBtnText:   { color:C.navy, fontFamily:'DMSans', fontWeight:'bold', fontSize:15 },
  modalPrimaryBtn:{ backgroundColor:C.navy },
  modalPrimaryText:{ color:C.cream, fontFamily:'DMSans', fontWeight:'bold', fontSize:15 },
});
