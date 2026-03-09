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
  TextInputProps,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

function Field({
  label, icon, placeholder, value, onChangeText,
  secureTextEntry, keyboardType, autoCapitalize, error, rightElement, maxLength,
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
          <Ionicons name={icon} size={17} color={focused ? '#6439FF' : '#98A2B3'} style={styles.inputIcon} />
        </View>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9BA4B5"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'words'}
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

export default function SignUpScreen() {
  const router = useRouter();
  const { register } = useApp();

  const [name, setName] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function clearError(key: string) {
    setErrors((p) => ({ ...p, [key]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Enter your full name (min 2 chars)';
    if (!collegeId.trim()) e.collegeId = 'College ID is required';
    else if (!/^[A-Z0-9]{6,20}$/.test(collegeId.trim())) e.collegeId = 'Use 6-20 letters/numbers only';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email address';
    if (!phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(phone.trim())) e.phone = 'Enter a valid 10-digit phone number';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }

  async function handleSignUp() {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setServerError('');
    setLoading(true);
    const result = await register(name.trim(), collegeId.trim(), email.trim(), password, phone.trim());
    setLoading(false);
    if (result.success) {
      router.replace('/sign-in');
    } else {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={30} color="#6439FF" />
          </View>
          <Text allowFontScaling={false} style={styles.title}>Create Account</Text>
          <Text allowFontScaling={false} style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.formCard}>
          {!!serverError && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#D32F2F" />
              <Text allowFontScaling={false} style={styles.errorText}>{serverError}</Text>
            </View>
          )}

          <Field
            label="Full Name"
            icon="person-outline"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(v) => { setName(v); clearError('name'); }}
            autoCapitalize="words"
            error={errors.name}
          />

          <Field
            label="College ID"
            icon="school-outline"
            placeholder="e.g. SDD23BD0025"
            value={collegeId}
            onChangeText={(v) => {
              setCollegeId(v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
              clearError('collegeId');
            }}
            autoCapitalize="characters"
            error={errors.collegeId}
            maxLength={20}
          />

          <Field
            label="Email Address"
            icon="mail-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={(v) => { setEmail(v.trim()); clearError('email'); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Field
            label="Phone Number"
            icon="call-outline"
            placeholder="10-digit phone number"
            value={phone}
            onChangeText={(v) => {
              setPhone(v.replace(/\D/g, '').slice(0, 10));
              clearError('phone');
            }}
            keyboardType="phone-pad"
            autoCapitalize="none"
            error={errors.phone}
            maxLength={10}
          />

          <Field
            label="Password"
            icon="lock-closed-outline"
            placeholder="Min 6 characters"
            value={password}
            onChangeText={(v) => { setPassword(v); clearError('password'); }}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            error={errors.password}
            rightElement={
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeBtn}>
                <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#98A2B3" />
              </Pressable>
            }
          />

          <Field
            label="Confirm Password"
            icon="shield-checkmark-outline"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
            secureTextEntry={!confirmVisible}
            autoCapitalize="none"
            error={errors.confirmPassword}
            rightElement={
              <Pressable onPress={() => setConfirmVisible(!confirmVisible)} style={styles.eyeBtn}>
                <Ionicons name={confirmVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#98A2B3" />
              </Pressable>
            }
          />

          <Text allowFontScaling={false} style={styles.helperText}>Password must be at least 6 characters</Text>

          <Pressable
            style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <View style={styles.primaryBtnGlow} />
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text allowFontScaling={false} style={styles.primaryBtnText}>Create Account</Text>
            }
          </Pressable>
        </View>

        <View style={styles.footerRow}>
          <Text allowFontScaling={false} style={styles.footerText}>Already have an account?</Text>
          <Pressable onPress={() => router.replace('/sign-in')}>
            <Text allowFontScaling={false} style={styles.footerLink}>Sign in</Text>
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
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
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
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFF0F0', borderRadius: 12, padding: 12,
    marginBottom: 20, borderWidth: 1, borderColor: '#FFCDD2',
  },
  errorText: { color: '#D32F2F', fontSize: 13, flex: 1 },

  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#1B2236', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E2E6EF', borderRadius: 16,
    paddingHorizontal: 10, height: 56, backgroundColor: '#FAFBFF',
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
  inputIcon: { marginRight: 0 },
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
  helperText: { color: '#7A859A', fontSize: 12, marginTop: 4, marginBottom: 10 },

  primaryBtn: {
    overflow: 'hidden',
    height: 56, borderRadius: 28, backgroundColor: '#6439FF',
    borderWidth: 1, borderColor: '#7252FF',
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, marginTop: 2, marginBottom: 8,
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
  footerRow: { marginTop: 16, flexDirection: 'row', alignSelf: 'center', gap: 4 },
  footerText: { fontSize: 13, color: '#667189' },
  footerLink: { fontSize: 13, fontWeight: '700', color: '#6439FF' },
});
