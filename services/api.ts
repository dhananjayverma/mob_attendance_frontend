const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

export type User              = { id: string; name: string; email: string };
export type Subject           = { id: string; name: string; time: string; status: 'completed' | 'in-progress'; progress?: number };
export type AttendanceRecord  = {
  id: string;
  date: string;
  hours: string;
  clockIn: string;
  clockOut: string;
  faceCaptured?: boolean;
  facePhotoUri?: string;
  faceCapturedAt?: string;
};
export type AttendanceSummary = { total: number; attended: number; percentage: number };
export type TodayHours        = { completed: number; total: number };
export type NotificationItem  = { id: string; title: string; body: string; read: boolean; createdAt: string };
export type ConversationItem  = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
};
export type ChatMessage = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
  createdAt: string;
};
export type ChatConversation = { id: string; name: string; avatar: string };

async function request<T>(method: string, path: string, token?: string, body?: object): Promise<T> {
  if (!BASE_URL || !/^https?:\/\//i.test(BASE_URL)) {
    throw new Error('API URL is missing/invalid. Set EXPO_PUBLIC_API_URL in myApp/.env');
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const raw = await res.text();
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(
      `Non-JSON response from ${BASE_URL}${path}. Check backend server and EXPO_PUBLIC_API_URL.`
    );
  }

  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  return data as T;
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const data = await request<{ success: boolean; token: string; user: User }>(
      'POST', '/api/auth/login', undefined, { email, password },
    );
    return { success: true, user: data.user, token: data.token };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function register(
  name: string,
  collegeId: string,
  email: string,
  password: string,
  phone?: string,
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const data = await request<{ success: boolean; token: string; user: User }>(
      'POST', '/api/auth/register', undefined, { name, collegeId, email, phone, password },
    );
    return { success: true, user: data.user, token: data.token };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function loginWithCollegeId(
  collegeId: string,
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const data = await request<{ success: boolean; token: string; user: User }>(
      'POST', '/api/auth/login-college', undefined, { collegeId },
    );
    return { success: true, user: data.user, token: data.token };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function loginWithPhone(
  phone: string,
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const data = await request<{ success: boolean; token: string; user: User }>(
      'POST', '/api/auth/login-phone', undefined, { phone },
    );
    return { success: true, user: data.user, token: data.token };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getSubjects(token: string): Promise<Subject[]> {
  const data = await request<{ success: boolean; subjects: Subject[] }>('GET', '/api/attendance/subjects', token);
  return data.subjects;
}

export async function getAttendanceSummary(token: string): Promise<AttendanceSummary> {
  const data = await request<{ success: boolean; summary: AttendanceSummary }>('GET', '/api/attendance/summary', token);
  return data.summary;
}

export async function getAttendanceRecords(token: string): Promise<AttendanceRecord[]> {
  const data = await request<{ success: boolean; records: AttendanceRecord[] }>('GET', '/api/attendance/records', token);
  return data.records;
}

export async function getTodayHours(token: string): Promise<TodayHours> {
  const data = await request<{ success: boolean; completed: number; total: number }>('GET', '/api/attendance/today-hours', token);
  return { completed: data.completed, total: data.total };
}

export async function markAttendance(
  token: string,
  payload?: { faceCaptured?: boolean; facePhotoUri?: string }
): Promise<AttendanceRecord> {
  const data = await request<{ success: boolean; record: AttendanceRecord }>(
    'POST',
    '/api/attendance/mark',
    token,
    payload
  );
  return data.record;
}

export async function getNotifications(token: string): Promise<NotificationItem[]> {
  const data = await request<{ success: boolean; notifications: NotificationItem[] }>(
    'GET',
    '/api/notifications',
    token
  );
  return data.notifications;
}

export async function markNotificationRead(token: string, notificationId: string): Promise<NotificationItem> {
  const data = await request<{ success: boolean; notification: NotificationItem }>(
    'PATCH',
    `/api/notifications/${notificationId}/read`,
    token
  );
  return data.notification;
}

export async function getConversations(token: string): Promise<ConversationItem[]> {
  const data = await request<{ success: boolean; conversations: ConversationItem[] }>(
    'GET',
    '/api/messages/conversations',
    token
  );
  return data.conversations;
}

export async function getConversationMessages(
  token: string,
  conversationId: string
): Promise<{ conversation: ChatConversation; messages: ChatMessage[] }> {
  const data = await request<{ success: boolean; conversation: ChatConversation; messages: ChatMessage[] }>(
    'GET',
    `/api/messages/conversations/${conversationId}/messages`,
    token
  );
  return { conversation: data.conversation, messages: data.messages };
}

export async function sendConversationMessage(
  token: string,
  conversationId: string,
  text: string
): Promise<ChatMessage> {
  const data = await request<{ success: boolean; message: ChatMessage }>(
    'POST',
    `/api/messages/conversations/${conversationId}/messages`,
    token,
    { text }
  );
  return data.message;
}
