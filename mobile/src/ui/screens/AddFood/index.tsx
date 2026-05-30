import * as ImagePicker from "expo-image-picker";

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
} from "react-native";
import {
  Calendar,
  Camera,
  Check,
  Edit3,
  Scan,
  Sparkles,
  X,
} from "lucide-react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  OpenFoodFactsProduct,
  OpenFoodFactsService,
} from "@app/services/OpenFoodFactsService";
import React, { useCallback, useRef, useState } from "react";
import { getCategoryColor, getCategoryIcon } from "@app/utils/categories";

import { AxiosError } from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "@ui/styles/theme";
import { useCreatePantryItem } from "@app/hooks/mutations/useCreatePantryItem";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Mode = "scan" | "manual";
type Location = "loc_fridge" | "loc_pantry" | "loc_freezer";

const SCAN_EXPIRY_PRESETS = [
  { label: "1 mês", days: 30 },
  { label: "3 meses", days: 90 },
  { label: "6 meses", days: 180 },
];

const CATEGORIES = [
  "Vegetais",
  "Frutas",
  "Laticínios",
  "Proteínas",
  "Grãos",
  "Padaria",
  "Mercearia",
  "Legumes",
  "Peixes",
];

const LOC_OPTIONS: Array<{ id: Location; label: string; icon: string }> = [
  { id: "loc_fridge", label: "Geladeira", icon: "🧊" },
  { id: "loc_pantry", label: "Despensa", icon: "🗄️" },
  { id: "loc_freezer", label: "Freezer", icon: "❄️" },
];

const TAG_SUGGESTIONS_SCAN = [
  "#promoção",
  "#festa",
  "#crianças",
  "#dieta",
  "#estoque",
];
const TAG_SUGGESTIONS_MANUAL = [
  "#promoção",
  "#feira",
  "#orgânico",
  "#crianças",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9.5,
        letterSpacing: 0.12 * 9.5,
        textTransform: "uppercase",
        color: theme.colors.muted,
        marginBottom: 6,
      }}
    >
      {children}
    </Text>
  );
}

function LocationSegment({
  value,
  onChange,
}: {
  value: Location;
  onChange: (v: Location) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.surfaceSoft,
        borderRadius: 999,
        padding: 3,
      }}
    >
      {LOC_OPTIONS.map((o) => (
        <Pressable
          key={o.id}
          onPress={() => onChange(o.id)}
          style={{
            flex: 1,
            height: 34,
            borderRadius: 999,
            backgroundColor:
              value === o.id ? theme.colors.canvas : "transparent",
            borderWidth: value === o.id ? 1 : 0,
            borderColor: theme.colors.hairline,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 13 }}>{o.icon}</Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 12.5,
              color: theme.colors.ink,
            }}
          >
            {o.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export function AddFood() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const { createPantryItem, isLoading: isSaving } = useCreatePantryItem();

  const [mode, setMode] = useState<Mode>("scan");

  const [isSearching, setIsSearching] = useState(false);
  const [foundProduct, setFoundProduct] = useState<OpenFoodFactsProduct | null>(
    null,
  );
  const scanLocked = useRef(false);

  const [formName, setFormName] = useState("");
  const [formQty, setFormQty] = useState("1");
  const [formUnit, setFormUnit] = useState("un");
  const [formCategory, setFormCategory] = useState("Vegetais");
  const [formEmoji, setFormEmoji] = useState("🥬");
  const [formLocation, setFormLocation] = useState<Location>("loc_fridge");
  const [formDays, setFormDays] = useState<number | null>(30);
  const [formCustomDate, setFormCustomDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [formLote, setFormLote] = useState("");
  const [formMarca, setFormMarca] = useState("");
  const [formTag, setFormTag] = useState("");

  const isDark = mode === "scan" && !foundProduct;

  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      if (scanLocked.current || isSearching) {
        return;
      }
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
          setFormDays(180);
          setFoundProduct(product);
        } else {
          Alert.alert(
            "Produto não encontrado",
            "Tente escanear novamente ou cadastre manualmente.",
            [
              {
                text: "Tentar de novo",
                onPress: () => {
                  scanLocked.current = false;
                },
              },
              {
                text: "Manual",
                onPress: () => {
                  setMode("manual");
                  scanLocked.current = false;
                },
              },
            ],
          );
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "Network request failed"
        ) {
          Alert.alert(
            "Erro de conexão",
            "Verifique sua internet e tente novamente.",
            [
              {
                text: "OK",
                onPress: () => {
                  scanLocked.current = false;
                },
              },
            ],
          );
        }
        else if (error instanceof AxiosError && error.response?.status === 404) {
          Alert.alert(
            "Produto não encontrado",
            "Tente escanear novamente ou cadastre manualmente.",
            [
              {
                text: "Tentar de novo",
                onPress: () => {
                  scanLocked.current = false;
                },
              },
              {
                text: "Manual",
                onPress: () => {
                  setMode("manual");
                  scanLocked.current = false;
                },
              },
            ],
          );
        } else {
          Alert.alert(
            "Erro ao buscar produto",
            "Ocorreu um erro ao buscar o produto. Tente novamente mais tarde.",
            [
              {
                text: "OK",
                onPress: () => {
                  scanLocked.current = false;
                },
              },
            ],
          );
        }

      } finally {
        setIsSearching(false);
      }
    },
    [isSearching],
  );

  async function pickPhoto(source: "camera" | "gallery") {
    const fn =
      source === "camera"
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync;
    const result = await fn({
      mediaTypes: ["images"],
      quality: 0.82,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setFormPhoto(result.assets[0].uri);
    }
  }

  function getExpiryDate(): Date {
    if (formCustomDate) {
      return formCustomDate;
    }
    const d = new Date();
    d.setDate(d.getDate() + (formDays ?? 30));
    return d;
  }

  async function handleSave() {
    const name = formName.trim();
    if (!name) {
      Alert.alert(
        "Nome obrigatório",
        "Digite o nome do alimento antes de salvar.",
      );
      return;
    }
    await createPantryItem({
      name,
      quantity: parseFloat(formQty) || 1,
      unit: formUnit.trim() || "un",
      category: formCategory,
      emoji: formEmoji,
      locationId: formLocation,
      expiresAt: getExpiryDate(),
      photo: formPhoto ?? undefined,
    });
    navigation.goBack();
  }

  function handleEditProduct() {
    setFoundProduct(null);
    scanLocked.current = false;
    setMode("manual");
  }

  function resetScan() {
    setFoundProduct(null);
    scanLocked.current = false;
    setIsSearching(false);
  }

  function addTag(
    tag: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    current: string,
  ) {
    if (!current.includes(tag)) {
      setter(`${current} ${tag}`.trim());
    }
  }

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#0d1411" }} />;
  }

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: bottom + 32,
        backgroundColor: isDark ? "#0d1411" : theme.colors.canvas,
      }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View
        style={{
          paddingTop: top + 14,
          paddingHorizontal: 16,
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
          marginBottom: 12,
        }}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            backgroundColor: isDark
              ? "rgba(255,255,255,0.15)"
              : theme.colors.surface,
            borderWidth: isDark ? 0 : 1,
            borderColor: theme.colors.hairline,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X
            size={18}
            color={isDark ? "#fff" : theme.colors.ink}
            strokeWidth={1.6}
          />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: isDark
              ? "rgba(255,255,255,0.10)"
              : theme.colors.surfaceSoft,
            borderRadius: 999,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 4,
            paddingRight: 4,
            gap: 2,
          }}
        >
          <Pressable
            onPress={() => {
              resetScan();
              setMode("scan");
            }}
            style={{
              height: 32,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor:
                mode === "scan" ? theme.colors.canvas : "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Scan
              size={13}
              color={
                mode === "scan"
                  ? theme.colors.ink
                  : isDark
                    ? "rgba(255,255,255,0.7)"
                    : theme.colors.muted
              }
              strokeWidth={1.6}
            />
            <Text
              style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 13,
                color:
                  mode === "scan"
                    ? theme.colors.ink
                    : isDark
                      ? "rgba(255,255,255,0.7)"
                      : theme.colors.muted,
              }}
            >
              Código
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("AIRecognize")}
            style={{
              height: 32,
              paddingHorizontal: 10,
              borderRadius: 999,
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Sparkles
              size={13}
              color={isDark ? "rgba(255,255,255,0.7)" : theme.colors.muted}
              strokeWidth={1.6}
            />
            <Text
              style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 13,
                color: isDark ? "rgba(255,255,255,0.7)" : theme.colors.muted,
              }}
            >
              IA
            </Text>
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 1.5,
                borderRadius: 999,
                backgroundColor: theme.colors.block.peach,
                marginLeft: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 8,
                  letterSpacing: 0.8,
                  color: theme.colors.ink,
                }}
              >
                PRO
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setMode("manual")}
            style={{
              height: 32,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor:
                mode === "manual" ? theme.colors.ink : "transparent",
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Edit3
              size={13}
              color={
                mode === "manual"
                  ? theme.colors.canvas
                  : isDark
                    ? "rgba(255,255,255,0.7)"
                    : theme.colors.muted
              }
              strokeWidth={1.6}
            />
            <Text
              style={{
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 13,
                color:
                  mode === "manual"
                    ? theme.colors.canvas
                    : isDark
                      ? "rgba(255,255,255,0.7)"
                      : theme.colors.muted,
              }}
            >
              Manual
            </Text>
          </Pressable>
        </View>
      </View>

      {mode === "scan" && !foundProduct && (
        <View style={{ flex: 1 }}>
          {permission.granted ? (
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: [
                  "ean13",
                  "ean8",
                  "upc_a",
                  "upc_e",
                  "code128",
                  "code39",
                  "qr",
                ],
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(13,20,17,0.55)",
                  alignItems: "center",
                }}
              >
                {/* Hero text */}
                <View
                  style={{
                    paddingHorizontal: 28,
                    alignSelf: "flex-start",
                    marginTop: 24,
                    marginBottom: 40,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: "uppercase",
                      color: "rgba(250,245,235,0.7)",
                      marginBottom: 8,
                    }}
                  >
                    QR · código de barras
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.display.regular,
                      fontSize: 28,
                      color: theme.colors.canvas,
                      lineHeight: 32,
                    }}
                  >
                    Aponte para o{"\n"}
                    <Text style={{ fontStyle: "italic" }}>
                      código do produto.
                    </Text>
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 13,
                      color: "rgba(250,245,235,0.6)",
                      marginTop: 6,
                      lineHeight: 18,
                    }}
                  >
                    Buscamos marca, volume e categoria no banco de produtos
                  </Text>
                </View>

                {/* Scanner frame */}
                <View style={{ width: 260, height: 160, position: "relative" }}>
                  {[
                    {
                      top: -2,
                      left: -2,
                      borderTopWidth: 3,
                      borderLeftWidth: 3,
                    },
                    {
                      top: -2,
                      right: -2,
                      borderTopWidth: 3,
                      borderRightWidth: 3,
                    },
                    {
                      bottom: -2,
                      left: -2,
                      borderBottomWidth: 3,
                      borderLeftWidth: 3,
                    },
                    {
                      bottom: -2,
                      right: -2,
                      borderBottomWidth: 3,
                      borderRightWidth: 3,
                    },
                  ].map((s, i) => (
                    <View
                      key={i}
                      style={{
                        position: "absolute",
                        width: 30,
                        height: 30,
                        borderColor: theme.colors.canvas,
                        borderStyle: "solid",
                        borderRadius: 8,
                        ...s,
                      }}
                    />
                  ))}
                  {!isSearching && (
                    <View
                      style={{
                        position: "absolute",
                        left: 8,
                        right: 8,
                        top: "50%",
                        height: 2,
                        backgroundColor: theme.colors.block.peach,
                      }}
                    />
                  )}
                </View>

                {isSearching ? (
                  <View
                    style={{
                      marginTop: 28,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "rgba(250,245,235,0.15)",
                      borderRadius: 999,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.canvas}
                    />
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color: theme.colors.canvas,
                      }}
                    >
                      Buscando produto…
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 11,
                      letterSpacing: 0.16 * 11,
                      textTransform: "uppercase",
                      color: "rgba(250,245,235,0.7)",
                      marginTop: 28,
                    }}
                  >
                    — BUSCANDO CÓDIGO —
                  </Text>
                )}

                <Pressable
                  onPress={() => setMode("manual")}
                  style={{
                    marginTop: 24,
                    height: 36,
                    paddingHorizontal: 16,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Edit3
                    size={14}
                    color="rgba(250,245,235,0.9)"
                    strokeWidth={1.6}
                  />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: "rgba(250,245,235,0.9)",
                    }}
                  >
                    Não consegui ler · cadastrar manualmente
                  </Text>
                </Pressable>
              </View>
            </CameraView>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 32,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <Camera
                  size={32}
                  color={theme.colors.canvas}
                  strokeWidth={1.4}
                />
              </View>
              <Text
                style={{
                  fontFamily: theme.fontFamily.display.regular,
                  fontSize: 24,
                  color: theme.colors.canvas,
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Acesso à câmera
              </Text>
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 14,
                  color: "rgba(250,245,235,0.7)",
                  textAlign: "center",
                  lineHeight: 20,
                  marginBottom: 28,
                }}
              >
                Necessário para escanear códigos de barras e identificar
                produtos automaticamente.
              </Text>
              <Pressable
                onPress={requestPermission}
                style={{
                  height: 50,
                  paddingHorizontal: 28,
                  borderRadius: 999,
                  backgroundColor: theme.colors.canvas,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.semiBold,
                    fontSize: 15,
                    color: theme.colors.ink,
                  }}
                >
                  Permitir câmera
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setMode("manual")}
                style={{ marginTop: 16 }}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 14,
                    color: "rgba(250,245,235,0.6)",
                  }}
                >
                  Cadastrar manualmente
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      {mode === "scan" && foundProduct && (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom + 100 }}
        >
          {/* Source banner */}
          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 10,
              paddingBottom: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: theme.colors.block.pistachio,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 999,
              }}
            >
              <Scan size={11} color={theme.colors.ink} strokeWidth={1.8} />
              <Text
                style={{
                  fontFamily: theme.fontFamily.mono.regular,
                  fontSize: 9.5,
                  letterSpacing: 0.1 * 9.5,
                  color: theme.colors.ink,
                }}
              >
                Lido por código de barras
              </Text>
            </View>
            <Text
              style={{
                flex: 1,
                textAlign: "right",
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.1 * 9.5,
                color: theme.colors.muted,
                textTransform: "uppercase",
              }}
            >
              banco de produtos
            </Text>
          </View>

          {/* Product card */}
          <View style={{ paddingHorizontal: 18, paddingBottom: 10 }}>
            <View
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: 130,
                  backgroundColor: getCategoryColor(foundProduct.category),
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 56 }}>{foundProduct.emoji}</Text>
              </View>
              <View
                style={{
                  paddingTop: 14,
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 9.5,
                    letterSpacing: 0.1 * 9.5,
                    textTransform: "uppercase",
                    color: theme.colors.muted,
                    marginBottom: 4,
                  }}
                >
                  {foundProduct.category}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fontFamily.display.regular,
                    fontSize: 26,
                    color: theme.colors.ink,
                    lineHeight: 30,
                  }}
                >
                  {foundProduct.name}
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 13,
                    color: theme.colors.muted,
                    marginTop: 4,
                  }}
                >
                  {foundProduct.brand ? `${foundProduct.brand} · ` : ""}
                  {foundProduct.quantity} {foundProduct.unit}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={resetScan}
              style={{ marginTop: 8, alignSelf: "center" }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 13,
                  color: theme.colors.ink,
                  textDecorationLine: "underline",
                }}
              >
                Não é esse produto? Escanear de novo
              </Text>
            </Pressable>
          </View>

          {/* Section header */}
          <View
            style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14 }}
          >
            <Text
              style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                textTransform: "uppercase",
                color: theme.colors.muted,
              }}
            >
              Suas informações
            </Text>
            <Text
              style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 28,
                color: theme.colors.ink,
                marginTop: 4,
                lineHeight: 32,
              }}
            >
              Complete o <Text style={{ fontStyle: "italic" }}>cadastro.</Text>
            </Text>
          </View>

          {/* Expiry */}
          <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
            <FieldLabel>
              Data de validade{" "}
              <Text
                style={{
                  textTransform: "none",
                  letterSpacing: 0,
                  color: theme.colors.danger,
                }}
              >
                *
              </Text>
            </FieldLabel>
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {SCAN_EXPIRY_PRESETS.map(({ label, days }) => (
                <Pressable
                  key={days}
                  onPress={() => {
                    setFormDays(days);
                    setFormCustomDate(null);
                  }}
                  style={{
                    height: 42,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    backgroundColor:
                      formDays === days && !formCustomDate
                        ? theme.colors.ink
                        : theme.colors.surface,
                    borderWidth: formDays === days && !formCustomDate ? 0 : 1,
                    borderColor: theme.colors.hairline,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color:
                        formDays === days && !formCustomDate
                          ? theme.colors.canvas
                          : theme.colors.ink,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  height: 42,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  backgroundColor: formCustomDate
                    ? theme.colors.ink
                    : theme.colors.surface,
                  borderWidth: formCustomDate ? 0 : 1,
                  borderColor: theme.colors.hairline,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Calendar
                  size={14}
                  color={
                    formCustomDate ? theme.colors.canvas : theme.colors.ink
                  }
                  strokeWidth={1.6}
                />
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 13,
                    color: formCustomDate
                      ? theme.colors.canvas
                      : theme.colors.ink,
                  }}
                >
                  {formCustomDate
                    ? formCustomDate.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Data específica"}
                </Text>
              </Pressable>
            </View>
            <Text
              style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                color: theme.colors.muted,
                textTransform: "uppercase",
              }}
            >
              · Impresso na embalagem, na tampa ou no rótulo ·
            </Text>
            {showDatePicker && (
              <DateTimePicker
                value={formCustomDate ?? new Date()}
                mode="date"
                minimumDate={new Date()}
                onChange={(_event, date) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (date) {
                    setFormCustomDate(date);
                    setFormDays(null);
                  }
                }}
              />
            )}
          </View>

          {/* Lote */}
          <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
            <FieldLabel>
              Lote / fabricação{" "}
              <Text
                style={{
                  textTransform: "none",
                  letterSpacing: 0,
                  color: theme.colors.muted,
                }}
              >
                (opcional)
              </Text>
            </FieldLabel>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                style={{
                  flex: 1,
                  height: 48,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  paddingHorizontal: 16,
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 15,
                  color: theme.colors.ink,
                }}
                value={formLote}
                onChangeText={setFormLote}
                placeholder="Ex: L2613 24/05/2026"
                placeholderTextColor={theme.colors.muted2}
              />
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Camera size={18} color={theme.colors.ink} strokeWidth={1.6} />
              </View>
            </View>
            <Text
              style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 9.5,
                letterSpacing: 0.12 * 9.5,
                color: theme.colors.muted,
                marginTop: 6,
                textTransform: "uppercase",
              }}
            >
              · Útil em caso de recall do fabricante ·
            </Text>
          </View>

          {/* Onde guardar */}
          <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
            <FieldLabel>Onde guardar</FieldLabel>
            <LocationSegment value={formLocation} onChange={setFormLocation} />
          </View>

          {/* Tag / descrição */}
          <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
            <FieldLabel>
              Tag / descrição{" "}
              <Text
                style={{
                  textTransform: "none",
                  letterSpacing: 0,
                  color: theme.colors.muted,
                }}
              >
                (opcional)
              </Text>
            </FieldLabel>
            <TextInput
              style={{
                height: 48,
                backgroundColor: theme.colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
                paddingHorizontal: 16,
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 15,
                color: theme.colors.ink,
                marginBottom: 8,
              }}
              value={formTag}
              onChangeText={setFormTag}
              placeholder="Ex: comprado em promoção · churrasco"
              placeholderTextColor={theme.colors.muted2}
            />
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
              {TAG_SUGGESTIONS_SCAN.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => addTag(tag, setFormTag, formTag)}
                  style={{
                    height: 30,
                    paddingHorizontal: 11,
                    borderRadius: 999,
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.hairline,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 11.5,
                      color: theme.colors.muted,
                    }}
                  >
                    {tag}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Alertas */}
          <View style={{ paddingHorizontal: 18, marginBottom: 14 }}>
            <View
              style={{
                backgroundColor: theme.colors.block.cream,
                borderRadius: 18,
                padding: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: "uppercase",
                      color: theme.colors.muted,
                    }}
                  >
                    Alertas automáticos
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 13,
                      color: theme.colors.ink,
                    }}
                  >
                    30, 15 e 5 dias antes de vencer
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[30, 15, 5].map((d) => (
                    <View
                      key={d}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: theme.colors.ink,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: theme.fontFamily.mono.regular,
                          fontSize: 10,
                          color: theme.colors.canvas,
                        }}
                      >
                        {d}d
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {mode === "scan" && foundProduct && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 18,
            paddingTop: 12,
            paddingBottom: bottom + 18,
            backgroundColor: theme.colors.canvas,
            borderTopWidth: 1,
            borderTopColor: theme.colors.hairlineSoft,
          }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={handleEditProduct}
              style={{
                flex: 1,
                height: 50,
                borderRadius: 14,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 14,
                  color: theme.colors.ink,
                }}
              >
                Editar
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              style={({ pressed }) => ({
                flex: 2,
                height: 50,
                borderRadius: 14,
                backgroundColor: theme.colors.ink,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: pressed || isSaving ? 0.7 : 1,
              })}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.colors.canvas} />
              ) : (
                <Check
                  size={16}
                  color={theme.colors.canvas}
                  strokeWidth={2.5}
                />
              )}
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.semiBold,
                  fontSize: 15,
                  color: theme.colors.canvas,
                }}
              >
                Salvar na despensa
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {mode === "manual" && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginTop: 12,
              }}
            >
              <View style={{ gap: 6 }}>
                <Text
                  style={{
                    fontFamily: theme.fontFamily.mono.regular,
                    fontSize: 9.5,
                    letterSpacing: 0.12 * 9.5,
                    textTransform: "uppercase",
                    color: theme.colors.muted,
                  }}
                >
                  Cadastro manual
                </Text>
                <Text
                  style={{
                    fontFamily: theme.fontFamily.display.regular,
                    fontSize: 36,
                    color: theme.colors.ink,
                    marginTop: 2,
                    lineHeight: 40,
                  }}
                >
                  Novo <Text style={{ fontStyle: "italic" }}>alimento.</Text>
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  setFoundProduct(null);
                  scanLocked.current = false;
                  setMode("scan");
                }}
                style={{
                  marginTop: 14,
                  height: 34,
                  paddingHorizontal: 12,
                  borderRadius: 999,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Scan size={14} color={theme.colors.ink} strokeWidth={1.6} />
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 13,
                    color: theme.colors.ink,
                  }}
                >
                  Escanear código
                </Text>
              </Pressable>
            </View>

            <Text
              style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 13,
                color: theme.colors.muted,
                marginTop: 8,
                marginBottom: 18,
                lineHeight: 18,
              }}
            >
              Cadastre alimentos sem código de barras — itens a granel, da feira
              ou caseiros.
            </Text>

            {/* Photo zone */}
            {formPhoto ? (
              <Pressable
                onPress={() => setFormPhoto(null)}
                style={{
                  marginBottom: 14,
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={{ uri: formPhoto }}
                  style={{ width: "100%", height: 180 }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    width: 32,
                    height: 32,
                    borderRadius: 999,
                    backgroundColor: "rgba(26,43,31,0.7)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={14} color="#fff" strokeWidth={2} />
                </View>
              </Pressable>
            ) : (
              <View
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 20,
                  borderWidth: 1.5,
                  borderColor: theme.colors.hairline,
                  borderStyle: "dashed",
                  padding: 22,
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    backgroundColor: theme.colors.block.cream,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera
                    size={26}
                    color={theme.colors.ink}
                    strokeWidth={1.6}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: theme.fontFamily.sans.medium,
                    fontSize: 14,
                    color: theme.colors.ink,
                  }}
                >
                  Adicione uma foto do alimento
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => pickPhoto("camera")}
                    style={{
                      height: 36,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: theme.colors.ink,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Camera
                      size={14}
                      color={theme.colors.canvas}
                      strokeWidth={1.6}
                    />
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color: theme.colors.canvas,
                      }}
                    >
                      Tirar foto
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => pickPhoto("gallery")}
                    style={{
                      height: 36,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1,
                      borderColor: theme.colors.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color: theme.colors.ink,
                      }}
                    >
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
                  height: 48,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  paddingHorizontal: 16,
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 15,
                  color: theme.colors.ink,
                }}
                value={formName}
                onChangeText={setFormName}
                placeholder="Ex: Tomate italiano"
                placeholderTextColor={theme.colors.muted2}
              />
            </View>

            {/* Qty + Unit */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Quantidade</FieldLabel>
                <TextInput
                  style={{
                    height: 48,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.colors.hairline,
                    paddingHorizontal: 16,
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 15,
                    color: theme.colors.ink,
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
                    height: 48,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.colors.hairline,
                    paddingHorizontal: 16,
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 15,
                    color: theme.colors.ink,
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
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -18 }}
                contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
              >
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => {
                      setFormCategory(cat);
                      setFormEmoji(getCategoryIcon(cat));
                    }}
                    style={{
                      height: 42,
                      paddingHorizontal: 12,
                      borderRadius: 999,
                      backgroundColor:
                        formCategory === cat
                          ? theme.colors.ink
                          : getCategoryColor(cat),
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{getCategoryIcon(cat)}</Text>
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color:
                          formCategory === cat
                            ? theme.colors.canvas
                            : theme.colors.ink,
                      }}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Location */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Onde guardar</FieldLabel>
              <LocationSegment
                value={formLocation}
                onChange={setFormLocation}
              />
            </View>

            {/* Expiry */}
            <View style={{ marginBottom: 14 }}>
              <FieldLabel>Data de validade</FieldLabel>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {[5, 15, 30].map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => {
                      setFormDays(d);
                      setFormCustomDate(null);
                    }}
                    style={{
                      height: 42,
                      paddingHorizontal: 14,
                      borderRadius: 999,
                      backgroundColor:
                        formDays === d && !formCustomDate
                          ? theme.colors.ink
                          : theme.colors.surface,
                      borderWidth: formDays === d && !formCustomDate ? 0 : 1,
                      borderColor: theme.colors.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.medium,
                        fontSize: 13,
                        color:
                          formDays === d && !formCustomDate
                            ? theme.colors.canvas
                            : theme.colors.ink,
                      }}
                    >
                      {d} dias
                    </Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={{
                    height: 42,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    backgroundColor: formCustomDate
                      ? theme.colors.ink
                      : theme.colors.surface,
                    borderWidth: formCustomDate ? 0 : 1,
                    borderColor: theme.colors.hairline,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Calendar
                    size={14}
                    color={
                      formCustomDate ? theme.colors.canvas : theme.colors.ink
                    }
                    strokeWidth={1.6}
                  />
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.medium,
                      fontSize: 13,
                      color: formCustomDate
                        ? theme.colors.canvas
                        : theme.colors.ink,
                    }}
                  >
                    {formCustomDate
                      ? formCustomDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Data específica"}
                  </Text>
                </Pressable>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={formCustomDate ?? new Date()}
                  mode="date"
                  minimumDate={new Date()}
                  onChange={(_event, date) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (date) {
                      setFormCustomDate(date);
                      setFormDays(null);
                    }
                  }}
                />
              )}
            </View>

            {/* Lote + Marca */}
            <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel>Lote / fabricação</FieldLabel>
                <View style={{ flexDirection: "row", gap: 6 }}>
                  <TextInput
                    style={{
                      flex: 1,
                      height: 48,
                      backgroundColor: theme.colors.surface,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: theme.colors.hairline,
                      paddingHorizontal: 14,
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 14,
                      color: theme.colors.ink,
                    }}
                    value={formLote}
                    onChangeText={setFormLote}
                    placeholder="Ex: L2613"
                    placeholderTextColor={theme.colors.muted2}
                  />
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1,
                      borderColor: theme.colors.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Scan
                      size={16}
                      color={theme.colors.ink}
                      strokeWidth={1.6}
                    />
                  </View>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel>
                  Marca{" "}
                  <Text
                    style={{
                      textTransform: "none",
                      letterSpacing: 0,
                      color: theme.colors.muted,
                    }}
                  >
                    (opcional)
                  </Text>
                </FieldLabel>
                <TextInput
                  style={{
                    height: 48,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.colors.hairline,
                    paddingHorizontal: 14,
                    fontFamily: theme.fontFamily.sans.regular,
                    fontSize: 14,
                    color: theme.colors.ink,
                  }}
                  value={formMarca}
                  onChangeText={setFormMarca}
                  placeholder="Ex: Feira"
                  placeholderTextColor={theme.colors.muted2}
                />
              </View>
            </View>

            <View style={{ marginBottom: 14 }}>
              <FieldLabel>
                Tag / descrição{" "}
                <Text
                  style={{
                    textTransform: "none",
                    letterSpacing: 0,
                    color: theme.colors.muted,
                  }}
                >
                  (opcional)
                </Text>
              </FieldLabel>
              <TextInput
                style={{
                  height: 48,
                  backgroundColor: theme.colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: theme.colors.hairline,
                  paddingHorizontal: 16,
                  fontFamily: theme.fontFamily.sans.regular,
                  fontSize: 15,
                  color: theme.colors.ink,
                  marginBottom: 8,
                }}
                value={formTag}
                onChangeText={setFormTag}
                placeholder="Ex: comprado na feira de sábado · churrasco"
                placeholderTextColor={theme.colors.muted2}
              />
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                {TAG_SUGGESTIONS_MANUAL.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => addTag(tag, setFormTag, formTag)}
                    style={{
                      height: 28,
                      paddingHorizontal: 10,
                      borderRadius: 999,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1,
                      borderColor: theme.colors.hairline,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: theme.fontFamily.sans.regular,
                        fontSize: 11,
                        color: theme.colors.muted,
                      }}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View
              style={{
                backgroundColor: theme.colors.block.cream,
                borderRadius: 18,
                padding: 14,
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.mono.regular,
                      fontSize: 9.5,
                      letterSpacing: 0.12 * 9.5,
                      textTransform: "uppercase",
                      color: theme.colors.muted,
                    }}
                  >
                    Alertas automáticos
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.fontFamily.sans.regular,
                      fontSize: 13,
                      color: theme.colors.ink,
                    }}
                  >
                    30, 15 e 5 dias antes de vencer
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[30, 15, 5].map((d) => (
                    <View
                      key={d}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: theme.colors.ink,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: theme.fontFamily.mono.regular,
                          fontSize: 10,
                          color: theme.colors.canvas,
                        }}
                      >
                        {d}d
                      </Text>
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
                height: 54,
                borderRadius: 999,
                backgroundColor: theme.colors.ink,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                opacity: pressed || isSaving ? 0.7 : 1,
              })}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={theme.colors.canvas} />
              ) : (
                <Check size={18} color={theme.colors.canvas} strokeWidth={2} />
              )}
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.semiBold,
                  fontSize: 16,
                  color: theme.colors.canvas,
                }}
              >
                Salvar alimento
              </Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
