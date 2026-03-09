import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBottomNav from '../components/AppBottomNav';
import { useApp } from '../context/AppContext';
import { ConversationItem, getConversations } from '../services/api';

export default function MessagesScreen() {
  const router = useRouter();
  const { authToken } = useApp();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadConversations = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      setConversations([]);
      setError('Please sign in to view messages');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getConversations(authToken);
      setConversations(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1B2236" />
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {loading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator size="small" color="#6439FF" />
            <Text style={styles.stateText}>Loading messages...</Text>
          </View>
        ) : error ? (
          <View style={styles.stateWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={loadConversations}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.stateWrap}>
            <Text style={styles.stateText}>No conversations found</Text>
          </View>
        ) : (
          conversations.map((c) => (
            <Pressable
              key={c.id}
              style={styles.row}
              onPress={() => router.push({ pathname: '/chat', params: { id: c.id } })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{c.avatar}</Text>
              </View>
              <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                  <Text style={styles.name}>{c.name}</Text>
                  <Text style={styles.time}>{c.time}</Text>
                </View>
                <View style={styles.rowBottom}>
                  <Text style={[styles.lastMsg, c.unread > 0 && styles.lastMsgBold]} numberOfLines={1}>
                    {c.lastMessage || 'No messages yet'}
                  </Text>
                  {c.unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{c.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
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
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1B2236' },

  list: { paddingHorizontal: 20, paddingBottom: 14, gap: 4 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14,
    elevation: 1,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: '#6439FF' },

  rowContent: { flex: 1, gap: 4 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: '#1B2236' },
  time: { fontSize: 12, color: '#B0B8C9' },

  rowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lastMsg: { fontSize: 13, color: '#667189', flex: 1 },
  lastMsgBold: { fontWeight: '600', color: '#1B2236' },

  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: '#6439FF', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  stateWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  stateText: { fontSize: 14, color: '#667189' },
  errorText: { fontSize: 14, color: '#C03744', textAlign: 'center' },
  retryBtn: { backgroundColor: '#6439FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  retryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
