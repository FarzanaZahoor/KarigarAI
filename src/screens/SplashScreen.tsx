import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, SafeAreaView } from 'react-native';

const C = {
  navy: '#223148',
  steel: '#2f486d',
  cream: '#f3eae0',
  warmGrey: '#d2c7b8',
  white: '#ffffff',
};

export default function SplashScreen({ navigation }: any) {
  const logoFade  = useRef(new Animated.Value(0)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(-24)).current;
  const taglineSlide = useRef(new Animated.Value(24)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoFade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(logoSlide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    Animated.parallel([
      Animated.timing(taglineFade,  { toValue: 1, duration: 800, delay: 300, useNativeDriver: true }),
      Animated.timing(taglineSlide, { toValue: 0, duration: 800, delay: 300, useNativeDriver: true }),
    ]).start();

    Animated.timing(barWidth, {
      toValue: 100,
      duration: 2200,
      delay: 200,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => navigation.replace('MainTabs'), 2600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={{ opacity: logoFade, transform: [{ translateY: logoSlide }] }}>
          <Text style={styles.logo}>
            Karigar<Text style={styles.aiText}>AI</Text>
          </Text>
        </Animated.View>

        <Animated.View style={{ opacity: taglineFade, transform: [{ translateY: taglineSlide }] }}>
          <Text style={styles.tagline}>Your Smart Service Assistant</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: barWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.poweredBy}>Powered by</Text>
        <View style={styles.badge}>
          <Text style={styles.googleText}>Google</Text>
          <Text style={styles.antigravityText}> Antigravity</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: C.navy },
  content:    { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  logo:       { fontSize: 52, fontFamily: 'CormorantGaramond', color: C.cream, letterSpacing: -1 },
  aiText:     { color: C.steel },
  tagline:    { fontSize: 17, fontFamily: 'DMSans', color: C.warmGrey, marginTop: 14, fontWeight: '500', letterSpacing: 0.5, textAlign: 'center' },
  barTrack:   { width: '70%', height: 4, backgroundColor: 'rgba(211,199,184,0.25)', borderRadius: 2, marginTop: 48, overflow: 'hidden' },
  barFill:    { height: '100%', backgroundColor: C.steel, borderRadius: 2 },
  footer:     { alignItems: 'center', marginBottom: 40 },
  poweredBy:  { color: C.warmGrey, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  badge:      { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(211,199,184,0.2)' },
  googleText: { color: C.cream, fontWeight: '700', fontSize: 13 },
  antigravityText: { color: C.steel, fontWeight: '800', fontSize: 13 },
});
