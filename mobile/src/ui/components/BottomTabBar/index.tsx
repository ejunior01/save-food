import React from 'react';
import { Pressable, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Bell, ScanLine, ChefHat, ShoppingCart } from 'lucide-react-native';
import { theme } from '@ui/styles/theme';

const TAB_ICONS: Record<string, React.ElementType> = {
  Home,
  Alerts: Bell,
  Scanner: ScanLine,
  Recipes: ChefHat,
  ShoppingList: ShoppingCart,
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: Math.max(bottom, 8),
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.xl,
          paddingHorizontal: 4,
          paddingVertical: 4,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isScanner = route.name === 'Scanner';
          const Icon = TAB_ICONS[route.name] ?? Home;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: theme.radii.lg,
                backgroundColor:
                  isFocused || isScanner ? theme.colors.primary : 'transparent',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Icon
                size={isScanner ? 26 : 22}
                color={isFocused || isScanner ? '#fff' : theme.colors.textMuted}
                strokeWidth={1.8}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
