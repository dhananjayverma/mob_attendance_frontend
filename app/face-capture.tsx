import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const OVAL_W = 300;
const OVAL_H = 420;

export default function FaceCaptureScreen() {
  const router = useRouter();
  const { markAttendance } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [captured, setCaptured] = useState(false);
  const [capturedUri, setCapturedUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cameraRef = useRef<CameraView>(null);

  async function handleCapture() {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      if (!photo?.uri) throw new Error('Photo capture failed. Please try again.');

      const isLargeDataUri = typeof photo.uri === 'string' && photo.uri.startsWith('data:');
      const safeUri = isLargeDataUri ? '' : photo.uri;
      await markAttendance({ faceCaptured: true, facePhotoUri: safeUri });

      setCapturedUri(photo.uri || '');
      setCaptured(true);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Could not capture image. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!permission) return <View style={styles.screen} />;

  if (!permission.granted) {
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.backSafe}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1B2236" />
          </Pressable>
        </SafeAreaView>

        <View style={styles.sheet}>
          <Text allowFontScaling={false} style={styles.sheetTitle}>Camera access needed</Text>
          <Text allowFontScaling={false} style={styles.sheetSubtext}>Allow camera access to capture your face for attendance.</Text>
          <Pressable style={styles.primaryBtn} onPress={requestPermission}>
            <Text allowFontScaling={false} style={styles.primaryBtnText}>Grant Permission</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {captured && capturedUri ? (
        <>
          <Image source={{ uri: capturedUri }} style={styles.camera} resizeMode="cover" />
          <View style={styles.captureOverlay} />
          <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="contain" />
        </>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="front" />
      )}

      <SafeAreaView style={styles.backSafe}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1B2236" />
        </Pressable>
      </SafeAreaView>

      <View style={[styles.ovalWrap, { pointerEvents: 'none' }]}>
        <View style={styles.ovalBorder} />
      </View>

      {!captured ? (
        <View style={styles.sheet}>
          <Text allowFontScaling={false} style={styles.sheetHint}>Align your face in the oval and capture</Text>
          {!!error && <Text allowFontScaling={false} style={styles.errorText}>{error}</Text>}
          <Pressable style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleCapture} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text allowFontScaling={false} style={styles.primaryBtnText}>Capture</Text>}
          </Pressable>
        </View>
      ) : (
        <View style={styles.successSheet}>
          <View style={styles.floatingBadge}>
            <Ionicons name="ribbon" size={56} color="#FFFFFF" />
            <Ionicons name="checkmark" size={28} color="#6A50EF" style={styles.badgeTick} />
          </View>
          <Text allowFontScaling={false} style={styles.successTitle}>Attendance marked!</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.replace('/mark-attendance')}>
            <Text allowFontScaling={false} style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  captureOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },

  backSafe: { position: 'absolute', top: 0, left: 0, right: 0 },
  backBtn: {
    marginLeft: 18,
    marginTop: 8,
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.4,
    borderColor: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ovalWrap: {
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  ovalBorder: {
    width: OVAL_W,
    height: OVAL_H,
    borderRadius: OVAL_W / 1.4,
    borderWidth: 1.2,
    borderColor: 'rgba(35,35,35,0.95)',
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },

  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F6F7F9',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    gap: 12,
    minHeight: 160,
  },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#1C2432', textAlign: 'center' },
  sheetSubtext: { fontSize: 14, color: '#5F6E84', textAlign: 'center', lineHeight: 20 },
  sheetHint: { fontSize: 14, color: '#2B3443', textAlign: 'center', fontWeight: '600' },

  successSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F6F7F9',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 82,
    paddingBottom: 24,
    gap: 20,
    minHeight: 300,
    alignItems: 'center',
  },
  floatingBadge: {
    position: 'absolute',
    top: -34,
    width: 132,
    height: 132,
    borderRadius: 28,
    backgroundColor: '#6A50EF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6A50EF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
  badgeTick: { position: 'absolute' },
  successTitle: { fontSize: 38, fontWeight: '700', color: '#1B2433', textAlign: 'center' },

  errorText: { fontSize: 13, color: '#C03744', textAlign: 'center' },
  primaryBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#6A50EF',
    borderWidth: 1,
    borderColor: '#7C68FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6A50EF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryBtnDisabled: { opacity: 0.75 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});
