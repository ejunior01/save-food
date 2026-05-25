import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Bell, Plus, Archive, ShoppingCart } from 'lucide-react-native';
import { theme } from '@ui/styles/theme';

const TAB_ICONS: Record<string, React.ElementType> = {
  Home: Home,
  Alerts: Bell,
  AddFood: Plus,
  Inventory: Archive,
  ShoppingList: ShoppingCart,
};

const TAB_LABELS: Record<string, string> = {
  Home: 'INÍCIO',
  Alerts: 'ALERTAS',
  AddFood: '',
  Inventory: 'DESPENSA',
  ShoppingList: 'COMPRAS',
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={{
      position: 'absolute',
      left: 0, right: 0, bottom: 0,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.hairline,
      paddingBottom: Math.max(bottom, 12),
      paddingTop: 8,
      paddingHorizontal: 14,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isAdd = route.name === 'AddFood';
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

        if (isAdd) {
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel ?? 'Adicionar'}
              style={({ pressed }) => ({
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.75 : 1,
                marginTop: -16,
              })}
            >
              <View style={{
                width: 56, height: 56,
                borderRadius: theme.radii.pill,
                backgroundColor: theme.colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: theme.colors.ink,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.25,
                shadowRadius: 20,
                elevation: 8,
              }}>
                <Icon size={26} color={theme.colors.onPrimary} strokeWidth={1.8} />
              </View>
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
              paddingVertical: 4,
              gap: 4,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View style={{ position: 'relative', alignItems: 'center' }}>
              <Icon
                size={22}
                color={isFocused ? theme.colors.ink : theme.colors.muted}
                strokeWidth={isFocused ? 2 : 1.6}
              />
              {isFocused && (
                <View style={{
                  position: 'absolute',
                  bottom: -6,
                  width: 4, height: 4,
                  borderRadius: 2,
                  backgroundColor: theme.colors.ink,
                }} />
              )}
            </View>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              color: isFocused ? theme.colors.ink : theme.colors.muted,
              includeFontPadding: false,
            }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
