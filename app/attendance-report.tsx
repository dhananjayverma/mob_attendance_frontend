import { useRouter } from 'expo-router';
import { Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

function Pagination() {
  return (
    <View style={styles.pagination}>
      <View style={styles.dotMuted} />
      <View style={styles.dotMuted} />
      <View style={styles.dotActive} />
    </View>
  );
}

export default function AttendanceReportScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      {/* Hero */}
      <View style={styles.heroSection}>
        <Image
          source={require('../assets/images/new.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* White card */}
      <View style={styles.bottomSection}>
        <View style={styles.copyBlock}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            Get attendance reports
          </Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Vel arcu vestibulum semper tortor rhoncus
            viverra.
          </Text>
          <Pagination />
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.push('/sign-up' as any)}
          >
            <Text style={styles.primaryButtonText}>Sign up</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/sign-in')}
          >
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#A89BF8',
  },
  heroSection: {
    flex: 55,
    backgroundColor: '#A89BF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '90%',
    height: '90%',
  },
  bottomSection: {
    flex: 45,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 36,
    justifyContent: 'space-between',
  },
  copyBlock: {
    alignItems: 'center',
    gap: 14,
  },
  title: {
    color: '#1B2236',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: '#667189',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  dotMuted: {
    width: 22,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#D9DCF1',
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#6D53FF',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#6439FF',
    boxShadow: '0 8px 16px rgba(100,57,255,0.3)',
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#6439FF',
  },
  secondaryButtonText: {
    color: '#6439FF',
    fontSize: 17,
    fontWeight: '700',
  },
});
