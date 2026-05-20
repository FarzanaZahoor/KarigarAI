import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { getBookings, Booking } from '../utils/bookingStore';

const C = { navy:'#223148', steel:'#2f486d', cream:'#f3eae0', warmGrey:'#d2c7b8', white:'#ffffff' };

const getIcon = (service: string) => {
  switch (service.toLowerCase()) {
    case 'electrician':   return '⚡';
    case 'plumber':       return '🚰';
    case 'ac technician': return '❄️';
    case 'beautician':    return '💅';
    case 'carpenter':     return '🪚';
    default:              return '🛠️';
  }
};

export default function BookingHistoryScreen({ navigation }: any) {
  const bookings = getBookings();

  const renderItem = ({ item }: { item: Booking }) => {
    const isCompleted  = item.status === 'Completed';
    const isCancelled  = item.status === 'Cancelled';
    const statusBg     = isCompleted ? 'rgba(34,49,72,0.08)' : isCancelled ? 'rgba(192,57,43,0.08)' : 'rgba(47,72,109,0.08)';
    const statusColor  = isCompleted ? C.navy : isCancelled ? '#c0392b' : C.steel;

    return (
      <View style={S.card}>
        <View style={S.cardHeader}>
          <View style={S.iconBadge}>
            <Text style={S.serviceIcon}>{getIcon(item.serviceType)}</Text>
          </View>
          <View style={S.headerText}>
            <Text style={S.serviceType}>{item.serviceType}</Text>
            <Text style={S.providerName}>{item.provider.name}</Text>
          </View>
          <View style={[S.statusBadge, { backgroundColor:statusBg }]}>
            <Text style={[S.statusText, { color:statusColor }]}>{item.status}</Text>
          </View>
        </View>

        <View style={S.divider} />

        <View style={S.detailsGrid}>
          <View style={S.detailItem}>
            <Text style={S.detailLabel}>DATE & TIME</Text>
            <Text style={S.detailValue}>{item.date}</Text>
          </View>
          <View style={S.detailItem}>
            <Text style={S.detailLabel}>CONFIRMATION</Text>
            <Text style={S.detailValue}>{item.id}</Text>
          </View>
        </View>

        <View style={S.cardFooter}>
          <Text style={S.costText}>Rs. {item.cost}</Text>
          <TouchableOpacity
            style={S.bookAgainBtn}
            onPress={() => navigation.navigate('HomeTab', { prefill: item.requestText })}
          >
            <Text style={S.bookAgainText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={S.container}>
      {/* Navy Header */}
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={S.backButton}>
          <Text style={S.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={S.title}>My Bookings</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={S.listContent}
        ListEmptyComponent={
          <View style={S.emptyContainer}>
            <Text style={S.emptyIcon}>📭</Text>
            <Text style={S.emptyTitle}>Koi booking nahi mili</Text>
            <Text style={S.emptySub}>Your completed bookings will appear here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container:    { flex:1, backgroundColor:C.cream },
  header:       { flexDirection:'row', alignItems:'center', padding:20, backgroundColor:C.navy },
  backButton:   { width:40, height:40, justifyContent:'center' },
  backIcon:     { fontSize:24, color:C.cream, fontWeight:'700' },
  title:        { fontSize:20, fontWeight:'800', color:C.cream, marginLeft:8 },
  listContent:  { padding:16, paddingBottom:40 },
  card:         { backgroundColor:C.white, borderRadius:16, padding:18, marginBottom:14, shadowColor:C.navy, shadowOffset:{width:0,height:4}, shadowOpacity:0.07, shadowRadius:14, elevation:3 },
  cardHeader:   { flexDirection:'row', alignItems:'center' },
  iconBadge:    { width:46, height:46, borderRadius:12, backgroundColor:C.cream, justifyContent:'center', alignItems:'center', borderWidth:1, borderColor:C.warmGrey },
  serviceIcon:  { fontSize:22 },
  headerText:   { flex:1, marginLeft:12 },
  serviceType:  { fontSize:16, fontWeight:'800', color:C.navy },
  providerName: { fontSize:13, color:C.steel, marginTop:2 },
  statusBadge:  { paddingHorizontal:10, paddingVertical:5, borderRadius:10 },
  statusText:   { fontSize:12, fontWeight:'800' },
  divider:      { height:1, backgroundColor:C.cream, marginVertical:12 },
  detailsGrid:  { flexDirection:'row', justifyContent:'space-between', marginBottom:12 },
  detailItem:   { flex:1 },
  detailLabel:  { fontSize:9, fontWeight:'800', color:C.warmGrey, letterSpacing:0.5 },
  detailValue:  { fontSize:13, color:C.navy, marginTop:4, fontWeight:'600' },
  cardFooter:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTopWidth:1, borderTopColor:C.cream },
  costText:     { fontSize:18, fontWeight:'900', color:C.navy },
  bookAgainBtn: { backgroundColor:C.navy, paddingHorizontal:16, paddingVertical:9, borderRadius:10 },
  bookAgainText:{ color:C.cream, fontSize:13, fontWeight:'700' },
  emptyContainer:{ alignItems:'center', marginTop:100 },
  emptyIcon:    { fontSize:64, marginBottom:16 },
  emptyTitle:   { fontSize:18, color:C.navy, fontWeight:'700' },
  emptySub:     { fontSize:14, color:C.steel, marginTop:6 },
});
