import { Pressable, StatusBar, Text, View } from 'react-native';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React from 'react';
import { runOnJS } from 'react-native-reanimated';
import { styles } from './styles';
import { theme } from '@ui/styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '@app/navigation/types';

type SlideKind = 'pasta' | 'milk' | 'salad';

const slides: Array<{
  kind: SlideKind;
  title: string;
  desc: string;
}> = [
  {
    kind: 'pasta',
    title: 'Reduza o desperdício',
    desc: 'Acompanhe o que você tem em casa e nunca mais perca um alimento por validade.',
  },
  {
    kind: 'milk',
    title: 'Escaneie e organize',
    desc: 'Adicione produtos rapidamente e receba alertas antes que vençam.',
  },
  {
    kind: 'salad',
    title: 'Cozinhe com o que tem',
    desc: 'Receba receitas baseadas nos ingredientes que precisam ser usados.',
  },
];

const productIcons: Record<SlideKind, string> = {
  pasta: '🍝',
  milk: '🥛',
  salad: '🥗',
};

function ProductImage({ kind, size }: { kind: SlideKind; size: number }) {
  return (
    <Text style={[styles.productImage, { fontSize: size }]}>
      {productIcons[kind]}
    </Text>
  );
}

type Props = AuthStackScreenProps<'Onboarding'>;

export function Onboarding({ navigation }: Props) {
  const [step, setStep] = React.useState(0);
  const { top, bottom } = useSafeAreaInsets();

  const currentSlide = slides[step];

  const handleDone = React.useCallback(() => {
    navigation.navigate('Login');
  }, [navigation]);

  const handleNext = React.useCallback(() => {
    if (step < slides.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    handleDone();
  }, [handleDone, step]);

  const handlePrevious = React.useCallback(() => {
    setStep((currentStep) => Math.max(currentStep - 1, 0));
  }, []);

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-20, 20])
        .failOffsetY([-20, 20])
        .onEnd((event) => {
          const shouldMoveNext =
            event.translationX < -48 || event.velocityX < -600;
          const shouldMovePrevious =
            event.translationX > 48 || event.velocityX > 600;

          if (shouldMoveNext) {
            runOnJS(handleNext)();
            return;
          }

          if (shouldMovePrevious) {
            runOnJS(handlePrevious)();
          }
        }),
    [handleNext, handlePrevious],
  );

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.surface}
      />

      <View style={styles.skipContainer}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={handleDone}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.skipText}>Pular</Text>
        </Pressable>
      </View>

      <GestureDetector gesture={panGesture}>
        <View style={styles.mainContent}>
          <View style={styles.productFrame}>
            <ProductImage kind={currentSlide.kind} size={112} />
          </View>

          <Text style={styles.title}>{currentSlide.title}</Text>
          <Text style={styles.description}>{currentSlide.desc}</Text>
        </View>
      </GestureDetector>

      <View style={[styles.footer, { paddingBottom: Math.max(bottom, 36) }]}>
        <View style={styles.indicators}>
          {slides.map((slide, index) => (
            <View
              key={slide.kind}
              style={[
                styles.indicator,
                index === step && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {step < slides.length - 1 ? 'Próximo' : 'Começar'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
