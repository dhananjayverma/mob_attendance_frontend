import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBottomNav from '../components/AppBottomNav';
import { useApp } from '../context/AppContext';

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const { records, todayHours, refreshData } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [openingCamera, setOpeningCamera] = useState(false);

  const loadPage = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshData]);

  useFocusEffect(
    useCallback(() => {
      loadPage();
    }, [loadPage])
  );

  function openFaceCapture() {
    if (openingCamera) return;
    setOpeningCamera(true);
    router.push('/face-capture');
    setTimeout(() => setOpeningCamera(false), 450);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.headerBg}>
        <View style={styles.headerBaseShade} />
        <View style={styles.headerGlow} />
      </View>

      <View style={styles.headerContent}>
        <Text allowFontScaling={false} style={styles.headerTitle}>Mark attendance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hoursCard}>
          <Text allowFontScaling={false} style={styles.hoursCardTitle}>Hours spent today</Text>

          <View style={styles.hoursBoxRow}>
            <View style={styles.hoursBox}>
              <View style={styles.hoursLabelRow}>
                <View style={styles.clockIcon} />
                <Text allowFontScaling={false} style={styles.hoursLabel}>Completed</Text>
              </View>
              <Text allowFontScaling={false} style={styles.hoursValue}>{String(todayHours.completed).padStart(2, '0')}:00 Hrs</Text>
            </View>

            <View style={styles.hoursBox}>
              <View style={styles.hoursLabelRow}>
                <View style={styles.clockIcon} />
                <Text allowFontScaling={false} style={styles.hoursLabel}>Total</Text>
              </View>
              <Text allowFontScaling={false} style={styles.hoursValue}>{String(todayHours.total).padStart(2, '0')}:00 Hrs</Text>
            </View>
          </View>

          <Pressable style={[styles.markButton, openingCamera && styles.markButtonDisabled]} onPress={openFaceCapture} disabled={openingCamera}>
            <View style={styles.markButtonBaseShade} />
            <View style={styles.markButtonHighlight} />
            {openingCamera ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text allowFontScaling={false} style={styles.markButtonText}>Mark attendance</Text>
            )}
          </Pressable>
        </View>

        {refreshing && records.length === 0 ? (
          <View style={styles.emptyBox}>
            <ActivityIndicator color="#7B6CF6" />
            <Text allowFontScaling={false} style={styles.emptyText}>Loading records...</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text allowFontScaling={false} style={styles.emptyText}>No attendance records yet</Text>
          </View>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.recordCard}>
              <Text allowFontScaling={false} style={styles.recordDate}>{record.date}</Text>
              <View style={styles.recordInner}>
                <View style={styles.recordCol}>
                  <Text allowFontScaling={false} style={styles.recordLabel}>Total Hours</Text>
                  <Text allowFontScaling={false} style={styles.recordValue}>{record.hours}</Text>
                </View>
                <View style={styles.recordColDivider} />
                <View style={styles.recordCol}>
                  <Text allowFontScaling={false} style={styles.recordLabel}>Clock in &amp; Out</Text>
                  <Text allowFontScaling={false} style={styles.recordValue}>{record.clockIn} - {record.clockOut}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AppBottomNav active="calendar" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ECEEF3' },

  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#6B4EF4',
    height: 210,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerBaseShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#6D53FF',
  },
  headerGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    top: -124,
    right: -96,
    backgroundColor: 'rgba(170,150,255,0.34)',
  },
  headerContent: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 20,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', letterSpacing: 0.2 },

  container: { paddingTop: 28, paddingHorizontal: 8, paddingBottom: 20, gap: 14 },

  hoursCard: {
    backgroundColor: '#F7F8FA', borderRadius: 10, padding: 16, gap: 14,
    borderWidth: 1, borderColor: '#E4E8EE',
  },
  hoursCardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2532' },
  hoursBoxRow: { flexDirection: 'row', gap: 12 },
  hoursBox: {
    flex: 1, backgroundColor: '#F7F8FA', borderRadius: 12,
    borderWidth: 1, borderColor: '#D9DEE7',
    paddingVertical: 12, paddingHorizontal: 12, gap: 8,
    minHeight: 110,
  },
  hoursLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clockIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#C5CBD7',
    borderWidth: 2,
    borderColor: '#C5CBD7',
  },
  hoursLabel: { fontSize: 13, color: '#4A5970', fontWeight: '500' },
  hoursValue: { fontSize: 22, fontWeight: '500', color: '#1E2533' },
  markButton: {
    overflow: 'hidden',
    height: 56, borderRadius: 28, backgroundColor: '#6848F0',
    borderWidth: 1, borderColor: '#7B68FF',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 16px rgba(92,63,232,0.4)', elevation: 5,
  },
  markButtonBaseShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: '#6439FF',
  },
  markButtonHighlight: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(188,168,255,0.42)',
  },
  markButtonDisabled: { opacity: 0.75 },
  markButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  emptyBox: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  emptyText: { color: '#667189', fontSize: 14 },

  recordCard: {
    backgroundColor: '#F7F8FA', borderRadius: 10, padding: 18, gap: 12,
    borderWidth: 1, borderColor: '#E2E6ED',
  },
  recordDate: { fontSize: 15, fontWeight: '700', color: '#1E2634' },
  recordInner: {
    flexDirection: 'row', borderWidth: 1, borderColor: '#D8DDE6',
    borderRadius: 12, overflow: 'hidden',
  },
  recordCol: { flex: 1, paddingVertical: 11, paddingHorizontal: 12, gap: 5 },
  recordColDivider: { width: 1, backgroundColor: '#D8DDE6' },
  recordLabel: { fontSize: 11, color: '#4E5D72', fontWeight: '500' },
  recordValue: { fontSize: 14, fontWeight: '700', color: '#3A465C' },
});
