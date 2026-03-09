import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type NavKey = 'home' | 'calendar' | 'records' | 'layers';

const NAV_ITEMS: { key: NavKey; icon: keyof typeof Ionicons.glyphMap; route: '/dashboard' | '/mark-attendance' | '/messages' | '/profile' }[] = [
  { key: 'home', icon: 'home-outline', route: '/dashboard' },
  { key: 'calendar', icon: 'calendar-outline', route: '/mark-attendance' },
  { key: 'records', icon: 'receipt-outline', route: '/messages' },
  { key: 'layers', icon: 'layers-outline', route: '/profile' },
];

export default function AppBottomNav({ active }: { active: NavKey }) {
  const router = useRouter();

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <Pressable key={item.key} style={styles.item} onPress={() => router.replace(item.route)}>
              <Ionicons name={item.icon} size={22} color={isActive ? '#FFFFFF' : 'rgba(255,255,255,0.82)'} />
              {isActive && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: '#F2F3F8' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#141B20',
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#232B31',
  },
  item: { width: 52, alignItems: 'center', justifyContent: 'center', gap: 7 },
  indicator: { width: 14, height: 2, borderRadius: 2, backgroundColor: '#FFFFFF' },
  homeIndicator: {
    alignSelf: 'center',
    width: 124,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D9DCE3',
    marginTop: 8,
    marginBottom: 6,
  },
});
