import React, { useState, useRef } from 'react';
import { ActivityIndicator, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraPermissions, CameraView } from 'expo-camera';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronLeft, Zap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { AppText } from '@ui/components/AppText';
import { Button } from '@ui/components/Button';
import { Input } from '@ui/components/Input';
import { LocationPicker } from '@ui/components/LocationPicker';
import { LocationsSheet, type LocationsSheetHandle } from '@ui/components/LocationsSheet';
import { theme } from '@ui/styles/theme';
import { useCreatePantryItem } from '@app/hooks/mutations/useCreatePantryItem';
import { useAppData } from '@app/context/AppDataContext';
import { useAuth } from '@app/context/AuthContext';
import { DEFAULT_LOCATION_ID } from '@app/types';
import { OpenFoodFactsService, OpenFoodFactsProduct } from '@app/services/OpenFoodFactsService';
import { getCategoryIcon } from '@app/utils/categories';
import { styles } from './styles';

type ScanMode = 'barcode' | 'manual';
type ScanState = 'idle' | 'loading' | 'found' | 'not_found';

export function Scanner() {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const { storageLocations } = useAppData();
  const { plan, upgradeToPremium } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [mode, setMode] = useState<ScanMode>('barcode');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [foundProduct, setFoundProduct] = useState<OpenFoodFactsProduct | null>(null);
  const [expiryDays, setExpiryDays] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [productName, setProductName] = useState('');
  const [manualExpiryDays, setManualExpiryDays] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState(DEFAULT_LOCATION_ID);
  const sheetRef = useRef<BottomSheet>(null);
  const locationsSheetRef = useRef<LocationsSheetHandle>(null);
  const { createPantryItem, isLoading: isSaving } = useCreatePantryItem();

  if (!permission) {
    return <View style={styles.permissionContainer} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ fontSize: 48 }}>📷</Text>
        <AppText size="lg" family="semiBold" align="center">
          Acesso à câmera necessário
        </AppText>
        <AppText size="sm" color={theme.colors.textMuted} align="center">
          Precisamos da câmera para escanear códigos de barras dos seus produtos.
        </AppText>
        <Button
          variant="primary"
          size="lg"
          label="Conceder permissão"
          onPress={requestPermission}
          style={{ marginTop: 8, width: '100%' }}
        />
      </View>
    );
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanState !== 'idle') { return; }
    setScannedCode(data);
    setScanState('loading');
    sheetRef.current?.snapToIndex(1);

    try {
      const product = await OpenFoodFactsService.searchByBarcode(data);
      if (product) {
        setFoundProduct(product);
        setQuantity(String(product.quantity));
        setScanState('found');
      } else {
        setScanState('not_found');
      }
    } catch {
      setScanState('not_found');
    }
  }

  function resetScan() {
    setScannedCode(null);
    setScanState('idle');
    setFoundProduct(null);
    setExpiryDays('');
    setQuantity('1');
    sheetRef.current?.snapToIndex(0);
  }

  async function handleAddProduct() {
    if (!foundProduct || !expiryDays) { return; }
    const days = parseInt(expiryDays, 10);
    if (isNaN(days) || days < 0) { return; }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await createPantryItem({
      name: foundProduct.name,
      category: foundProduct.category,
      emoji: foundProduct.emoji,
      quantity: parseFloat(quantity) || 1,
      unit: foundProduct.unit,
      expiresAt,
      locationId: selectedLocationId,
    });
    navigation.goBack();
  }

  async function handleManualAdd() {
    if (!productName || !manualExpiryDays) { return; }
    const days = parseInt(manualExpiryDays, 10);
    if (isNaN(days) || days < 0) { return; }
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    await createPantryItem({
      name: productName,
      category: 'Geral',
      emoji: '🛒',
      quantity: 1,
      unit: 'un',
      expiresAt,
      locationId: selectedLocationId,
    });
    setProductName('');
    setManualExpiryDays('');
    navigation.goBack();
  }

  function renderBarcodeContent() {
    if (scanState === 'idle') {
      return (
        <View style={{ gap: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 36 }}>🔍</Text>
          <AppText size="sm" color={theme.colors.textMuted} align="center">
            Aguardando leitura do código de barras...
          </AppText>
        </View>
      );
    }

    if (scanState === 'loading') {
      return (
        <View style={{ gap: 12, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <AppText size="sm" color={theme.colors.textMuted} align="center">
            Buscando produto...
          </AppText>
          <AppText size="xs" color={theme.colors.textMuted} align="center">
            {scannedCode}
          </AppText>
        </View>
      );
    }

    if (scanState === 'not_found') {
      return (
        <View style={{ gap: 12, alignItems: 'center' }}>
          <Text style={{ fontSize: 36 }}>❌</Text>
          <AppText size="base" family="semiBold" align="center">
            Produto não encontrado
          </AppText>
          <AppText size="sm" color={theme.colors.textMuted} align="center">
            Código {scannedCode} não consta no Open Food Facts.
          </AppText>
          <Button
            variant="secondary"
            size="md"
            label="Adicionar manualmente"
            onPress={() => { setMode('manual'); resetScan(); }}
            style={{ width: '100%' }}
          />
          <Button
            variant="ghost"
            size="md"
            label="Escanear outro"
            onPress={resetScan}
            style={{ width: '100%' }}
          />
        </View>
      );
    }

    if (scanState === 'found' && foundProduct) {
      return (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontSize: 40 }}>{getCategoryIcon(foundProduct.category)}</Text>
            <View style={{ flex: 1 }}>
              <AppText size="base" family="semiBold" numberOfLines={2}>
                {foundProduct.name}
              </AppText>
              {foundProduct.brand ? (
                <AppText size="sm" color={theme.colors.textMuted}>
                  {foundProduct.brand} · {foundProduct.category}
                </AppText>
              ) : (
                <AppText size="sm" color={theme.colors.textMuted}>
                  {foundProduct.category}
                </AppText>
              )}
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Input
                label="Quantidade"
                placeholder="1"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Validade (dias)"
                placeholder="ex: 7"
                value={expiryDays}
                onChangeText={setExpiryDays}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <LocationPicker
            locations={storageLocations}
            selectedId={selectedLocationId}
            plan={plan}
            onSelect={setSelectedLocationId}
            onManage={() => locationsSheetRef.current?.open()}
          />

          <Button
            variant="primary"
            size="lg"
            label="Adicionar à despensa"
            onPress={handleAddProduct}
            loading={isSaving}
            disabled={!expiryDays || isSaving}
            style={{ width: '100%' }}
          />
          <Button
            variant="ghost"
            size="sm"
            label="Escanear outro"
            onPress={resetScan}
            style={{ width: '100%' }}
          />
        </View>
      );
    }

    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanState === 'idle' ? handleBarCodeScanned : undefined}
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={[styles.darkArea, { height: top + 56 }]} />

          {/* Header */}
          <View style={[styles.header, { paddingTop: top }]}>
            <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
              <ChevronLeft size={22} color="#fff" strokeWidth={2} />
            </Pressable>
            <AppText size="base" family="semiBold" color="#fff">
              Escanear produto
            </AppText>
            <Pressable style={styles.iconButton}>
              <Zap size={20} color="#fff" strokeWidth={1.8} />
            </Pressable>
          </View>

          {/* Scan area row */}
          <View style={[styles.scanRow, { flex: 1 }]}>
            <View style={[styles.darkArea, { flex: 1 }]} />
            <View style={styles.scanArea}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            <View style={[styles.darkArea, { flex: 1 }]} />
          </View>

          {/* Hint text below scan area */}
          <View style={[styles.darkArea, { paddingVertical: 16, alignItems: 'center' }]}>
            <AppText size="sm" color="rgba(255,255,255,0.7)" align="center">
              Aponte para o código de barras do produto
            </AppText>
          </View>

          {/* Bottom filler */}
          <View style={[styles.darkArea, { flex: 2 }]} />
        </View>
      </CameraView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={['28%', '65%']}
        backgroundStyle={{ backgroundColor: theme.colors.surface }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.border, width: 40 }}
      >
        <BottomSheetView style={styles.sheetContent}>
          {/* Mode tabs */}
          <View style={styles.modeTabs}>
            {(['barcode', 'manual'] as ScanMode[]).map((m) => (
              <Pressable
                key={m}
                style={[styles.modeTab, mode === m && styles.modeTabActive]}
                onPress={() => { setMode(m); if (m === 'barcode') { resetScan(); } }}
              >
                <AppText
                  size="sm"
                  family="medium"
                  color={mode === m ? theme.colors.text : theme.colors.textMuted}
                >
                  {m === 'barcode' ? 'Código de barras' : 'Manual'}
                </AppText>
              </Pressable>
            ))}
          </View>

          {mode === 'barcode' ? renderBarcodeContent() : (
            <View style={{ gap: 12 }}>
              <Input
                label="Nome do produto"
                placeholder="Ex: Leite integral"
                value={productName}
                onChangeText={setProductName}
              />
              <Input
                label="Validade (dias)"
                placeholder="Ex: 7"
                value={manualExpiryDays}
                onChangeText={setManualExpiryDays}
                keyboardType="number-pad"
              />
              <LocationPicker
                locations={storageLocations}
                selectedId={selectedLocationId}
                plan={plan}
                onSelect={setSelectedLocationId}
                onManage={() => locationsSheetRef.current?.open()}
              />
              <Button
                variant="primary"
                size="lg"
                label="Adicionar produto"
                onPress={handleManualAdd}
                loading={isSaving}
                disabled={!productName || !manualExpiryDays || isSaving}
                style={{ width: '100%' }}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>

      <LocationsSheet
        ref={locationsSheetRef}
        locations={storageLocations}
        plan={plan}
        onUpgrade={upgradeToPremium}
      />
    </View>
  );
}
