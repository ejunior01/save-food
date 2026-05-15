import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

import React from 'react';
import { theme } from '@ui/styles/theme';

const BAG_COLOR = '#C4914A';
const TEXT_COLOR = theme.colors.primary;

function PaperBagIcon() {
  return (
    <Svg width={34} height={40} viewBox="0 0 34 40">
      {/* Handle arch */}
      <Path
        d="M10 14 C10 4 24 4 24 14"
        stroke={BAG_COLOR}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Bag body */}
      <Path
        d="M2 14 L32 14 L32 34 Q32 38 28 38 L6 38 Q2 38 2 34 Z"
        fill={BAG_COLOR}
      />
      {/* Fold shadow at top */}
      <Rect x="2" y="14" width="30" height="5" fill="rgba(0,0,0,0.18)" />
    </Svg>
  );
}

export function Logo() {
  return (
    <View style={styles.container}>
      <PaperBagIcon />
      <Text style={styles.text}>DespensaCerta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontFamily: theme.fontFamily.sans.semiBold,
    fontSize: 22,
    letterSpacing: -0.4,
    includeFontPadding: false,
    color: TEXT_COLOR,
  },
});
