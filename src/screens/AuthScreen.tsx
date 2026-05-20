import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  Animated, ScrollView, KeyboardAvoidingView, Platform, Modal
} from 'react-native';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff', bg:'#f0f4f8', error:'#c0392b', success:'#2ecc71' };

const CITIES = ['Lahore'];
const AREAS = ['Gulberg', 'DHA Phase 5', 'Johar Town', 'Model Town', 'Bahria Town', 'Garden Town', 'Iqbal Town', 'Wapda Town', 'Cavalry Ground', 'Cantt'];
const SERVICES = ['Electrician', 'Plumber', 'AC Technician', 'Beautician', 'Carpenter'];

type Mode = 'welcome' | 'login' | 'register_customer' | 'register_provider' | 'success';

export default function AuthScreen({ navigation }: any) {
  const [mode, setMode] = useState<Mode>('welcome');
  const [errors, setErrors] = useState<{[key:string]: string}>({});
  
  // Modals
  const [showCityModal, setShowCityModal] = useState(false);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  
  // Forms
  const [loginForm, setLoginForm] = useState({ phoneOrEmail: '', password: '' });
  const [cForm, setCForm] = useState({ fullName: '', phone: '', email: '', city: 'Lahore', area: '', address: '', password: '', confirm: '' });
  const [pForm, setPForm] = useState({ fullName: '', phone: '', email: '', service: '', shopName: '', shopAddress: '', area: '', experience: '', price: '', cnic: '', password: '', confirm: '' });

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [mode]);

  const validatePhone = (phone: string) => /^\d{11}$/.test(phone.replace(/\D/g, ''));

  const handleCustomerSubmit = () => {
    let errs: any = {};
    if (!cForm.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!validatePhone(cForm.phone)) errs.phone = 'Valid 11-digit phone required';
    if (!cForm.area) errs.area = 'Area is required';
    if (!cForm.address.trim()) errs.address = 'Address is required';
    if (cForm.password.length < 6) errs.password = 'Min 6 chars required';
    if (cForm.password !== cForm.confirm) errs.confirm = 'Passwords do not match';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      handleSuccess();
    }
  };

  const handleProviderSubmit = () => {
    let errs: any = {};
    if (!pForm.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!validatePhone(pForm.phone)) errs.phone = 'Valid 11-digit phone required';
    if (!pForm.service) errs.service = 'Service type required';
    if (!pForm.shopName.trim()) errs.shopName = 'Shop Name required';
    if (!pForm.shopAddress.trim()) errs.shopAddress = 'Shop Address required';
    if (!pForm.area) errs.area = 'Service Area required';
    if (!pForm.price.trim()) errs.price = 'Price required';
    if (!pForm.cnic.trim()) errs.cnic = 'CNIC required';
    if (pForm.password.length < 6) errs.password = 'Min 6 chars required';
    if (pForm.password !== pForm.confirm) errs.confirm = 'Passwords do not match';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      handleSuccess();
    }
  };

  const handleLoginSubmit = () => {
    let errs: any = {};
    if (!loginForm.phoneOrEmail.trim()) errs.phoneOrEmail = 'Phone or Email required';
    if (!loginForm.password.trim()) errs.password = 'Password required';
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
    } else {
      setErrors({});
      handleSuccess();
    }
  };

  const handleSuccess = () => {
    setMode('success');
    Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    setTimeout(() => {
      navigation.navigate('MainTabs');
    }, 2000);
  };

  const InputField = ({ label, value, onChangeText, secureTextEntry, keyboardType, error, placeholder }: any) => (
    <View style={S.inputGroup}>
      <Text style={S.label}>{label}</Text>
      <TextInput
        style={[S.input, error && S.inputError]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={C.warmGrey}
      />
      {error && <Text style={S.errorText}>{error}</Text>}
    </View>
  );

  const SelectField = ({ label, value, onPress, error, placeholder }: any) => (
    <View style={S.inputGroup}>
      <Text style={S.label}>{label}</Text>
      <TouchableOpacity style={[S.input, S.selectInput, error && S.inputError]} onPress={onPress}>
        <Text style={{ color: value ? C.navy : C.warmGrey, fontFamily: 'DMSans' }}>
          {value || placeholder}
        </Text>
        <Text style={{ color: C.navy }}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={S.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={S.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={S.header}>
          <TouchableOpacity onPress={() => mode === 'welcome' ? navigation.goBack() : setMode('welcome')}>
            <Text style={S.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={S.headerTitle}>Karigar<Text style={S.navAI}>AI</Text></Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView contentContainerStyle={S.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            
            {/* WELCOME MODE */}
            {mode === 'welcome' && (
              <View style={S.welcomeBox}>
                <Text style={S.welcomeTitle}>Welcome to KarigarAI</Text>
                <Text style={S.welcomeSub}>How would you like to use our platform?</Text>
                
                <TouchableOpacity style={S.primaryBtn} onPress={() => setMode('register_customer')}>
                  <Text style={S.primaryBtnText}>👤 I need a Service</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.outlineBtn} onPress={() => setMode('register_provider')}>
                  <Text style={S.outlineBtnText}>🛠️ I provide a Service</Text>
                </TouchableOpacity>

                <View style={S.dividerRow}>
                  <View style={S.dividerLine} /><Text style={S.dividerText}>OR</Text><View style={S.dividerLine} />
                </View>

                <TouchableOpacity style={S.loginLinkBtn} onPress={() => setMode('login')}>
                  <Text style={S.loginLinkText}>Already have an account? <Text style={S.loginLinkBold}>Login</Text></Text>
                </TouchableOpacity>
              </View>
            )}

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <View style={S.card}>
                <Text style={S.cardTitle}>Login</Text>
                <InputField label="Phone Number or Email" value={loginForm.phoneOrEmail} onChangeText={(t:any)=>setLoginForm({...loginForm, phoneOrEmail: t})} error={errors.phoneOrEmail} />
                <InputField label="Password" secureTextEntry value={loginForm.password} onChangeText={(t:any)=>setLoginForm({...loginForm, password: t})} error={errors.password} />
                <TouchableOpacity style={S.primaryBtn} onPress={handleLoginSubmit}>
                  <Text style={S.primaryBtnText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={S.textBtn} onPress={() => setMode('register_customer')}>
                  <Text style={S.textBtnLabel}>Don't have an account? Register</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CUSTOMER REGISTRATION */}
            {mode === 'register_customer' && (
              <View style={S.card}>
                <Text style={S.cardTitle}>Customer Registration</Text>
                <InputField label="Full Name" value={cForm.fullName} onChangeText={(t:any)=>setCForm({...cForm, fullName: t})} error={errors.fullName} />
                <InputField label="Phone Number" placeholder="03XX-XXXXXXX" keyboardType="phone-pad" value={cForm.phone} onChangeText={(t:any)=>setCForm({...cForm, phone: t})} error={errors.phone} />
                <InputField label="Email (Optional)" keyboardType="email-address" value={cForm.email} onChangeText={(t:any)=>setCForm({...cForm, email: t})} />
                
                <SelectField label="City" value={cForm.city} onPress={() => setShowCityModal(true)} />
                <SelectField label="Area / Location" value={cForm.area} placeholder="Select Area" onPress={() => setShowAreaModal(true)} error={errors.area} />
                
                <InputField label="Home Address" value={cForm.address} onChangeText={(t:any)=>setCForm({...cForm, address: t})} error={errors.address} />
                <InputField label="Password" secureTextEntry value={cForm.password} onChangeText={(t:any)=>setCForm({...cForm, password: t})} error={errors.password} />
                <InputField label="Confirm Password" secureTextEntry value={cForm.confirm} onChangeText={(t:any)=>setCForm({...cForm, confirm: t})} error={errors.confirm} />
                
                <TouchableOpacity style={S.primaryBtn} onPress={handleCustomerSubmit}>
                  <Text style={S.primaryBtnText}>Register as Customer</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* PROVIDER REGISTRATION */}
            {mode === 'register_provider' && (
              <View style={S.card}>
                <Text style={S.cardTitle}>Provider Registration</Text>
                <InputField label="Full Name" value={pForm.fullName} onChangeText={(t:any)=>setPForm({...pForm, fullName: t})} error={errors.fullName} />
                <InputField label="Phone Number" placeholder="03XX-XXXXXXX" keyboardType="phone-pad" value={pForm.phone} onChangeText={(t:any)=>setPForm({...pForm, phone: t})} error={errors.phone} />
                <InputField label="Email (Optional)" keyboardType="email-address" value={pForm.email} onChangeText={(t:any)=>setPForm({...pForm, email: t})} />
                <InputField label="CNIC Number" keyboardType="number-pad" value={pForm.cnic} onChangeText={(t:any)=>setPForm({...pForm, cnic: t})} error={errors.cnic} />
                
                <SelectField label="Service Type" value={pForm.service} placeholder="Select Service" onPress={() => setShowServiceModal(true)} error={errors.service} />
                <InputField label="Years of Experience" keyboardType="number-pad" value={pForm.experience} onChangeText={(t:any)=>setPForm({...pForm, experience: t})} />
                <InputField label="Price per Visit (Rs.)" keyboardType="number-pad" value={pForm.price} onChangeText={(t:any)=>setPForm({...pForm, price: t})} error={errors.price} />
                
                <InputField label="Shop / Business Name" value={pForm.shopName} onChangeText={(t:any)=>setPForm({...pForm, shopName: t})} error={errors.shopName} />
                <InputField label="Shop Address" value={pForm.shopAddress} onChangeText={(t:any)=>setPForm({...pForm, shopAddress: t})} error={errors.shopAddress} />
                <SelectField label="Service Area (Main)" value={pForm.area} placeholder="Select Area" onPress={() => setShowAreaModal(true)} error={errors.area} />
                
                <InputField label="Password" secureTextEntry value={pForm.password} onChangeText={(t:any)=>setPForm({...pForm, password: t})} error={errors.password} />
                <InputField label="Confirm Password" secureTextEntry value={pForm.confirm} onChangeText={(t:any)=>setPForm({...pForm, confirm: t})} error={errors.confirm} />
                
                <TouchableOpacity style={S.primaryBtn} onPress={handleProviderSubmit}>
                  <Text style={S.primaryBtnText}>Register as Provider</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* SUCCESS MODE */}
            {mode === 'success' && (
              <View style={S.successBox}>
                <Animated.View style={[S.successIconCircle, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={S.successCheck}>✓</Text>
                </Animated.View>
                <Text style={S.successTitle}>Registration Successful!</Text>
                <Text style={S.successSub}>Welcome to KarigarAI</Text>
              </View>
            )}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODALS */}
      <Modal visible={showCityModal} transparent animationType="fade">
        <TouchableOpacity style={S.overlay} onPress={()=>setShowCityModal(false)}>
          <View style={S.modalCard}>
            <Text style={S.modalTitle}>Select City</Text>
            {CITIES.map(item => (
              <TouchableOpacity key={item} style={S.modalItem} onPress={() => { setCForm({...cForm, city: item}); setShowCityModal(false); }}>
                <Text style={S.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showAreaModal} transparent animationType="fade">
        <TouchableOpacity style={S.overlay} onPress={()=>setShowAreaModal(false)}>
          <View style={S.modalCard}>
            <Text style={S.modalTitle}>Select Area</Text>
            <ScrollView style={{maxHeight: 300}}>
              {AREAS.map(item => (
                <TouchableOpacity key={item} style={S.modalItem} onPress={() => { 
                  if(mode === 'register_customer') setCForm({...cForm, area: item});
                  if(mode === 'register_provider') setPForm({...pForm, area: item});
                  setShowAreaModal(false); 
                }}>
                  <Text style={S.modalItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showServiceModal} transparent animationType="fade">
        <TouchableOpacity style={S.overlay} onPress={()=>setShowServiceModal(false)}>
          <View style={S.modalCard}>
            <Text style={S.modalTitle}>Select Service</Text>
            {SERVICES.map(item => (
              <TouchableOpacity key={item} style={S.modalItem} onPress={() => { setPForm({...pForm, service: item}); setShowServiceModal(false); }}>
                <Text style={S.modalItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: C.navy, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backBtn: { color: C.cream, fontFamily: 'DMSans', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { fontSize: 28, fontFamily: 'CormorantGaramond', fontWeight: 'bold', color: C.cream, letterSpacing: -0.5 },
  navAI: { color: C.steel },
  scrollContent: { padding: 20, paddingBottom: 60 },
  
  welcomeBox: { marginTop: 40, alignItems: 'center', backgroundColor: C.white, padding: 30, borderRadius: 24, shadowColor: C.navy, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4 },
  welcomeTitle: { fontSize: 26, fontFamily: 'CormorantGaramond', fontWeight: 'bold', color: C.navy, marginBottom: 10, textAlign: 'center' },
  welcomeSub: { fontSize: 14, fontFamily: 'DMSans', color: C.steel, marginBottom: 30, textAlign: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: C.bg },
  dividerText: { marginHorizontal: 15, color: C.warmGrey, fontFamily: 'DMSans', fontWeight: 'bold' },
  loginLinkBtn: { paddingVertical: 10 },
  loginLinkText: { color: C.steel, fontFamily: 'DMSans', fontSize: 14 },
  loginLinkBold: { color: C.navy, fontWeight: 'bold' },

  card: { backgroundColor: C.white, borderRadius: 24, padding: 24, shadowColor: C.navy, shadowOpacity: 0.05, shadowRadius: 16, elevation: 4, marginTop: 20 },
  cardTitle: { fontSize: 24, fontFamily: 'CormorantGaramond', fontWeight: 'bold', color: C.navy, marginBottom: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontFamily: 'DMSans', fontWeight: 'bold', color: C.navy, marginBottom: 8 },
  input: { backgroundColor: C.bg, padding: 16, borderRadius: 12, fontFamily: 'DMSans', fontSize: 15, color: C.navy, borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: C.error, backgroundColor: '#fdf3f2' },
  selectInput: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { color: C.error, fontSize: 12, fontFamily: 'DMSans', marginTop: 4, marginLeft: 4 },

  primaryBtn: { backgroundColor: C.navy, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, width: '100%' },
  primaryBtnText: { color: C.cream, fontFamily: 'DMSans', fontSize: 16, fontWeight: 'bold' },
  outlineBtn: { backgroundColor: C.white, borderWidth: 2, borderColor: C.navy, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16, width: '100%' },
  outlineBtnText: { color: C.navy, fontFamily: 'DMSans', fontSize: 16, fontWeight: 'bold' },
  textBtn: { marginTop: 20, alignItems: 'center' },
  textBtnLabel: { color: C.navy, fontFamily: 'DMSans', fontWeight: 'bold', fontSize: 14 },

  successBox: { marginTop: 80, alignItems: 'center' },
  successIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.success, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: 'rgba(46, 204, 113, 0.2)' },
  successCheck: { color: C.white, fontSize: 40, fontWeight: 'bold' },
  successTitle: { fontSize: 26, fontFamily: 'CormorantGaramond', fontWeight: 'bold', color: C.navy, marginBottom: 8 },
  successSub: { fontSize: 16, fontFamily: 'DMSans', color: C.steel },

  overlay: { flex: 1, backgroundColor: 'rgba(34,49,72,0.6)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: C.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontFamily: 'CormorantGaramond', fontWeight: 'bold', color: C.navy, marginBottom: 16 },
  modalItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.bg },
  modalItemText: { fontSize: 16, fontFamily: 'DMSans', color: C.navy, fontWeight: '500' },
});
