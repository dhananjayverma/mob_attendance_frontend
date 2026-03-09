import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

function Illustration() {
  return (
    <View style={styles.illustrationWrap}>
      <View style={styles.illustrationBackdrop} />
      <View style={[styles.blob, styles.blobGold]} />
      <View style={[styles.blob, styles.blobLavender]} />
      <View style={styles.gearLarge}>
        <View style={styles.gearLargeCore} />
      </View>
      <View style={styles.gearSmall}>
        <View style={styles.gearSmallCore} />
      </View>
      <View style={styles.robotHead}>
        <View style={styles.robotFace}>
          <View style={styles.robotEye} />
          <View style={styles.robotEye} />
        </View>
        <View style={styles.robotEar} />
      </View>
      <View style={styles.robotBody}>
        <View style={styles.robotPanel} />
        <View style={styles.robotArmLeft} />
        <View style={styles.robotArmRight} />
      </View>
      <View style={styles.cloud}>
        <View style={[styles.cloudPuff, styles.cloudPuffLeft]} />
        <View style={[styles.cloudPuff, styles.cloudPuffCenter]} />
        <View style={[styles.cloudPuff, styles.cloudPuffRight]} />
      </View>
      <View style={styles.phoneShadow} />
      <View style={styles.phone}>
        <View style={styles.phoneScreen}>
          <View style={styles.phoneRippleOuter}>
            <View style={styles.phoneRippleInner} />
          </View>
        </View>
      </View>
    </View>
  );
}

function Pagination() {
  return (
    <View style={styles.pagination}>
      <View style={styles.dotMuted} />
      <View style={styles.dotActive} />
      <View style={styles.dotMuted} />
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.heroSection}>
        <Illustration />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.copyBlock}>
          <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>Mark accurate attendance</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Vel arcu vestibulum semper tortor rhoncus
            viverra.
          </Text>
          <Pagination />
        </View>

        <View style={styles.actions}>
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => router.push('/attendance-report')}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#8B7CF8',
  },
  heroSection: {
    flex: 55,
    backgroundColor: '#8B7CF8',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationWrap: {
    width: 370,
    height: 390,
    position: 'relative',
  },
  illustrationBackdrop: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 338,
    height: 338,
    borderRadius: 169,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.9,
  },
  blobGold: {
    width: 118,
    height: 200,
    left: 56,
    top: 28,
    backgroundColor: '#F6B33F',
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 44,
    borderBottomRightRadius: 44,
    transform: [{ rotate: '-10deg' }],
  },
  blobLavender: {
    width: 92,
    height: 240,
    left: 34,
    top: 116,
    backgroundColor: '#C07EE5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 52,
    borderBottomRightRadius: 18,
    transform: [{ rotate: '-14deg' }],
  },
  gearLarge: {
    position: 'absolute',
    top: 46,
    right: 42,
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 14,
    borderColor: '#AAB4C5',
    backgroundColor: '#DDE1EA',
  },
  gearLargeCore: {
    position: 'absolute',
    top: 18,
    left: 18,
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#EFF1F6',
    borderWidth: 8,
    borderColor: '#AAB4C5',
  },
  gearSmall: {
    position: 'absolute',
    right: 74,
    top: 226,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 8,
    borderColor: '#B4BCC8',
    backgroundColor: '#E6E9F0',
  },
  gearSmallCore: {
    position: 'absolute',
    top: 11,
    left: 11,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F4F6FA',
    borderWidth: 4,
    borderColor: '#B4BCC8',
  },
  robotHead: {
    position: 'absolute',
    left: 98,
    top: 88,
    width: 164,
    height: 118,
    borderRadius: 58,
    backgroundColor: '#F6F6F7',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
    elevation: 5,
  },
  robotFace: {
    width: 112,
    height: 48,
    borderRadius: 18,
    backgroundColor: '#33346D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  robotEye: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F6F6F1',
  },
  robotEar: {
    position: 'absolute',
    left: -14,
    top: 34,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#C7CEDA',
  },
  robotBody: {
    position: 'absolute',
    left: 140,
    top: 204,
    width: 88,
    height: 62,
    borderRadius: 18,
    backgroundColor: '#F0F1F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotPanel: {
    width: 60,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E4E7EB',
    marginBottom: 8,
  },
  robotArmLeft: {
    position: 'absolute',
    left: -10,
    top: 28,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#33346D',
  },
  robotArmRight: {
    position: 'absolute',
    right: -10,
    top: 28,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#33346D',
  },
  cloud: {
    position: 'absolute',
    right: 54,
    top: 182,
    width: 134,
    height: 80,
    justifyContent: 'flex-end',
  },
  cloudPuff: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#7A62F6',
  },
  cloudPuffLeft: {
    left: 0,
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  cloudPuffCenter: {
    left: 28,
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  cloudPuffRight: {
    right: 0,
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  phoneShadow: {
    position: 'absolute',
    bottom: 22,
    left: 88,
    width: 210,
    height: 22,
    borderRadius: 999,
    backgroundColor: '#CCD1DF',
    opacity: 0.45,
  },
  phone: {
    position: 'absolute',
    bottom: 30,
    left: 92,
    width: 206,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#28285F',
    transform: [{ skewX: '-24deg' }, { rotate: '-2deg' }],
    padding: 2,
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: '#F58AA0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneRippleOuter: {
    width: 30,
    height: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFF6F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneRippleInner: {
    width: 14,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#FFF6F7',
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
