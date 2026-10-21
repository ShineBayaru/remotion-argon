import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Chapter1AudioTrack } from "./Chapter1AudioTrack";
import {
  ActionBurst,
  ChromaticAberration,
  COMIC_BODY_FONT,
  COMIC_DISPLAY_FONT,
  HalftoneOverlay,
  ImpactFrameFlash,
  NarratorBox,
  SpeedLines,
  useSteppedFrame,
} from "./SpiderVerseEffects";
import {
  AnimatedCSCrosshair,
  ClockGearSVG,
  FaceitLevelBadge,
  HeadshotSkullIcon,
} from "./ComicIcons";
import { ParallaxCameraState, ParallaxPlane } from "./ParallaxLayer";
import {
  AnimatedCTEnemyRig,
  MultiLayerShineeRig,
} from "./ComicCharacters";

/**
 * Deterministic pseudo-random helper (pure function of seed).
 */
const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * CHAPTER 1: THE HOOK — "ШӨНИЙН 01:30 — НЭГХЭН ХОЖИЛ" (0:00 - 1:16 / 2280 frames @ 30fps)
 *
 * Upgraded v3: True 2.5D Multi-Layer Parallax & Sequential Character Acting Motion-Comic!
 * Synchronized with ElevenLabs Mongolian voiceover (src/assets/hook.mp3 / public/audio/hook.mp3).
 */

/**
 * BEAT 1 & 2 (0 - 265 frames / 0.0s - 8.8s):
 * True 3-Plane 2.5D Parallax of Ulaanbaatar at 01:30 AM + Exterior Frosted Window Close-Up!
 * - Plane 1 (Far BG): `ch1_s1_sky_bg.png` (Bogd Khan mountains, smokestacks, crescent moon)
 * - Plane 2 (Midground Cutout): `ch1_s1_buildings_mid_cutout.png` (Apartment block with 1 glowing cyan window)
 * - Plane 3 (Foreground Cutout): `ch1_s1_street_fg_cutout.png` (Utility poles, power lines, snowy pine trees sweeping outward!)
 * - Shot 3 (local 135-265): `ch1_s1_window_closeup.png` (Looking straight through the frost-rimmed window at Shinee inside!)
 */
const Beat1And2UlaanbaatarParallax: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const isWindowCloseup = frame >= 135;

  // Camera pans up/in while foreground utility poles part ways in 2.5D parallax
  const camera: ParallaxCameraState = {
    panX: interpolate(frame, [0, 135], [-0.18, 0.12], {
      extrapolateRight: "clamp",
    }),
    panY: interpolate(frame, [0, 135], [0.22, -0.15], {
      extrapolateRight: "clamp",
    }),
    zoom: interpolate(frame, [0, 135], [1.02, 1.38], {
      extrapolateRight: "clamp",
    }),
    rotate: interpolate(frame, [0, 135], [-0.8, 0.6], {
      extrapolateRight: "clamp",
    }),
  };

  // Digital clock ticks: 01:29:58 -> 01:29:59 -> 01:30:00 at frame 42
  const clockLocked = frame >= 42;
  const clockSeconds = frame < 20 ? "58" : frame < 42 ? "59" : "00";
  const clockPrefix = frame < 42 ? "01:29:" : "01:30:";

  const closeupDive =
    frame >= 220
      ? interpolate(frame, [220, 265], [1.08, 2.45], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [135, 220], [1.0, 1.08], {
          extrapolateLeft: "clamp",
        });

  const closeupPop = spring({
    frame: Math.max(0, frame - 135),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#04030A", overflow: "hidden" }}>
      {!isWindowCloseup ? (
        <>
          {/* PLANE 1 (Depth -0.3): Distant Ulaanbaatar Sky, Mountains & Power Plant Smoke */}
          <ParallaxPlane camera={camera} depth={-0.3}>
            <Img
              src={staticFile("comic/ch1/ch1_s1_sky_bg.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.15)",
              }}
            />
          </ParallaxPlane>

          {/* PLANE 2 (Depth 0.25): Midground Soviet Apartment Block Cutout with Glowing Window */}
          <ParallaxPlane camera={camera} depth={0.25}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "translateY(70px) scale(1.04)",
                filter: "drop-shadow(0 -10px 25px rgba(0,240,255,0.22))",
              }}
            >
              <Img
                src={staticFile("comic/ch1/ch1_s1_buildings_mid_cutout.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center bottom",
                }}
              />
              {/* Animated Sonar Ping Rings on the Glowing Cyan Window (x: 61.5%, y: 36%) */}
              {frame >= 95 && (
                <div
                  style={{
                    position: "absolute",
                    left: "61.5%",
                    top: "36%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {[0, 1, 2].map((ringIdx) => {
                    const ringProgress =
                      ((frame - 95 + ringIdx * 18) % 54) / 54;
                    return (
                      <div
                        key={ringIdx}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          width: 40 + ringProgress * 220,
                          height: 40 + ringProgress * 220,
                          transform: "translate(-50%, -50%)",
                          border: "4px solid #00F0FF",
                          borderRadius: "50%",
                          opacity: 1 - ringProgress,
                          boxShadow: "0 0 18px #00F0FF",
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </ParallaxPlane>

          {/* PLANE 3 (Depth 0.95): Closest Foreground Utility Poles, Wires & Snowy Pine Trees */}
          <ParallaxPlane camera={camera} depth={0.95}>
            <Img
              src={staticFile("comic/ch1/ch1_s1_street_fg_cutout.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scale(1.14)",
                filter: "drop-shadow(12px 12px 0px #000000)",
              }}
            />
          </ParallaxPlane>
        </>
      ) : (
        /* SHOT 3 (Frames 135 - 265): Exterior Close-Up Looking Inside the Frosty Window at Shinee! */
        <AbsoluteFill
          style={{
            transform: `scale(${closeupDive * closeupPop})`,
            transformOrigin: "54% 48%",
          }}
        >
          <ChromaticAberration intensity={frame >= 235 ? 8 : 3}>
            <Img
              src={staticFile("comic/ch1/ch1_s1_window_closeup.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ChromaticAberration>
          <NarratorBox
            text="ХАРИН ЖИЖИГХЭН ӨРӨӨНИЙ БУЛАНД..."
            x={55}
            y={45}
            delay={138}
            bgColor="#00F0FF"
            textColor="#05040A"
            rotation={-2}
          />
          {frame >= 180 && (
            <ActionBurst
              text="МОНИТОРЫН ГЭРЭЛ!"
              bgColor="#FFE600"
              color="#05040A"
              size={44}
              x="76%"
              y="22%"
              rotation={6}
              delay={180}
            />
          )}
        </AbsoluteFill>
      )}

      {/* Animated Falling Snow Particles Across All Shots */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {Array.from({ length: 42 }).map((_, i) => {
          const startX = pseudoRandom(i * 11) * 2100 - 100;
          const startY = pseudoRandom(i * 23) * 1080;
          const speedY = 4 + pseudoRandom(i * 31) * 6;
          const speedX = -2.5 - pseudoRandom(i * 43) * 3;
          const x = (startX + frame * speedX + 2200) % 2050;
          const y = (startY + frame * speedY) % 1080;
          const size = 4 + (i % 4) * 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size * 2.4,
                backgroundColor: i % 5 === 0 ? "#00F0FF" : "#FFFFFF",
                opacity: 0.45 + (i % 3) * 0.2,
                transform: "rotate(22deg)",
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Top-Left Digital Clock Box (0 - 135 frames) */}
      {!isWindowCloseup && (
        <div
          style={{
            position: "absolute",
            left: 55,
            top: 45,
            backgroundColor: "#080612",
            border: "5px solid #000000",
            boxShadow: clockLocked
              ? "10px 10px 0px #00F0FF, -4px -4px 0px #FF0055"
              : "8px 8px 0px #FFE600",
            padding: "16px 32px",
            transform: `rotate(-2deg) scale(${clockLocked ? 1.05 : 1})`,
            fontFamily: COMIC_DISPLAY_FONT,
            zIndex: 35,
          }}
        >
          <div
            style={{
              fontSize: 17,
              color: "#FFE600",
              letterSpacing: "3px",
              marginBottom: 4,
            }}
          >
            УЛААНБААТАР ХОТ // 3-Р ХОРООЛОЛ
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              color: clockLocked ? "#00F0FF" : "#FFFFFF",
              letterSpacing: "4px",
              textShadow: "4px 4px 0px #000",
              lineHeight: 1,
            }}
          >
            {clockPrefix}
            <span style={{ color: clockLocked ? "#FFE600" : "#FF0055" }}>
              {clockSeconds}
            </span>
          </div>
        </div>
      )}

      {frame >= 230 && <SpeedLines color="#00F0FF" density={36} />}
    </AbsoluteFill>
  );
};

/**
 * BEAT 3, 4 & 5 (265 - 860 frames / 595 local frames / 8.8s - 28.7s):
 * Inside Shinee's Room — Multi-Layer 2.5D Parallax + Sequential Facial Acting!
 * - Beat 3a (local 0-50): "Энэ бол Шинээ." — Shinee is `tired` at 01:30 AM (breath puff & natural eye blink), monitor in foreground parallax!
 * - Beat 3b (local 50-170): "Түүний өмнө танил дэлгэц..." — Shinee leans forward & switches to `focus` expression + Player Telemetry card!
 * - Beat 4 (local 170-340): "Дэлгэцийн буланд 1985 ELO, Level 9..." — Switches to `focus_closeup` cutout angle + FACEIT Level 6->10 & 1985 ELO Odometer!
 * - Beat 5 (local 340-595): "Мөрөөдлийн улаан өнгөтэй Level 10... ердөө 15-хан оноо дутуу" — Shinee switches to `smirk` expression as `+15 ELO -> LEVEL 10` locks in!
 */
const Beat3To5ShineeActingAndElo: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const isTiredPhase = frame < 50;
  const isFocusTelemetryPhase = frame >= 50 && frame < 170;
  const isEloRollPhase = frame >= 170 && frame < 340;
  const isSmirkLevel10Phase = frame >= 340;

  const mood = isTiredPhase
    ? "tired"
    : isSmirkLevel10Phase
    ? "smirk"
    : "focus";

  const angleVariant = isEloRollPhase ? "focus_closeup" : "side_rig";

  // Smooth continuous 2.5D camera orbit inside the bedroom
  const camera: ParallaxCameraState = {
    panX: Math.sin(frame * 0.03) * 0.25 + (isFocusTelemetryPhase ? -0.15 : 0.1),
    panY: Math.cos(frame * 0.025) * 0.15,
    zoom: isSmirkLevel10Phase
      ? interpolate(frame, [340, 595], [1.08, 1.25], {
          extrapolateRight: "clamp",
        })
      : isTiredPhase
      ? interpolate(frame, [0, 50], [1.02, 1.1], { extrapolateRight: "clamp" })
      : 1.12,
  };

  // Animated ELO counter rolling from 1890 -> 1985
  const eloCount = Math.floor(
    interpolate(frame, [180, 280], [1890, 1985], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const cardPop = spring({
    frame: Math.max(0, frame - 52),
    fps,
    config: { damping: 13, stiffness: 170 },
  });

  const eloPanelPop = spring({
    frame: Math.max(0, frame - 172),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <AbsoluteFill>
      <MultiLayerShineeRig
        camera={camera}
        mood={mood}
        angleVariant={angleVariant}
        rimColor={isSmirkLevel10Phase ? "#FFE600" : "#00F0FF"}
        charX={
          isTiredPhase
            ? 140
            : isFocusTelemetryPhase
            ? -210
            : isEloRollPhase
            ? -310
            : -230
        }
        charY={25}
        charScale={isEloRollPhase ? 1.08 : 1.15}
        showMonitorFg={!isEloRollPhase}
        behindCharacterLayer={
          /* GIANT COMIC TYPOGRAPHY SANDWICHED BEHIND SHINEE'S SHOULDERS IN 3D SPACE! */
          <div
            style={{
              position: "absolute",
              left: isTiredPhase ? "38%" : "6%",
              top: "12%",
              fontFamily: COMIC_DISPLAY_FONT,
              fontSize: 138,
              fontWeight: 900,
              color: isSmirkLevel10Phase
                ? "rgba(255, 230, 0, 0.22)"
                : "rgba(0, 240, 255, 0.18)",
              WebkitTextStroke: isSmirkLevel10Phase
                ? "3px rgba(255, 230, 0, 0.55)"
                : "3px rgba(0, 240, 255, 0.45)",
              letterSpacing: "6px",
              lineHeight: 0.92,
              transform: "rotate(-4deg)",
              userSelect: "none",
            }}
          >
            {isTiredPhase
              ? "01:30 AM\nSOLO QUEUE"
              : isSmirkLevel10Phase
              ? "LEVEL 10\nTARGET"
              : "LASER\nFOCUS"}
          </div>
        }
      />

      {/* Flash when Shinee snaps from Tired (Expr 1) -> Laser Focus (Expr 3) at frame 50 */}
      <ImpactFrameFlash triggerFrame={50} duration={3} color="#00F0FF" />
      {/* Flash when Shinee switches to Cocky Smirk (Expr 4) at frame 340 */}
      <ImpactFrameFlash triggerFrame={340} duration={3} color="#FFE600" />

      {/* BEAT 3a (local 0-65): Tired Exhale Tag */}
      {isTiredPhase && (
        <ActionBurst
          text="*ФҮҮҮ...* 01:30 AM"
          bgColor="#00F0FF"
          color="#05040A"
          size={36}
          x="36%"
          y="56%"
          rotation={-8}
          delay={10}
        />
      )}

      {/* BEAT 3b (local 65-150): Player Profile & Skill Bars */}
      {isFocusTelemetryPhase && (
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 72,
            width: 680,
            backgroundColor: "#0B0818",
            border: "6px solid #000",
            boxShadow: "12px 12px 0px #FFE600",
            padding: "26px 32px",
            transform: `scale(${cardPop}) rotate(1deg)`,
            fontFamily: COMIC_DISPLAY_FONT,
            zIndex: 40,
          }}
        >
          <div
            style={{
              fontSize: 20,
              color: "#00F0FF",
              letterSpacing: "3px",
              marginBottom: 4,
            }}
          >
            // PLAYER STATE: LOCKED IN
          </div>
          <div
            style={{
              fontSize: 54,
              color: "#FFFFFF",
              fontWeight: 900,
              marginBottom: 18,
              textShadow: "4px 4px 0px #000",
            }}
          >
            ШИНЭЭ (22 НАСТАЙ)
          </div>

          {[
            { label: "AIM / ОНОВЧ", pct: 92, color: "#00F0FF" },
            { label: "РЕФЛЕКС ХУРД", pct: 89, color: "#FFE600" },
            { label: "ТЭВЧЭЭР (MENTAL)", pct: 48, color: "#FF0055" },
          ].map((stat, idx) => {
            const fillW = interpolate(
              frame,
              [75 + idx * 10, 115 + idx * 10],
              [0, stat.pct],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div key={stat.label} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 21,
                    color: "#FFFFFF",
                    marginBottom: 5,
                    fontFamily: COMIC_BODY_FONT,
                    fontWeight: 800,
                  }}
                >
                  <span>{stat.label}</span>
                  <span style={{ color: stat.color }}>{Math.round(fillW)}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 20,
                    backgroundColor: "#1A1530",
                    border: "3px solid #000",
                  }}
                >
                  <div
                    style={{
                      width: `${fillW}%`,
                      height: "100%",
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BEAT 4 & 5 (local 150-450): FACEIT Rank Strip & 1985 -> 2000 ELO Bridge */}
      {(isEloRollPhase || isSmirkLevel10Phase) && (
        <div
          style={{
            position: "absolute",
            top: 34,
            right: 32,
            bottom: 124,
            width: "52%",
            backgroundColor: "rgba(14, 11, 29, 0.94)",
            border: "6px solid #000",
            boxShadow: isSmirkLevel10Phase
              ? "-12px 12px 0px #FFE600"
              : "-12px 12px 0px #00F0FF",
            padding: "24px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transform: `scale(${eloPanelPop}) skewX(-2deg)`,
            fontFamily: COMIC_DISPLAY_FONT,
            zIndex: 40,
          }}
        >
          {/* Top Rank Progression Strip (Levels 6 -> 10) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#070510",
              border: "4px solid #000",
              padding: "12px 18px",
            }}
          >
            {[6, 7, 8, 9, 10].map((lvl) => {
              const isCurrent = lvl === 9;
              const isTarget = lvl === 10;
              return (
                <div
                  key={lvl}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: isCurrent
                      ? `scale(${1.12 + Math.sin(frame * 0.2) * 0.05})`
                      : isTarget && isSmirkLevel10Phase
                      ? `scale(${1.18 + Math.sin(frame * 0.3) * 0.08})`
                      : "scale(0.85)",
                    opacity: lvl < 9 ? 0.45 : 1,
                  }}
                >
                  <FaceitLevelBadge
                    level={lvl}
                    size={isCurrent || isTarget ? 74 : 54}
                    glow={isCurrent || (isTarget && isSmirkLevel10Phase)}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      marginTop: 4,
                      color: isTarget
                        ? "#FF0044"
                        : isCurrent
                        ? "#FFE600"
                        : "#888",
                    }}
                  >
                    LVL {lvl}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Animated ELO Odometer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "#16112E",
              border: "5px solid #000",
              padding: "18px 24px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, color: "#00F0FF", letterSpacing: "2px" }}>
                ОДООГИЙН ОНОО
              </div>
              <div
                style={{
                  fontSize: 94,
                  fontWeight: 900,
                  color: "#FFE600",
                  textShadow: "6px 6px 0px #000, -4px -4px 0px #FF0055",
                  lineHeight: 1,
                }}
              >
                {eloCount}
              </div>
              <div style={{ fontSize: 20, color: "#FF8800", marginTop: 4 }}>
                FACEIT LEVEL 9
              </div>
            </div>

            {isSmirkLevel10Phase && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#00FF88",
                      color: "#05040A",
                      border: "4px solid #000",
                      padding: "6px 14px",
                      fontSize: 26,
                      fontWeight: 900,
                      transform: `scale(${
                        1 + Math.sin(frame * 0.3) * 0.08
                      }) rotate(-4deg)`,
                    }}
                  >
                    +15 ELO
                  </div>
                  <svg width="90" height="32" viewBox="0 0 90 32">
                    <line
                      x1="0"
                      y1="16"
                      x2="75"
                      y2="16"
                      stroke="#FFE600"
                      strokeWidth="6"
                      strokeDasharray="10 6"
                    />
                    <polygon points="70,4 90,16 70,28" fill="#FFE600" />
                  </svg>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 18,
                      color: "#FF0055",
                      letterSpacing: "2px",
                    }}
                  >
                    МӨРӨӨДЛИЙН ОРГИЛ
                  </div>
                  <div
                    style={{
                      fontSize: 86,
                      fontWeight: 900,
                      color: "#FF0044",
                      textShadow: "5px 5px 0px #000, 0 0 25px #FF0044",
                      lineHeight: 1,
                    }}
                  >
                    2000
                  </div>
                  <div style={{ fontSize: 20, color: "#FFFFFF", marginTop: 4 }}>
                    FACEIT LEVEL 10
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom High-Impact Banner */}
          <div
            style={{
              backgroundColor: isSmirkLevel10Phase ? "#FF0055" : "#FFE600",
              color: isSmirkLevel10Phase ? "#FFFFFF" : "#05040A",
              border: "5px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "14px 20px",
              textAlign: "center",
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "1px",
            }}
          >
            {isSmirkLevel10Phase
              ? "ГАНЦХАН ХОЖИЛ = ЛЕВЕЛ АРАВ!"
              : "ДЭЛГЭЦИЙН БУЛАНД: 1985 ELO"}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/**
 * BEAT 6 & 7 (860 - 1255 frames / 395 local frames / 28.7s - 41.8s):
 * - Shot 6 (local 0-185): "Тоглолт олдлоо. Газрын зураг — Мираж..." — Match Found Modal -> Mouse Click -> DE_MIRAGE Map Reveal with Foreground USP-S!
 * - Shot 7 (local 185-395): "Шинээгийн гар халуун... яг л цагны механизм шиг" — Clockwork Flow State with Interlocking Gears + Shinee's `flow_lightning` Cutout!
 */
const Beat6And7MirageFlowState: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const isFlowShot = frame >= 185;

  const cursorX = interpolate(frame, [0, 42], [1350, 960], {
    extrapolateRight: "clamp",
  });
  const cursorY = interpolate(frame, [0, 42], [820, 560], {
    extrapolateRight: "clamp",
  });
  const clicked = frame >= 44;

  const mirageCardPop = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const flowCamera: ParallaxCameraState = {
    panX: Math.sin(frame * 0.05) * 0.25,
    panY: Math.cos(frame * 0.04) * 0.15,
    zoom: interpolate(frame, [185, 395], [1.05, 1.22], {
      extrapolateLeft: "clamp",
    }),
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#06050F" }}>
      {!isFlowShot ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Img
            src={staticFile("comic/ch1/ch1_s1_room_bg.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />

          {/* Before Click: MATCH FOUND ACCEPT MODAL */}
          {frame < 65 && (
            <div
              style={{
                backgroundColor: "#0C1E17",
                border: "7px solid #000",
                boxShadow: "0 0 0 6px #00FF88, 16px 16px 0px #000",
                padding: "42px 76px",
                textAlign: "center",
                transform: `scale(${clicked ? 1.08 : 1}) skewX(-3deg)`,
                fontFamily: COMIC_DISPLAY_FONT,
                zIndex: 20,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  color: "#00FF88",
                  letterSpacing: "4px",
                  marginBottom: 10,
                }}
              >
                FACEIT MATCHMAKING // SERVER READY
              </div>
              <div
                style={{
                  fontSize: 74,
                  color: "#FFFFFF",
                  marginBottom: 24,
                  textShadow: "5px 5px 0px #000",
                }}
              >
                ТОГЛОЛТ ОЛДЛОО!
              </div>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: clicked ? "#FFE600" : "#00FF88",
                  color: "#05040A",
                  border: "5px solid #000",
                  padding: "16px 64px",
                  fontSize: 42,
                  fontWeight: 900,
                  boxShadow: clicked ? "2px 2px 0px #000" : "8px 8px 0px #000",
                }}
              >
                {clicked ? "ACCEPTED! (10/10)" : "ACCEPT MATCH"}
              </div>
            </div>
          )}

          {/* Animated Comic Mouse Cursor */}
          {frame < 65 && (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              style={{
                position: "absolute",
                left: cursorX,
                top: cursorY,
                zIndex: 60,
                transform: `scale(${clicked ? 0.8 : 1})`,
              }}
            >
              <polygon
                points="8,4 52,26 32,34 42,56 30,60 20,38 8,50"
                fill="#FFE600"
                stroke="#000"
                strokeWidth="4"
              />
            </svg>
          )}

          {/* After Click (frame 55-150): Multi-Layer DE_MIRAGE Map + Foreground USP-S Reveal! */}
          {frame >= 55 && (
            <div
              style={{
                width: "88%",
                height: "75%",
                marginBottom: 60,
                backgroundColor: "#120E24",
                border: "7px solid #000",
                boxShadow: "14px 14px 0px #FFE600, -10px -10px 0px #00F0FF",
                transform: `scale(${mirageCardPop})`,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                zIndex: 30,
              }}
            >
              {/* Left 65%: Multi-Layer De_Mirage A-Site with Foreground Crates & USP-S */}
              <div
                style={{
                  width: "65%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  borderRight: "6px solid #000",
                }}
              >
                <Img
                  src={staticFile("comic/ch1/ch1_s3_mirage_asite_bg.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(1.1) translateX(${(frame - 55) * -0.4}px)`,
                  }}
                />
                <Img
                  src={staticFile("comic/ch1/ch1_s3_fps_usps_idle_cutout.png")}
                  style={{
                    position: "absolute",
                    right: -40,
                    bottom: -30,
                    width: "75%",
                    height: "75%",
                    objectFit: "contain",
                    transform: `translateY(${Math.sin(frame * 0.2) * 8}px)`,
                    filter: "drop-shadow(8px 8px 0px #000)",
                  }}
                />
              </div>

              {/* Right 35%: Tactical Briefing */}
              <div
                style={{
                  flex: 1,
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  fontFamily: COMIC_DISPLAY_FONT,
                }}
              >
                <div>
                  <div style={{ fontSize: 20, color: "#00F0FF", letterSpacing: "3px" }}>
                    SELECTED MAP
                  </div>
                  <div
                    style={{
                      fontSize: 64,
                      color: "#FFE600",
                      textShadow: "5px 5px 0px #000",
                      lineHeight: 1.05,
                    }}
                  >
                    DE_MIRAGE
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#080612",
                    border: "4px solid #00F0FF",
                    padding: "18px",
                    fontFamily: COMIC_BODY_FONT,
                    fontWeight: 800,
                    fontSize: 20,
                    color: "#FFF",
                  }}
                >
                  <div style={{ color: "#00FF88", marginBottom: 8 }}>
                    ● ГАР ХАЛУУН: 100% READY
                  </div>
                  <div style={{ color: "#00F0FF", marginBottom: 8 }}>
                    ● АНХААРАЛ: ДЭЭД ЦЭГТЭЭ
                  </div>
                  <div style={{ color: "#FFE600" }}>
                    ● РАУНД 1: ПИСТОЛ РАУНД
                  </div>
                </div>
              </div>
            </div>
          )}
        </AbsoluteFill>
      ) : (
        /* SHOT 7 (local 185 - 395): Multi-Layer Flow State ("Цагны механизм шиг") */
        <AbsoluteFill>
          <MultiLayerShineeRig
            camera={flowCamera}
            mood="flow"
            angleVariant={frame >= 240 ? "flow_lightning" : "side_rig"}
            rimColor="#00F0FF"
            charX={280}
            charY={20}
            charScale={1.16}
            showMonitorFg={false}
            behindCharacterLayer={
              /* Giant Rotating Clockwork Gears Behind Shinee's Cutout Body! */
              <div
                style={{
                  position: "absolute",
                  right: 120,
                  top: 80,
                  width: 600,
                  height: 600,
                  opacity: 0.45,
                }}
              >
                <ClockGearSVG
                  size={440}
                  rotation={frame * 2.0}
                  color="#00F0FF"
                />
              </div>
            }
          />

          <ImpactFrameFlash triggerFrame={240} duration={3} color="#00F0FF" />

          {/* Left Panel: Interlocking Clockwork Gears & WASD Input Telemetry */}
          <div
            style={{
              position: "absolute",
              left: 36,
              top: 36,
              bottom: 124,
              width: "44%",
              backgroundColor: "rgba(11, 9, 25, 0.92)",
              border: "6px solid #000",
              boxShadow: "10px 10px 0px #00F0FF",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 40,
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                fontFamily: COMIC_DISPLAY_FONT,
                fontSize: 18,
                color: "#00F0FF",
                letterSpacing: "2px",
                borderBottom: "2px solid rgba(0,240,255,0.3)",
                paddingBottom: 8,
              }}
            >
              <span>FLOW STATE // ENGINE</span>
              <span style={{ color: "#00FF88" }}>SYNC: 100.0%</span>
            </div>

            <div style={{ position: "relative", width: 380, height: 310 }}>
              <div style={{ position: "absolute", left: 10, top: 5 }}>
                <ClockGearSVG
                  size={210}
                  rotation={frame * 2.4}
                  color="#00F0FF"
                />
              </div>
              <div style={{ position: "absolute", right: 10, bottom: 5 }}>
                <ClockGearSVG
                  size={165}
                  rotation={-frame * 3.0}
                  color="#FFE600"
                />
              </div>
            </div>

            <div
              style={{
                fontFamily: COMIC_DISPLAY_FONT,
                fontSize: 30,
                color: "#FFFFFF",
                textAlign: "center",
                textShadow: "3px 3px 0px #000",
              }}
            >
              ЦАГНЫ МЕХАНИЗМ ШИГ ТӨГС ХӨДӨЛГӨӨН
            </div>

            {/* Animated WASD Keystroke Row */}
            <div
              style={{
                display: "flex",
                gap: 10,
                fontFamily: COMIC_DISPLAY_FONT,
              }}
            >
              {["W", "A", "S", "D", "MOUSE 1"].map((key, idx) => {
                const active = Math.floor(frame / 6) % 5 === idx;
                return (
                  <div
                    key={key}
                    style={{
                      backgroundColor: active ? "#00F0FF" : "#0A0814",
                      color: active ? "#05040A" : "#FFF",
                      border: "4px solid #000",
                      padding: "8px 16px",
                      fontSize: 20,
                      fontWeight: 900,
                      transform: active ? "translateY(-5px)" : "none",
                      boxShadow: "4px 4px 0px #000",
                    }}
                  >
                    {key}
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/**
 * BEAT 8 (1050 - 1260 frames / 210 local frames):
 * TRUE 5-LAYER 2.5D FIRST-PERSON CS2 DE_MIRAGE 3-KILL SEQUENCE!
 * - Layer 1 (Depth 0.0): `ch1_s3_mirage_asite_bg.png` whipping across A-Site as Shinee aims & flicks!
 * - Layer 2 (Depth 0.35): 3 Articulated Counter-Terrorist Enemy Rigs (`AnimatedCTEnemyRig`) peeking out & getting headshotted with flying helmets!
 * - Layer 3 (Depth 0.50): Volumetric Smoke Grenade Cutout (`ch1_s3_smoke_cloud_cutout.png`) + Foreground Wooden Crates Cutout (`ch1_s3_mirage_crates_fg_cutout.png`)!
 * - Layer 4 (Depth 0.75): Dynamic CS2 Crosshair snapping from Enemy 1 -> Enemy 2 -> Enemy 3 + Live Top-Right Killfeed!
 * - Layer 5 (Depth 1.0): First-Person Gloved Hands & USP-S Cutout (`ch1_s3_fps_usps_idle_cutout.png` <-> `ch1_s3_fps_usps_fire_cutout.png`) kicking back in recoil on every shot!
 */
const Beat8ThreeKillMultiLayerFPS: React.FC = () => {
  const frame = useSteppedFrame(2);

  const hit1 = frame >= 28;
  const hit2 = frame >= 92;
  const hit3 = frame >= 152;

  const isFiring1 = frame >= 28 && frame < 40;
  const isFiring2 = frame >= 92 && frame < 104;
  const isFiring3 = frame >= 152 && frame < 166;
  const isFiringAny = isFiring1 || isFiring2 || isFiring3;

  // Camera whip-pans across Mirage A-site from Target 1 (center-left) -> Target 2 (right) -> Target 3 (smoke edge left)
  const panX =
    frame < 60
      ? interpolate(frame, [0, 28], [-0.25, -0.05], { extrapolateRight: "clamp" })
      : frame < 120
      ? interpolate(frame, [60, 88], [-0.05, 0.35], { extrapolateRight: "clamp" })
      : interpolate(frame, [120, 148], [0.35, -0.22], { extrapolateRight: "clamp" });

  const camera: ParallaxCameraState = {
    panX,
    panY: isFiringAny ? -0.08 : 0.02,
    zoom: hit3 ? 1.18 : 1.1,
    rotate: isFiringAny ? -1.5 : 0,
  };

  // Crosshair screen position tracking each enemy's head!
  const aimX =
    frame < 60
      ? interpolate(frame, [0, 26], [520, 745], { extrapolateRight: "clamp" })
      : frame < 120
      ? interpolate(frame, [60, 90], [745, 1185], { extrapolateRight: "clamp" })
      : interpolate(frame, [120, 150], [1185, 555], { extrapolateRight: "clamp" });

  const aimY =
    frame < 60
      ? interpolate(frame, [0, 26], [520, 425], { extrapolateRight: "clamp" })
      : frame < 120
      ? interpolate(frame, [60, 90], [425, 390], { extrapolateRight: "clamp" })
      : interpolate(frame, [120, 150], [390, 445], { extrapolateRight: "clamp" });

  const shake = isFiringAny ? (pseudoRandom(frame) - 0.5) * 22 : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05040A",
        overflow: "hidden",
        transform: `translate(${shake}px, ${-shake * 0.6}px)`,
      }}
    >
      {/* LAYER 1 (Depth 0.0): Wide De_Mirage A-Site Background Plate */}
      <ParallaxPlane camera={camera} depth={0.0}>
        <ChromaticAberration intensity={isFiringAny ? 6 : 2} glitchActive={isFiringAny}>
          <Img
            src={staticFile("comic/ch1/ch1_s3_mirage_asite_bg.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.16)",
            }}
          />
        </ChromaticAberration>
      </ParallaxPlane>

      {/* LAYER 2 (Depth 0.35): Articulated Counter-Terrorist Enemy Rigs Peeking & Getting Headshotted! */}
      <ParallaxPlane camera={camera} depth={0.35}>
        {/* ENEMY #1: Peeking above Center Triple Box */}
        <AnimatedCTEnemyRig
          frame={frame}
          hitFrame={28}
          x={575}
          y={255}
          scale={0.95}
          peekDir={-1}
          accentColor="#00F0FF"
        />

        {/* ENEMY #2: Peeking on Right Balcony / Stairs (appears at frame 52 for 180° flick!) */}
        {frame >= 52 && (
          <AnimatedCTEnemyRig
            frame={frame - 52}
            hitFrame={40}
            x={940}
            y={220}
            scale={0.95}
            peekDir={1}
            accentColor="#FFE600"
          />
        )}

        {/* VOLUMETRIC SMOKE GRENADE CLOUD + ENEMY #3 AT SMOKE EDGE (appears at frame 112) */}
        {frame >= 112 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 170,
                width: 720,
                height: 500,
                transform: `translateX(${Math.sin(frame * 0.1) * 18}px) scale(1.05)`,
              }}
            >
              <Img
                src={staticFile("comic/ch1/ch1_s3_smoke_cloud_cutout.png")}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
            <AnimatedCTEnemyRig
              frame={frame - 112}
              hitFrame={40}
              x={380}
              y={265}
              scale={0.95}
              peekDir={1}
              accentColor="#FF0055"
            />
          </>
        )}
      </ParallaxPlane>

      {/* LAYER 4: Bullet Tracer Line + Dynamic CS2 Crosshair */}
      {isFiringAny && (
        <svg
          width="1920"
          height="1080"
          style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 35 }}
        >
          <line
            x1={1180}
            y1={640}
            x2={aimX}
            y2={aimY}
            stroke="#FFE600"
            strokeWidth="8"
          />
          <line
            x1={1180}
            y1={640}
            x2={aimX}
            y2={aimY}
            stroke="#00F0FF"
            strokeWidth="16"
            opacity={0.45}
          />
        </svg>
      )}

      <AnimatedCSCrosshair
        x={aimX}
        y={aimY}
        spread={isFiringAny ? 24 : 8}
        isHit={isFiringAny}
      />

      {/* LAYER 5 (Depth 1.0 - Closest Foreground): First-Person Gloved Hands & USP-S Cutout! */}
      <ParallaxPlane camera={camera} depth={0.95}>
        <div
          style={{
            position: "absolute",
            right: -60,
            bottom: -75,
            width: 1180,
            height: 780,
            transform: `translate(${
              (aimX - 960) * 0.14 + (isFiringAny ? 32 : 0)
            }px, ${
              (aimY - 540) * 0.12 + (isFiringAny ? -42 : Math.sin(frame * 0.25) * 8)
            }px) rotate(${isFiringAny ? 8 : 0}deg)`,
            transformOrigin: "bottom right",
            filter: "drop-shadow(12px 12px 0px #000000)",
            zIndex: 45,
          }}
        >
          <Img
            src={staticFile(
              isFiringAny
                ? "comic/ch1/ch1_s3_fps_usps_fire_cutout.png"
                : "comic/ch1/ch1_s3_fps_usps_idle_cutout.png"
            )}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "right bottom",
            }}
          />
        </div>
      </ParallaxPlane>

      {/* Impact Frame Flashes on Each One-Tap Headshot */}
      <ImpactFrameFlash triggerFrame={28} duration={2} color="#00F0FF" />
      <ImpactFrameFlash triggerFrame={92} duration={2} color="#FFE600" />
      <ImpactFrameFlash triggerFrame={152} duration={3} color="#FF0055" />

      {/* Top-Right Live CS2 Comic Killfeed Stacking Up! */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 32,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 55,
          fontFamily: COMIC_DISPLAY_FONT,
        }}
      >
        {[
          { show: hit1, label: "1. НЭГ СУМААР!", victim: "CT_SAS_01", color: "#00F0FF" },
          { show: hit2, label: "2. 180° ЭРГЭНГҮҮТЭЭ!", victim: "CT_SAS_02", color: "#FFE600" },
          { show: hit3, label: "3. СМОУКНЫ ИРМЭГ!", victim: "CT_SAS_03", color: "#FF0055" },
        ].map(
          (k) =>
            k.show && (
              <div
                key={k.label}
                style={{
                  backgroundColor: "#090714",
                  border: `4px solid ${k.color}`,
                  boxShadow: "6px 6px 0px #000",
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#FFFFFF",
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                <span style={{ color: k.color }}>SHINEE</span>
                <span style={{ fontSize: 15, color: "#AAA" }}>[USP-S]</span>
                <HeadshotSkullIcon size={28} color={k.color} accent="#05040A" />
                <span>{k.victim}</span>
                <span
                  style={{
                    backgroundColor: k.color,
                    color: "#05040A",
                    padding: "2px 8px",
                    marginLeft: 6,
                  }}
                >
                  {k.label}
                </span>
              </div>
            )
        )}
      </div>

      {/* Comic Action Bursts on Each Kill */}
      {hit1 && frame < 85 && (
        <ActionBurst
          text="*ТАС!* 1 KILL"
          bgColor="#0088CC"
          color="#FFFFFF"
          size={42}
          x="32%"
          y="22%"
          rotation={-6}
          delay={28}
        />
      )}
      {hit2 && frame < 145 && (
        <ActionBurst
          text="180° ФЛИК! 2K!"
          bgColor="#FF6600"
          color="#FFFFFF"
          size={44}
          x="62%"
          y="20%"
          rotation={5}
          delay={92}
        />
      )}
      {hit3 && (
        <ActionBurst
          text="ГУРВАН КИЛЛ! 3K!"
          bgColor="#FF0055"
          color="#FFFFFF"
          size={52}
          x="36%"
          y="24%"
          rotation={-5}
          delay={152}
        />
      )}
    </AbsoluteFill>
  );
};

/**
 * BEAT 9 & 10 (1490 - 1855 frames / 365 local frames / 49.7s - 61.8s):
 * Multi-Layer Room + Shinee's Golden Victory Confidence Cutout (`ch1_s4_shinee_victory_cutout.png`)
 * + Scoreboard 4:1 + Teammates Voice Chat Audio Waveforms!
 */
const Beat9And10ScoreboardAndHype: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  // Scoreboard counts up to 4:1 as narrator says "Тоо дөрөв нэгийн харьцаатай..."
  const teamScore = frame < 130 ? 1 : frame < 155 ? 2 : frame < 180 ? 3 : 4;
  const enemyScore = frame < 165 ? 0 : 1;

  const boardPop = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: { damping: 12, stiffness: 170 },
  });

  const confidencePct = Math.round(
    interpolate(frame, [220, 310], [60, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const camera: ParallaxCameraState = {
    panX: Math.sin(frame * 0.04) * 0.22,
    panY: -0.05,
    zoom: interpolate(frame, [0, 365], [1.05, 1.18], {
      extrapolateRight: "clamp",
    }),
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#06040E" }}>
      {/* PLANE 1: Room Background */}
      <ParallaxPlane camera={camera} depth={-0.15}>
        <Img
          src={staticFile("comic/ch1/ch1_s1_room_bg.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scale(1.12)",
          }}
        />
      </ParallaxPlane>

      {/* PLANE 2: Golden Victory Shinee Cutout on the Right */}
      <ParallaxPlane camera={camera} depth={0.45} breatheAmp={6}>
        <div
          style={{
            position: "absolute",
            right: -120,
            bottom: 0,
            width: "68%",
            height: "96%",
            filter: "drop-shadow(10px 10px 0px #000) drop-shadow(-5px -5px 0px #FFE600)",
          }}
        >
          <Img
            src={staticFile("comic/ch1/ch1_s4_shinee_victory_cutout.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "right bottom",
            }}
          />
        </div>
      </ParallaxPlane>

      {/* Top Center Scoreboard: 4 : 1 */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          transform: `scale(${boardPop}) skewX(-3deg)`,
          backgroundColor: "#0E0B1C",
          border: "6px solid #000",
          boxShadow: "10px 10px 0px #00F0FF",
          padding: "16px 44px",
          display: "flex",
          alignItems: "center",
          gap: 36,
          fontFamily: COMIC_DISPLAY_FONT,
          zIndex: 40,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#00FF88", letterSpacing: "2px" }}>
            TEAM SHINEE
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "#FFE600",
              textShadow: "5px 5px 0px #000",
              lineHeight: 1,
            }}
          >
            {teamScore}
          </div>
        </div>

        <div style={{ fontSize: 54, color: "#FFF", fontWeight: 900 }}>:</div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, color: "#FF0055", letterSpacing: "2px" }}>
            ENEMY TEAM
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "#FF0055",
              textShadow: "5px 5px 0px #000",
              lineHeight: 1,
            }}
          >
            {enemyScore}
          </div>
        </div>
      </div>

      {/* Left Column: Teammate Voice Chat Cards with Live Audio Waveforms */}
      <div
        style={{
          position: "absolute",
          top: 215,
          left: 48,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 40,
        }}
      >
        {[
          {
            speaker: "БАГИЙН АНД_01",
            quote: "“ШИНЭЭ ЧИ ШҮҮ! АЙМААР БАЙНА АА!”",
            color: "#00FF88",
            delay: 15,
          },
          {
            speaker: "БАГИЙН АНД_02",
            quote: "“ӨНӨӨДӨР ЧИНИЙ ӨДӨР БАЙНА БРО!”",
            color: "#00F0FF",
            delay: 55,
          },
        ].map((chat, idx) => {
          if (frame < chat.delay) return null;
          return (
            <div
              key={chat.speaker}
              style={{
                backgroundColor: "#090714",
                border: `5px solid ${chat.color}`,
                boxShadow: "8px 8px 0px #000",
                padding: "14px 22px",
                width: 600,
                fontFamily: COMIC_BODY_FONT,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: chat.color,
                    fontWeight: 900,
                    fontSize: 17,
                    letterSpacing: "2px",
                  }}
                >
                  🔊 {chat.speaker}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 4,
                    height: 22,
                  }}
                >
                  {Array.from({ length: 12 }).map((_, barI) => {
                    const h =
                      5 +
                      Math.abs(
                        Math.sin(frame * 0.4 + barI * 0.9 + idx * 2)
                      ) *
                        17;
                    return (
                      <div
                        key={barI}
                        style={{
                          width: 4,
                          height: h,
                          backgroundColor: chat.color,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              <div style={{ color: "#FFFFFF", fontSize: 22, fontWeight: 900 }}>
                {chat.quote}
              </div>
            </div>
          );
        })}

        {/* 100% Confidence Meter */}
        {frame >= 130 && (
          <div
            style={{
              backgroundColor: "#FFE600",
              color: "#05040A",
              border: "6px solid #000",
              boxShadow: "10px 10px 0px #FF0055",
              padding: "16px 26px",
              width: 600,
              fontFamily: COMIC_DISPLAY_FONT,
              transform: "rotate(-1deg)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "2px" }}>
              ӨӨРТӨӨ ИТГЭХ ИТГЭЛ: {confidencePct}%
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4 }}>
              “ЭНЭ ТОГЛОЛТ Ч МАНАЙХ ЮМ БАЙНА ДАА!”
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/**
 * BEAT 11 & 12 (1855 - 2280 frames / 425 local frames / 61.8s - 76.0s):
 * The Psychological Collapse ("Гэвч... Шинээ нэг л зүйлийг мэдээгүй байлаа... ТИЛТ!")!
 * - Phase 1 (local 0-95): Shinee's expression physically snaps to `shock` (`shinee_expr_6_shock.png` — wide eyes, high brows, open-mouth gasp, cold blue skin) + Foreground Shattered Glass Shards (`ch1_s4_glass_shards_fg_cutout.png`)!
 * - Phase 2 (local 95-240): Shinee's expression warps into `rage` (`shinee_expr_7_rage.png` — angry V-brows, snarling mouth, crimson eye glow) + Spiking Heart Rate ECG (`78 -> 142 BPM`)!
 * - Phase 3 (local 240-425): Neural Brain-Freeze Silhouette (`ch1_tilt_shadow.png`) + Crimson Synapse Short-Circuit + 4-Card `Т - И - Л - Т` Slam at local 330!
 */
const Beat11And12BrainFreezeTilt: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const isShockPhase = frame < 95;
  const isRagePhase = frame >= 95 && frame < 240;
  const isNeuralFinale = frame >= 240;

  const bpm = Math.round(
    interpolate(frame, [10, 210], [78, 142], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const camera: ParallaxCameraState = {
    panX: (pseudoRandom(frame) - 0.5) * (isRagePhase ? 0.18 : 0.08),
    panY: (pseudoRandom(frame + 33) - 0.5) * (isRagePhase ? 0.18 : 0.08),
    zoom: interpolate(frame, [0, 240], [1.06, 1.30], {
      extrapolateRight: "clamp",
    }),
    rotate: isShockPhase ? 3 : isRagePhase ? -4 : 0,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", overflow: "hidden" }}>
      <ImpactFrameFlash triggerFrame={2} duration={4} color="#00F0FF" />
      <ImpactFrameFlash triggerFrame={95} duration={4} color="#FF0044" />
      <ImpactFrameFlash triggerFrame={240} duration={4} color="#FF0055" />
      <ImpactFrameFlash triggerFrame={330} duration={5} color="#FF0044" />

      {!isNeuralFinale ? (
        /* PHASE 1 & 2 (local 0-240): Multi-Layer Shinee Shock -> Rage Expression Shift! */
        <MultiLayerShineeRig
          camera={camera}
          mood={isShockPhase ? "shock" : "rage"}
          rimColor={isShockPhase ? "#00F0FF" : "#FF0044"}
          charX={-190}
          charY={30}
          charScale={1.18}
          showMonitorFg={true}
          foregroundOverlay={
            /* Closest Foreground Shattered Glass Shards (`ch1_s4_glass_shards_fg_cutout.png`) */
            <ParallaxPlane camera={camera} depth={1.1}>
              <Img
                src={staticFile("comic/ch1/ch1_s4_glass_shards_fg_cutout.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: "scale(1.08)",
                }}
              />
            </ParallaxPlane>
          }
        />
      ) : (
        /* PHASE 3 (local 240-425): Neural Short-Circuit Silhouette + Foreground Shards */
        <AbsoluteFill>
          <ChromaticAberration intensity={8} glitchActive={true}>
            <Img
              src={staticFile("comic/ch1_tilt_shadow.png")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 28%",
                transform: `scale(${interpolate(frame, [240, 425], [1.08, 1.25], { extrapolateRight: "clamp" })})`,
              }}
            />
          </ChromaticAberration>
          <Img
            src={staticFile("comic/ch1/ch1_s4_glass_shards_fg_cutout.png")}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      )}

      {/* Top-Left Warning Box */}
      <NarratorBox
        text={
          isShockPhase
            ? "ГЭВЧ... ШИНЭЭ НЭГ Л ЗҮЙЛИЙГ МЭДЭЭГҮЙ БАЙЛАА"
            : isRagePhase
            ? "ХАМГИЙН АЮУЛТАЙ ДАЙСАН ӨӨРИЙНХ НЬ ТОЛГОЙ ДОТОР!"
            : "ТАРХИНЫ ГАЦАЛТ // BRAIN FREEZE!"
        }
        x={52}
        y={42}
        delay={4}
        bgColor={isShockPhase ? "#00F0FF" : "#FF0044"}
        textColor={isShockPhase ? "#05040A" : "#FFFFFF"}
        rotation={-2}
      />

      {/* Right-Side Biometric Heart-Rate Monitor (local 15 - 235) */}
      {frame >= 15 && frame < 235 && (
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 90,
            backgroundColor: "rgba(9, 6, 18, 0.92)",
            border: "5px solid #FF0044",
            boxShadow: "10px 10px 0px #000",
            padding: "20px 28px",
            width: 520,
            fontFamily: COMIC_DISPLAY_FONT,
            zIndex: 45,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ color: "#FF0044", fontSize: 20, letterSpacing: "2px" }}>
              ♥ ЗҮРХНИЙ ЦОХИЛТ (BPM)
            </span>
            <span style={{ color: "#FFE600", fontSize: 48, fontWeight: 900 }}>
              {bpm} BPM
            </span>
          </div>
          <svg width="460" height="70" viewBox="0 0 460 70">
            <polyline
              fill="none"
              stroke="#FF0044"
              strokeWidth="5"
              points={Array.from({ length: 46 })
                .map((_, idx) => {
                  const x = idx * 10;
                  const pulse =
                    (idx + Math.floor(frame / 2)) % 8 === 0
                      ? -28
                      : (idx + Math.floor(frame / 2)) % 8 === 1
                      ? 26
                      : 0;
                  return `${x},${35 + pulse}`;
                })
                .join(" ")}
            />
          </svg>
          <div
            style={{
              color: isShockPhase ? "#00F0FF" : "#FF0055",
              fontSize: 22,
              fontWeight: 900,
              marginTop: 8,
            }}
          >
            {isShockPhase
              ? "⚡ АНХААРАЛ САРНИЛТ ЭХЭЛЛЭЭ..."
              : "⚠️ АДРЕНАЛИН ХЭТ ИХСЭЛТ: ТИЛТ!"}
          </div>
        </div>
      )}

      {/* BEAT 12 FINALE (local 250 - 425): Giant 4-Card Ransom-Note "Т - И - Л - Т" Slam */}
      {frame >= 250 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 138,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 55,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFE600",
              color: "#05040A",
              border: "5px solid #000",
              boxShadow: "8px 8px 0px #000",
              padding: "8px 28px",
              fontFamily: COMIC_DISPLAY_FONT,
              fontSize: 30,
              fontWeight: 900,
              marginBottom: 16,
              transform: "rotate(-1.5deg)",
            }}
          >
            {frame < 330 ? "ТЭР ДАЙСНЫ НЭРИЙГ..." : "ТЭР ДАЙСНЫ НЭРИЙГ... ТИЛТ ГЭДЭГ!"}
          </div>

          {frame >= 330 && (
            <div style={{ display: "flex", gap: 22 }}>
              {["Т", "И", "Л", "Т"].map((letter, i) => {
                const s = spring({
                  frame: Math.max(0, frame - 330 - i * 6),
                  fps,
                  config: { damping: 9, stiffness: 240 },
                });
                const angles = [-7, 5, -5, 8];
                const bgColors = ["#FF0044", "#FFE600", "#00F0FF", "#FF0055"];
                const txtColors = ["#FFFFFF", "#05040A", "#05040A", "#FFFFFF"];
                return (
                  <div
                    key={i}
                    style={{
                      backgroundColor: bgColors[i],
                      color: txtColors[i],
                      fontFamily: COMIC_DISPLAY_FONT,
                      fontSize: 132,
                      fontWeight: 900,
                      padding: "6px 38px",
                      border: "8px solid #000000",
                      boxShadow: "14px 14px 0px #000000",
                      transform: `scale(${s}) rotate(${angles[i]}deg)`,
                      lineHeight: 1.05,
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

export const Chapter1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#05040A", overflow: "hidden" }}>
      {/* Master Audio Track: Voiceover + Spider-Verse BGM + 22 Frame-Accurate SFX */}
      <Chapter1AudioTrack />

      {/* BEAT 1 & 2: 0:00 - 0:08 (0 - 265 frames) */}
      <Sequence durationInFrames={265}>
        <Beat1And2UlaanbaatarParallax />
      </Sequence>

      {/* BEAT 3, 4 & 5: 0:08 - 0:28 (265 - 860 frames) */}
      <Sequence from={265} durationInFrames={595}>
        <Beat3To5ShineeActingAndElo />
      </Sequence>

      {/* BEAT 6 & 7: 0:28 - 0:41 (860 - 1255 frames) */}
      <Sequence from={860} durationInFrames={395}>
        <Beat6And7MirageFlowState />
      </Sequence>

      {/* BEAT 8: 0:41 - 0:49 (1255 - 1490 frames) */}
      <Sequence from={1255} durationInFrames={235}>
        <Beat8ThreeKillMultiLayerFPS />
      </Sequence>

      {/* BEAT 9 & 10: 0:49 - 1:01 (1490 - 1855 frames) */}
      <Sequence from={1490} durationInFrames={365}>
        <Beat9And10ScoreboardAndHype />
      </Sequence>

      {/* BEAT 11 & 12: 1:01 - 1:16 (1855 - 2280 frames) */}
      <Sequence from={1855} durationInFrames={425}>
        <Beat11And12BrainFreezeTilt />
      </Sequence>

      {/* Scene Cut Impact Flashes */}
      <ImpactFrameFlash triggerFrame={265} duration={3} color="#00F0FF" />
      <ImpactFrameFlash triggerFrame={860} duration={3} color="#00FF88" />
      <ImpactFrameFlash triggerFrame={1255} duration={3} color="#FFE600" />
      <ImpactFrameFlash triggerFrame={1490} duration={3} color="#00F0FF" />
      <ImpactFrameFlash triggerFrame={1855} duration={4} color="#FF0044" />
      <ImpactFrameFlash triggerFrame={2185} duration={5} color="#FF0055" />

      {/* Global Spider-Verse Halftone Dot Texture */}
      <HalftoneOverlay opacity={0.14} />

      {/* Global Comic Frame Border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "12px solid #000000",
          pointerEvents: "none",
          zIndex: 90,
        }}
      />
    </AbsoluteFill>
  );
};
