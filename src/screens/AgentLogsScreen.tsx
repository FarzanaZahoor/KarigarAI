import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { getTrace } from '../utils/agentLogger';

const C = {
  navy: '#223148',
  steel: '#2f486d',
  cream: '#f3eae0',
  warmGrey: '#d2c7b8',
  white: '#ffffff',
};

export default function AgentLogsScreen({ navigation }: any) {
  const { trace, lastUpdated } = getTrace();

  const handleExport = async () => {
    try {
      const textLogs = trace.map(log => {
        return `[${log.timestamp}] ${log.icon} ${log.title}\n` +
               `Tool: ${log.tool}\n` +
               (log.input ? `Input: "${log.input}"\n` : '') +
               `Result: ${log.result}\n` +
               `Status: ${log.status}\n`;
      }).join('\n---------------------------------------\n\n');
      
      await Clipboard.setStringAsync(textLogs);
      Alert.alert('Export Success', 'Complete agent logs have been copied to clipboard for debugging.');
    } catch (e: any) {
      Alert.alert('Export Error', 'Could not copy logs to clipboard.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🤖 Agent Logs</Text>
          <Text style={styles.headerSubtitle}>Complete AI Reasoning Trace</Text>
        </View>
        <Text style={styles.updateTime}>{lastUpdated || 'No logs yet'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {trace.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🤖</Text>
            <Text style={styles.emptyText}>No recent booking trace found.</Text>
            <Text style={styles.emptySub}>Perform a booking to see agent reasoning.</Text>
          </View>
        ) : (
          trace.map((log, i) => (
            <View key={i} style={styles.logEntry}>
              <View style={styles.logHeader}>
                <Text style={styles.timestamp}>[{log.timestamp}]</Text>
                <Text style={styles.logIcon}>{log.icon}</Text>
                <Text style={styles.logTitle}>{log.title}</Text>
              </View>

              <View style={styles.logDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tool:</Text>
                  <Text style={styles.detailTool}>{log.tool}</Text>
                </View>
                {log.input && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Input:</Text>
                    <Text style={styles.detailValue}>"{log.input}"</Text>
                  </View>
                )}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Result:</Text>
                  <Text style={styles.detailValue}>{log.result}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={styles.statusText}>{log.status} Complete</Text>
                </View>
              </View>

              {i < trace.length - 1 && <View style={styles.divider} />}
            </View>
          ))
        )}
      </ScrollView>

      {trace.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Text style={styles.exportText}>📤 Export Logs</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: C.navy },
  header:         { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: C.navy, borderBottomWidth: 1, borderBottomColor: 'rgba(211,199,184,0.15)' },
  backButton:     { width: 40, height: 40, justifyContent: 'center', marginRight: 4 },
  backIcon:       { fontSize: 24, fontWeight: '700', color: C.cream },
  headerTitle:    { fontSize: 19, fontWeight: '800', color: C.cream },
  headerSubtitle: { fontSize: 12, color: C.warmGrey, fontWeight: '600', marginTop: 2 },
  updateTime:     { fontSize: 10, color: C.steel, fontWeight: '800' },
  scrollContent:  { padding: 20, paddingBottom: 40 },
  emptyState:     { alignItems: 'center', marginTop: 100 },
  emptyEmoji:     { fontSize: 56, marginBottom: 16 },
  emptyText:      { color: C.cream, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptySub:       { color: C.warmGrey, fontSize: 14, marginTop: 8, textAlign: 'center' },
  logEntry:       { marginBottom: 20 },
  logHeader:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  timestamp:      { color: C.steel, fontFamily: 'monospace', fontSize: 12, marginRight: 10 },
  logIcon:        { fontSize: 16, marginRight: 8 },
  logTitle:       { color: C.cream, fontSize: 13, fontWeight: '800', letterSpacing: 0.8, flex: 1 },
  logDetails:     { paddingLeft: 20, borderLeftWidth: 2, borderLeftColor: C.steel, paddingVertical: 4 },
  detailRow:      { flexDirection: 'row', marginBottom: 6, flexWrap: 'wrap' },
  detailLabel:    { color: C.warmGrey, fontSize: 12, fontWeight: '700', width: 60 },
  detailTool:     { color: C.steel, fontSize: 12, fontWeight: '800', fontFamily: 'monospace' },
  detailValue:    { color: 'rgba(243,234,224,0.8)', fontSize: 12, flex: 1, fontFamily: 'monospace' },
  statusText:     { color: '#6bbf8e', fontSize: 12, fontWeight: '800' },
  divider:        { height: 1, backgroundColor: 'rgba(211,199,184,0.12)', marginTop: 20 },
  footer:         { padding: 20, backgroundColor: C.navy, borderTopWidth: 1, borderTopColor: 'rgba(211,199,184,0.12)' },
  exportButton:   { backgroundColor: C.steel, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  exportText:     { color: C.cream, fontSize: 14, fontWeight: '700' },
});
