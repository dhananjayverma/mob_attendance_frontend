import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBottomNav from '../components/AppBottomNav';
import { useApp } from '../context/AppContext';
import { getNotifications, markNotificationRead, NotificationItem } from '../services/api';

function displayTime(dateISO: string) {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
    new Date(dateISO)
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { authToken } = useApp();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      setNotifications([]);
      setError('Please sign in to view notifications');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getNotifications(authToken);
      setNotifications(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function onOpenNotification(item: NotificationItem) {
    if (!authToken || item.read) return;
    try {
      const updated = await markNotificationRead(authToken, item.id);
      setNotifications((prev) => prev.map((n) => (n.id === item.id ? updated : n)));
    } catch {}
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1B2236" />
        </Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {loading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator size="small" color="#6439FF" />
            <Text style={styles.stateText}>Loading notifications...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={loadNotifications}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateText}>No notifications found</Text>
          </View>
        ) : (
          notifications.map((n) => (
            <Pressable key={n.id} style={[styles.card, !n.read && styles.cardUnread]} onPress={() => onOpenNotification(n)}>
              <View style={[styles.iconBox, !n.read && styles.iconBoxUnread]}>
                <Ionicons name="document-text-outline" size={22} color={n.read ? '#9CA3AF' : '#6439FF'} />
              </View>
              <View style={styles.content}>
                <View style={styles.topRow}>
                  <Text style={[styles.title, !n.read && styles.titleUnread]} numberOfLines={1}>
                    {n.title}
                  </Text>
                  <Text style={styles.time}>{displayTime(n.createdAt)}</Text>
                </View>
                <Text style={styles.body} numberOfLines={2}>
                  {n.body}
                </Text>
              </View>
              {!n.read && <View style={styles.dot} />}
            </Pressable>
          ))
        )}
      </ScrollView>
      <AppBottomNav active="records" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F8' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
    backgroundColor: '#F2F3F8',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1B2236' },

  list: { paddingHorizontal: 20, paddingBottom: 14, gap: 12 },

  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    elevation: 1,
  },
  cardUnread: { backgroundColor: '#FAFAFF', elevation: 2 },

  iconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#F0F0F5', alignItems: 'center', justifyContent: 'center',
  },
  iconBoxUnread: { backgroundColor: '#EEF0FF' },

  content: { flex: 1, gap: 4 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 14, fontWeight: '600', color: '#667189', flex: 1, marginRight: 8 },
  titleUnread: { color: '#1B2236', fontWeight: '700' },
  time: { fontSize: 12, color: '#B0B8C9' },
  body: { fontSize: 13, color: '#667189', lineHeight: 18 },
  stateWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  stateText: { fontSize: 14, color: '#667189' },
  errorText: { fontSize: 14, color: '#C03744', textAlign: 'center' },
  retryBtn: { backgroundColor: '#6439FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  retryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#6439FF', marginTop: 4,
  },
});
