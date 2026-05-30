import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  ChevronRight,
  Eye,
  Heart,
  HelpCircle,
  Leaf,
  Lock,
  LogOut,
  Mail,
  Package,
  Pencil,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react-native";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";

import { theme } from "@ui/styles/theme";
import { useAppData } from "@app/context/AppDataContext";
import { useAuth } from "@app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@app/stores/userStore";

function Eyebrow({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: theme.fontFamily.mono.regular,
        fontSize: 9.5,
        letterSpacing: 0.12 * 9.5,
        textTransform: "uppercase",
        color: dark ? "rgba(250,245,235,0.65)" : theme.colors.muted,
      }}
    >
      {children}
    </Text>
  );
}

function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.colors.hairline,
      }}
    >
      <Text
        style={{
          fontFamily: theme.fontFamily.display.italic,
          fontSize: 22,
          color: accent ? theme.colors.safe : theme.colors.ink,
          lineHeight: 26,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: theme.fontFamily.mono.regular,
          fontSize: 8.5,
          letterSpacing: 0.12 * 8.5,
          textTransform: "uppercase",
          color: theme.colors.muted,
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function ProfRow({
  icon,
  label,
  sub,
  onPress,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onPress?: () => void;
  badge?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.hairlineSoft,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: theme.colors.surfaceSoft,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: theme.fontFamily.sans.medium,
            fontSize: 13.5,
            color: theme.colors.ink,
          }}
        >
          {label}
        </Text>
        {sub && (
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 11.5,
              color: theme.colors.muted,
            }}
          >
            {sub}
          </Text>
        )}
      </View>
      {badge && (
        <View
          style={{
            paddingHorizontal: 7,
            paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: theme.colors.ink,
          }}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              color: theme.colors.block.pistachio,
            }}
          >
            ★ {badge}
          </Text>
        </View>
      )}
      <ChevronRight size={14} color={theme.colors.muted} strokeWidth={1.6} />
    </Pressable>
  );
}

function ProfSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ paddingHorizontal: 18, paddingBottom: 6 }}>
      <View style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
        <Eyebrow>{title}</Eyebrow>
      </View>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: theme.colors.hairline,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function UpgradeCard({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: theme.colors.ink,
        borderRadius: 22,
        padding: 18,
        overflow: "hidden",
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View style={{ position: "absolute", right: -12, bottom: -16 }}>
        <Text
          style={{
            fontSize: 96,
            opacity: 0.1,
            color: theme.colors.block.pistachio,
          }}
        >
          ✦
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: theme.colors.block.pistachio,
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          marginBottom: 10,
        }}
      >
        <Sparkles size={12} color={theme.colors.ink} strokeWidth={1.6} />
        <Text
          style={{
            fontFamily: theme.fontFamily.mono.regular,
            fontSize: 9,
            letterSpacing: 0.12 * 9,
            textTransform: "uppercase",
            color: theme.colors.ink,
          }}
        >
          Premium
        </Text>
      </View>
      <Text
        style={{
          fontFamily: theme.fontFamily.display.regular,
          fontSize: 26,
          color: theme.colors.canvas,
          lineHeight: 28,
          marginBottom: 4,
        }}
      >
        Faça mais com{"\n"}
        <Text
          style={{ fontStyle: "italic", color: theme.colors.block.pistachio }}
        >
          Premium.
        </Text>
      </Text>
      <Text
        style={{
          fontFamily: theme.fontFamily.sans.regular,
          fontSize: 12.5,
          color: "rgba(250,245,235,0.7)",
          marginBottom: 12,
          lineHeight: 18,
        }}
      >
        IA para frutas e verduras, NFe, planejador semanal, casa compartilhada e
        insights de desperdício.
      </Text>
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
              fontFamily: theme.fontFamily.display.italic,
              fontSize: 22,
              color: theme.colors.canvas,
            }}
          >
            R$ 8,90
            <Text style={{ fontSize: 11, color: "rgba(250,245,235,0.6)" }}>
              /mês
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 8.5,
              letterSpacing: 0.12 * 8.5,
              textTransform: "uppercase",
              color: theme.colors.block.pistachio,
            }}
          >
            ★ 14 dias grátis
          </Text>
        </View>
        <View
          style={{
            height: 38,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.block.pistachio,
            borderRadius: 999,
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
            Experimentar →
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function PremiumStatusCard({ onManage }: { onManage?: () => void }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.block.pistachio,
        borderRadius: 22,
        padding: 16,
        overflow: "hidden",
      }}
    >
      <View style={{ position: "absolute", right: -12, bottom: -16 }}>
        <Text style={{ fontSize: 96, opacity: 0.16 }}>✦</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            backgroundColor: theme.colors.ink,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Sparkles
            size={20}
            color={theme.colors.block.pistachio}
            strokeWidth={1.6}
          />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Eyebrow>· Plano ativo ·</Eyebrow>
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 14,
              color: theme.colors.ink,
            }}
          >
            Premium · cobrança anual
          </Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 11.5,
              color: theme.colors.ink2,
            }}
          >
            R$ 8,90/mês · próxima cobrança 17 jun 2026
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
        <Pressable
          onPress={onManage}
          style={({ pressed }) => ({
            flex: 1,
            height: 38,
            borderRadius: 999,
            backgroundColor: theme.colors.canvas,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 13,
              color: theme.colors.ink,
            }}
          >
            Gerenciar assinatura
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => ({
            height: 38,
            paddingHorizontal: 16,
            borderRadius: 999,
            backgroundColor: "rgba(26,43,31,0.10)",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.medium,
              fontSize: 13,
              color: theme.colors.ink,
            }}
          >
            Recibos
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function LogoutSheet({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(26,43,31,0.45)",
          justifyContent: "flex-end",
        }}
        onPress={onCancel}
      >
        <Pressable
          style={{
            backgroundColor: theme.colors.canvas,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 18,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              width: 38,
              height: 4,
              backgroundColor: theme.colors.hairline,
              borderRadius: 999,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: 16,
              paddingBottom: 18,
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 8 }}>👋</Text>
            <Eyebrow>Sair da conta</Eyebrow>
            <Text
              style={{
                fontFamily: theme.fontFamily.display.regular,
                fontSize: 26,
                color: theme.colors.ink,
                marginTop: 6,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Tem certeza?
            </Text>
            <Text
              style={{
                fontFamily: theme.fontFamily.sans.regular,
                fontSize: 13,
                color: theme.colors.muted,
                textAlign: "center",
                lineHeight: 18,
              }}
            >
              Você pode entrar de novo a qualquer momento — com senha ou
              biometria.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({
                flex: 1,
                height: 50,
                borderRadius: 999,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.hairline,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 15,
                  color: theme.colors.ink,
                }}
              >
                Cancelar
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => ({
                flex: 1,
                height: 50,
                borderRadius: 999,
                backgroundColor: theme.colors.danger,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: theme.fontFamily.sans.medium,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                Sair da conta
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function Profile() {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { signOut } = useAuth();
  const { pantryItems } = useAppData();
  const {
    name: userName,
    email: userEmail,
    avatarUri,
    houseName,
    adults,
    kids,
    restrictions,
    plan,
  } = useUserStore();
  const isPremium = plan === "premium";
  const [logoutOpen, setLogoutOpen] = useState(false);

  const displayName = userName || "Usuário";
  const firstName = displayName.split(" ")[0];
  const lastName = displayName.split(" ").slice(1).join(" ");
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberCount = adults + kids;

  function handleLogout() {
    setLogoutOpen(false);
    signOut();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.canvas }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.ink} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
      >
        <View
          style={{
            paddingTop: top + 14,
            paddingHorizontal: 18,
            paddingBottom: 6,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <ArrowLeft size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted,
            }}
          >
            Perfil
          </Text>
          <Pressable
            onPress={() => navigation.navigate("EditAccount")}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Pencil size={18} color={theme.colors.ink} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* User hero */}
        <View
          style={{
            paddingHorizontal: 22,
            paddingTop: 14,
            paddingBottom: 22,
            alignItems: "center",
          }}
        >
          <View style={{ position: "relative" }}>
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: theme.colors.block.pistachio,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: theme.colors.block.pistachio,
                shadowColor: theme.colors.canvas,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 2,
                overflow: "hidden",
              }}
            >
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  style={{
                    fontFamily: theme.fontFamily.display.italic,
                    fontSize: 36,
                    color: theme.colors.ink,
                  }}
                >
                  {initials || "U"}
                </Text>
              )}
            </View>
            {isPremium && (
              <View
                style={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  backgroundColor: theme.colors.ink,
                  borderWidth: 3,
                  borderColor: theme.colors.canvas,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles
                  size={14}
                  color={theme.colors.block.pistachio}
                  strokeWidth={1.6}
                />
              </View>
            )}
          </View>

          <Text
            style={{
              fontFamily: theme.fontFamily.display.regular,
              fontSize: 26,
              color: theme.colors.ink,
              marginTop: 14,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {firstName}
            {lastName ? (
              <Text style={{ fontStyle: "italic" }}>{" " + lastName}</Text>
            ) : null}
          </Text>
          <Text
            style={{
              fontFamily: theme.fontFamily.sans.regular,
              fontSize: 13,
              color: theme.colors.muted,
              marginBottom: 10,
            }}
          >
            {userEmail || "—"}
          </Text>
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: isPremium
                ? theme.colors.ink
                : theme.colors.surfaceSoft,
              borderWidth: isPremium ? 0 : 1,
              borderColor: theme.colors.hairline,
            }}
          >
            <Text
              style={{
                fontFamily: theme.fontFamily.mono.regular,
                fontSize: 10,
                letterSpacing: 0.12 * 10,
                textTransform: "uppercase",
                color: isPremium
                  ? theme.colors.block.pistachio
                  : theme.colors.muted,
              }}
            >
              {isPremium ? "★ Premium · renova em 24 dias" : "Plano Free"}
            </Text>
          </View>
        </View>

        {/* Stats strip */}
        <View
          style={{
            paddingHorizontal: 18,
            paddingBottom: 18,
            flexDirection: "row",
            gap: 8,
          }}
        >
          <StatCard
            value={String(pantryItems.length || 18)}
            label="alimentos cadastrados"
          />
          <StatCard value="12 alimentos" label="salvos em maio" accent />
        </View>

        <View style={{ paddingHorizontal: 18, paddingBottom: 18 }}>
          {isPremium ? <PremiumStatusCard /> : <UpgradeCard />}
        </View>

        {/* Conta */}
        <ProfSection title="Conta">
          <ProfRow
            icon={<User size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Dados pessoais"
            sub="Nome, email, foto"
            onPress={() => navigation.navigate("EditAccount")}
          />
          <ProfRow
            icon={<Lock size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Senha e segurança"
            sub="Trocar senha · biometria"
          />
          <ProfRow
            icon={<Mail size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Preferências de contato"
            sub="Email e WhatsApp"
          />
        </ProfSection>

        {/* Família & Casa */}
        <ProfSection title="Família & Casa">
          <ProfRow
            icon={
              <Package size={16} color={theme.colors.ink} strokeWidth={1.6} />
            }
            label={houseName || "Perfil da casa"}
            sub={`${memberCount} pessoa${memberCount !== 1 ? "s" : ""} · ${restrictions.length} restrição${restrictions.length !== 1 ? "ões" : ""}`}
          />
          <ProfRow
            icon={
              <Users size={16} color={theme.colors.ink} strokeWidth={1.6} />
            }
            label="Membros da família"
            sub="Pedro, Luiza"
            badge={isPremium ? undefined : "PREMIUM"}
          />
          <ProfRow
            icon={<Leaf size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Restrições alimentares"
            sub={
              restrictions.length > 0
                ? `${restrictions.length} restrição${restrictions.length !== 1 ? "ões" : ""}`
                : "Nenhuma"
            }
          />
        </ProfSection>

        {/* Aplicativo */}
        <ProfSection title="Aplicativo">
          <ProfRow
            icon={<Bell size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Notificações"
            sub="Push · email · WhatsApp"
          />
          <ProfRow
            icon={
              <Calendar size={16} color={theme.colors.ink} strokeWidth={1.6} />
            }
            label="Alertas de validade"
            sub="30 / 15 / 5 dias"
          />
          <ProfRow
            icon={
              <Settings size={16} color={theme.colors.ink} strokeWidth={1.6} />
            }
            label="Preferências"
            sub="Idioma · tema · unidades"
          />
        </ProfSection>

        {/* Privacidade & Suporte */}
        <ProfSection title="Privacidade & Suporte">
          <ProfRow
            icon={<Eye size={16} color={theme.colors.ink} strokeWidth={1.6} />}
            label="Privacidade e LGPD"
          />
          <ProfRow
            icon={
              <Heart size={16} color={theme.colors.ink} strokeWidth={1.6} />
            }
            label="Ajude o DespensaCerta"
            sub="Avalie · indique amigos"
          />
          <ProfRow
            icon={
              <HelpCircle
                size={16}
                color={theme.colors.ink}
                strokeWidth={1.6}
              />
            }
            label="Central de ajuda"
            sub="FAQ · falar com a gente"
          />
        </ProfSection>

        {/* Logout */}
        <View
          style={{ paddingHorizontal: 18, paddingTop: 8, paddingBottom: 28 }}
        >
          <Pressable
            onPress={() => setLogoutOpen(true)}
            style={({ pressed }) => ({
              backgroundColor: theme.colors.surface,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: theme.colors.hairline,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                backgroundColor: theme.colors.dangerSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LogOut size={16} color={theme.colors.danger} strokeWidth={1.6} />
            </View>
            <Text
              style={{
                flex: 1,
                fontFamily: theme.fontFamily.sans.medium,
                fontSize: 14,
                color: theme.colors.danger,
              }}
            >
              Sair da conta
            </Text>
            <ArrowRight
              size={16}
              color={theme.colors.danger}
              strokeWidth={1.6}
            />
          </Pressable>

          <Text
            style={{
              fontFamily: theme.fontFamily.mono.regular,
              fontSize: 9.5,
              letterSpacing: 0.12 * 9.5,
              textTransform: "uppercase",
              color: theme.colors.muted2,
              textAlign: "center",
              marginTop: 18,
            }}
          >
            DESPENSACERTA · VERSÃO 1.0 · BR
          </Text>
        </View>
      </ScrollView>

      {logoutOpen && (
        <LogoutSheet
          onCancel={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />
      )}
    </View>
  );
}
