import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { ChatConversation, ChatMessage, getConversationMessages, sendConversationMessage } from '../services/api';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { authToken } = useApp();
  const scrollRef = useRef<ScrollView>(null);

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const loadConversation = useCallback(async () => {
    if (!authToken || !id) {
      setLoading(false);
      setMessages([]);
      setError('Conversation not available');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getConversationMessages(authToken, id);
      setConversation(data.conversation);
      setMessages(data.messages);
    } catch (e: any) {
      setError(e.message || 'Failed to load chat');
    } finally {
      setLoading(false);
    }
  }, [authToken, id]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  async function sendMessage() {
    const trimmed = text.trim();
    if (!trimmed || !authToken || !id || sending) return;

    setSending(true);
    try {
      const message = await sendConversationMessage(authToken, id, trimmed);
      setMessages((prev) => [...prev, message]);
      setText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      setError(e.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1B2236" />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{conversation?.avatar || '?'}</Text>
          </View>
          <Text style={styles.headerName}>{conversation?.name || 'Chat'}</Text>
        </View>
        <Pressable style={styles.backBtn}>
          <Ionicons name="call-outline" size={20} color="#6439FF" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesArea}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {loading ? (
            <View style={styles.stateWrap}>
              <ActivityIndicator size="small" color="#6439FF" />
              <Text style={styles.stateText}>Loading chat...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateWrap}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryBtn} onPress={loadConversation}>
                <Text style={styles.retryText}>Retry</Text>
              </Pressable>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.stateWrap}>
              <Text style={styles.stateText}>No messages yet</Text>
            </View>
          ) : (
            messages.map((msg) => (
              <View key={msg.id} style={[styles.bubble, msg.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, msg.fromMe && styles.bubbleTextMe]}>{msg.text}</Text>
                <Text style={[styles.bubbleTime, msg.fromMe && styles.bubbleTimeMe]}>{msg.time}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#B0B8C9"
              value={text}
              onChangeText={setText}
              multiline
            />
            <Pressable style={styles.inputIcon}>
              <Ionicons name="attach-outline" size={22} color="#B0B8C9" />
            </Pressable>
            <Pressable style={styles.inputIcon}>
              <Ionicons name="camera-outline" size={22} color="#B0B8C9" />
            </Pressable>
          </View>
          <Pressable style={styles.sendBtn} onPress={sendMessage} disabled={sending}>
            <Ionicons name={text.trim() ? 'send' : 'mic-outline'} size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F3F8' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12,
    backgroundColor: '#FFFFFF', elevation: 2,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: '#F2F3F8',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 16, fontWeight: '800', color: '#6439FF' },
  headerName: { fontSize: 16, fontWeight: '700', color: '#1B2236' },

  messagesArea: { flex: 1 },
  messagesList: { padding: 16, gap: 10 },

  bubble: {
    maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10,
    gap: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start', backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4, elevation: 1,
  },
  bubbleMe: {
    alignSelf: 'flex-end', backgroundColor: '#6439FF',
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, color: '#1B2236', lineHeight: 20 },
  bubbleTextMe: { color: '#FFFFFF' },
  bubbleTime: { fontSize: 11, color: '#B0B8C9', alignSelf: 'flex-end' },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.65)' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF', elevation: 4,
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F2F3F8', borderRadius: 24,
    paddingHorizontal: 14, paddingVertical: 8, gap: 4, minHeight: 46,
  },
  input: {
    flex: 1, fontSize: 14, color: '#1B2236', maxHeight: 100,
    outlineWidth: 0,
  } as any,
  inputIcon: { padding: 2 },

  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#6439FF', alignItems: 'center', justifyContent: 'center',
    elevation: 3,
  },

  stateWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 10 },
  stateText: { fontSize: 14, color: '#667189' },
  errorText: { fontSize: 14, color: '#C03744', textAlign: 'center' },
  retryBtn: { backgroundColor: '#6439FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  retryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
});
