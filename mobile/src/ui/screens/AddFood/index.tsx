import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Calendar, Camera, Check, Edit3, Scan, X } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { theme } from '@ui/styles/theme';
import { getCategoryIcon, getCategoryColor } from '@app/utils/categories';
import { OpenFoodFactsService, OpenFoodFactsProduct } from '@app/services/OpenFoodFactsService';
import { useCreatePantryItem } from '@app/hooks/mutations/useCreatePantryItem';

type Mode = 'scan' | 'manual';
type Location = 'loc_fridge' | 'loc_pantry' | 'loc_freezer';

const CATEGORIES = [
  'Vegetais', 'Frutas', 'Laticínios', 'Proteínas',
  'Grãos', 'Padaria', 'Mercearia', 'Legumes', 'Peixes',
];

const LOC_OPTIONS: Array<{ id: Location; label: string; icon: string }> = [
  { id: 'loc_fridge',  label: 'Geladeira', icon: '🧊' },
  { id: 'loc_pantry',  label: 'Despensa',  icon: '🗄️' },
  { id: 'loc_freezer', label: 'Freezer',   icon: '❄️' },
];

function FieldLabel({ children }: { children: string }) {
  return (
    <Text style={{
      fontFamily: theme.fontFamily.mono.regular,
      fontSize: 9.5,
      letterSpacing: 0.12 * 9.5,
      textTransform: 'uppercase',
      color: theme.colors.muted,
      marginBottom: 6,
    }}>{children}</Text>
  );
}

export function AddFood() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const { createPantryItem, isLoading: isSaving } = useCreatePantryItem();

  const [mode, setMode] = useState<Mode>('scan');

  // Scan state
  const [isSearching, setIsSearching] = useState(false);
  const [foundProduct, setFoundProduct] = useState<OpenFoodFactsProduct | null>(null);
  const scanLocked = useRef(false);

  // Form state
  const [formName, setFormName]       = useState('');
  const [formQty, setFormQty]         = useState('1');
  const [formUnit, setFormUnit]       = useState('un');
  const [formCategory, setFormCategory] = useState('Vegetais');
  const [formEmoji, setFormEmoji]     = useState('🥬');
  const [formLocation, setFormLocation] = useState<Location>('loc_fridge');
  const [formDays, setFormDays]       = useState<number | null>(15);
  const [formCustomDate, setFormCustomDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formPhoto, setFormPhoto]     = useState<string | null>(null);

  const handleBarcodeScanned = useCallback(async ({ data }: { data: string }) => {
    if (scanLocked.current || isSearching) return;
    scanLocked.current = true;
    setIsSearching(true);
    try {
      const product = await OpenFoodFactsService.searchByBarcode(data);
      if (product) {
        setFormName(product.name);
        setFormQty(String(product.quantity));
        setFormUnit(product.unit);
        setFormCategory(product.category);
        setFormEmoji(product.emoji);
        setFoundProduct(product);
      } else {
        Alert.alert(
          'Produto não encontrado',
          'Tente escanear novamente ou cadastre manualmente.',
          [
            { text: 'Tentar de novo', onPress: () => { scanLocked.current = false; } },
            { text: 'Manual', onPress: () => { setMode('manual'); scanLocked.current = false; } },
          ],
        );
      }
    } catch {
      Alert.alert('Erro de conexão', 'Verifique sua internet e tente novamente.', [
        { text: 'OK', onPress: () => { scanLocked.current = false; } },
      ]);
    } finally {
      setIsSearching(false);
    }
  }, [isSearching]);

  async function pickPhoto(source: 'camera' | 'gallery') {
    const fn = source === 'camera'
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await fn({
      mediaTypes: ['images'],
      quality: 0.82,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setFormPhoto(result.assets[0].uri);
    }
  }

  function getExpiryDate(): Date {
    if (formCustomDate) return formCustomDate;
    const d = new Date();
    d.setDate(d.getDate() + (formDays ?? 15));
    return d;
  }

  async function handleSave() {
    const name = formName.trim();
    if (!name) {
      Alert.alert('Nome obrigatório', 'Digite o nome do alimento antes de salvar.');
      return;
    }
    await createPantryItem({
      name,
      quantity: parseFloat(formQty) || 1,
      unit: formUnit.trim() || 'un',
      category: formCategory,
      emoji: formEmoji,
      locationId: formLocation,
      expiresAt: getExpiryDate(),
      photo: formPhoto ?? undefined,
    });
    navigation.goBack();
  }

  function useFoundProduct() {
    setFoundProduct(null);
    scanLocked.current = false;
    setMode('manual');
  }

  async function saveFoundProduct() {
    await handleSave();
  }

  // — Camera permission gate —
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#0d1411' }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: mode === 'scan' ? '#0d1411' : theme.colors.canvas }}>
      <StatusBar barStyle={mode === 'scan' ? 'light-content' : 'dark-content'} />

      {/* Top bar */}
      <View style={{
        paddingTop: top + 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 40, height: 40, borderRadius: 999,
            backgroundColor: mode === 'scan' ? 'rgba(255,255,255,0.15)' : theme.colors.surface,
            borderWidth: mode === 'scan' ? 0 : 1,
            borderColor: theme.colors.hairline,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <X size={18} color={mode === 'scan' ? '#fff' : theme.colors.ink} strokeWidth={1.6} />
        </Pressable>

        {/* Mode segmented */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: mode === 'manual' ? theme.colors.surfaceSoft : 'rgba(255,255,255,0.10)',
          borderRadius: 999,
          padding: 3,
          gap: 2,
        }}>
          {([
            { id: 'scan' as Mode, label: 'Código', Icon: Scan },
            { id: 'manual' as Mode, label: 'Manual', Icon: Edit3 },
          ]).map(({ id, label, Icon }) => (
            <Pressable
              key={id}
              onPress={() => {
                if (id === 'scan') {
                  scanLocked.current = false;
                  setFoundProduct(null);
                }
                setMode(id);
              }}
              style={{
                height: 32, paddingHorizontal: 12, borderRadius: 999,
                backgroundColor: mode === id
                  ? (id === 'manual' ? theme.colors.ink : theme.colors.canvas)
                  : 'transparent',
                flexDirection: 'row', alignItems: 'center', gap: 5,
              }}
            >
              <Icon size={13} color={
                mode === id
                  ? (id === 'manual' ? theme.colors.canvas : theme.colors.ink)
                  : (mode === 'scan' ? 'rgba(255,255,255,0.7)' : theme.colors.muted)
              } strokeWidth={1.6} />
              <Text style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 13,
                color: mode === id
                  ? (id === 'manual' ? theme.colors.canvas : theme.colors.ink)
                  : (mode === 'scan' ? 'rgba(255,255,255,0.7)' : theme.colors.muted),
              }}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* SCAN MODE */}
      {mode === 'scan' && (
        <View style={{ flex: 1 }}>
          {permission.granted ? (
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
              }}
            >
              {/* Overlay */}
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(13,20,17,0.55)',
                alignItems: 'center',
              }}>
                {/* Hero text */}
                <View style={{ paddingHorizontal: 28, alignSelf: 'flex-start', marginTop: 24, marginBottom: 40 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 9.5, letterSpacing: 0.12 * 9.5,
                    textTransform: 'uppercase',
                    color: 'rgba(250,245,235,0.7)', marginBottom: 8,
                  }}>Adicionar alimento</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.display.regular,
                    fontSize: 28, color: theme.colors.canvas, lineHeight: 32,
                  }}>
                    Aponte para o{'\n'}<Text style={{ fontStyle: 'italic' }}>código de barras.</Text>
                  </Text>
                </View>

                {/* Scanner frame */}
                <View style={{ width: 260, height: 160, position: 'relative' }}>
                  {[
                    { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3 },
                    { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3 },
                    { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3 },
                    { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3 },
                  ].map((s, i) => (
                    <View key={i} style={{
                      position: 'absolute', width: 30, height: 30,
                      borderColor: theme.colors.canvas, borderStyle: 'solid',
                      borderRadius: 8, ...s,
                    }} />
                  ))}
                  <View style={{
                    position: 'absolute', left: 8, right: 8, top: '50%',
                    height: 2, backgroundColor: theme.colors.block.peach,
                  }} />
                </View>

                {/* Searching indicator */}
                {isSearching && (
                  <View style={{
                    marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 10,
                    backgroundColor: 'rgba(250,245,235,0.15)', borderRadius: 999,
                    paddingHorizontal: 16, paddingVertical: 10,
                  }}>
                    <ActivityIndicator size="small" color={theme.colors.canvas} />
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium, fontSize: 13,
                      color: theme.colors.canvas,
                    }}>Buscando produto…</Text>
                  </View>
                )}

                {!isSearching && (
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular, fontSize: 11,
                    letterSpacing: 0.16 * 11, textTransform: 'uppercase',
                    color: 'rgba(250,245,235,0.7)', marginTop: 28,
                  }}>— BUSCANDO CÓDIGO —</Text>
                )}

                <Pressable
                  onPress={() => setMode('manual')}
                  style={{
                    marginTop: 24, height: 36, paddingHorizontal: 16,
                    borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.15)',
                    flexDirection: 'row', alignItems: 'center', gap: 8,
                  }}
                >
                  <Edit3 size={14} color="rgba(250,245,235,0.9)" strokeWidth={1.6} />
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium, fontSize: 13,
                    color: 'rgba(250,245,235,0.9)',
                  }}>Cadastrar manualmente</Text>
                </Pressable>
              </View>
            </CameraView>
          ) : (
            /* Permission request UI */
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
              <View style={{
                width: 72, height: 72, borderRadius: 36,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              }}>
                <Camera size={32} color={theme.colors.canvas} strokeWidth={1.4} />
              </View>
              <Text style={{
                fontFamily: theme.fontFamily.display.regular, fontSize: 24,
                color: theme.colors.canvas, textAlign: 'center', marginBottom: 10,
              }}>Acesso à câmera</Text>
              <Text style={{
                fontFamily: theme.fontFamily.sans.regular, fontSize: 14,
                color: 'rgba(250,245,235,0.7)', textAlign: 'center',
                lineHeight: 20, marginBottom: 28,
              }}>
                Necessário para escanear códigos de barras e identificar produtos automaticamente.
              </Text>
              <Pressable
                onPress={requestPermission}
                style={{
                  height: 50, paddingHorizontal: 28, borderRadius: 999,
                  backgroundColor: theme.colors.canvas,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Text style={{
                  fontFamily: theme.fontFamily.sans.semiBold, fontSize: 15,
                  color: theme.colors.ink,
                }}>Permitir câmera</Text>
              </Pressable>
              <Pressable onPress={() => setMode('manual')} style={{ marginTop: 16 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium, fontSize: 14,
                  color: 'rgba(250,245,235,0.6)',
                }}>Cadastrar manualmente</Text>
              </Pressable>
            </View>
          )}

          {/* Product found sheet */}
          {foundProduct && (
            <View style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              backgroundColor: theme.colors.canvas,
              borderTopLeftRadius: 28, borderTopRightRadius: 28,
              paddingHorizontal: 18, paddingTop: 14, paddingBottom: bottom + 18,
            }}>
              <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: theme.colors.hairline, alignSelf: 'center', marginBottom: 16 }} />

              <Text style={{
                fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                letterSpacing: 0.12 * 9.5, textTransform: 'uppercase', color: theme.colors.muted,
                marginBottom: 4,
              }}>Produto encontrado</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.display.regular, fontSize: 28,
                    color: theme.colors.ink, lineHeight: 32,
                  }}>{foundProduct.name}</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular, fontSize: 13,
                    color: theme.colors.muted,
                  }}>{foundProduct.brand ? `${foundProduct.brand} · ` : ''}{foundProduct.category}</Text>
                </View>
                <View style={{
                  width: 64, height: 64, borderRadius: 14,
                  backgroundColor: getCategoryColor(foundProduct.category),
                  alignItems: 'center', justifyContent: 'center', marginLeft: 14,
                }}>
                  <Text style={{ fontSize: 30 }}>{foundProduct.emoji}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={useFoundProduct}
                  style={{
                    flex: 1, height: 50, borderRadius: 14,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1, borderColor: theme.colors.hairline,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: theme.colors.ink,
                  }}>Editar</Text>
                </Pressable>
                <Pressable
                  onPress={saveFoundProduct}
                  disabled={isSaving}
                  style={({ pressed }) => ({
                    flex: 2, height: 50, borderRadius: 14,
                    backgroundColor: theme.colors.ink,
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: pressed || isSaving ? 0.7 : 1,
                  })}
                >
                  {isSaving
                    ? <ActivityIndicator size="small" color={theme.colors.canvas} />
                    : <Check size={16} color={theme.colors.canvas} strokeWidth={2.5} />
                  }
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.semiBold, fontSize: 15, color: theme.colors.canvas,
                  }}>Salvar na despensa</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      )}

      {/* MANUAL MODE */}
      {mode === 'manual' && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 12 }}>
              <View style={{ gap: 6 }}>
                <Text style={{
                  fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                  letterSpacing: 0.12 * 9.5, textTransform: 'uppercase', color: theme.colors.muted,
                }}>Cadastro manual</Text>
                <Text style={{
                  fontFamily: theme.fontFamily.display.regular, fontSize: 36,
                  color: theme.colors.ink, marginTop: 2, lineHeight: 40,
                }}>
                  Novo <Text style={{ fontStyle: 'italic' }}>alimento.</Text>
                </Text>
              </View>
              <Pressable
                onPress={() => { setFoundProduct(null); scanLocked.current = false; setMode('scan'); }}
                style={{
                  marginTop: 14, height: 34, paddingHorizontal: 12, borderRadius: 999,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1, borderColor: theme.colors.hairline,
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                }}
              >
                <Scan size={14} color={theme.colors.ink} strokeWidth={1.6} />
                <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.ink }}>
                  Escanear
                </Text>
              </Pressable>
            </View>

            <Text style={{
              fontFamily: theme.fontFamily.sans.regular, fontSize: 13, color: theme.colors.muted,
              marginTop: 8, marginBottom: 18, lineHeight: 18,
            }}>
              Itens a granel, da feira ou caseiros.
            </Text>

            {/* Photo zone */}
            {formPhoto ? (
              <Pressable onPress={() => setFormPhoto(null)} style={{ marginBottom: 14, borderRadius: 20, overflow: 'hidden' }}>
                <Image source={{ uri: formPhoto }} style={{ width: '100%', height: 180, borderRadius: 20 }} resizeMode="cover" />
                <View style={{
                  position: 'absolute', top: 10, right: 10,
                  width: 32, height: 32, borderRadius: 999,
                  backgroundColor: 'rgba(26,43,31,0.7)',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={14} color="#fff" strokeWidth={2} />
                </View>
              </Pressable>
            ) : (
              <View style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 20, borderWidth: 1.5,
                borderColor: theme.colors.hairline, borderStyle: 'dashed',
                padding: 22, alignItems: 'center', gap: 12, marginBottom: 14,
              }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 999,
                  backgroundColor: theme.colors.block.cream,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Camera size={26} color={theme.colors.ink} strokeWidth={1.6} />
                </View>
                <Text style={{
                  fontFamily: theme.fontFamily.sans.medium, fontSize: 14, color: theme.colors.ink,
                }}>Adicione uma foto do produto</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => pickPhoto('camera')}
                    style={{
                      height: 36, paddingHorizontal: 14, borderRadius: 999,
                      backgroundColor: theme.colors.ink,
                      flexDirection: 'row', alignItems: 'center', gap: 6,
                    }}
                  >
                    <Camera size={14} color={theme.colors.canvas} strokeWidth={1.6} />
                    <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.canvas }}>
                      Tirar foto
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => pickPhoto('gallery')}
                    style={{
                      height: 36, paddingHorizontal: 14, borderRadius: 999,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1, borderColor: theme.colors.hairline,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontFamily: theme.fontFamily.sans.medium, fontSize: 13, color: theme.colors.ink }}>
                      Da galeria
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Name */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Nome do alimento</FieldLabel>
              <TextInput
                style={{
                  height: 48, backgroundColor: theme.colors.surface,
                  borderRadius: 14, borderWidth: 1, borderColor: theme.colors.hairline,
                  paddingHorizontal: 16, fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 15, color: theme.colors.ink,
                }}
                value={formName}
                onChangeText={setFormName}
                placeholder="Ex: Tomate italiano"
                placeholderTextColor={theme.colors.muted2}
              />
            </View>

            {/* Qty + Unit */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Quantidade</FieldLabel>
                <TextInput
                  style={{
                    height: 48, backgroundColor: theme.colors.surface,
                    borderRadius: 14, borderWidth: 1, borderColor: theme.colors.hairline,
                    paddingHorizontal: 16, fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 15, color: theme.colors.ink,
                  }}
                  value={formQty}
                  onChangeText={setFormQty}
                  placeholder="1"
                  placeholderTextColor={theme.colors.muted2}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel>Unidade</FieldLabel>
                <TextInput
                  style={{
                    height: 48, backgroundColor: theme.colors.surface,
                    borderRadius: 14, borderWidth: 1, borderColor: theme.colors.hairline,
                    paddingHorizontal: 16, fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 15, color: theme.colors.ink,
                  }}
                  value={formUnit}
                  onChangeText={setFormUnit}
                  placeholder="un"
                  placeholderTextColor={theme.colors.muted2}
                />
              </View>
            </View>

            {/* Category */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Categoria</FieldLabel>
              <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -18 }}
                contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
              >
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => { setFormCategory(cat); setFormEmoji(getCategoryIcon(cat)); }}
                    style={{
                      height: 42, paddingHorizontal: 12, borderRadius: 999,
                      backgroundColor: formCategory === cat ? theme.colors.ink : getCategoryColor(cat),
                      flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 0,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{getCategoryIcon(cat)}</Text>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium, fontSize: 13,
                      color: formCategory === cat ? theme.colors.canvas : theme.colors.ink,
                    }}>{cat}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Location */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Onde guardar</FieldLabel>
              <View style={{
                flexDirection: 'row', backgroundColor: theme.colors.surfaceSoft,
                borderRadius: 999, padding: 3,
              }}>
                {LOC_OPTIONS.map((o) => (
                  <Pressable
                    key={o.id}
                    onPress={() => setFormLocation(o.id)}
                    style={{
                      flex: 1, height: 34, borderRadius: 999,
                      backgroundColor: formLocation === o.id ? theme.colors.canvas : 'transparent',
                      borderWidth: formLocation === o.id ? 1 : 0,
                      borderColor: theme.colors.hairline,
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    <Text style={{ fontSize: 13 }}>{o.icon}</Text>
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium, fontSize: 12.5, color: theme.colors.ink,
                    }}>{o.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Expiry */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Data de validade</FieldLabel>
              <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                {[5, 15, 30].map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => { setFormDays(d); setFormCustomDate(null); }}
                    style={{
                      height: 42, paddingHorizontal: 14, borderRadius: 999,
                      backgroundColor: formDays === d && !formCustomDate ? theme.colors.ink : theme.colors.surface,
                      borderWidth: formDays === d && !formCustomDate ? 0 : 1,
                      borderColor: theme.colors.hairline,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{
                      fontFamily: theme.fontFamily.sans.medium, fontSize: 13,
                      color: formDays === d && !formCustomDate ? theme.colors.canvas : theme.colors.ink,
                    }}>{d} dias</Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    height: 42, paddingHorizontal: 14, borderRadius: 999,
                    backgroundColor: formCustomDate ? theme.colors.ink : theme.colors.surface,
                    borderWidth: formCustomDate ? 0 : 1, borderColor: theme.colors.hairline,
                    flexDirection: 'row', alignItems: 'center', gap: 6,
                  }}
                >
                  <Calendar size={14}
                    color={formCustomDate ? theme.colors.canvas : theme.colors.ink}
                    strokeWidth={1.6}
                  />
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.medium, fontSize: 13,
                    color: formCustomDate ? theme.colors.canvas : theme.colors.ink,
                  }}>
                    {formCustomDate
                      ? formCustomDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Data específica'}
                  </Text>
                </Pressable>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={formCustomDate ?? new Date()}
                  mode="date"
                  minimumDate={new Date()}
                  onChange={(_event, date) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (date) {
                      setFormCustomDate(date);
                      setFormDays(null);
                    }
                  }}
                />
              )}
            </View>

            {/* Alerts info block */}
            <View style={{
              backgroundColor: theme.colors.block.cream,
              borderRadius: 18, padding: 14, marginBottom: 14,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 2 }}>
                  <Text style={{
                    fontFamily: theme.fontFamily.mono.regular, fontSize: 9.5,
                    letterSpacing: 0.12 * 9.5, textTransform: 'uppercase', color: theme.colors.muted,
                  }}>Alertas automáticos</Text>
                  <Text style={{
                    fontFamily: theme.fontFamily.sans.regular, fontSize: 13, color: theme.colors.ink,
                  }}>30, 15 e 5 dias antes de vencer</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {[30, 15, 5].map((d) => (
                    <View key={d} style={{
                      paddingHorizontal: 8, paddingVertical: 4,
                      backgroundColor: theme.colors.ink, borderRadius: 999,
                    }}>
                      <Text style={{
                        fontFamily: theme.fontFamily.mono.regular, fontSize: 10, color: theme.colors.canvas,
                      }}>{d}d</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Save CTA */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => ({
                height: 54, borderRadius: 999,
                backgroundColor: theme.colors.ink,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
                opacity: pressed || isSaving ? 0.7 : 1,
              })}
            >
              {isSaving
                ? <ActivityIndicator size="small" color={theme.colors.canvas} />
                : <Check size={18} color={theme.colors.canvas} strokeWidth={2} />
              }
              <Text style={{
                fontFamily: theme.fontFamily.sans.semiBold, fontSize: 16, color: theme.colors.canvas,
              }}>Salvar alimento</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
