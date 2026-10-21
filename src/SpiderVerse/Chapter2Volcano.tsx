import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Chapter2AudioTrack } from "./Chapter2AudioTrack";
import {
  ActionBurst,
  ChromaticAberration,
  COMIC_DISPLAY_FONT,
  HalftoneOverlay,
  ImpactFrameFlash,
  SpeedLines,
  useSteppedFrame,
} from "./SpiderVerseEffects";
import {
  AnimatedCSCrosshair,
  HeadshotSkullIcon,
} from "./ComicIcons";
import { ParallaxCameraState, ParallaxPlane } from "./ParallaxLayer";
import { MultiLayerShineeRig } from "./ComicCharacters";

/**
 * CHAPTER 2: "ЭХНИЙ ОЧ БА ГАЛТ УУЛЫН ХУРИМТЛАЛ" (The First Spark & Volcano Accumulation)
 *
 * Visual Style: Spider-Man: Into/Across the Spider-Verse graphic novel aesthetic.
 * 2.5D Multi-layer parallax, stepped frames, halftone textures, chromatic aberration,
 * authentic Counter-Strike sounds & gameplay moments.
 */

// =============================================================================
// BEAT 1 & 2: Mirage A-Ramp Push with Volumetric Smoke (frames 0 - 540)
// =============================================================================
const Beat1And2MirageSmokePush: React.FC = () => {
  const frame = useSteppedFrame(2);

  // First-person camera bobbing as Shinee walks forward
  const walkBob = Math.sin(frame * 0.15) * 6;
  const walkSway = Math.cos(frame * 0.075) * 4;

  const camera: ParallaxCameraState = {
    panX:
      interpolate(frame, [0, 540], [-0.06, 0.04], {
        extrapolateRight: "clamp",
      }) +
      walkSway * 0.002,
    panY:
      interpolate(frame, [0, 540], [0.03, -0.02], {
        extrapolateRight: "clamp",
      }) +
      walkBob * 0.002,
    zoom: interpolate(frame, [0, 540], [1.02, 1.25], {
      extrapolateRight: "clamp",
    }),
    rotate: Math.sin(frame * 0.05) * 0.4,
  };

  // Smoke billowing expansion
  const smokeScale = interpolate(frame, [0, 540], [0.95, 1.12]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0A14", overflow: "hidden" }}>
      {/* LAYER 1 (Depth 0.0): Mirage A-Ramp Sandstone Architecture */}
      <ParallaxPlane camera={camera} depth={0.0}>
        <Img
          src={staticFile("comic/ch2/ch2_s1_mirage_aramp_bg.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ParallaxPlane>

      {/* LAYER 2 (Depth 0.4): Volumetric Comic Smoke Grenade Bloom */}
      <ParallaxPlane camera={camera} depth={0.4}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            transform: `translate(-50%, -45%) scale(${smokeScale})`,
            width: "85%",
            height: "85%",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("comic/ch2/ch2_s1_smoke_cloud_dense.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </ParallaxPlane>

      {/* LAYER 3 (Depth 0.75): First-Person Crosshair locked onto smoke edge */}
      <ParallaxPlane camera={camera} depth={0.75}>
        <AnimatedCSCrosshair
          x={960 + walkSway}
          y={520 + walkBob}
          spread={frame < 240 ? 12 : 8}
          isHit={false}
        />
      </ParallaxPlane>

      {/* LAYER 4 (Depth 1.0): First-Person M4A1 Tactical Rifle */}
      <ParallaxPlane camera={camera} depth={1.0}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: `translate(${walkSway * 1.5}px, ${walkBob * 1.5}px)`,
          }}
        >
          <Img
            src={staticFile("comic/ch2/ch2_s1_fps_rifle_idle_cutout.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </ParallaxPlane>

      {/* COMIC HUD OVERLAY: Round 6 Eco Round Info */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 50,
          display: "flex",
          gap: 16,
          zIndex: 40,
        }}
      >
        <div
          style={{
            backgroundColor: "#0D0B18",
            border: "4px solid #000",
            boxShadow: "6px 6px 0px #FFE600",
            padding: "10px 22px",
            fontFamily: COMIC_DISPLAY_FONT,
            fontSize: 26,
            color: "#FFE600",
            letterSpacing: 2,
          }}
        >
          ROUND 6 // ECO ROUND
        </div>
        <div
          style={{
            backgroundColor: "#0D0B18",
            border: "4px solid #000",
            boxShadow: "6px 6px 0px #00F0FF",
            padding: "10px 20px",
            fontFamily: COMIC_DISPLAY_FONT,
            fontSize: 24,
            color: "#00F0FF",
            letterSpacing: 1,
          }}
        >
          FULL BUY: M4A1-S + ARMOR + UTILITY
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 3: Running Sideways Deagle Kill through Smoke (frames 540 - 720)
// =============================================================================
const Beat3RunningDeagleBurst: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  // Enemy bursts into frame at local frame 30, fires at local frame 90
  const enemyBurst = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 10, stiffness: 140 },
  });

  const isFiring = frame >= 90 && frame <= 110;

  // Violent screen shake on deagle gunshot
  const shakeX = isFiring ? Math.sin(frame * 12) * 24 : 0;
  const shakeY = isFiring ? Math.cos(frame * 14) * 18 : 0;

  // Running enemy translation horizontally across smoke
  const enemyX = interpolate(frame, [30, 180], [1400, 300], {
    extrapolateLeft: "clamp",
  });
  const enemyY = 480 + Math.sin(frame * 0.25) * 25; // jumping gait

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0C0A14",
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Background Mirage with intense chromatic distortion */}
      <ChromaticAberration
        intensity={isFiring ? 12 : 3}
        glitchActive={isFiring}
      >
        <Img
          src={staticFile("comic/ch2/ch2_s1_mirage_aramp_bg.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ChromaticAberration>

      {/* Heavy Speedlines during the running sprint */}
      {frame >= 30 && <SpeedLines color="#FFE600" density={32} />}

      {/* Running Deagle Enemy Cutout */}
      {frame >= 30 && (
        <div
          style={{
            position: "absolute",
            left: enemyX,
            top: enemyY,
            transform: `translate(-50%, -50%) scale(${enemyBurst * 1.05})`,
            width: 1400,
            height: 900,
            zIndex: 35,
          }}
        >
          <Img
            src={staticFile("comic/ch2/ch2_s2_running_deagle.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Explosive Action Burst at Muzzle Flash (frame 90) */}
      <ActionBurst
        text="BLAM!"
        delay={90}
        exitFrame={115}
        x={enemyX - 260}
        y={enemyY - 100}
        color="#FFFFFF"
        bgColor="#FF0055"
        size={64}
      />

      {/* Impact Frame Flash */}
      <ImpactFrameFlash triggerFrame={90} duration={4} color="#FF0055" />

      {/* Crosshair snapping in horror */}
      <AnimatedCSCrosshair
        x={960}
        y={520}
        spread={isFiring ? 40 : 10}
        isHit={isFiring}
      />
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 4: "ХЭДШОТ" Comic Card & Black Screen (frames 720 - 960)
// =============================================================================
const Beat4HeadshotDeathCard: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const cardPop = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#08040C", overflow: "hidden" }}>
      {/* Glitch & Red Halftone Tint */}
      <HalftoneOverlay dotSize={6} opacity={0.35} dotColor="#FF0055" />

      {/* Dramatic Comic Headshot Card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${cardPop})`,
          width: "90%",
          height: "85%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 30,
        }}
      >
        <Img
          src={staticFile("comic/ch2/ch2_s3_headshot_card.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Top Warning Banner */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#FF0055",
          border: "5px solid #000",
          boxShadow: "8px 8px 0px #FFE600",
          padding: "12px 36px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          zIndex: 40,
        }}
      >
        <HeadshotSkullIcon size={38} color="#FFFFFF" accent="#FFE600" />
        <span
          style={{
            fontFamily: COMIC_DISPLAY_FONT,
            fontSize: 34,
            color: "#FFFFFF",
            letterSpacing: 2,
          }}
        >
          ХЭДШОТ // FULL ARMOR ONE-TAP
        </span>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 5: Shinee's Forced Calm Smirk (frames 960 - 1200)
// =============================================================================
const Beat5ShineeDrySmirk: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const camera: ParallaxCameraState = {
    panX: interpolate(frame, [0, 240], [0.08, -0.04]),
    panY: interpolate(frame, [0, 240], [-0.02, 0.03]),
    zoom: interpolate(frame, [0, 240], [1.02, 1.15]),
    rotate: 0,
  };

  const bubblePop = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 11, stiffness: 160 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0A18", overflow: "hidden" }}>
      {/* 4-Plane Shinee Rig with "smirk" expression & leaning back posture! */}
      <MultiLayerShineeRig
        camera={camera}
        mood="smirk"
        angleVariant="side_rig"
        rimColor="#00F0FF"
        charX={120}
        charY={20}
        charScale={1.15}
        showMonitorFg={true}
        behindCharacterLayer={
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.85,
            }}
          >
            <Img
              src={staticFile("comic/ch2/ch2_s4_shinee_dry_smirk_panel.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        }
      />

      {/* Comic Dialogue Balloon pop */}
      {frame >= 30 && (
        <div
          style={{
            position: "absolute",
            left: 360,
            top: 240,
            transform: `scale(${bubblePop})`,
            backgroundColor: "#FFFFFF",
            border: "6px solid #000000",
            boxShadow: "10px 10px 0px #FFE600",
            padding: "20px 32px",
            maxWidth: 580,
            zIndex: 50,
          }}
        >
          <div
            style={{
              fontFamily: COMIC_DISPLAY_FONT,
              fontSize: 32,
              color: "#0D0B18",
              lineHeight: 1.3,
            }}
          >
            "За яахав, зүгээр л азтай суга байна..."
          </div>
          <div
            style={{
              fontSize: 18,
              color: "#666",
              marginTop: 8,
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            (Гаднаасаа тайван боловч...)
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 6: Time Freeze & Shattered Reality (frames 1200 - 1380)
// =============================================================================
const Beat6TimeFreeze: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const freezeFlash = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 220 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07060E",
        overflow: "hidden",
        filter: "grayscale(70%) contrast(140%)",
      }}
    >
      <ChromaticAberration intensity={8} glitchActive={true}>
        <Img
          src={staticFile("comic/ch2/ch2_s4_shinee_dry_smirk_panel.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </ChromaticAberration>

      <SpeedLines color="#00F0FF" density={36} />

      {/* Freeze Time Comic Banner */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${freezeFlash})`,
          backgroundColor: "#00F0FF",
          border: "8px solid #000000",
          boxShadow: "14px 14px 0px #FF0055",
          padding: "24px 60px",
          textAlign: "center",
          zIndex: 45,
        }}
      >
        <div
          style={{
            fontFamily: COMIC_DISPLAY_FONT,
            fontSize: 48,
            color: "#000000",
            letterSpacing: 4,
          }}
        >
          ЦАГИЙГ ТҮР ЗОГСООЁ!
        </div>
        <div
          style={{
            fontSize: 22,
            fontFamily: "sans-serif",
            fontWeight: 800,
            color: "#0D0B18",
            marginTop: 8,
          }}
        >
          TIME FREEZE // PSYCHOLOGICAL ANALYSIS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 7: Jared Tendler - Sports Psychologist Card (frames 1380 - 1740)
// =============================================================================
const Beat7JaredTendlerTheory: React.FC = () => {
  const frame = useSteppedFrame(2);
  const { fps } = useVideoConfig();

  const cardSlide = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A1020", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          transform: `scale(${cardSlide})`,
        }}
      >
        <Img
          src={staticFile("comic/ch2/ch2_s5_jared_tendler.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <HalftoneOverlay dotSize={7} opacity={0.25} dotColor="#00F0FF" />
    </AbsoluteFill>
  );
};

// =============================================================================
// BEAT 8 & 9: Volcano Accumulation Diagram (frames 1740 - 2400)
// =============================================================================
const Beat8And9VolcanoAccumulation: React.FC = () => {
  const frame = useSteppedFrame(2);

  // Magma rises from 10% (local frame 0-180) to 30% (local frame 180-400)
  const magmaRise = interpolate(frame, [0, 180, 400], [0.1, 0.15, 0.35], {
    extrapolateRight: "clamp",
  });

  // Lava heat pulsation
  const lavaPulse = 1.0 + Math.sin(frame * 0.15) * 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D0A16", overflow: "hidden" }}>
      {/* Background: Volcano Geological Cross-Section Plate */}
      <Img
        src={staticFile("comic/ch2/ch2_s6_volcano_diagram_bg.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Animated Rising Glowing Magma Reservoir */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          clipPath: `inset(${(1 - magmaRise) * 60}% 0px 0px 0px)`,
          transform: `scale(${lavaPulse})`,
          transformOrigin: "center bottom",
          filter: "drop-shadow(0 0 24px #FF5A00)",
        }}
      >
        <Img
          src={staticFile("comic/ch2/ch2_s6_volcano_magma_glow.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Subconscious Stress Meter Overlay (appears at frame 90) */}
      {frame >= 90 && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("comic/ch2/ch2_s6_subconscious_meter.png")}
            style={{ width: "90%", height: "90%", objectFit: "contain" }}
          />
        </div>
      )}

      {/* Halftone Overlay */}
      <HalftoneOverlay dotSize={6} opacity={0.25} dotColor="#FF9000" />
    </AbsoluteFill>
  );
};

// =============================================================================
// MAIN CHAPTER 2 COMPONENT
// =============================================================================
export const Chapter2Volcano: React.FC = () => {
  const frame = useSteppedFrame(2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      {/* BEAT 1 & 2: Mirage A-Ramp Push with Volumetric Smoke (0 - 540) */}
      {frame < 540 && <Beat1And2MirageSmokePush />}

      {/* BEAT 3: Running Sideways Deagle Burst (540 - 720) */}
      {frame >= 540 && frame < 720 && <Beat3RunningDeagleBurst />}

      {/* BEAT 4: "ХЭДШОТ" Headshot Death Card (720 - 960) */}
      {frame >= 720 && frame < 960 && <Beat4HeadshotDeathCard />}

      {/* BEAT 5: Shinee's Forced Calm Smirk (960 - 1200) */}
      {frame >= 960 && frame < 1200 && <Beat5ShineeDrySmirk />}

      {/* BEAT 6: Time Freeze & Shattered Reality (1200 - 1380) */}
      {frame >= 1200 && frame < 1380 && <Beat6TimeFreeze />}

      {/* BEAT 7: Jared Tendler - Sports Psychologist Card (1380 - 1740) */}
      {frame >= 1380 && frame < 1740 && <Beat7JaredTendlerTheory />}

      {/* BEAT 8 & 9: Volcano Accumulation Diagram (1740 - 2400) */}
      {frame >= 1740 && <Beat8And9VolcanoAccumulation />}

      {/* AUTHENTIC AUDIO MIXER (BGM + REAL CS SFX + VOICEOVER) */}
      <Chapter2AudioTrack deagleShotFrame={630} freezeFrame={1200} />
    </AbsoluteFill>
  );
};
