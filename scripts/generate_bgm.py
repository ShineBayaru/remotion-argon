#!/usr/bin/env python3
"""
Synthesize a custom 76.0s (2280 frames @ 30fps) Spider-Verse Style BGM Soundtrack.
Tempo: 135 BPM | Key: C Minor / C Phrygian
Audio format: 44.1kHz Stereo 16-bit WAV -> MP3
"""
import os
import wave
import numpy as np
import subprocess

OUT_FILE = "/workspaces/remotion-argon/public/audio/bgm_spiderverse.mp3"
SR = 44100
DURATION = 76.0  # seconds
TOTAL_SAMPLES = int(SR * DURATION)
BPM = 135.0
BEAT_DUR = 60.0 / BPM  # ~0.444s per beat
BAR_DUR = BEAT_DUR * 4.0  # ~1.777s per 4/4 bar
SIXTEENTH = BEAT_DUR / 4.0  # ~0.111s

print(f"Synthesizing Spider-Verse BGM: {DURATION}s at {BPM} BPM...")

# Initialize stereo mix buffers
left = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
right = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

t_all = np.linspace(0, DURATION, TOTAL_SAMPLES, endpoint=False)

# -------------------------------------------------------------------
# Helper: Simple IIR low-pass filter
# -------------------------------------------------------------------
def lowpass_filter(signal: np.ndarray, cutoff_hz: float) -> np.ndarray:
    rc = 1.0 / (2 * np.pi * cutoff_hz)
    dt = 1.0 / SR
    alpha = dt / (rc + dt)
    out = np.zeros_like(signal)
    prev = 0.0
    for i in range(len(signal)):
        prev += alpha * (signal[i] - prev)
        out[i] = prev
    return out

# -------------------------------------------------------------------
# Drum One-Shots Pre-generation
# -------------------------------------------------------------------
# 1. 808 Kick
kick_len = int(SR * 0.45)
t_k = np.linspace(0, 0.45, kick_len, endpoint=False)
f_k = 135 * np.exp(-t_k * 22) + 42
phase_k = 2 * np.pi * np.cumsum(f_k) / SR
kick_raw = np.sin(phase_k) * np.exp(-t_k * 6.5)
kick_one_shot = np.tanh(2.8 * kick_raw) * 0.95

# 2. Trap Snare / Clap
snare_len = int(SR * 0.28)
t_s = np.linspace(0, 0.28, snare_len, endpoint=False)
body_s = np.sin(2 * np.pi * 195 * t_s) * np.exp(-t_s * 25)
noise_s = np.random.uniform(-1, 1, snare_len) * np.exp(-t_s * 14)
snare_one_shot = (body_s * 0.4 + noise_s * 0.6) * 0.85

# 3. Closed Hi-Hat
hat_len = int(SR * 0.05)
t_h = np.linspace(0, 0.05, hat_len, endpoint=False)
noise_h = np.random.uniform(-1, 1, hat_len)
# simple metallic ring
ring_h = (np.sin(2 * np.pi * 6500 * t_h) + np.sin(2 * np.pi * 8400 * t_h)) * 0.4
hat_one_shot = (noise_h * 0.6 + ring_h) * np.exp(-t_h * 75) * 0.55

# -------------------------------------------------------------------
# LAYER 1: Ambient Pad & Drone (0.0s - 76.0s)
# -------------------------------------------------------------------
print("Synthesizing ambient atmospheric pads...")
# C minor chords: C3 (130.8Hz), Eb3 (155.6Hz), G3 (196.0Hz), Ab3 (207.6Hz)
pad_freqs = [130.81, 155.56, 196.00, 207.65]
pad_synth = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
for idx, freq in enumerate(pad_freqs):
    # Detuned chorused sines
    phase1 = 2 * np.pi * freq * t_all
    phase2 = 2 * np.pi * (freq * 1.004) * t_all
    pad_synth += (np.sin(phase1) + 0.8 * np.sin(phase2)) * 0.08

# Pad volume automation across timeline
pad_vol = np.ones(TOTAL_SAMPLES, dtype=np.float32) * 0.4
# Swell in at 0s, dip slightly during 3-kills, rise in finale
pad_synth *= pad_vol
left += pad_synth * 0.9
right += pad_synth * 1.05

# -------------------------------------------------------------------
# LAYER 2: Melodic Spider-Verse Synth Arpeggio Motif
# -------------------------------------------------------------------
print("Synthesizing Spider-Verse lead synth arpeggio...")
# Motif notes: C4 (261.6), Eb4 (311.1), G4 (392.0), Ab4 (415.3), G4 (392.0), Eb4 (311.1), D4 (293.7), C4 (261.6)
arp_pitches = [261.63, 311.13, 392.00, 415.30, 392.00, 311.13, 293.66, 261.63]
arp_audio = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

# Play arp from 8.8s to 61.8s
step_t = SIXTEENTH
num_steps = int((61.8 - 8.8) / step_t)
for step_i in range(num_steps):
    st = 8.8 + step_i * step_t
    s_idx = int(st * SR)
    pitch = arp_pitches[step_i % len(arp_pitches)]
    note_len = int(SR * step_t * 0.9)
    t_n = np.linspace(0, note_len / SR, note_len, endpoint=False)
    # Sawtooth with rich harmonics
    saw = (2.0 * (t_n * pitch - np.floor(0.5 + t_n * pitch)))
    # Sub harmonic
    sub = np.sin(2 * np.pi * (pitch / 2) * t_n) * 0.4
    note_audio = (saw * 0.6 + sub) * np.exp(-t_n * 16)
    
    # Velocity accent on 1st and 5th 16th note
    vel = 0.55 if step_i % 4 == 0 else 0.35
    if st >= 28.7 and st < 49.7:
        vel *= 1.4  # higher intensity during Match Found & 3-Kills
    elif st >= 49.7:
        vel *= 1.25 # triumphant hype

    e_idx = min(TOTAL_SAMPLES, s_idx + note_len)
    arp_audio[s_idx:e_idx] += note_audio[: e_idx - s_idx] * vel

# Add simple delay echo
echo_samples = int(SR * 0.166)
arp_echo = np.zeros_like(arp_audio)
arp_echo[echo_samples:] = arp_audio[:-echo_samples] * 0.38
arp_final = arp_audio + arp_echo

left += arp_final * 0.42
right += arp_final * 0.48

# -------------------------------------------------------------------
# LAYER 3: 808 Bassline & Reese Synth
# -------------------------------------------------------------------
print("Synthesizing 808 sub bass & reese bassline...")
bass_audio = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
# Bassline root notes: C2 (65.4Hz) for 2 bars -> Ab1 (51.9Hz) for 1 bar -> G1 (49.0Hz) for 1 bar
bass_roots = [65.41, 65.41, 51.91, 48.99]

# Bass active from 8.8s to 61.8s
cur_bar = 0
for b_start in np.arange(8.8, 61.8, BAR_DUR):
    root_freq = bass_roots[cur_bar % len(bass_roots)]
    cur_bar += 1
    # 4 beats per bar
    for beat_i in range(4):
        # Trigger 808 on beat 0 and beat 2.5
        triggers = [0.0, 1.5] if (b_start >= 28.7) else [0.0]
        for trig in triggers:
            t_trig = b_start + trig * BEAT_DUR
            if t_trig >= 61.8:
                break
            b_idx = int(t_trig * SR)
            b_dur = BEAT_DUR * 1.2
            b_len = int(SR * b_dur)
            t_b = np.linspace(0, b_dur, b_len, endpoint=False)
            f_glide = root_freq * (1.0 + 0.8 * np.exp(-t_b * 30))
            p_glide = 2 * np.pi * np.cumsum(f_glide) / SR
            b_wave = np.sin(p_glide) * np.exp(-t_b * 2.2)
            b_sat = np.tanh(2.2 * b_wave)
            end_b = min(TOTAL_SAMPLES, b_idx + b_len)
            bass_audio[b_idx:end_b] += b_sat[: end_b - b_idx] * 0.72

left += bass_audio * 0.5
right += bass_audio * 0.5

# -------------------------------------------------------------------
# LAYER 4: Trap Drum Grooves (Kicks, Snares, Hats)
# -------------------------------------------------------------------
print("Synthesizing hard trap drum groove...")
drum_l = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
drum_r = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

# Drum pattern active from 28.7s to 61.8s (Match Found -> Scoreboard 4:1)
for bar_start in np.arange(28.7, 61.8, BAR_DUR):
    # Kick pattern: Beat 0, Beat 1.75, Beat 2.5
    for kick_t in [0.0, 1.75, 2.5]:
        kt = bar_start + kick_t * BEAT_DUR
        if kt >= 61.8:
            break
        k_idx = int(kt * SR)
        e_idx = min(TOTAL_SAMPLES, k_idx + len(kick_one_shot))
        drum_l[k_idx:e_idx] += kick_one_shot[: e_idx - k_idx] * 0.75
        drum_r[k_idx:e_idx] += kick_one_shot[: e_idx - k_idx] * 0.75

    # Snare pattern: Beat 2 (half-time 3rd beat in 8-count)
    for snare_t in [1.0, 3.0]:
        st = bar_start + snare_t * BEAT_DUR
        if st >= 61.8:
            break
        s_idx = int(st * SR)
        e_idx = min(TOTAL_SAMPLES, s_idx + len(snare_one_shot))
        drum_l[s_idx:e_idx] += snare_one_shot[: e_idx - s_idx] * 0.65
        drum_r[s_idx:e_idx] += snare_one_shot[: e_idx - s_idx] * 0.65

    # Hi-Hat pattern: 16th notes with velocity variation
    for h_step in range(16):
        ht = bar_start + h_step * SIXTEENTH
        if ht >= 61.8:
            break
        h_idx = int(ht * SR)
        # Triplet rolls on step 14, 15
        if h_step in [14, 15]:
            roll_sub = SIXTEENTH / 3.0
            for r_i in range(3):
                rt = ht + r_i * roll_sub
                r_idx = int(rt * SR)
                e_idx = min(TOTAL_SAMPLES, r_idx + len(hat_one_shot))
                drum_l[r_idx:e_idx] += hat_one_shot[: e_idx - r_idx] * 0.45
                drum_r[r_idx:e_idx] += hat_one_shot[: e_idx - r_idx] * 0.45
        else:
            e_idx = min(TOTAL_SAMPLES, h_idx + len(hat_one_shot))
            vel = 0.55 if h_step % 4 == 0 else 0.35
            drum_l[h_idx:e_idx] += hat_one_shot[: e_idx - h_idx] * vel
            drum_r[h_idx:e_idx] += hat_one_shot[: e_idx - h_idx] * vel

left += drum_l
right += drum_r

# -------------------------------------------------------------------
# LAYER 5: THE TILT COLLAPSE (61.8s - 76.0s) — Dramatic Low-pass Filter & Eerie Drone
# -------------------------------------------------------------------
print("Applying Spider-Verse Tilt Audio Collapse (Muffle & Drone)...")
collapse_idx = int(61.8 * SR)

# Low-pass filter the remaining master after 61.8s down to 320 Hz (underwater / shock effect)
post_l = left[collapse_idx:]
post_r = right[collapse_idx:]

# Attenuate and filter heavily
filtered_l = lowpass_filter(post_l, 340.0) * 0.28
filtered_r = lowpass_filter(post_r, 340.0) * 0.28

# Add tense dissonant sub-drone during Tilt awakening (41Hz + 61Hz)
t_post = np.linspace(0, len(filtered_l) / SR, len(filtered_l), endpoint=False)
eerie_drone = (
    np.sin(2 * np.pi * 41.2 * t_post) * 0.5
    + np.sin(2 * np.pi * 61.8 * t_post) * 0.35
    + np.sin(2 * np.pi * 123.5 * t_post) * 0.2
) * (t_post / (len(t_post)/SR))  # swells up toward the end

filtered_l += eerie_drone * 0.4
filtered_r += eerie_drone * 0.45

left[collapse_idx:] = filtered_l
right[collapse_idx:] = filtered_r

# -------------------------------------------------------------------
# MASTERING & EXPORT
# -------------------------------------------------------------------
print("Mastering & normalizing full soundtrack...")
master = np.column_stack([left, right])
max_peak = np.max(np.abs(master))
if max_peak > 0:
    master = master / max_peak * 0.88  # Clean headroom for voiceover & SFX

wav_path = "/tmp/bgm_spiderverse.wav"
data = (master * 32767.0).astype(np.int16)
with wave.open(wav_path, "wb") as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(data.tobytes())

# Convert to high-quality 256kbps MP3
subprocess.run(
    ["npx", "remotion", "ffmpeg", "-y", "-i", wav_path, "-b:a", "256k", OUT_FILE],
    check=True,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
)

print(f"\n=== SUCCESS! Exported BGM to: {OUT_FILE} ===")
