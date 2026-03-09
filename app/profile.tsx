import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppBottomNav from '../components/AppBottomNav';
import { useApp } from '../context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, summary, logout } = useApp();
  const attendancePct = Number(summary?.percentage ?? 0);
  const isGoodStanding = attendancePct >= 75;

  function handleLogout() {
    logout();
    router.replace('/sign-in');
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1B2236" />
          </Pressable>
          <Text allowFontScaling={false} style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text allowFontScaling={false} style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
          </View>
          <Text allowFontScaling={false} style={styles.userName}>{user?.name ?? 'Student'}</Text>
          <Text allowFontScaling={false} style={styles.userId}>{user?.id ?? ''}</Text>
          <View style={[styles.statusPill, isGoodStanding ? styles.goodPill : styles.warnPill]}>
            <View style={[styles.statusDot, isGoodStanding ? styles.goodDot : styles.warnDot]} />
            <Text allowFontScaling={false} style={styles.statusText}>
              {isGoodStanding ? 'Good Standing' : 'Low Attendance'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <InfoRow icon="mail-outline" label="Email" value={user?.email ?? '-'} />
          <InfoRow icon="card-outline" label="College ID" value={user?.id ?? '-'} />
          <InfoRow icon="person-outline" label="Full Name" value={user?.name ?? '-'} />
          <InfoRow icon="stats-chart-outline" label="Attendance" value={`${summary.attended} / ${summary.total} (${summary.percentage}%)`} />
        </View>

        <View style={styles.quickSection}>
          <Text allowFontScaling={false} style={styles.quickTitle}>Quick actions</Text>
          <View style={styles.quickRow}>
            <Pressable style={styles.quickBtn} onPress={() => router.push('/notifications')}>
              <Ionicons name="notifications-outline" size={18} color="#6E55F8" />
              <Text allowFontScaling={false} style={styles.quickText}>Notifications</Text>
            </Pressable>
            <Pressable style={styles.quickBtn} onPress={() => router.push('/messages')}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#6E55F8" />
              <Text allowFontScaling={false} style={styles.quickText}>Messages</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.optionsSection}>
          <Text allowFontScaling={false} style={styles.quickTitle}>Account options</Text>
          <OptionRow icon="home-outline" label="Go to Dashboard" onPress={() => router.push('/dashboard')} />
          <OptionRow icon="calendar-outline" label="Mark Attendance" onPress={() => router.push('/mark-attendance')} />
          <OptionRow icon="receipt-outline" label="Open Messages" onPress={() => router.push('/messages')} />
          <OptionRow icon="shield-checkmark-outline" label="Privacy & Security" />
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text allowFontScaling={false} style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
      <AppBottomNav active="layers" />
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#7B6CF6" />
      </View>
      <View style={styles.infoText}>
        <Text allowFontScaling={false} style={styles.infoLabel}>{label}</Text>
        <Text allowFontScaling={false} style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function OptionRow({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.optionRow} onPress={onPress}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color="#7B6CF6" />
      </View>
      <Text allowFontScaling={false} style={styles.optionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9AA4B7" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F8' },
  container: { paddingHorizontal: 20, paddingTop: 16, gap: 18, paddingBottom: 20 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1B2236' },

  avatarSection: { alignItems: 'center', gap: 6 },
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ECE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#6D53FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  avatarText: { fontSize: 34, fontWeight: '900', color: '#FFFFFF' },
  userName: { fontSize: 30, fontWeight: '800', color: '#1B2236' },
  userId: { fontSize: 13, fontWeight: '600', color: '#7B6CF6' },
  statusPill: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  goodPill: { backgroundColor: '#EBF9F1' },
  warnPill: { backgroundColor: '#FFF3E6' },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  goodDot: { backgroundColor: '#24B26B' },
  warnDot: { backgroundColor: '#D9901A' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#475467' },

  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 6,
    elevation: 2,
    gap: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 12, color: '#667189', fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1B2236' },

  quickSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    gap: 10,
    elevation: 2,
  },
  quickTitle: { fontSize: 14, fontWeight: '800', color: '#1B2236' },
  quickRow: { flexDirection: 'row', gap: 10 },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    backgroundColor: '#F8F9FC',
  },
  quickText: { fontSize: 13, fontWeight: '700', color: '#4F5D78' },

  optionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 8,
    gap: 4,
    elevation: 2,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 12,
  },
  optionLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: '#3D4860' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E84545',
    borderRadius: 16,
    paddingVertical: 15,
    gap: 8,
    marginBottom: 12,
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
