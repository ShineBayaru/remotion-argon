import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";

/**
 * CHAPTER 1: AUDIO TRACK
 *
 * 1. Master Mongolian Voiceover (ElevenLabs `hook.mp3`)
 * 2. Background Music: "Internet Cafe Vibes" (`internet_cafe_vibes.mp3`)
 * 3. Authentic CS in-game sound assets (USP-S, Headshot helmet dink, Smoke, UI clicks, Radio)
 */
export const Chapter1AudioTrack: React.FC = () => {
  return (
    <>
      {/* Master Voiceover Track */}
      <Sequence from={0} durationInFrames={2280}>
        <Audio src={staticFile("audio/hook.mp3")} volume={1.0} />
      </Sequence>

      {/* Background Music: "Internet Cafe Vibes" */}
      <Sequence from={0} durationInFrames={2280}>
        <Audio
          src={staticFile("audio/internet_cafe_vibes.mp3")}
          volume={(f) => {
            // Gentle fade-in over the first second
            if (f < 45) {
              return interpolate(f, [0, 45], [0.05, 0.30], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            }
            // During speech & action: comfortable background level
            if (f < 1855) {
              return 0.30;
            }
            // Dramatic ducking on "Гэвч... ТИЛТ" climax
            return interpolate(f, [1855, 1880, 2220, 2280], [0.30, 0.22, 0.22, 0.05], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          }}
        />
      </Sequence>

      {/* -------------------------------------------------------------
          AUTHENTIC CS IN-GAME SOUND EFFECTS ONLY
      ------------------------------------------------------------- */}

      {/* Tactical Mouse / UI Button Click (Match Accept at frame 904) */}
      <Sequence from={904} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/mouse_click.wav")} volume={0.8} />
      </Sequence>

      {/* 3-KILL PISTOL ROUND (Frames 1255 - 1490) */}
      {/* KILL 1: Center Triple Box Headshot */}
      <Sequence from={1283} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_usp_silenced.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={1284} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_headshot_dink.wav")} volume={0.85} />
      </Sequence>

      {/* KILL 2: Right Balcony 180° Headshot */}
      <Sequence from={1347} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_usp_silenced.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={1348} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_headshot_dink.wav")} volume={0.85} />
      </Sequence>

      {/* Real In-Game Smoke Pop */}
      <Sequence from={1367} durationInFrames={90}>
        <Audio src={staticFile("audio/sfx/cs2_smoke_pop.wav")} volume={0.65} />
      </Sequence>

      {/* KILL 3: Smoke Edge Headshot */}
      <Sequence from={1407} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_usp_silenced.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={1408} durationInFrames={20}>
        <Audio src={staticFile("audio/sfx/cs2_headshot_dink.wav")} volume={0.85} />
      </Sequence>

      {/* Real In-Game Radio Chatter on 4:1 Hype */}
      <Sequence from={1505} durationInFrames={45}>
        <Audio src={staticFile("audio/sfx/radio_chatter.wav")} volume={0.7} />
      </Sequence>
    </>
  );
};
