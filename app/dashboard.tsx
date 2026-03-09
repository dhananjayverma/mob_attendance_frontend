import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBottomNav from '../components/AppBottomNav';
import { useApp } from '../context/AppContext';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, subjects, refreshData } = useApp();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    refreshData().finally(() => setLoaded(true));
  }, []);

  const safeSubjects = Array.isArray(subjects) ? subjects : [];
  const completed = safeSubjects.filter((s) => s?.status === 'completed');
  const inProgress = safeSubjects.filter((s) => s?.status === 'in-progress');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.topName}>{user?.name ?? 'Student'}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#6357F6" />
            </View>
            <Text style={styles.topId}>{user?.id ?? ''}</Text>
          </View>
          <View style={styles.topActions}>
            <Pressable style={styles.topIconBtn} onPress={() => router.push('/messages')}>
              <Ionicons name="chatbubble" size={16} color="#6357F6" />
            </Pressable>
            <Pressable style={styles.topIconBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications" size={16} color="#6357F6" />
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Attendance Summary</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{completed.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Your schedule for the day</Text>

          {completed.map((s) => (
            <View key={s.id ?? s.name} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.dot} />
                <Text style={styles.name}>{s.name}</Text>
                <View style={styles.timeWrap}>
                  <Ionicons name="time-outline" size={14} color="#B4BBC7" />
                  <Text style={styles.time}>{s.time}</Text>
                </View>
              </View>
              <Pressable style={styles.markBtn} onPress={() => router.push('/face-capture')}>
                <Text style={styles.markText}>Mark</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In-Progress</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{inProgress.length}</Text>
            </View>
          </View>

          {inProgress.map((s) => (
            <View key={s.id ?? s.name} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.dot} />
                <Text style={styles.name}>{s.name}</Text>
              </View>
              <View style={styles.progressChip}>
                <Ionicons name="time-outline" size={12} color="#AEB6C5" />
                <Text style={styles.progressChipText}>In Progress</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, Math.max(0, (s.progress ?? 0) * 100))}%` as any },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {safeSubjects.length === 0 && (
          <View style={styles.empty}>
            {!loaded ? (
              <>
                <ActivityIndicator size="small" color="#6A50EF" />
                <Text style={styles.emptyText}>Loading subjects...</Text>
              </>
            ) : (
              <Text style={styles.emptyText}>No subjects found</Text>
            )}
          </View>
        )}
      </ScrollView>
      <AppBottomNav active="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ECEEF3' },
  container: { padding: 14, gap: 14, paddingBottom: 18 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ECEEF3',
    paddingTop: 4,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topName: { fontSize: 20, fontWeight: '700', color: '#252C37' },
  topId: { marginTop: 6, fontSize: 13, color: '#6357F6', fontWeight: '600' },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCard: {
    borderRadius: 14,
    backgroundColor: '#6B51EE',
    minHeight: 108,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  summaryTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  section: {
    borderRadius: 10,
    backgroundColor: '#F4F5F7',
    padding: 14,
    gap: 12,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 17, color: '#222A36', fontWeight: '700' },
  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E1DCF8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { color: '#6B51EE', fontSize: 13, fontWeight: '700' },
  sectionSubtitle: { color: '#68778D', fontSize: 13 },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE2EA',
    backgroundColor: '#F8F9FB',
    padding: 14,
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#6B51EE' },
  name: { flex: 1, fontSize: 15, fontWeight: '500', color: '#232A36' },
  timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { fontSize: 12, color: '#4A596D', fontWeight: '500' },

  markBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#6B51EE',
    borderRadius: 18,
    minWidth: 86,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  markText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  progressChip: {
    alignSelf: 'flex-start',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E6EAF0',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressChipText: { color: '#5A6B81', fontSize: 13, fontWeight: '600' },
  progressBg: { height: 8, borderRadius: 4, backgroundColor: '#DFE2E8' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: '#6B51EE' },

  empty: { alignItems: 'center', gap: 10, paddingVertical: 24 },
  emptyText: { color: '#657386', fontSize: 14 },
});
