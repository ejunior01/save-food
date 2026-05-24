import React from 'react';
import { Pressable, View, Text } from 'react-native';
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

const TAB_LABELS: Record<string, string> = {
  Home: 'INÍCIO',
  Alerts: 'ALERTAS',
  Scanner: 'SCAN',
  Recipes: 'RECEITAS',
  ShoppingList: 'COMPRAS',
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: Math.max(bottom, 8),
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 4,
          paddingTop: 8,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const isScanner = route.name === 'Scanner';
          const Icon = TAB_ICONS[route.name] ?? Home;
          const label = TAB_LABELS[route.name] ?? route.name.toUpperCase();

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

          if (isScanner) {
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
                  paddingVertical: 6,
                  gap: 4,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: theme.radii.pill,
                  backgroundColor: theme.colors.text,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color="#fff" strokeWidth={1.8} />
                </View>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 9,
                  letterSpacing: 0.8,
                  color: isFocused ? theme.colors.text : theme.colors.textMuted,
                  includeFontPadding: false,
                }}>
                  {label}
                </Text>
              </Pressable>
            );
          }

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
                paddingVertical: 6,
                gap: 4,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              {/* Active dot indicator */}
              <View style={{ height: 4, width: 4, borderRadius: 2, marginBottom: 2,
                backgroundColor: isFocused ? theme.colors.primary : 'transparent' }} />
              <Icon
                size={20}
                color={isFocused ? theme.colors.primary : theme.colors.textMuted}
                strokeWidth={isFocused ? 2 : 1.6}
              />
              <Text style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 9,
                letterSpacing: 0.8,
                color: isFocused ? theme.colors.text : theme.colors.textMuted,
                includeFontPadding: false,
              }}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
