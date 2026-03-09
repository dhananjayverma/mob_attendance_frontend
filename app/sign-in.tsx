import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

function Field({
  label, icon, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, autoCapitalize, error,
  rightElement, maxLength,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  error?: string;
  rightElement?: React.ReactNode;
  maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldGroup}>
      <Text allowFontScaling={false} style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused, !!error && styles.inputWrapError]}>
        <View style={[styles.iconBox, focused && styles.iconBoxFocused]}>
          <Ionicons name={icon} size={17} color={focused ? '#6439FF' : '#98A2B3'} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9BA4B5"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement}
      </View>
      {!!error && <Text allowFontScaling={false} style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

export default function SignInScreen() {
  const router = useRouter();
  const { login, loginWithCollegeId, loginWithPhone } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [altMode, setAltMode] = useState<'college' | 'phone' | null>(null);
  const [altId, setAltId] = useState('');

  function validate() {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    return e;
  }

  function validateAlt() {
    const e: Record<string, string> = {};
    if (!altId.trim()) {
      e.altId = altMode === 'college' ? 'College ID is required' : 'Phone number is required';
    } else if (altMode === 'phone' && !/^\d{10}$/.test(altId.trim())) {
      e.altId = 'Enter a valid 10-digit phone number';
    } else if (altMode === 'college' && !/^[A-Z0-9]{6,20}$/.test(altId.trim())) {
      e.altId = 'Use 6-20 letters/numbers only';
    }
    return e;
  }

  async function handleSignIn() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setServerError('');
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.success) router.replace('/dashboard');
    else setServerError(result.error || 'Login failed. Please try again.');
  }

  async function handleAltSignIn() {
    const e = validateAlt();
    setErrors(e);
    if (Object.keys(e).length) return;
    setServerError('');
    setLoading(true);
    const result = altMode === 'college'
      ? await loginWithCollegeId(altId.trim())
      : await loginWithPhone(altId.trim());
    setLoading(false);
    if (result.success) router.replace('/dashboard');
    else setServerError(result.error || 'Login failed. Please try again.');
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="school" size={32} color="#6439FF" />
          </View>
          <Text allowFontScaling={false} style={styles.title}>Welcome Back</Text>
          <Text allowFontScaling={false} style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formCard}>
          {!!serverError && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#D32F2F" />
              <Text allowFontScaling={false} style={styles.errorText}>{serverError}</Text>
            </View>
          )}

          {altMode === null && (
            <>
              <Field
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email"
                value={email}
                onChangeText={(v) => { setEmail(v.trim()); setErrors((p) => ({ ...p, email: '' })); }}
                keyboardType="email-address"
                error={errors.email}
              />

              <Field
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password"
                value={password}
                onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })); }}
                secureTextEntry={!passwordVisible}
                error={errors.password}
                rightElement={(
                  <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeBtn}>
                    <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#98A2B3" />
                  </Pressable>
                )}
              />

              <Pressable style={styles.forgotRow}>
                <Text allowFontScaling={false} style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              <Pressable style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={handleSignIn} disabled={loading}>
                <View style={styles.primaryBtnGlow} />
                {loading ? <ActivityIndicator color="#fff" /> : <Text allowFontScaling={false} style={styles.primaryBtnText}>Sign In</Text>}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text allowFontScaling={false} style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>
            </>
          )}

          <Pressable
            style={[styles.outlineBtn, altMode === 'college' && styles.outlineBtnActive]}
            onPress={() => { setAltMode(altMode === 'college' ? null : 'college'); setAltId(''); setErrors({}); setServerError(''); }}
          >
            <Ionicons name="school-outline" size={20} color={altMode === 'college' ? '#FFFFFF' : '#6439FF'} />
            <Text allowFontScaling={false} style={[styles.outlineBtnText, altMode === 'college' && { color: '#FFFFFF' }]}>
              Sign in With College ID
            </Text>
          </Pressable>

          {altMode === 'college' && (
            <View style={styles.altForm}>
              <Field
                label="College ID"
                icon="school-outline"
                placeholder="e.g. SDD23BD0025"
                value={altId}
                onChangeText={(v) => { setAltId(v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()); setErrors((p) => ({ ...p, altId: '' })); }}
                autoCapitalize="characters"
                error={errors.altId}
                maxLength={20}
              />
              <Pressable style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={handleAltSignIn} disabled={loading}>
                <View style={styles.primaryBtnGlow} />
                {loading ? <ActivityIndicator color="#fff" /> : <Text allowFontScaling={false} style={styles.primaryBtnText}>Sign In</Text>}
              </Pressable>
            </View>
          )}

          <Pressable
            style={[styles.outlineBtn, { marginTop: 12 }, altMode === 'phone' && styles.outlineBtnActive]}
            onPress={() => { setAltMode(altMode === 'phone' ? null : 'phone'); setAltId(''); setErrors({}); setServerError(''); }}
          >
            <Ionicons name="call-outline" size={20} color={altMode === 'phone' ? '#FFFFFF' : '#6439FF'} />
            <Text allowFontScaling={false} style={[styles.outlineBtnText, altMode === 'phone' && { color: '#FFFFFF' }]}>
              Sign in With Phone
            </Text>
          </Pressable>

          {altMode === 'phone' && (
            <View style={styles.altForm}>
              <Field
                label="Phone Number"
                icon="call-outline"
                placeholder="10-digit phone number"
                value={altId}
                onChangeText={(v) => { setAltId(v.replace(/\D/g, '').slice(0, 10)); setErrors((p) => ({ ...p, altId: '' })); }}
                keyboardType="phone-pad"
                error={errors.altId}
                maxLength={10}
              />
              <Pressable style={[styles.primaryBtn, loading && { opacity: 0.7 }]} onPress={handleAltSignIn} disabled={loading}>
                <View style={styles.primaryBtnGlow} />
                {loading ? <ActivityIndicator color="#fff" /> : <Text allowFontScaling={false} style={styles.primaryBtnText}>Sign In</Text>}
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text allowFontScaling={false} style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.back()}>
            <Text allowFontScaling={false} style={styles.footerLink}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F6FC' },
  container: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },

  header: { alignItems: 'center', marginBottom: 28 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1B2236' },
  subtitle: { fontSize: 14, color: '#667189', marginTop: 4 },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9EDF5',
    elevation: 3,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: { color: '#D32F2F', fontSize: 13, flex: 1 },

  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#1B2236', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E6EF',
    borderRadius: 16,
    paddingHorizontal: 10,
    height: 56,
    backgroundColor: '#FAFBFF',
  },
  inputWrapFocused: { borderColor: '#6439FF', backgroundColor: '#FFFFFF' },
  inputWrapError: { borderColor: '#E84545' },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F4FB',
    marginRight: 10,
  },
  iconBoxFocused: { backgroundColor: '#EEE8FF' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1B2236',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    outlineWidth: 0,
    outlineStyle: 'none',
    outlineColor: 'transparent',
  } as any,
  eyeBtn: { padding: 4 },
  fieldError: { fontSize: 12, color: '#E84545', marginTop: 5, marginLeft: 4 },

  forgotRow: { alignItems: 'flex-end', marginBottom: 18, marginTop: -2 },
  forgotText: { fontSize: 13, color: '#6439FF', fontWeight: '700' },

  primaryBtn: {
    overflow: 'hidden',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6439FF',
    borderWidth: 1,
    borderColor: '#7252FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    marginBottom: 18,
  },
  primaryBtnGlow: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(186,166,255,0.35)',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E5F1' },
  dividerText: { fontSize: 13, color: '#98A2B3', fontWeight: '700' },

  outlineBtn: {
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: '#6439FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  outlineBtnActive: { backgroundColor: '#6439FF', borderColor: '#6439FF' },
  outlineBtnText: { fontSize: 15, fontWeight: '700', color: '#6439FF' },
  altForm: { marginTop: 16, gap: 4 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  footerText: { fontSize: 14, color: '#667189' },
  footerLink: { fontSize: 14, fontWeight: '700', color: '#6439FF' },
});
