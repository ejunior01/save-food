import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAuth } from '@app/context/AuthContext';
import { AuthStackScreenProps } from '@app/navigation/types';

const SLIDES = [
  {
    eyebrow: '01 / Prevenir',
    title: 'Menos\n',
    titleItalic: 'desperdício,',
    titleEnd: '\nmais economia.',
    body: 'Veja o que vence primeiro antes de virar lixo. Alertas inteligentes em 30, 15 e 5 dias.',
    blockColor: theme.colors.block.pistachio,
    photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80',
  },
  {
    eyebrow: '02 / Organizar',
    title: 'Escaneie\ne organize\nnum ',
    titleItalic: 'toque.',
    titleEnd: '',
    body: 'Aponte para o código de barras: nome, marca e categoria preenchidos. Você só confirma a validade.',
    blockColor: theme.colors.block.peach,
    photo: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=80',
  },
  {
    eyebrow: '03 / Aproveitar',
    title: 'Cozinhe\ncom o que\nvocê ',
    titleItalic: 'tem.',
    titleEnd: '',
    body: 'Receitas sugeridas pelos itens em alerta. Lista de compras sem comprar repetido.',
    blockColor: theme.colors.block.rose,
    photo: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&q=80',
  },
];

type Props = AuthStackScreenProps<'Onboarding'>;

export function Onboarding({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const { top, bottom } = useSafeAreaInsets();
  const { markOnboardingDone } = useAuth();

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  async function handleNext() {
    if (isLast) {
      await markOnboardingDone();
      navigation.navigate('Login');
    } else {
      setStep(step + 1);
    }
  }

  async function handleSkip() {
    await markOnboardingDone();
    navigation.navigate('Login');
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      {/* Top bar */}
      <View style={{
        paddingTop: top + 14,
        paddingHorizontal: 20,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 17,
            color: theme.colors.ink,
          }}>Despensa<Text style={{ fontStyle: 'italic' }}>Certa</Text></Text>
        </View>
        <Pressable
          onPress={handleSkip}
          style={{
            height: 34, paddingHorizontal: 14, borderRadius: 999,
            backgroundColor: theme.colors.surface,
            borderWidth: 1, borderColor: theme.colors.hairline,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 13,
            color: theme.colors.ink,
          }}>Pular</Text>
        </Pressable>
      </View>

      {/* Hero photo block */}
      <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
        <View style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
          <Image
            source={{ uri: slide.photo }}
            style={{ width: '100%', height: 260 }}
            resizeMode="cover"
          />
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(26,43,31,0)',
          }} />
          {/* Eyebrow sticker */}
          <View style={{ position: 'absolute', top: 14, left: 16 }}>
            <View style={{
              height: 28, paddingHorizontal: 10, borderRadius: 999,
              backgroundColor: theme.colors.canvas,
              flexDirection: 'row', alignItems: 'center',
            }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: 'uppercase',
                color: theme.colors.ink,
              }}>{slide.eyebrow}</Text>
            </View>
          </View>
          {/* Slide counter */}
          <View style={{ position: 'absolute', right: 14, bottom: 14 }}>
            <Text style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 10,
              letterSpacing: 0.16 * 10,
              color: theme.colors.canvas,
            }}>{String(step + 1).padStart(2, '0')} / 03</Text>
          </View>
        </View>
      </View>

      {/* Copy */}
      <View style={{ flex: 1, paddingHorizontal: 22, paddingTop: 24, gap: 14 }}>
        <Text style={{
          fontFamily: theme.fontFamily.display.regular,
          fontSize: 48,
          lineHeight: 50,
          color: theme.colors.ink,
        }}>
          {slide.title}
          <Text style={{ fontStyle: 'italic' }}>{slide.titleItalic}</Text>
          {slide.titleEnd}
        </Text>
        <Text style={{
          fontFamily: theme.fontFamily.sans.regular,
          fontSize: 15,
          color: theme.colors.muted,
          lineHeight: 22,
          maxWidth: 300,
        }}>{slide.body}</Text>
      </View>

      {/* Pagination + CTA */}
      <View style={{ paddingHorizontal: 22, paddingBottom: Math.max(bottom, 32), gap: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Dots */}
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <View key={i} style={{
                height: 6,
                width: i === step ? 24 : 6,
                borderRadius: 999,
                backgroundColor: i === step ? theme.colors.ink : 'rgba(26,43,31,0.2)',
              }} />
            ))}
          </View>
          {/* Nav buttons */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {step > 0 && (
              <Pressable
                onPress={() => setStep(step - 1)}
                style={{
                  width: 40, height: 40, borderRadius: 999,
                  borderWidth: 1, borderColor: theme.colors.hairline,
                  backgroundColor: theme.colors.surface,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => ({
                height: 40, paddingHorizontal: 18, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                flexDirection: 'row', alignItems: 'center', gap: 8,
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <Text style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 14,
                color: theme.colors.canvas,
              }}>{isLast ? 'Criar conta' : 'Próximo'}</Text>
              <ArrowRight size={18} color={theme.colors.canvas} strokeWidth={1.6} />
            </Pressable>
          </View>
        </View>
        <Text style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 9.5,
          letterSpacing: 0.12 * 9.5,
          textTransform: 'uppercase',
          color: theme.colors.muted,
          textAlign: 'center',
        }}>
          Já tem conta?{' '}
          <Text
            onPress={() => navigation.navigate('Login')}
            style={{ color: theme.colors.ink }}
          >
            Entrar →
          </Text>
        </Text>
      </View>
    </View>
  );
}
