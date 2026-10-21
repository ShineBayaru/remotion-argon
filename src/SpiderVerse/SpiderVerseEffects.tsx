import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadRubik } from "@remotion/google-fonts/Rubik";
import { MicIconSVG } from "./ComicIcons";

const { fontFamily: montserratFamily } = loadMontserrat("normal", {
  weights: ["700", "800", "900"],
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
});

const { fontFamily: rubikFamily } = loadRubik("normal", {
  weights: ["800", "900"],
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
});

export const COMIC_DISPLAY_FONT = `${rubikFamily}, ${montserratFamily}, sans-serif`;
export const COMIC_BODY_FONT = `${montserratFamily}, sans-serif`;

/**
 * Spider-Verse animates on 2s (15fps) for that authentic stop-motion comic feel.
 */
export const useSteppedFrame = (step = 2): number => {
  const frame = useCurrentFrame();
  return Math.floor(frame / step) * step;
};

/**
 * Deterministic pseudo-random generator for glitch/shake effects
 */
export const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Ben-Day Halftone Dots & Cross-Hatching Texture Overlay
 */
export const HalftoneOverlay: React.FC<{
  opacity?: number;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  vignetteIntensity?: number;
}> = ({
  opacity = 0.16,
  dotColor = "#00f0ff",
  dotSize = 2.2,
  spacing = 14,
  vignetteIntensity = 0.6,
}) => {
  const patternId = React.useId();
  const hatchId = React.useId();

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      <svg width="100%" height="100%" style={{ opacity }}>
        <defs>
          <pattern
            id={patternId}
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(18)"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={dotSize}
              fill={dotColor}
            />
          </pattern>
          <pattern
            id={hatchId}
            width={10}
            height={10}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="#000000"
              strokeWidth="1.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        <rect width="100%" height="100%" fill={`url(#${hatchId})`} />
      </svg>

      {/* Heavy Comic Vignette & Ink Frame */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, transparent 55%, rgba(5, 3, 15, ${vignetteIntensity}) 100%)`,
          boxShadow: "inset 0 0 0 12px #07060c, inset 0 0 0 16px #000000",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Chromatic Aberration / RGB Split Glitch Wrapper
 */
export const ChromaticAberration: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  glitchActive?: boolean;
}> = ({ children, intensity = 4, glitchActive = false }) => {
  const frame = useSteppedFrame(2);
  const jitter = glitchActive
    ? (pseudoRandom(frame) - 0.5) * intensity * 3.5
    : 0;
  const shift = intensity + Math.abs(jitter);

  return (
    <AbsoluteFill>
      {/* Cyan Channel Offset */}
      <AbsoluteFill
        style={{
          transform: `translate(${-shift}px, ${jitter * 0.4}px)`,
          filter: "drop-shadow(-3px 0 0 rgba(0, 240, 255, 0.75))",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Crimson/Magenta Channel Offset */}
      <AbsoluteFill
        style={{
          transform: `translate(${shift}px, ${-jitter * 0.4}px)`,
          filter: "drop-shadow(3px 0 0 rgba(255, 0, 85, 0.75))",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* Main Crisp Layer */}
      <AbsoluteFill>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Classic Spider-Verse Slanted Comic Narrator Caption Box with entry & optional exit
 */
export const NarratorBox: React.FC<{
  text: string;
  subtext?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  style?: React.CSSProperties;
  delay?: number;
  exitFrame?: number;
  skew?: number;
  x?: number | string;
  y?: number | string;
  rotation?: number;
}> = ({
  text,
  subtext,
  bgColor = "#FFE600",
  textColor = "#08070C",
  accentColor = "#FF0055",
  style,
  delay = 0,
  exitFrame,
  skew = -4,
  x,
  y,
  rotation = -1.5,
}) => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  if (frame < delay) return null;
  if (exitFrame !== undefined && frame > exitFrame) return null;

  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 11, stiffness: 220, mass: 0.7 },
  });

  const exitProgress =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const scale = interpolate(pop, [0, 1], [0.4, 1]) * exitProgress;
  const rotate = interpolate(pop, [0, 1], [-8, rotation]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 40,
        transform: `scale(${scale}) rotate(${rotate}deg) skewX(${skew}deg)`,
        transformOrigin: "left center",
        backgroundColor: bgColor,
        color: textColor,
        border: "5px solid #000000",
        boxShadow: `10px 10px 0px #000000, 14px 14px 0px ${accentColor}`,
        padding: "14px 26px",
        fontFamily: COMIC_DISPLAY_FONT,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 48,
          height: "100%",
          backgroundImage:
            "radial-gradient(#000000 22%, transparent 23%)",
          backgroundSize: "8px 8px",
          opacity: 0.14,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          fontSize: 27,
          fontWeight: 900,
          letterSpacing: "1px",
          textTransform: "uppercase",
          lineHeight: 1.15,
        }}
      >
        {text}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            marginTop: 5,
            color: textColor,
            opacity: 0.88,
            fontFamily: COMIC_BODY_FONT,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

/**
 * Explosive Comic Onomatopoeia / Action Sound Effect ("ТАС!", "БЭНГ!", "3 KILLS!")
 */
export const ActionBurst: React.FC<{
  text: string;
  color?: string;
  bgColor?: string;
  delay?: number;
  exitFrame?: number;
  x?: number | string;
  y?: number | string;
  size?: number;
  rotation?: number;
}> = ({
  text,
  color = "#FFFFFF",
  bgColor = "#FF0055",
  delay = 0,
  exitFrame,
  x = "50%",
  y = "50%",
  size = 54,
  rotation = -8,
}) => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  if (frame < delay) return null;
  if (exitFrame !== undefined && frame > exitFrame) return null;

  const burst = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 260, mass: 0.6 },
  });

  const jitterX = (pseudoRandom(frame * 3) - 0.5) * 5;
  const jitterY = (pseudoRandom(frame * 7) - 0.5) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 45,
        transform: `translate(-50%, -50%) translate(${jitterX}px, ${jitterY}px) scale(${burst}) rotate(${rotation}deg)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          backgroundColor: bgColor,
          border: "5px solid #000000",
          padding: "12px 28px",
          boxShadow: "9px 9px 0px #000000, -4px -4px 0px #00F0FF",
          clipPath:
            "polygon(3% 0%, 97% 5%, 100% 93%, 90% 100%, 5% 96%, 0% 10%)",
        }}
      >
        <span
          style={{
            fontFamily: COMIC_DISPLAY_FONT,
            fontSize: size,
            fontWeight: 900,
            color,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            textShadow: "3px 3px 0px #000000, -2px -2px 0px #000000",
            display: "block",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

/**
 * Voiceover Script Sync Subtitle Bar with Word-by-Word Highlighting & Crisp SVG Icon
 */
export const VoiceoverTrackSubtitle: React.FC<{
  lines: Array<{ startFrame: number; endFrame: number; text: string }>;
}> = ({ lines }) => {
  const frame = useCurrentFrame();
  const activeLine = lines.find(
    (l) => frame >= l.startFrame && frame < l.endFrame
  );

  if (!activeLine) return null;

  const progress = interpolate(
    frame,
    [activeLine.startFrame, activeLine.startFrame + 8],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const words = activeLine.text.split(" ");
  const lineDuration = activeLine.endFrame - activeLine.startFrame;
  const currentWordIndex = Math.floor(
    interpolate(
      frame,
      [activeLine.startFrame, activeLine.startFrame + lineDuration * 0.88],
      [0, words.length],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${(1 - progress) * 12}px)`,
        opacity: progress,
        zIndex: 90,
        maxWidth: "86%",
        backgroundColor: "rgba(7, 6, 15, 0.94)",
        border: "3px solid #00F0FF",
        boxShadow: "6px 6px 0px #000000, -3px -3px 0px #FF0055",
        padding: "10px 26px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontSize: 12,
          fontWeight: 900,
          color: "#00F0FF",
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: 4,
          fontFamily: COMIC_DISPLAY_FONT,
        }}
      >
        <MicIconSVG size={15} color="#00F0FF" />
        <span>NARRATOR VOICEOVER SYNC</span>
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          fontFamily: COMIC_BODY_FONT,
          lineHeight: 1.35,
          textShadow: "2px 2px 0px #000000",
        }}
      >
        {words.map((word, idx) => {
          const isSpoken = idx <= currentWordIndex;
          const isCurrent = idx === currentWordIndex;
          return (
            <span
              key={idx}
              style={{
                color: isCurrent
                  ? "#FFE600"
                  : isSpoken
                  ? "#FFFFFF"
                  : "rgba(255,255,255,0.45)",
                display: "inline-block",
                marginRight: 7,
                transform: isCurrent ? "scale(1.06)" : "scale(1)",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const ImpactFrameFlash: React.FC<{
  triggerFrame: number;
  duration?: number;
  color?: string;
}> = ({ triggerFrame, duration = 3, color = "#00F0FF" }) => {
  const frame = useCurrentFrame();
  if (frame < triggerFrame || frame >= triggerFrame + duration) return null;
  const isInvert = (frame - triggerFrame) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: isInvert ? color : "#FFFFFF",
        mixBlendMode: "difference",
        opacity: 0.72,
        pointerEvents: "none",
        zIndex: 80,
      }}
    />
  );
};

export const SpeedLines: React.FC<{
  color?: string;
  density?: number;
}> = ({ color = "#00F0FF", density = 32 }) => {
  const frame = useSteppedFrame(2);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 30 }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {Array.from({ length: density }).map((_, i) => {
          const angle = (i / density) * Math.PI * 2 + frame * 0.03;
          const r1 = 360 + pseudoRandom(i + frame) * 140;
          const r2 = 1150;
          const x1 = 960 + Math.cos(angle) * r1;
          const y1 = 540 + Math.sin(angle) * r1;
          const x2 = 960 + Math.cos(angle) * r2;
          const y2 = 540 + Math.sin(angle) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 3 === 0 ? "#FFE600" : color}
              strokeWidth={3 + (i % 4) * 2}
              opacity={0.55}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
