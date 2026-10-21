import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { ParallaxCameraState, ParallaxPlane } from "./ParallaxLayer";
import { useSteppedFrame } from "./SpiderVerseEffects";

export type ShineeMood =
  | "tired"
  | "focus"
  | "smirk"
  | "flow"
  | "shock"
  | "rage";

const MOOD_TO_FILE: Record<ShineeMood, string> = {
  tired: "comic/ch1/shinee_expr_1_tired.png",
  focus: "comic/ch1/shinee_expr_3_focus.png",
  smirk: "comic/ch1/shinee_expr_4_smirk.png",
  flow: "comic/ch1/shinee_expr_5_flow.png",
  shock: "comic/ch1/shinee_expr_6_shock.png",
  rage: "comic/ch1/shinee_expr_7_rage.png",
};

interface MultiLayerShineeRigProps {
  camera: ParallaxCameraState;
  mood: ShineeMood;
  /** Optional alternate full-bleed or cutout portrait override ("focus_closeup" | "flow_lightning") */
  angleVariant?: "side_rig" | "focus_closeup" | "flow_lightning";
  /** Content rendered BEHIND Shinee's cutout body and IN FRONT of the bedroom wall! */
  behindCharacterLayer?: React.ReactNode;
  /** Content rendered IN FRONT of Shinee (HUD, foreground debris, etc.) */
  foregroundOverlay?: React.ReactNode;
  /** Rim light color around Shinee cutout */
  rimColor?: string;
  /** Character X position offset in px */
  charX?: number;
  /** Character Y position offset in px */
  charY?: number;
  /** Character scale */
  charScale?: number;
  /** Show the foreground curved gaming monitor on the left */
  showMonitorFg?: boolean;
}

/**
 * 4-Plane 2.5D Parallax Rig for Shinee inside his gaming room:
 * Plane 1 (depth -0.1): Dark RGB Gaming Room Background Plate
 * Plane 2 (depth  0.2): Behind-Character Midground Layer (Typography / Aura / Speedlines behind shoulders)
 * Plane 3 (depth  0.5): Animated Shinee Cutout Sprite (with automatic eye blinking & posture shifts!)
 * Plane 4 (depth  0.95): Foreground Monitor Bezel (`ch1_s2_monitor_fg_cutout.png`) & Screen Glow Rays
 */
export const MultiLayerShineeRig: React.FC<MultiLayerShineeRigProps> = ({
  camera,
  mood,
  angleVariant = "side_rig",
  behindCharacterLayer,
  foregroundOverlay,
  rimColor = "#00F0FF",
  charX = 80,
  charY = 30,
  charScale = 1.12,
  showMonitorFg = true,
}) => {
  const frame = useSteppedFrame(2);

  // Automatic natural eye blink every 64 frames (lasts 4 frames) when in side_rig mode
  const isBlinking =
    angleVariant === "side_rig" &&
    mood !== "shock" &&
    mood !== "rage" &&
    frame % 64 >= 58 &&
    frame % 64 <= 62;

  let spriteSrc = isBlinking
    ? "comic/ch1/shinee_expr_2_blink.png"
    : MOOD_TO_FILE[mood];

  if (angleVariant === "focus_closeup") {
    spriteSrc = "comic/ch1/ch1_s2_shinee_focus_cutout.png";
  } else if (angleVariant === "flow_lightning") {
    spriteSrc = "comic/ch1/ch1_s2_shinee_flow_cutout.png";
  }

  // Posture animation based on mood (leaning forward in focus/flow, recoiling in shock, trembling in rage)
  const leanX =
    mood === "focus" || mood === "flow"
      ? -28
      : mood === "shock"
      ? 24
      : mood === "rage"
      ? Math.sin(frame * 1.7) * 10
      : 0;
  const leanRotate =
    mood === "focus" || mood === "flow"
      ? -2.5
      : mood === "shock"
      ? 3.5
      : mood === "rage"
      ? -4 + Math.cos(frame * 1.5) * 1.8
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#06040C", overflow: "hidden" }}>
      {/* PLANE 1 (Depth -0.15): Bedroom Background Plate */}
      <ParallaxPlane camera={camera} depth={-0.15}>
        <Img
          src={staticFile("comic/ch1/ch1_s1_room_bg.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.12)",
            filter:
              mood === "rage"
                ? "hue-rotate(-45deg) saturate(1.8)"
                : mood === "shock"
                ? "saturate(0.35) brightness(0.75)"
                : "none",
          }}
        />
        {/* Ambient radial glow on back wall */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 65% 45%, ${rimColor}33 0%, transparent 65%)`,
          }}
        />
      </ParallaxPlane>

      {/* PLANE 2 (Depth 0.2): Behind-Character Layer (Sandwiched behind Shinee!) */}
      {behindCharacterLayer && (
        <ParallaxPlane camera={camera} depth={0.2}>
          {behindCharacterLayer}
        </ParallaxPlane>
      )}

      {/* PLANE 3 (Depth 0.5): Animated Shinee Character Cutout */}
      <ParallaxPlane
        camera={camera}
        depth={0.5}
        breatheAmp={mood === "rage" ? 9 : 5}
        breatheSpeed={mood === "rage" ? 0.35 : 0.14}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            transform: `translate(${charX + leanX}px, ${charY}px) scale(${charScale}) rotate(${leanRotate}deg)`,
            filter: `drop-shadow(10px 10px 0px #000000) drop-shadow(-5px -3px 0px ${rimColor})`,
          }}
        >
          <Img
            src={staticFile(spriteSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center bottom",
            }}
          />
        </div>
      </ParallaxPlane>

      {/* PLANE 4 (Depth 0.95): Closest Foreground Monitor Bezel & Volumetric Screen Glow */}
      {showMonitorFg && (
        <ParallaxPlane camera={camera} depth={0.95}>
          {/* Volumetric monitor light cone projecting onto Shinee */}
          <div
            style={{
              position: "absolute",
              left: "12%",
              top: "8%",
              width: "48%",
              height: "85%",
              background: `linear-gradient(95deg, ${
                mood === "rage"
                  ? "rgba(255,0,68,0.28)"
                  : mood === "smirk"
                  ? "rgba(255,200,0,0.22)"
                  : "rgba(0,240,255,0.24)"
              } 0%, transparent 75%)`,
              transform: "skewY(-8deg)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: "translate(-40px, 20px) scale(1.12)",
              filter: "drop-shadow(14px 10px 0px #000000)",
            }}
          >
            <Img
              src={staticFile("comic/ch1/ch1_s2_monitor_fg_cutout.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "left bottom",
              }}
            />
          </div>
        </ParallaxPlane>
      )}

      {/* Optional extra foreground layer */}
      {foregroundOverlay}
    </AbsoluteFill>
  );
};

interface AnimatedCTEnemyRigProps {
  /** Frame when the headshot hits this enemy */
  hitFrame: number;
  /** Local frame counter */
  frame: number;
  /** X position on screen (px) */
  x: number;
  /** Y position on screen (px) */
  y: number;
  /** Scale multiplier */
  scale?: number;
  /** Peek direction: -1 peeks left, 1 peeks right */
  peekDir?: -1 | 1;
  /** Accent rim color */
  accentColor?: string;
}

/**
 * Multi-jointed Spider-Verse Comic Counter-Terrorist (SAS) Enemy Rig!
 * - Slides out from cover, leans & aims M4A1-S rifle with warning glint
 * - On `frame >= hitFrame`, head snaps backward, helmet spins off into the air,
 *   rifle drops, and a comic headshot starburst erupts!
 */
export const AnimatedCTEnemyRig: React.FC<AnimatedCTEnemyRigProps> = ({
  hitFrame,
  frame,
  x,
  y,
  scale = 1,
  peekDir = 1,
  accentColor = "#00F0FF",
}) => {
  const { fps } = useVideoConfig();
  const isHit = frame >= hitFrame;
  const hitElapsed = Math.max(0, frame - hitFrame);

  // Peek-out slide animation before being hit
  const peekSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 160 },
  });

  // Ragdoll knockback after headshot
  const knockbackX = isHit
    ? interpolate(hitElapsed, [0, 18], [0, -peekDir * 55], {
        extrapolateRight: "clamp",
      })
    : (1 - peekSpring) * -peekDir * 110;

  const knockbackY = isHit
    ? interpolate(hitElapsed, [0, 6, 22], [0, -18, 95], {
        extrapolateRight: "clamp",
      })
    : Math.sin(frame * 0.25) * 4;

  const bodyTilt = isHit
    ? interpolate(hitElapsed, [0, 16], [0, -peekDir * 28], {
        extrapolateRight: "clamp",
      })
    : peekDir * 5;

  const headSnap = isHit
    ? interpolate(hitElapsed, [0, 8], [0, -peekDir * 48], {
        extrapolateRight: "clamp",
      })
    : 0;

  // Independent flying helmet arc on headshot!
  const helmetX = isHit ? -peekDir * hitElapsed * 14 : 0;
  const helmetY = isHit ? -hitElapsed * 22 + 0.9 * hitElapsed * hitElapsed : 0;
  const helmetRot = isHit ? hitElapsed * 28 * -peekDir : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 340,
        height: 420,
        transform: `translate(${knockbackX}px, ${knockbackY}px) scale(${scale}) rotate(${bodyTilt}deg)`,
        transformOrigin: "center bottom",
        pointerEvents: "none",
      }}
    >
      <svg width="340" height="420" viewBox="0 0 340 420" style={{ overflow: "visible" }}>
        {/* TORSO & TACTICAL RIG */}
        <g>
          <polygon
            points="85,390 105,175 235,175 255,390"
            fill="#182238"
            stroke="#05040A"
            strokeWidth="8"
          />
          {/* Comic Rim Highlight on Shoulder */}
          <polygon
            points="88,385 107,178 126,178 112,385"
            fill={isHit ? "#FF0055" : accentColor}
          />
          {/* Shoulder Pads */}
          <ellipse cx="98" cy="195" rx="26" ry="34" fill="#233150" stroke="#05040A" strokeWidth="7" />
          <ellipse cx="242" cy="195" rx="26" ry="34" fill="#233150" stroke="#05040A" strokeWidth="7" />
          {/* Tactical Vest Pouches */}
          <rect x="122" y="225" width="28" height="48" rx="4" fill="#2C3D63" stroke="#05040A" strokeWidth="6" />
          <rect x="156" y="225" width="28" height="48" rx="4" fill="#2C3D63" stroke="#05040A" strokeWidth="6" />
          <rect x="190" y="225" width="28" height="48" rx="4" fill="#2C3D63" stroke="#05040A" strokeWidth="6" />
        </g>

        {/* ARTICULATED SAS GAS-MASK HEAD (Snaps backward on headshot!) */}
        <g
          transform={`translate(170, 165) rotate(${headSnap}) translate(-170, -165)`}
        >
          {/* Head Base */}
          <ellipse
            cx="170"
            cy="125"
            rx="46"
            ry="52"
            fill="#1E2538"
            stroke="#05040A"
            strokeWidth="8"
          />
          {/* Glowing Menacing SAS Goggles */}
          <ellipse
            cx="150"
            cy="118"
            rx="16"
            ry="12"
            fill={isHit ? "#FFE600" : "#FF0055"}
            stroke="#05040A"
            strokeWidth="5"
          />
          <ellipse
            cx="190"
            cy="118"
            rx="16"
            ry="12"
            fill={isHit ? "#FFE600" : "#FF0055"}
            stroke="#05040A"
            strokeWidth="5"
          />
          <circle cx="148" cy="116" r="4" fill="#FFFFFF" />
          <circle cx="188" cy="116" r="4" fill="#FFFFFF" />
          {/* Dual Gas Mask Respirator Canisters */}
          <circle cx="142" cy="152" r="16" fill="#121622" stroke="#05040A" strokeWidth="6" />
          <circle cx="198" cy="152" r="16" fill="#121622" stroke="#05040A" strokeWidth="6" />
          <ellipse cx="170" cy="148" rx="18" ry="20" fill="#2A344B" stroke="#05040A" strokeWidth="6" />
        </g>

        {/* FLYING BALLISTIC HELMET (Detaches and spins through the air on headshot!) */}
        <g
          transform={`translate(${170 + helmetX}, ${95 + helmetY}) rotate(${helmetRot}) translate(-170, -95)`}
        >
          <path
            d="M 114 112 C 114 55, 226 55, 226 112 Z"
            fill="#28385E"
            stroke="#05040A"
            strokeWidth="8"
          />
          <path
            d="M 122 104 C 125 68, 165 64, 175 64"
            fill="none"
            stroke={accentColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Tactical NVG Mount on Helmet */}
          <rect x="158" y="68" width="24" height="18" fill="#121622" stroke="#05040A" strokeWidth="5" />
        </g>

        {/* M4A1-S RIFLE & ARMS (Drops downward when headshotted!) */}
        <g
          transform={`translate(170, 210) rotate(${
            isHit ? hitElapsed * 12 : Math.sin(frame * 0.4) * 2
          }) translate(-170, -210)`}
        >
          {/* Rifle Body */}
          <rect x="35" y="188" width="175" height="22" rx="4" fill="#141824" stroke="#05040A" strokeWidth="7" />
          {/* Silencer Barrel */}
          <rect x="-25" y="192" width="65" height="14" rx="3" fill="#2E3B52" stroke="#05040A" strokeWidth="6" />
          {/* Magazine */}
          <polygon points="115,210 138,210 128,252 104,248" fill="#1F2638" stroke="#05040A" strokeWidth="6" />
          {/* Enemy Muzzle Glint before being hit */}
          {!isHit && frame % 6 < 3 && (
            <polygon
              points="-28,199 -48,184 -36,199 -48,214"
              fill="#FFE600"
              stroke="#FF0055"
              strokeWidth="2"
            />
          )}
        </g>

        {/* SPIDER-VERSE HEADSHOT IMPACT STARBURST! */}
        {isHit && hitElapsed < 18 && (
          <g transform="translate(170, 105)">
            <polygon
              points="0,-95 22,-32 82,-68 42,-12 105,10 40,28 75,85 15,42 -12,98 -28,36 -92,68 -45,12 -102,-22 -38,-28 -68,-88 -12,-38"
              fill="#FF0055"
              stroke="#05040A"
              strokeWidth="6"
            />
            <polygon
              points="0,-58 15,-18 55,-38 24,-5 62,12 22,18 42,55 6,24 -15,58 -18,20 -58,36 -25,4 -55,-18 -20,-18 -35,-52 -5,-22"
              fill="#FFE600"
              stroke="#05040A"
              strokeWidth="4"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
