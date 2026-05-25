import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Copy, Crown, Plus, Users } from 'lucide-react-native';

import { theme } from '@ui/styles/theme';
import { useAppData } from '@app/context/AppDataContext';

function Eyebrow({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: dark ? 'rgba(250,245,235,0.65)' : theme.colors.muted,
    }}>{children}</Text>
  );
}

const MEMBERS = [
  { id: '1', name: 'Marina Pires', role: 'admin', emoji: '👩', items: 12, color: theme.colors.block.pistachio },
  { id: '2', name: 'João Silva',   role: 'member', emoji: '👨', items: 3,  color: theme.colors.block.peach },
];

const INVITE_CODE = 'CASA-2024';

export function Household() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { pantryItems } = useAppData();
  const [codeCopied, setCodeCopied] = useState(false);

  function copyCode() {
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.canvas} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          paddingTop: top + 14,
          paddingHorizontal: 18,
          paddingBottom: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 999,
              borderWidth: 1, borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9.5,
            letterSpacing: 0.12 * 9.5,
            textTransform: 'uppercase',
            color: theme.colors.muted,
          }}>Casa</Text>
          <Pressable style={({ pressed }) => ({
            width: 40, height: 40, borderRadius: 999,
            borderWidth: 1, borderColor: theme.colors.hairline,
            backgroundColor: theme.colors.surface,
            alignItems: 'center', justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}>
            <Plus size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 4 }}>
          <Eyebrow>Sua casa</Eyebrow>
          <Text style={{
            fontFamily: theme.fontFamily.display.regular,
            fontSize: 38,
            color: theme.colors.ink,
            marginTop: 6,
            marginBottom: 8,
            lineHeight: 42,
          }}>
            Despensa de{'\n'}<Text style={{ fontStyle: 'italic' }}>Marina.</Text>
          </Text>
          <Text style={{
            fontFamily: theme.fontFamily.sans.regular,
            fontSize: 14,
            color: theme.colors.muted,
            marginBottom: 14,
            lineHeight: 20,
          }}>
            Gerencie quem tem acesso à sua despensa compartilhada.
          </Text>
        </View>

        {/* Stats row */}
        <View style={{ paddingHorizontal: 18, flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <View style={{
            flex: 1, backgroundColor: theme.colors.block.pistachio,
            borderRadius: 18, padding: 16, gap: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Users size={14} color={theme.colors.ink} strokeWidth={1.6} />
              <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: 'uppercase', color: theme.colors.muted }}>Membros</Text>
            </View>
            <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 38, color: theme.colors.ink, lineHeight: 40 }}>{MEMBERS.length}</Text>
            <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11, color: theme.colors.muted }}>na sua casa</Text>
          </View>
          <View style={{
            flex: 1, backgroundColor: theme.colors.surface,
            borderRadius: 18, padding: 16, gap: 4,
            borderWidth: 1, borderColor: theme.colors.hairline,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: theme.colors.primary }} />
              <Text style={{ fontFamily: theme.fontFamily.mono.regular, fontSize: 9, letterSpacing: 0.12 * 9, textTransform: 'uppercase', color: theme.colors.muted }}>Itens</Text>
            </View>
            <Text style={{ fontFamily: theme.fontFamily.display.italic, fontSize: 38, color: theme.colors.ink, lineHeight: 40 }}>{pantryItems.length}</Text>
            <Text style={{ fontFamily: theme.fontFamily.sans.regular, fontSize: 11, color: theme.colors.muted }}>cadastrados</Text>
          </View>
        </View>

        {/* Members list */}
        <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 22,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.colors.hairline,
          }}>
            <Eyebrow>Integrantes</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 22,
              color: theme.colors.ink,
              marginTop: 4,
              marginBottom: 16,
              lineHeight: 26,
            }}>Quem tem <Text style={{ fontStyle: 'italic' }}>acesso.</Text></Text>

            <View style={{ gap: 10 }}>
              {MEMBERS.map((member) => (
                <View key={member.id} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: theme.colors.canvas,
                  padding: 12,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                }}>
                  <View style={{
                    width: 48, height: 48, borderRadius: 24,
                    backgroundColor: member.color,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Text style={{ fontSize: 22 }}>{member.emoji}</Text>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 14,
                        color: theme.colors.ink,
                      }}>{member.name}</Text>
                      {member.role === 'admin' && (
                        <Crown size={12} color={theme.colors.soon} strokeWidth={1.6} />
                      )}
                    </View>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 12,
                      color: theme.colors.muted,
                    }}>{member.items} itens adicionados</Text>
                  </View>
                  <View style={{
                    paddingHorizontal: 10, paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: member.role === 'admin' ? theme.colors.ink : theme.colors.surface,
                    borderWidth: member.role === 'admin' ? 0 : 1,
                    borderColor: theme.colors.hairline,
                  }}>
                    <Text style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9,
                      letterSpacing: 0.12 * 9,
                      textTransform: 'uppercase',
                      color: member.role === 'admin' ? theme.colors.canvas : theme.colors.muted,
                    }}>{member.role === 'admin' ? 'Admin' : 'Membro'}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Invite block — charcoal */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 14 }}>
          <View style={{
            backgroundColor: theme.colors.block.charcoal,
            borderRadius: 22,
            padding: 22,
          }}>
            <Eyebrow dark>Convite</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 26,
              color: theme.colors.canvas,
              marginTop: 6,
              marginBottom: 14,
              lineHeight: 30,
            }}>
              Convide para a sua <Text style={{ fontStyle: 'italic' }}>despensa.</Text>
            </Text>
            <Text style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 13,
              color: 'rgba(250,245,235,0.7)',
              marginBottom: 16,
              lineHeight: 18,
            }}>
              Compartilhe o código abaixo com quem você quer convidar. O acesso é imediato.
            </Text>

            {/* Code block */}
            <View style={{
              backgroundColor: 'rgba(250,245,235,0.12)',
              borderRadius: 14,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 22,
                letterSpacing: 0.18 * 22,
                color: theme.colors.canvas,
              }}>{INVITE_CODE}</Text>
              <Pressable
                onPress={copyCode}
                style={({ pressed }) => ({
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: codeCopied ? theme.colors.block.pistachio : 'rgba(250,245,235,0.2)',
                  alignItems: 'center', justifyContent: 'center',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Copy size={16} color={codeCopied ? theme.colors.ink : theme.colors.canvas} strokeWidth={1.6} />
              </Pressable>
            </View>

            {codeCopied && (
              <Text style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: 'uppercase',
                color: theme.colors.block.pistachio,
                marginBottom: 10,
              }}>· Código copiado ·</Text>
            )}

            <Pressable style={({ pressed }) => ({
              height: 46, borderRadius: 999,
              backgroundColor: theme.colors.canvas,
              alignItems: 'center', justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}>
              <Text style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 14,
                color: theme.colors.ink,
              }}>Compartilhar convite</Text>
            </Pressable>
          </View>
        </View>

        {/* Permissions info */}
        <View style={{ paddingHorizontal: 18, paddingBottom: 24 }}>
          <View style={{
            backgroundColor: theme.colors.block.cream,
            borderRadius: 22,
            padding: 20,
          }}>
            <Eyebrow>Permissões</Eyebrow>
            <Text style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 20,
              color: theme.colors.ink,
              marginTop: 4,
              marginBottom: 12,
              lineHeight: 24,
            }}>O que <Text style={{ fontStyle: 'italic' }}>membros</Text> podem fazer.</Text>

            {([
              { label: 'Ver itens da despensa', allowed: true },
              { label: 'Adicionar novos itens', allowed: true },
              { label: 'Marcar como consumido', allowed: true },
              { label: 'Excluir itens de outros', allowed: false },
              { label: 'Convidar novos membros', allowed: false },
              { label: 'Configurações da casa', allowed: false },
            ] as Array<{ label: string; allowed: boolean }>).map((p, i) => (
              <View key={i} style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 8,
                borderBottomWidth: i < 5 ? 1 : 0,
                borderBottomColor: 'rgba(26,43,31,0.08)',
              }}>
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: p.allowed ? theme.colors.safeSoft : theme.colors.dangerSoft,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 11 }}>{p.allowed ? '✓' : '✕'}</Text>
                </View>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 13,
                  color: p.allowed ? theme.colors.ink : theme.colors.muted,
                }}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
