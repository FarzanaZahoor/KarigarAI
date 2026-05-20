import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Animated, ScrollView } from 'react-native';
import { updateBookingRating } from '../utils/bookingStore';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff' };

const TAGS = ['On Time','Professional','Good Price','Clean Work','Friendly','Fast Service'];

const getRatingText = (r: number) => {
  switch(r) { case 1: return 'Poor'; case 2: return 'Fair'; case 3: return 'Good'; case 4: return 'Very Good'; case 5: return 'Excellent! 🎉'; default: return 'Select Stars'; }
};

export default function RatingScreen({ route, navigation }: any) {
  const { bookingId, provider } = route.params;
  const [rating, setRating]         = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment]       = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const successFade = useRef(new Animated.Value(0)).current;

  const toggleTag = (tag: string) =>
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = () => {
    updateBookingRating(bookingId, rating, selectedTags, comment);
    Animated.timing(fadeAnim, { toValue:0, duration:400, useNativeDriver:true }).start(() => {
      setIsSubmitted(true);
      Animated.timing(successFade, { toValue:1, duration:600, useNativeDriver:true }).start();
    });
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={[S.container, { backgroundColor:C.navy }]}>
        <Animated.View style={[S.successContainer, { opacity:successFade }]}>
          <Text style={S.successEmoji}>🎉</Text>
          <Text style={S.successTitle}>Shukriya!</Text>
          <Text style={S.successSubtitle}>Your rating helps others find great service.</Text>
          <TouchableOpacity style={S.homeButton} onPress={() => navigation.popToTop()}>
            <Text style={S.homeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={S.container}>
      <ScrollView contentContainerStyle={S.scrollContent}>
        <Animated.View style={{ opacity:fadeAnim }}>
          {/* Header */}
          <View style={S.header}>
            <View style={S.checkCircle}>
              <Text style={S.checkMark}>✓</Text>
            </View>
            <Text style={S.title}>How was your experience?</Text>
            <Text style={S.subtitle}>Rate {provider.name}</Text>
          </View>

          {/* Stars */}
          <View style={S.starsContainer}>
            {[1,2,3,4,5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[S.star, { color: star <= rating ? C.navy : C.warmGrey }]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={S.ratingLabel}>{getRatingText(rating)}</Text>

          {/* Provider Card */}
          <View style={S.providerCard}>
            <Text style={S.providerName}>{provider.name}</Text>
            <Text style={S.providerSub}>{provider.service} · {provider.area}</Text>
            <Text style={S.providerBookingId}>ID: {bookingId}</Text>
          </View>

          {/* Tags */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>WHAT WAS GOOD?</Text>
            <View style={S.tagsContainer}>
              {TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[S.tag, selectedTags.includes(tag) && S.tagActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[S.tagText, selectedTags.includes(tag) && S.tagTextActive]}>
                    {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Comments */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>ANY COMMENTS?</Text>
            <TextInput
              style={S.commentBox}
              placeholder="Share your experience... (optional)"
              placeholderTextColor={C.warmGrey}
              multiline
              maxLength={200}
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[S.submitButton, rating === 0 && S.submitDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={S.submitText}>Submit Rating</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:      { flex:1, backgroundColor:C.cream },
  scrollContent:  { padding:24 },
  header:         { alignItems:'center', marginBottom:28, marginTop:8 },
  checkCircle:    { width:52, height:52, backgroundColor:C.steel, borderRadius:26, justifyContent:'center', alignItems:'center', marginBottom:14 },
  checkMark:      { color:C.cream, fontSize:26, fontWeight:'bold' },
  title:          { fontSize:24, fontWeight:'800', color:C.navy, textAlign:'center' },
  subtitle:       { fontSize:15, color:C.steel, marginTop:6 },
  starsContainer: { flexDirection:'row', justifyContent:'center', marginBottom:8 },
  star:           { fontSize:44, marginHorizontal:4 },
  ratingLabel:    { textAlign:'center', fontSize:17, fontWeight:'700', color:C.navy, marginBottom:28 },
  providerCard:   { backgroundColor:C.white, borderRadius:16, padding:20, marginBottom:28, borderWidth:1, borderColor:C.warmGrey, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.07, shadowRadius:14, elevation:3 },
  providerName:   { fontSize:17, fontWeight:'800', color:C.navy },
  providerSub:    { fontSize:13, color:C.steel, marginTop:4 },
  providerBookingId:{ fontSize:11, color:C.warmGrey, marginTop:8 },
  section:        { marginBottom:28 },
  sectionTitle:   { fontSize:11, fontWeight:'800', color:C.warmGrey, letterSpacing:1, marginBottom:14 },
  tagsContainer:  { flexDirection:'row', flexWrap:'wrap' },
  tag:            { backgroundColor:C.white, borderWidth:1.5, borderColor:C.warmGrey, paddingHorizontal:14, paddingVertical:8, borderRadius:20, marginRight:8, marginBottom:8 },
  tagActive:      { backgroundColor:C.navy, borderColor:C.navy },
  tagText:        { fontSize:13, fontWeight:'600', color:C.navy },
  tagTextActive:  { color:C.cream },
  commentBox:     { backgroundColor:C.white, borderWidth:1, borderColor:C.warmGrey, borderRadius:12, padding:16, height:100, textAlignVertical:'top', fontSize:14, color:C.navy },
  submitButton:   { backgroundColor:C.white, paddingVertical:18, borderRadius:14, alignItems:'center', borderWidth:2, borderColor:C.navy, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.1, shadowRadius:10, elevation:3 },
  submitDisabled: { borderColor:C.warmGrey, shadowOpacity:0, elevation:0 },
  submitText:     { color:C.navy, fontSize:16, fontWeight:'800' },
  successContainer:{ flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  successEmoji:   { fontSize:80, marginBottom:24 },
  successTitle:   { fontSize:28, fontWeight:'800', color:C.cream, textAlign:'center' },
  successSubtitle:{ fontSize:16, color:C.warmGrey, marginTop:12, textAlign:'center', marginBottom:40 },
  homeButton:     { backgroundColor:C.cream, paddingVertical:18, paddingHorizontal:48, borderRadius:14 },
  homeButtonText: { color:C.navy, fontSize:16, fontWeight:'800' },
});
