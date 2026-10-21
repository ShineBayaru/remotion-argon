import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { useSteppedFrame } from "./SpiderVerseEffects";

export interface ParallaxCameraState {
  /** Normalized horizontal camera pan (-1 to 1) */
  panX: number;
  /** Normalized vertical camera pan (-1 to 1) */
  panY: number;
  /** Base camera zoom (1 = 100%) */
  zoom: number;
  /** Subtle camera tilt in degrees */
  rotate?: number;
}

interface ParallaxPlaneProps {
  camera: ParallaxCameraState;
  /**
   * Depth multiplier:
   * -0.3 = distant sky / far background (moves slowly)
   *  0.0 = main background plate
   *  0.4 = midground character / enemy cutout (moves noticeably)
   *  0.9 = close foreground frame / weapon POV / debris (moves fast!)
   */
  depth: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** Optional independent idle breathing bob amplitude in px */
  breatheAmp?: number;
  breatheSpeed?: number;
}

/**
 * Renders a 2.5D plane that shifts and scales according to its depth relative to the camera.
 */
export const ParallaxPlane: React.FC<ParallaxPlaneProps> = ({
  camera,
  depth,
  children,
  style,
  breatheAmp = 0,
  breatheSpeed = 0.12,
}) => {
  const frame = useSteppedFrame(2);

  // Parallax translation in pixels based on depth
  const offsetX = -camera.panX * (60 + depth * 110);
  const offsetY = -camera.panY * (35 + depth * 70);
  const breatheY = breatheAmp ? Math.sin(frame * breatheSpeed) * breatheAmp : 0;

  // Foreground layers scale slightly more during camera zoom
  const planeScale = Math.max(
    1,
    1 + (camera.zoom - 1) * (1 + depth * 0.45)
  );
  const planeRotate = (camera.rotate ?? 0) * (1 + depth * 0.25);

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${offsetX}px, ${
          offsetY + breatheY
        }px, 0) scale(${planeScale}) rotate(${planeRotate}deg)`,
        transformOrigin: "center center",
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

interface ComicCutoutSpriteProps {
  /** Path relative to `public/`, e.g. "comic/ch1/ch1_s2_shinee_laser_focus_cutout.png" */
  src: string;
  style?: React.CSSProperties;
  /** Colored comic rim-light drop shadow, e.g. "#00F0FF" or "#FF0055" */
  rimColor?: string;
  /** Scale multiplier */
  scale?: number;
  /** X offset in px or % */
  x?: number | string;
  /** Y offset in px or % */
  y?: number | string;
  /** Rotation in deg */
  rotation?: number;
}

/**
 * Renders a transparent RGBA cutout PNG sprite with a crisp comic book drop shadow & rim glow.
 */
export const ComicCutoutSprite: React.FC<ComicCutoutSpriteProps> = ({
  src,
  style,
  rimColor = "#00F0FF",
  scale = 1,
  x = 0,
  y = 0,
  rotation = 0,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${ typeof x === "number" ? `${x}px` : x }, ${
          typeof y === "number" ? `${y}px` : y
        }) scale(${scale}) rotate(${rotation}deg)`,
        filter: `drop-shadow(8px 8px 0px #000000) drop-shadow(-4px -4px 0px ${rimColor})`,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
