import React from "react";

/**
 * Crisp SVG Headshot Skull + Crosshair Icon (Replaces broken unicode emojis)
 */
export const HeadshotSkullIcon: React.FC<{
  size?: number;
  color?: string;
  accent?: string;
}> = ({ size = 32, color = "#FF0055", accent = "#FFE600" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Outer Target Ring */}
    <circle
      cx="32"
      cy="32"
      r="26"
      stroke={color}
      strokeWidth="5"
      strokeDasharray="18 8"
    />
    <line x1="32" y1="0" x2="32" y2="14" stroke={accent} strokeWidth="5" />
    <line x1="32" y1="50" x2="32" y2="64" stroke={accent} strokeWidth="5" />
    <line x1="0" y1="32" x2="14" y2="32" stroke={accent} strokeWidth="5" />
    <line x1="50" y1="32" x2="64" y2="32" stroke={accent} strokeWidth="5" />
    {/* Stylized Comic Skull */}
    <path
      d="M20 30C20 22 25 17 32 17C39 17 44 22 44 30C44 35 41 38 39 40V46H25V40C23 38 20 35 20 30Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth="3.5"
    />
    <circle cx="27.5" cy="30" r="3.5" fill="#000000" />
    <circle cx="36.5" cy="30" r="3.5" fill="#000000" />
    <line x1="29" y1="41" x2="29" y2="46" stroke="#000000" strokeWidth="2.5" />
    <line x1="35" y1="41" x2="35" y2="46" stroke="#000000" strokeWidth="2.5" />
  </svg>
);

/**
 * Crisp SVG Microphone Icon for Voice Comms & Narrator
 */
export const MicIconSVG: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#00F0FF",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="8"
      y="2"
      width="8"
      height="12"
      rx="4"
      fill={color}
      stroke="#000"
      strokeWidth="2"
    />
    <path
      d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="22"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="8"
      y1="22"
      x2="16"
      y2="22"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * FACEIT Skill Level Badge SVG (Level 1 - 10 with dynamic arc)
 */
export const FaceitLevelBadge: React.FC<{
  level: number;
  size?: number;
  glow?: boolean;
}> = ({ level, size = 110, glow = false }) => {
  const isLvl10 = level === 10;
  const mainColor = isLvl10 ? "#FF0033" : level >= 8 ? "#FF6600" : "#FFE600";
  const arcFraction = level / 10;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - arcFraction);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        filter: glow ? `drop-shadow(0 0 18px ${mainColor})` : undefined,
      }}
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="#0D0B18"
        stroke="#000000"
        strokeWidth="6"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#252038"
        strokeWidth="9"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={mainColor}
        strokeWidth="9"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="63"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize={isLvl10 ? "38" : "42"}
        fontWeight="900"
        fontFamily="sans-serif"
      >
        {level}
      </text>
    </svg>
  );
};

/**
 * Mechanical Clockwork Gear SVG for "Цагны механизм шиг" Flow State
 */
export const ClockGearSVG: React.FC<{
  size?: number;
  rotation: number;
  color?: string;
}> = ({ size = 180, rotation, color = "#00F0FF" }) => {
  const teeth = 12;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i * 360) / teeth;
        return (
          <rect
            key={i}
            x="90"
            y="8"
            width="20"
            height="28"
            rx="3"
            fill={color}
            stroke="#000"
            strokeWidth="4"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      <circle
        cx="100"
        cy="100"
        r="72"
        fill="#0B0917"
        stroke="#000"
        strokeWidth="6"
      />
      <circle
        cx="100"
        cy="100"
        r="62"
        fill="none"
        stroke={color}
        strokeWidth="6"
      />
      <circle
        cx="100"
        cy="100"
        r="26"
        fill={color}
        stroke="#000"
        strokeWidth="5"
      />
      <line x1="100" y1="28" x2="100" y2="172" stroke={color} strokeWidth="6" />
      <line x1="28" y1="100" x2="172" y2="100" stroke={color} strokeWidth="6" />
    </svg>
  );
};

/**
 * Dynamic CS2 Crosshair with Recoil Expansion & Hitmarker Flash
 */
export const AnimatedCSCrosshair: React.FC<{
  x: number;
  y: number;
  spread?: number;
  isHit?: boolean;
}> = ({ x, y, spread = 10, isHit = false }) => {
  const color = isHit ? "#FF0055" : "#00FF66";
  const length = 18;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 45,
      }}
    >
      <svg width="140" height="140" viewBox="-70 -70 140 140">
        {/* Top, Bottom, Left, Right Crosshair Lines */}
        <line
          x1="0"
          y1={-spread - length}
          x2="0"
          y2={-spread}
          stroke="#000"
          strokeWidth="7"
        />
        <line
          x1="0"
          y1={-spread - length}
          x2="0"
          y2={-spread}
          stroke={color}
          strokeWidth="3.5"
        />

        <line
          x1="0"
          y1={spread}
          x2="0"
          y2={spread + length}
          stroke="#000"
          strokeWidth="7"
        />
        <line
          x1="0"
          y1={spread}
          x2="0"
          y2={spread + length}
          stroke={color}
          strokeWidth="3.5"
        />

        <line
          x1={-spread - length}
          y1="0"
          x2={-spread}
          y2="0"
          stroke="#000"
          strokeWidth="7"
        />
        <line
          x1={-spread - length}
          y1="0"
          x2={-spread}
          y2="0"
          stroke={color}
          strokeWidth="3.5"
        />

        <line
          x1={spread}
          y1="0"
          x2={spread + length}
          y2="0"
          stroke="#000"
          strokeWidth="7"
        />
        <line
          x1={spread}
          y1="0"
          x2={spread + length}
          y2="0"
          stroke={color}
          strokeWidth="3.5"
        />

        {/* Center Dot */}
        <circle cx="0" cy="0" r="3" fill={color} stroke="#000" strokeWidth="1.5" />

        {/* Hitmarker Diagonal X Flash */}
        {isHit && (
          <>
            <line
              x1="-28"
              y1="-28"
              x2="-10"
              y2="-10"
              stroke="#FFE600"
              strokeWidth="5"
            />
            <line
              x1="28"
              y1="-28"
              x2="10"
              y2="-10"
              stroke="#FFE600"
              strokeWidth="5"
            />
            <line
              x1="-28"
              y1="28"
              x2="-10"
              y2="10"
              stroke="#FFE600"
              strokeWidth="5"
            />
            <line
              x1="28"
              y1="28"
              x2="10"
              y2="10"
              stroke="#FFE600"
              strokeWidth="5"
            />
          </>
        )}
      </svg>
    </div>
  );
};
