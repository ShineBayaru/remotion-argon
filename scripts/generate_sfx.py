#!/usr/bin/env python3
"""
Generate a complete, high-quality Sound Effects (SFX) library for Remotion Spider-Verse Tilt.
Uses audio files from Source engine CS:GO/CSS repository + synthesized sample-accurate elements.
"""
import os
import wave
import numpy as np
import subprocess

OUT_DIR = "/workspaces/remotion-argon/public/audio/sfx"
os.makedirs(OUT_DIR, exist_ok=True)
SR = 44100


def save_wav(filename: str, audio: np.ndarray, channels=2):
    path = os.path.join(OUT_DIR, filename)
    # Ensure range [-1.0, 1.0]
    audio = np.clip(audio, -1.0, 1.0)
    data = (audio * 32767.0).astype(np.int16)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(data.tobytes())
    print(f"Generated: {path} ({len(audio)/SR:.2f}s, {channels}ch)")


def load_and_resample(path: str, target_sr=SR) -> np.ndarray:
    tmp_out = f"/tmp/{os.path.basename(path)}_resampled.wav"
    subprocess.run(
        ["npx", "remotion", "ffmpeg", "-y", "-i", path, "-ar", str(target_sr), "-ac", "2", tmp_out],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    with wave.open(tmp_out, "rb") as wf:
        raw = wf.readframes(wf.getnframes())
        audio = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        # shape (N, 2)
        audio = audio.reshape(-1, 2)
    return audio


# -------------------------------------------------------------
# 1. CS2 USP-S SILENCED SHOT with enhanced punch
# -------------------------------------------------------------
usp_raw = load_and_resample("/tmp/cstrike_repo/sound/weapons/usp/usp1.wav")
# Add a punchy 65Hz sub transient for modern esports weight
t_usp = np.linspace(0, len(usp_raw) / SR, len(usp_raw), endpoint=False)
sub_thump = np.sin(2 * np.pi * (75 * np.exp(-t_usp * 35) + 40) * t_usp) * np.exp(-t_usp * 22)
sub_thump = np.column_stack([sub_thump, sub_thump]) * 0.45
usp_enhanced = usp_raw * 1.1 + sub_thump
# Normalize
usp_enhanced = usp_enhanced / (np.max(np.abs(usp_enhanced)) + 1e-6) * 0.95
save_wav("cs2_usp_silenced.wav", usp_enhanced, 2)


# -------------------------------------------------------------
# 2. CS2 HEADSHOT DINK (Helmet Ping + Metallic Resonator)
# -------------------------------------------------------------
dink_raw = load_and_resample("/tmp/cstrike_repo/sound/player/bhit_helmet-1.wav")
t_dink = np.linspace(0, len(dink_raw) / SR, len(dink_raw), endpoint=False)
# High metallic harmonic ping (CS2 helmet signature)
ping = (
    0.45 * np.sin(2 * np.pi * 3120 * t_dink)
    + 0.35 * np.sin(2 * np.pi * 4850 * t_dink)
    + 0.20 * np.sin(2 * np.pi * 7200 * t_dink)
) * np.exp(-t_dink * 26.0)
ping_stereo = np.column_stack([ping * 0.95, ping * 1.05])
dink_enhanced = dink_raw * 0.85 + ping_stereo * 0.65
dink_enhanced = dink_enhanced / (np.max(np.abs(dink_enhanced)) + 1e-6) * 0.95
save_wav("cs2_headshot_dink.wav", dink_enhanced, 2)


# -------------------------------------------------------------
# 3. CS2 SMOKE POP & HISS
# -------------------------------------------------------------
smoke_raw = load_and_resample("/tmp/cstrike_repo/sound/weapons/smokegrenade/sg_explode.wav")
smoke_norm = smoke_raw / (np.max(np.abs(smoke_raw)) + 1e-6) * 0.92
save_wav("cs2_smoke_pop.wav", smoke_norm, 2)


# -------------------------------------------------------------
# 4. FACEIT / CS2 MATCH FOUND (Iconic Double-Beep Chime)
# -------------------------------------------------------------
dur_match = 0.95
t_m = np.linspace(0, dur_match, int(SR * dur_match), endpoint=False)
# Note 1: D5 (587.33 Hz) at 0.0s
note1 = np.where(
    t_m < 0.2,
    (np.sin(2 * np.pi * 587.33 * t_m) + 0.3 * np.sin(2 * np.pi * 1174.66 * t_m)) * np.exp(-t_m * 14),
    0.0,
)
# Note 2: G5 (783.99 Hz) at 0.18s
t2 = np.maximum(0.0, t_m - 0.18)
note2 = np.where(
    t_m >= 0.18,
    (np.sin(2 * np.pi * 783.99 * t2) + 0.35 * np.sin(2 * np.pi * 1567.98 * t2) + 0.15 * np.sin(2 * np.pi * 2351.97 * t2))
    * np.exp(-t2 * 6.5),
    0.0,
)
match_sound = np.column_stack([note1 * 0.9 + note2 * 0.95, note1 * 0.95 + note2 * 0.9])
save_wav("faceit_match_found.wav", match_sound, 2)


# -------------------------------------------------------------
# 5. TACTILE ESPORTS MOUSE CLICK
# -------------------------------------------------------------
click_raw = load_and_resample("/tmp/cstrike_repo/sound/ui/buttonclick.wav")
click_norm = click_raw / (np.max(np.abs(click_raw)) + 1e-6) * 0.92
save_wav("mouse_click.wav", click_norm, 2)


# -------------------------------------------------------------
# 6. MECHANICAL CLOCK TICK & ALARM CONFIRMATION
# -------------------------------------------------------------
dur_tick = 0.08
t_tk = np.linspace(0, dur_tick, int(SR * dur_tick), endpoint=False)
wood_click = (np.sin(2 * np.pi * 1850 * t_tk) * 0.6 + np.random.uniform(-0.4, 0.4, len(t_tk))) * np.exp(-t_tk * 85)
clock_tick_stereo = np.column_stack([wood_click, wood_click]) * 0.8
save_wav("clock_tick.wav", clock_tick_stereo, 2)

dur_lock = 0.35
t_lk = np.linspace(0, dur_lock, int(SR * dur_lock), endpoint=False)
lock_chime = (
    np.sin(2 * np.pi * 1760 * t_lk) * 0.7
    + np.sin(2 * np.pi * 3520 * t_lk) * 0.3
) * np.exp(-t_lk * 16)
clock_lock_stereo = np.column_stack([lock_chime * 0.9, lock_chime * 1.0])
save_wav("clock_lock.wav", clock_lock_stereo, 2)


# -------------------------------------------------------------
# 7. NIGHTTIME ULAANBAATAR WIND AMBIENCE (8.8 seconds loop)
# -------------------------------------------------------------
wind_raw = load_and_resample("/tmp/cstrike_repo/sound/ambient/wind/wind_bass.wav")
# Loop to reach 9 seconds
repeats = int(np.ceil((SR * 9.0) / len(wind_raw)))
wind_loop = np.tile(wind_raw, (repeats, 1))[: int(SR * 9.0)]
# Fade in & out
fade_len = int(SR * 0.8)
fade_in = np.linspace(0, 1, fade_len)
fade_out = np.linspace(1, 0, fade_len)
wind_loop[:fade_len] *= fade_in[:, None]
wind_loop[-fade_len:] *= fade_out[:, None]
wind_loop = wind_loop / (np.max(np.abs(wind_loop)) + 1e-6) * 0.75
save_wav("wind_night.wav", wind_loop, 2)


# -------------------------------------------------------------
# 8. CINEMATIC WHOOSH DIVE (Window Zoom-In)
# -------------------------------------------------------------
dur_wh = 1.6
t_wh = np.linspace(0, dur_wh, int(SR * dur_wh), endpoint=False)
# Swept pinkish noise with exponential swell and decay
pink = np.random.uniform(-1, 1, len(t_wh))
swell = np.sin(np.pi * np.clip(t_wh / dur_wh, 0, 1)) ** 2.5
sub_glide = np.sin(2 * np.pi * (45 + 180 * swell) * t_wh) * swell * 0.5
whoosh = np.column_stack([(pink * 0.5 + sub_glide) * swell, (pink * 0.55 + sub_glide) * swell])
whoosh = whoosh / (np.max(np.abs(whoosh)) + 1e-6) * 0.9
save_wav("whoosh_dive.wav", whoosh, 2)


# -------------------------------------------------------------
# 9. MECHANICAL KEYBOARD RAPID WASD CLATTER (5.0s)
# -------------------------------------------------------------
dur_kb = 6.0
t_kb = np.linspace(0, dur_kb, int(SR * dur_kb), endpoint=False)
kb_audio = np.zeros((len(t_kb), 2), dtype=np.float32)
rng = np.random.RandomState(42)
# Trigger ~32 random keypresses
for _ in range(36):
    k_t = rng.uniform(0.1, dur_kb - 0.2)
    k_idx = int(k_t * SR)
    k_len = int(SR * 0.045)
    t_k = np.linspace(0, 0.045, k_len, endpoint=False)
    freq = rng.uniform(2200, 3600)
    k_pulse = (np.sin(2 * np.pi * freq * t_k) * 0.5 + rng.uniform(-0.5, 0.5, k_len)) * np.exp(-t_k * 110)
    vol = rng.uniform(0.4, 0.85)
    pan = rng.uniform(0.8, 1.2)
    end_idx = min(len(t_kb), k_idx + k_len)
    actual_len = end_idx - k_idx
    kb_audio[k_idx:end_idx, 0] += k_pulse[:actual_len] * vol * (2.0 - pan)
    kb_audio[k_idx:end_idx, 1] += k_pulse[:actual_len] * vol * pan

kb_audio = kb_audio / (np.max(np.abs(kb_audio)) + 1e-6) * 0.8
save_wav("keyboard_rapid_wasd.wav", kb_audio, 2)


# -------------------------------------------------------------
# 10. ELO DIGITAL ODOMETER ROLLING (1890 -> 1985)
# -------------------------------------------------------------
dur_elo = 3.2
t_elo = np.linspace(0, dur_elo, int(SR * dur_elo), endpoint=False)
elo_audio = np.zeros((len(t_elo), 2), dtype=np.float32)
# Rapid clicks that accelerate
click_times = np.cumsum(np.geomspace(0.14, 0.045, 24))
click_times = click_times[click_times < dur_elo - 0.1]
for i, ct in enumerate(click_times):
    c_idx = int(ct * SR)
    c_len = int(SR * 0.03)
    t_c = np.linspace(0, 0.03, c_len, endpoint=False)
    pitch = 900 + i * 45
    pulse = (np.sin(2 * np.pi * pitch * t_c) + 0.3 * np.sin(2 * np.pi * pitch * 2 * t_c)) * np.exp(-t_c * 120)
    end_idx = min(len(t_elo), c_idx + c_len)
    elo_audio[c_idx:end_idx, 0] += pulse[: end_idx - c_idx] * 0.65
    elo_audio[c_idx:end_idx, 1] += pulse[: end_idx - c_idx] * 0.65

elo_audio = elo_audio / (np.max(np.abs(elo_audio)) + 1e-6) * 0.85
save_wav("elo_rolling.wav", elo_audio, 2)


# -------------------------------------------------------------
# 11. FACEIT LEVEL 10 GOLDEN CHIME
# -------------------------------------------------------------
dur_l10 = 2.4
t_l10 = np.linspace(0, dur_l10, int(SR * dur_l10), endpoint=False)
# Grand chord: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz), E6 (1318Hz)
l10_sound = (
    np.sin(2 * np.pi * 523.25 * t_l10) * 0.3
    + np.sin(2 * np.pi * 659.25 * t_l10) * 0.3
    + np.sin(2 * np.pi * 783.99 * t_l10) * 0.35
    + np.sin(2 * np.pi * 1046.50 * t_l10) * 0.4
    + np.sin(2 * np.pi * 1318.51 * t_l10) * 0.25
) * np.exp(-t_l10 * 2.2)
# Shimmer tremolo
shimmer = 1.0 + 0.15 * np.sin(2 * np.pi * 8 * t_l10)
l10_stereo = np.column_stack([l10_sound * shimmer * 0.95, l10_sound * shimmer * 1.05])
l10_stereo = l10_stereo / (np.max(np.abs(l10_stereo)) + 1e-6) * 0.92
save_wav("level10_chime.wav", l10_stereo, 2)


# -------------------------------------------------------------
# 12. CLOCKWORK GEARS TICKING (Flow State 6.0s)
# -------------------------------------------------------------
dur_gears = 7.0
t_g = np.linspace(0, dur_gears, int(SR * dur_gears), endpoint=False)
gears_audio = np.zeros((len(t_g), 2), dtype=np.float32)
gear_step = 0.111  # ~135 BPM 16th note
num_ticks = int(dur_gears / gear_step)
for i in range(num_ticks):
    g_idx = int(i * gear_step * SR)
    g_len = int(SR * 0.04)
    t_tick = np.linspace(0, 0.04, g_len, endpoint=False)
    freq = 1400 if i % 2 == 0 else 2100
    p = (np.sin(2 * np.pi * freq * t_tick) * 0.7 + np.sin(2 * np.pi * freq * 1.6 * t_tick) * 0.3) * np.exp(-t_tick * 90)
    end_idx = min(len(t_g), g_idx + g_len)
    pan = 0.8 if i % 2 == 0 else 1.2
    gears_audio[g_idx:end_idx, 0] += p[: end_idx - g_idx] * (2.0 - pan) * 0.5
    gears_audio[g_idx:end_idx, 1] += p[: end_idx - g_idx] * pan * 0.5

gears_audio = gears_audio / (np.max(np.abs(gears_audio)) + 1e-6) * 0.75
save_wav("clockwork_gears.wav", gears_audio, 2)


# -------------------------------------------------------------
# 13. LIGHTNING SURGE (Flow Lightning Burst)
# -------------------------------------------------------------
dur_zap = 0.65
t_z = np.linspace(0, dur_zap, int(SR * dur_zap), endpoint=False)
zap_noise = np.random.uniform(-1, 1, len(t_z)) * (np.sin(2 * np.pi * 240 * t_z) > 0)
zap_env = np.exp(-t_z * 7)
sub_zap = np.sin(2 * np.pi * 65 * t_z) * np.exp(-t_z * 12)
zap = (zap_noise * 0.6 + sub_zap * 0.5) * zap_env
zap_stereo = np.column_stack([zap * 0.95, zap * 1.05])
zap_stereo = zap_stereo / (np.max(np.abs(zap_stereo)) + 1e-6) * 0.9
save_wav("lightning_surge.wav", zap_stereo, 2)


# -------------------------------------------------------------
# 14. 180° FLICK WHIP-PAN
# -------------------------------------------------------------
dur_flk = 0.35
t_flk = np.linspace(0, dur_flk, int(SR * dur_flk), endpoint=False)
flk_env = np.sin(np.pi * (t_flk / dur_flk)) ** 2
flk_noise = np.random.uniform(-1, 1, len(t_flk)) * flk_env
flk_sub = np.sin(2 * np.pi * (90 + 250 * flk_env) * t_flk) * flk_env * 0.6
flick_stereo = np.column_stack([flk_noise * 0.5 + flk_sub, flk_noise * 0.55 + flk_sub])
flick_stereo = flick_stereo / (np.max(np.abs(flick_stereo)) + 1e-6) * 0.9
save_wav("flick_180.wav", flick_stereo, 2)


# -------------------------------------------------------------
# 15. TRIPLE KILL HORN / COMBO SLAM
# -------------------------------------------------------------
dur_3k = 1.2
t_3k = np.linspace(0, dur_3k, int(SR * dur_3k), endpoint=False)
brass = (
    np.sin(2 * np.pi * 146.83 * t_3k) * 0.5  # D3
    + np.sin(2 * np.pi * 220.00 * t_3k) * 0.35 # A3
    + np.sin(2 * np.pi * 293.66 * t_3k) * 0.3  # D4
) * np.exp(-t_3k * 3.5)
sub_3k = np.sin(2 * np.pi * 55 * t_3k) * np.exp(-t_3k * 4.0) * 0.7
horn = np.tanh(2.5 * (brass + sub_3k)) * 0.9
horn_stereo = np.column_stack([horn, horn])
save_wav("triple_kill_horn.wav", horn_stereo, 2)


# -------------------------------------------------------------
# 16. TEAMMATE RADIO CHATTER & CHEER
# -------------------------------------------------------------
radio_raw = load_and_resample("/tmp/cstrike_repo/sound/radio/locknload.wav")
# Add radio squelch static
sq_dur = 0.08
t_sq = np.linspace(0, sq_dur, int(SR * sq_dur), endpoint=False)
sq_noise = np.random.uniform(-0.5, 0.5, len(t_sq)) * np.exp(-t_sq * 30)
sq_stereo = np.column_stack([sq_noise, sq_noise])
radio_full = np.vstack([sq_stereo, radio_raw * 0.9, sq_stereo * 0.6])
radio_full = radio_full / (np.max(np.abs(radio_full)) + 1e-6) * 0.85
save_wav("radio_chatter.wav", radio_full, 2)


# -------------------------------------------------------------
# 17. SCOREBOARD 4:1 SLAM
# -------------------------------------------------------------
dur_sc = 0.8
t_sc = np.linspace(0, dur_sc, int(SR * dur_sc), endpoint=False)
sc_thump = np.sin(2 * np.pi * (110 * np.exp(-t_sc * 18) + 48) * t_sc) * np.exp(-t_sc * 9)
sc_snap = np.random.uniform(-0.4, 0.4, len(t_sc)) * np.exp(-t_sc * 45)
sc_slam = np.column_stack([sc_thump + sc_snap, sc_thump + sc_snap])
sc_slam = sc_slam / (np.max(np.abs(sc_slam)) + 1e-6) * 0.92
save_wav("scoreboard_slam.wav", sc_slam, 2)


# -------------------------------------------------------------
# 18. DRAMATIC GLASS SHATTER (Tilt Shock Phase)
# -------------------------------------------------------------
dur_gl = 1.6
t_gl = np.linspace(0, dur_gl, int(SR * dur_gl), endpoint=False)
gl_audio = np.zeros((len(t_gl), 2), dtype=np.float32)
# Massive initial snap
snap_len = int(SR * 0.12)
t_sn = np.linspace(0, 0.12, snap_len, endpoint=False)
snap = (np.random.uniform(-1, 1, snap_len) + np.sin(2 * np.pi * 950 * t_sn)) * np.exp(-t_sn * 35)
gl_audio[:snap_len, 0] += snap * 0.8
gl_audio[:snap_len, 1] += snap * 0.8
# 30 cascading glass crystal pings
rng_gl = np.random.RandomState(77)
for _ in range(32):
    shard_t = rng_gl.exponential(0.18)
    if shard_t >= dur_gl - 0.2:
        continue
    sh_idx = int(shard_t * SR)
    sh_len = int(SR * rng_gl.uniform(0.08, 0.25))
    t_sh = np.linspace(0, sh_len / SR, sh_len, endpoint=False)
    freq = rng_gl.uniform(2200, 7800)
    ping = np.sin(2 * np.pi * freq * t_sh) * np.exp(-t_sh * rng_gl.uniform(18, 45))
    pan = rng_gl.uniform(0.7, 1.3)
    end_idx = min(len(t_gl), sh_idx + sh_len)
    gl_audio[sh_idx:end_idx, 0] += ping[: end_idx - sh_idx] * (2.0 - pan) * 0.35
    gl_audio[sh_idx:end_idx, 1] += ping[: end_idx - sh_idx] * pan * 0.35

gl_audio = gl_audio / (np.max(np.abs(gl_audio)) + 1e-6) * 0.95
save_wav("glass_shatter.wav", gl_audio, 2)


# -------------------------------------------------------------
# 19. ACCELERATING HEARTBEAT (78 BPM -> 142 BPM, 8.5 seconds)
# -------------------------------------------------------------
dur_hb = 9.0
t_hb = np.linspace(0, dur_hb, int(SR * dur_hb), endpoint=False)
hb_audio = np.zeros((len(t_hb), 2), dtype=np.float32)

# Accelerating intervals
cur_t = 0.2
bpm_cur = 78.0
while cur_t < dur_hb - 0.5:
    bpm_cur = 78.0 + (cur_t / dur_hb) * (142.0 - 78.0)
    interval = 60.0 / bpm_cur
    # "Lub" beat
    idx1 = int(cur_t * SR)
    len1 = int(SR * 0.14)
    t1 = np.linspace(0, 0.14, len1, endpoint=False)
    lub = np.sin(2 * np.pi * (62 * np.exp(-t1 * 14) + 44) * t1) * np.exp(-t1 * 16)
    end1 = min(len(t_hb), idx1 + len1)
    hb_audio[idx1:end1, 0] += lub[: end1 - idx1] * 0.85
    hb_audio[idx1:end1, 1] += lub[: end1 - idx1] * 0.85

    # "Dub" beat (0.13s later)
    cur_t2 = cur_t + 0.13
    idx2 = int(cur_t2 * SR)
    len2 = int(SR * 0.12)
    t2 = np.linspace(0, 0.12, len2, endpoint=False)
    dub = np.sin(2 * np.pi * (72 * np.exp(-t2 * 16) + 50) * t2) * np.exp(-t2 * 18)
    end2 = min(len(t_hb), idx2 + len2)
    hb_audio[idx2:end2, 0] += dub[: end2 - idx2] * 0.95
    hb_audio[idx2:end2, 1] += dub[: end2 - idx2] * 0.95

    cur_t += interval

hb_audio = hb_audio / (np.max(np.abs(hb_audio)) + 1e-6) * 0.92
save_wav("heartbeat_rising.wav", hb_audio, 2)


# -------------------------------------------------------------
# 20. TINNITUS EAR-RINGING & NEURAL SYNAPSE GLITCH (6.0s)
# -------------------------------------------------------------
dur_tin = 6.5
t_tin = np.linspace(0, dur_tin, int(SR * dur_tin), endpoint=False)
# 3850 Hz pure tone swelling and fading
tin_tone = np.sin(2 * np.pi * 3850 * t_tin) * np.sin(np.pi * np.clip(t_tin / dur_tin, 0, 1)) * 0.35
# Neural digital glitch clicks
glitch = np.random.uniform(-0.15, 0.15, len(t_tin)) * (np.sin(2 * np.pi * 32 * t_tin) > 0.85)
tin_audio = np.column_stack([tin_tone + glitch, tin_tone * 0.95 + glitch])
tin_audio = tin_audio / (np.max(np.abs(tin_audio)) + 1e-6) * 0.75
save_wav("tinnitus_glitch.wav", tin_audio, 2)


# -------------------------------------------------------------
# 21. TILT 808 SUB-BOOM IMPACT (Card Slam)
# -------------------------------------------------------------
dur_boom = 1.8
t_bm = np.linspace(0, dur_boom, int(SR * dur_boom), endpoint=False)
# 808 pitch drop from 75Hz -> 38Hz with heavy saturation
f_bm = 80 * np.exp(-t_bm * 12) + 38
bm_phase = 2 * np.pi * np.cumsum(f_bm) / SR
bm_sine = np.sin(bm_phase) * np.exp(-t_bm * 2.4)
bm_sat = np.tanh(3.0 * bm_sine) * 0.95
boom_stereo = np.column_stack([bm_sat, bm_sat])
save_wav("tilt_boom.wav", boom_stereo, 2)

print("\n=== ALL 21 SOUND EFFECTS GENERATED SUCCESSFULLY! ===")
