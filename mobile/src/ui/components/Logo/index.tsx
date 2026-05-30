import * as React from "react";

import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
  SvgProps,
  TSpan,
  Text,
} from "react-native-svg";

const LogoHorizontal = ({ width = 640, height = 180, style,...props }: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    width={width}
    height={height}
    viewBox="0 0 640 180"
    preserveAspectRatio="xMidYMid meet"
    style={style}
  >
    <Defs>
      <LinearGradient id="a" x1={0} x2={0} y1={0} y2={1}>
        <Stop offset="0%" stopColor="#1F4D2E" />
        <Stop offset="100%" stopColor="#266040" />
      </LinearGradient>
    </Defs>
    <G transform="matrix(.35 0 0 .35 20 20)">
      <Rect width={400} height={400} fill="none" rx={72} />
      <Path
        fill="#3DA672"
        d="M160 120c2.91-26.087-12.748-49.3-35.788-53.058-5.147 22.77 10.51 45.984 35.788 53.058ZM200 120c17-20 17-48 0-64-17 16-17 44 0 64ZM240 120c25.277-7.074 40.935-30.288 35.788-53.058C252.748 70.7 237.09 93.913 240 120Z"
      />
      <Rect width={204} height={240} x={98} y={120} fill="url(#a)" rx={22} />
      <Path
        stroke="rgba(255,255,255,0.14)"
        strokeLinecap="round"
        strokeWidth={3}
        d="M200 120v108"
      />
      <Rect
        width={84}
        height={88}
        x={108}
        y={132}
        fill="rgba(255,255,255,0.08)"
        rx={14}
      />
      <Rect
        width={84}
        height={88}
        x={208}
        y={132}
        fill="rgba(255,255,255,0.08)"
        rx={14}
      />
      <Circle cx={174} cy={176} r={8} fill="rgba(250,245,235,0.72)" />
      <Circle cx={226} cy={176} r={8} fill="rgba(250,245,235,0.72)" />
      <Rect
        width={204}
        height={8}
        x={98}
        y={225}
        fill="rgba(255,255,255,0.24)"
        rx={4}
      />
      <Circle cx={136} cy={284} r={23} fill="#F2C57C" opacity={0.95} />
      <Circle cx={200} cy={290} r={18} fill="#D5E2A8" opacity={0.9} />
      <Circle cx={262} cy={282} r={21} fill="#EAB5A8" opacity={0.88} />
      <Rect
        width={28}
        height={16}
        x={116}
        y={358}
        fill="#1A2B1F"
        opacity={0.5}
        rx={8}
      />
      <Rect
        width={28}
        height={16}
        x={256}
        y={358}
        fill="#1A2B1F"
        opacity={0.5}
        rx={8}
      />
    </G>
    <Text
      xmlSpace="preserve"
      x={142}
      y={120}
      fill="#1F4D2E"
      fontFamily="'Instrument Serif', Georgia, serif"
      fontSize={62}
    >
      {"Despensa"}
      <TSpan fill="#3DA672" fontStyle="italic">
        {"Certa"}
      </TSpan>
    </Text>
  </Svg>
);

const LogoIcon = ({ width = 400, height = 400, style,...props }: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    width={width}
    height={height}
    viewBox="0 0 400 400"
    preserveAspectRatio="xMidYMid meet"
    style={style}
  >
    <Defs>
      <RadialGradient id="c" cx="50%" cy="80%" r="55%">
        <Stop offset="0%" stopColor="#F2C57C" stopOpacity={0.22} />
        <Stop offset="100%" stopColor="#F2C57C" stopOpacity={0} />
      </RadialGradient>
      <LinearGradient id="a" x1={0} x2={0} y1={0} y2={1}>
        <Stop offset="0%" stopColor="#1F4D2E" />
        <Stop offset="100%" stopColor="#266040" />
      </LinearGradient>
    </Defs>
    <Rect width={width} height={height} fill="#FAF5EB" rx={72} />
    <Path
      fill="#3DA672"
      d="M160 120c2.91-26.087-12.748-49.3-35.788-53.058-5.147 22.77 10.51 45.984 35.788 53.058ZM200 120c17-20 17-48 0-64-17 16-17 44 0 64ZM240 120c25.277-7.074 40.935-30.288 35.788-53.058C252.748 70.7 237.09 93.913 240 120Z"
    />
    <Rect
      width={204}
      height={240}
      x={98}
      y={120}
      fill="url(#a)"
      filter="url(#b)"
      rx={22}
    />
    <Rect
      width={204}
      height={132}
      x={98}
      y={228}
      fill="url(#c)"
      rx={0}
      style={{
        rx: "0 0 22px 22px",
      }}
    />
    <Path
      stroke="rgba(255,255,255,0.14)"
      strokeLinecap="round"
      strokeWidth={3}
      d="M200 120v108"
    />
    <Rect
      width={84}
      height={88}
      x={108}
      y={132}
      fill="rgba(255,255,255,0.08)"
      rx={14}
    />
    <Rect
      width={84}
      height={88}
      x={208}
      y={132}
      fill="rgba(255,255,255,0.08)"
      rx={14}
    />
    <Circle cx={174} cy={176} r={8} fill="rgba(250,245,235,0.72)" />
    <Circle cx={226} cy={176} r={8} fill="rgba(250,245,235,0.72)" />
    <Rect
      width={204}
      height={8}
      x={98}
      y={225}
      fill="rgba(255,255,255,0.24)"
      rx={4}
    />
    <Circle cx={136} cy={284} r={23} fill="#F2C57C" opacity={0.95} />
    <Circle cx={200} cy={290} r={18} fill="#D5E2A8" opacity={0.9} />
    <Circle cx={262} cy={282} r={21} fill="#EAB5A8" opacity={0.88} />
    <Rect
      width={28}
      height={16}
      x={116}
      y={358}
      fill="#1A2B1F"
      opacity={0.5}
      rx={8}
    />
    <Rect
      width={28}
      height={16}
      x={256}
      y={358}
      fill="#1A2B1F"
      opacity={0.5}
      rx={8}
    />
  </Svg>
);

type LogoProps = SvgProps & {
  variant?: "full" | "icon";
  inverted?: boolean;
  size?: number;
};

export function Logo({
  variant = "full",
  size,
  width,
  height,
  ...props
}: LogoProps) {
  if (variant === "icon") {
    const finalSize = size ?? width ?? height ?? 40;

    return <LogoIcon width={finalSize} height={finalSize} {...props} />;
  }

  const finalWidth = size ?? width ?? 120;
  const finalHeight = height ?? (Number(finalWidth) * 180) / 640;

  return <LogoHorizontal width={finalWidth} height={finalHeight} {...props} />;
}
