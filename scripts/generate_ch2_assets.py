#!/usr/bin/env python3
"""
Generate Chapter 2 Visual Assets in Spider-Verse Graphic Novel Style
Target Directory: public/comic/ch2/
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUTPUT_DIR = "/workspaces/remotion-argon/public/comic/ch2"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Colors in Spider-Verse palette
BLACK = (10, 8, 18, 255)
DARK_INK = (18, 14, 28, 255)
WHITE = (255, 255, 255, 255)
CYAN = (0, 240, 255, 255)
MAGENTA = (255, 0, 85, 255)
YELLOW = (255, 230, 0, 255)
NEON_ORANGE = (255, 90, 0, 255)
LAVA_RED = (230, 20, 20, 255)
SAND_WARM = (225, 195, 145, 255)
SAND_DARK = (165, 130, 90, 255)
SKY_BLUE = (80, 150, 220, 255)
VOLCANO_ROCK = (30, 26, 38, 255)

def apply_chromatic_aberration(img_rgba, offset=4):
    """Offset Red and Blue/Cyan channels horizontally for 3D comic print effect"""
    r, g, b, a = img_rgba.split()
    r_shifted = Image.new('L', img_rgba.size, 0)
    b_shifted = Image.new('L', img_rgba.size, 0)
    
    r_shifted.paste(r, (offset, 0))
    b_shifted.paste(b, (-offset, 0))
    
    return Image.merge('RGBA', (r_shifted, g, b_shifted, a))

def draw_halftone_pattern(draw, bbox, spacing=10, radius=2, color=CYAN):
    """Draws a regular grid of Ben-Day halftone comic dots"""
    x0, y0, x1, y1 = bbox
    for y in range(y0, y1, spacing):
        offset = (spacing // 2) if ((y // spacing) % 2 == 1) else 0
        for x in range(x0 + offset, x1, spacing):
            draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=color)

def draw_comic_speed_lines(draw, center, max_r, count=48, color=WHITE, inner_r=80):
    """Radiating dynamic comic speed lines"""
    cx, cy = center
    for i in range(count):
        angle = (2 * math.pi / count) * i + (np.sin(i * 3.7) * 0.05)
        r0 = inner_r + (math.sin(i * 5.1) * 20)
        r1 = max_r
        x0 = cx + math.cos(angle) * r0
        y0 = cy + math.sin(angle) * r0
        x1 = cx + math.cos(angle) * r1
        y1 = cy + math.sin(angle) * r1
        
        # Tapered polygon for comic line weight
        perp = angle + math.pi / 2
        w = 2.5 + (i % 3) * 1.5
        dx = math.cos(perp) * w
        dy = math.sin(perp) * w
        draw.polygon([(x0, y0), (x1 - dx, y1 - dy), (x1 + dx, y1 + dy)], fill=color)

# ==============================================================================
# ASSET 1: Mirage A-Ramp Background Plate (`ch2_s1_mirage_aramp_bg.png`)
# ==============================================================================
def generate_mirage_aramp_bg():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (180, 160, 130, 255))
    draw = ImageDraw.Draw(img)
    
    # Sky gradient / desert atmosphere
    for y in range(260):
        t = y / 260.0
        r = int(70 * (1-t) + 210 * t)
        g = int(140 * (1-t) + 185 * t)
        b = int(220 * (1-t) + 150 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Sun burst behind scaffolding
    draw.ellipse([w - 400, -100, w + 200, 500], fill=(255, 245, 200, 120))
    
    # Sandstone buildings & arches (Mirage A-ramp geometry)
    # Left Wall / Palace entrance
    left_wall = [(0, 120), (450, 180), (450, h), (0, h)]
    draw.polygon(left_wall, fill=SAND_DARK)
    
    # Left Wall shadow & halftone
    draw_halftone_pattern(draw, (0, 250, 420, h), spacing=12, radius=3, color=(80, 60, 50, 180))
    
    # Archway cutout into ramp
    arch_pts = [(450, 180), (820, 200), (800, h), (450, h)]
    draw.polygon(arch_pts, fill=(90, 75, 65, 255)) # Dark interior ramp alley
    
    # Right scaffolding & high wall
    right_wall = [(820, 140), (w, 80), (w, h), (800, h)]
    draw.polygon(right_wall, fill=SAND_WARM)
    
    # Wooden scaffolding beams on right
    for i in range(5):
        bx = 840 + i * 100
        draw.line([(bx, 100), (bx, h)], fill=(70, 45, 25, 255), width=8)
        draw.line([(bx - 50, 250 + i * 70), (bx + 80, 320 + i * 70)], fill=(60, 40, 20, 255), width=6)
        
    # Ramp ground plane sloping downwards
    ramp_floor = [(380, h), (450, 520), (800, 520), (w, h)]
    draw.polygon(ramp_floor, fill=(195, 170, 125, 255))
    
    # Heavy Comic Inking outlines
    draw.line([(450, 180), (450, h)], fill=BLACK, width=6)
    draw.line([(820, 140), (800, h)], fill=BLACK, width=6)
    draw.line([(450, 520), (800, 520)], fill=BLACK, width=5)
    draw.line([(0, 120), (450, 180), (820, 140), (w, 80)], fill=BLACK, width=6)
    
    # Ground grit & cobblestone crosshatching
    for y in range(540, h, 28):
        draw.line([(300, y), (w, y)], fill=(120, 95, 70, 160), width=3)
        for x in range(350, w, 60):
            draw.line([(x, y), (x + 20, y + 25)], fill=BLACK, width=2)
            
    # Spider-Verse Ben-Day Dots overlay in shadows
    draw_halftone_pattern(draw, (450, 220, 800, 520), spacing=14, radius=3, color=(40, 30, 45, 220))
    
    # Chromatic shift
    img_rgb = apply_chromatic_aberration(img, offset=3).convert('RGB')
    path = os.path.join(OUTPUT_DIR, "ch2_s1_mirage_aramp_bg.png")
    img_rgb.save(path, quality=95)
    print("Saved:", path)

# ==============================================================================
# ASSET 2: Dense Volumetric Smoke Cloud Cutout (`ch2_s1_smoke_cloud_dense.png`)
# ==============================================================================
def generate_dense_smoke_cutout():
    w, h = 1920, 1080
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2, h // 2 + 100
    
    # Layered concentric puffy billows with halftone screen tones
    billows = [
        (cx - 300, cy + 50, 360, (180, 185, 195, 240)),
        (cx + 280, cy + 30, 380, (170, 175, 188, 240)),
        (cx - 150, cy - 120, 340, (200, 205, 215, 250)),
        (cx + 120, cy - 140, 350, (210, 215, 225, 250)),
        (cx, cy - 50, 420, (225, 230, 240, 255)),
        (cx - 420, cy + 120, 260, (150, 155, 170, 230)),
        (cx + 440, cy + 100, 280, (145, 150, 165, 230)),
    ]
    
    # Outer dark ink comic silhouette
    for bx, by, r, _ in billows:
        draw.ellipse([bx - r - 8, by - r - 8, bx + r + 8, by + r + 8], fill=BLACK)
        
    # Cloud puff bodies
    for bx, by, r, col in billows:
        draw.ellipse([bx - r, by - r, bx + r, by + r], fill=col)
        
    # Internal comic swirls and Ben-Day dots
    for bx, by, r, _ in billows[:4]:
        draw_halftone_pattern(draw, (bx - r + 30, by - r + 30, bx + r - 30, by + r - 30), 
                              spacing=14, radius=3, color=(120, 125, 140, 180))
        
    # Swirl lines
    for i in range(12):
        sx = cx + int(math.sin(i * 1.3) * 350)
        sy = cy + int(math.cos(i * 1.5) * 180)
        draw.arc([sx - 100, sy - 80, sx + 100, sy + 80], start=0, end=180, fill=BLACK, width=5)
        
    # Chromatic aberration for Spider-Verse comic effect
    img = apply_chromatic_aberration(img, offset=4)
    path = os.path.join(OUTPUT_DIR, "ch2_s1_smoke_cloud_dense.png")
    img.save(path)
    print("Saved:", path)

# ==============================================================================
# ASSET 3: First-Person Tactical Rifle Cutout (`ch2_s1_fps_rifle_idle_cutout.png`)
# ==============================================================================
def generate_fps_rifle_cutout():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Right arm & hand holding M4A1 rifle in first person
    # Arm / sleeve (dark tactical gamer hoodie)
    hoodie_col = (25, 28, 42, 255)
    glove_col = (35, 40, 52, 255)
    metal_dark = (20, 22, 28, 255)
    metal_mid = (45, 50, 62, 255)
    
    # Right shoulder / arm sweeping into bottom right
    arm_pts = [(w - 420, h), (w - 280, 480), (w - 180, 420), (w, 540), (w, h)]
    draw.polygon(arm_pts, fill=hoodie_col)
    
    # Glove fingers wrapping around pistol grip
    draw.ellipse([w - 320, 440, w - 240, 540], fill=glove_col)
    draw.ellipse([w - 330, 470, w - 250, 550], fill=BLACK)
    
    # M4A1 Receiver & Barrel angled toward upper left center
    receiver = [(620, 360), (980, 390), (940, 510), (600, 460)]
    draw.polygon(receiver, fill=metal_dark)
    
    # Barrel & Silencer protruding towards center (x=420, y=340)
    silencer = [(420, 340), (620, 360), (610, 410), (410, 390)]
    draw.polygon(silencer, fill=metal_mid)
    
    # Top Picatinny Rail & Holographic / Iron Sights
    rail = [(580, 340), (840, 365), (830, 385), (570, 360)]
    draw.polygon(rail, fill=(60, 65, 80, 255))
    draw.rectangle([700, 300, 770, 350], fill=metal_dark) # Sight housing
    
    # Magazine inserting from bottom
    mag = [(740, 470), (810, 480), (780, 640), (710, 620)]
    draw.polygon(mag, fill=(30, 34, 45, 255))
    
    # Left hand supporting front handguard
    left_hand = [(540, 390), (620, 410), (590, 490), (520, 460)]
    draw.polygon(left_hand, fill=glove_col)
    
    # Thick Comic Line Art & Rim Light
    for shape in [receiver, silencer, rail, mag, left_hand, arm_pts]:
        draw.polygon(shape, outline=BLACK, width=5)
        
    # Cyan / Yellow Edge Rim Highlights
    draw.line([(420, 340), (620, 360), (840, 365)], fill=CYAN, width=3)
    draw.line([(w - 280, 480), (w - 180, 420)], fill=YELLOW, width=3)
    
    # Halftone texture on weapon metal
    draw_halftone_pattern(draw, (620, 380, 900, 480), spacing=10, radius=2, color=CYAN)
    
    img = apply_chromatic_aberration(img, offset=3)
    path = os.path.join(OUTPUT_DIR, "ch2_s1_fps_rifle_idle_cutout.png")
    img.save(path)
    print("Saved:", path)

# ==============================================================================
# ASSET 4: Enemy Running Sideways with Desert Eagle (`ch2_s2_running_deagle.png`)
# ==============================================================================
def generate_running_deagle_cutout():
    w, h = 1920, 1080
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2 - 100, h // 2
    
    # Dynamic speed lines behind enemy running sideways from right to left
    draw_comic_speed_lines(draw, (cx + 350, cy), max_r=800, count=36, color=(255, 230, 0, 180), inner_r=160)
    
    # Terrorist / Eco Enemy Body (T shirt, tactical jeans, balaclava / sunglasses)
    t_shirt = (180, 150, 90, 255)
    jeans = (45, 65, 95, 255)
    skin = (210, 160, 120, 255)
    
    # Legs mid-air sprint pose (left leg stretched back, right leg bent high forward)
    left_leg = [(cx + 180, cy + 120), (cx + 380, cy + 240), (cx + 420, cy + 220), (cx + 220, cy + 100)]
    right_leg = [(cx + 120, cy + 120), (cx + 40, cy + 280), (cx - 20, cy + 260), (cx + 60, cy + 90)]
    draw.polygon(left_leg, fill=jeans)
    draw.polygon(right_leg, fill=jeans)
    
    # Torso leaning forward horizontally
    torso = [(cx + 80, cy - 80), (cx + 200, cy - 40), (cx + 170, cy + 130), (cx + 70, cy + 110)]
    draw.polygon(torso, fill=t_shirt)
    
    # Head with aviator sunglasses & smirk
    head_center = (cx + 80, cy - 140)
    draw.ellipse([head_center[0] - 60, head_center[1] - 70, head_center[0] + 60, head_center[1] + 70], fill=skin)
    # Sunglasses
    draw.rectangle([head_center[0] - 50, head_center[1] - 25, head_center[0] + 35, head_center[1] + 5], fill=BLACK)
    draw.line([(head_center[0] - 45, head_center[1] - 10), (head_center[0] + 25, head_center[1] - 10)], fill=YELLOW, width=4)
    
    # Stretched Right Arm holding Desert Eagle pointed straight at camera/viewer
    arm = [(cx + 140, cy - 40), (cx - 80, cy - 80), (cx - 100, cy - 30), (cx + 120, cy + 20)]
    draw.polygon(arm, fill=skin)
    
    # DESERT EAGLE (Chrome finish with high dynamic reflections)
    deagle_pts = [(cx - 260, cy - 130), (cx - 90, cy - 110), (cx - 100, cy - 20), (cx - 220, cy - 10)]
    draw.polygon(deagle_pts, fill=(235, 240, 250, 255))
    # Deagle barrel hole
    draw.ellipse([cx - 275, cy - 120, cx - 245, cy - 85], fill=BLACK)
    
    # Heavy Comic Inking Outlines
    for shape in [left_leg, right_leg, torso, arm, deagle_pts]:
        draw.polygon(shape, outline=BLACK, width=6)
    draw.ellipse([head_center[0] - 60, head_center[1] - 70, head_center[0] + 60, head_center[1] + 70], outline=BLACK, width=6)
    
    # Massive Comic Muzzle Flash Starburst at the Deagle muzzle!
    fx, fy = cx - 260, cy - 102
    draw_comic_speed_lines(draw, (fx, fy), max_r=360, count=24, color=YELLOW, inner_r=20)
    draw_comic_speed_lines(draw, (fx, fy), max_r=240, count=16, color=NEON_ORANGE, inner_r=10)
    draw.ellipse([fx - 50, fy - 50, fx + 50, fy + 50], fill=WHITE)
    
    # Comic sound FX text: "BLAM!"
    # Draw stylized block letters for BLAM!
    bx, by = fx - 220, fy - 180
    draw.text((bx, by), "BLAM!", fill=YELLOW, stroke_width=8, stroke_fill=BLACK, font=None)
    
    # Chromatic aberration for Spider-Verse aesthetic
    img = apply_chromatic_aberration(img, offset=6)
    path = os.path.join(OUTPUT_DIR, "ch2_s2_running_deagle.png")
    img.save(path)
    print("Saved:", path)

# ==============================================================================
# ASSET 5: "ХЭДШОТ" Comic Card & Death Screen (`ch2_s3_headshot_card.png`)
# ==============================================================================
def generate_headshot_card():
    w, h = 1920, 1080
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2, h // 2
    
    # Background red-black vignette slash card
    card_pts = [(180, cy - 240), (w - 140, cy - 300), (w - 220, cy + 280), (120, cy + 220)]
    draw.polygon(card_pts, fill=(15, 8, 14, 245), outline=BLACK, width=10)
    
    # Red accent drop-shadow box
    accent_pts = [(p[0] + 16, p[1] + 16) for p in card_pts]
    # Inner border
    draw.polygon(card_pts, outline=MAGENTA, width=6)
    
    # Halftone pattern inside card
    draw_halftone_pattern(draw, (220, cy - 220, w - 240, cy + 200), spacing=16, radius=3, color=(255, 0, 85, 120))
    
    # Speed lines exploding from center skull
    draw_comic_speed_lines(draw, (cx, cy - 30), max_r=600, count=32, color=(255, 0, 85, 200), inner_r=150)
    
    # Center Red Skull Hitmarker Icon
    sk_size = 130
    draw.ellipse([cx - sk_size, cy - sk_size - 40, cx + sk_size, cy + sk_size - 40], fill=(255, 0, 60, 255), outline=BLACK, width=8)
    # Skull eye holes
    draw.ellipse([cx - 55, cy - 70, cx - 15, cy - 30], fill=BLACK)
    draw.ellipse([cx + 15, cy - 70, cx + 55, cy - 30], fill=BLACK)
    # Nose triangle
    draw.polygon([(cx, cy - 25), (cx - 15, cy), (cx + 15, cy)], fill=BLACK)
    # Teeth
    for i in range(4):
        tx = cx - 45 + i * 26
        draw.rectangle([tx, cy + 15, tx + 16, cy + 45], fill=WHITE, outline=BLACK, width=3)
        
    # Death Text ribbon: "1-TAP DEAGLE • 0 HP"
    draw.rectangle([cx - 420, cy + 90, cx + 420, cy + 160], fill=YELLOW, outline=BLACK, width=6)
    draw.text((cx - 260, cy + 105), "1-TAP DEAGLE // FULL ARMOR LOSS", fill=BLACK, font=None)
    
    img = apply_chromatic_aberration(img, offset=5)
    path = os.path.join(OUTPUT_DIR, "ch2_s3_headshot_card.png")
    img.save(path)
    print("Saved:", path)

# ==============================================================================
# ASSET 6: Shinee Dry Smirk Panel (`ch2_s4_shinee_dry_smirk_panel.png`)
# ==============================================================================
def generate_shinee_dry_smirk_panel():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (14, 12, 24, 255))
    draw = ImageDraw.Draw(img)
    
    # Gaming room background with cool dark tones and glowing monitor on left
    draw.rectangle([0, 0, w, h], fill=(12, 10, 20, 255))
    
    # Curved monitor glow on left side casting cyan rays
    monitor_pts = [(0, 100), (320, 160), (320, 640), (0, 700)]
    draw.polygon(monitor_pts, fill=(10, 30, 50, 255), outline=BLACK, width=8)
    # Death screen red glow inside monitor
    draw.polygon([(10, 120), (300, 175), (300, 620), (10, 680)], fill=(120, 15, 30, 255))
    draw.text((60, 360), "YOU ARE DEAD\nRespawn in 3s", fill=YELLOW, font=None)
    
    # Ben-Day dots in room ambient
    draw_halftone_pattern(draw, (360, 40, w - 40, 400), spacing=18, radius=3, color=(0, 240, 255, 60))
    
    # Shinee Leaning Back in Gaming Chair (Right Center)
    # Chair headrest & wings
    chair_cx, chair_cy = 820, 380
    draw.polygon([(chair_cx - 240, chair_cy - 280), (chair_cx + 240, chair_cy - 280), 
                  (chair_cx + 200, chair_cy + 360), (chair_cx - 200, chair_cy + 360)], 
                 fill=(22, 20, 32, 255), outline=BLACK, width=8)
    # Red sports accent stripes on chair
    draw.line([(chair_cx - 180, chair_cy - 260), (chair_cx - 140, chair_cy + 340)], fill=MAGENTA, width=12)
    draw.line([(chair_cx + 180, chair_cy - 260), (chair_cx + 140, chair_cy + 340)], fill=MAGENTA, width=12)
    
    # Shinee Torso leaning back
    draw.polygon([(chair_cx - 140, chair_cy - 60), (chair_cx + 160, chair_cy - 60),
                  (chair_cx + 220, chair_cy + 380), (chair_cx - 180, chair_cy + 380)],
                 fill=(32, 36, 52, 255), outline=BLACK, width=7)
    
    # Head & Face (Sarcastic dry smirk, tilted head, raised eyebrow)
    hx, hy = chair_cx, chair_cy - 120
    draw.ellipse([hx - 90, hy - 110, hx + 90, hy + 110], fill=(225, 185, 145, 255), outline=BLACK, width=6)
    
    # Messy dark anime/comic hair
    hair_pts = [(hx - 110, hy - 40), (hx - 90, hy - 140), (hx - 20, hy - 170), 
                (hx + 60, hy - 160), (hx + 110, hy - 120), (hx + 100, hy - 30),
                (hx + 60, hy - 80), (hx + 10, hy - 100), (hx - 40, hy - 80), (hx - 80, hy - 60)]
    draw.polygon(hair_pts, fill=BLACK)
    
    # Raised left eyebrow, lowered right eyebrow (skeptical smirk)
    draw.line([(hx - 60, hy - 35), (hx - 15, hy - 48)], fill=BLACK, width=5)
    draw.line([(hx + 15, hy - 40), (hx + 60, hy - 38)], fill=BLACK, width=5)
    
    # Narrowed eyes
    draw.arc([hx - 60, hy - 30, hx - 20, hy + 5], start=180, end=360, fill=BLACK, width=4)
    draw.arc([hx + 20, hy - 30, hx + 60, hy + 5], start=180, end=360, fill=BLACK, width=4)
    
    # Dry, crooked smirk mouth (raised on right side)
    draw.line([(hx - 35, hy + 45), (hx + 10, hy + 40), (hx + 45, hy + 25)], fill=BLACK, width=6)
    
    # Single drop of nervous sweat on temple!
    draw.polygon([(hx + 75, hy - 25), (hx + 70, hy - 10), (hx + 80, hy - 10)], fill=CYAN, outline=BLACK, width=2)
    draw.ellipse([hx + 68, hy - 12, hx + 82, hy + 2], fill=CYAN, outline=BLACK, width=2)
    
    # Hands resting behind head or off keyboard in forced relaxation
    draw.ellipse([hx - 160, hy - 40, hx - 80, hy + 40], fill=(225, 185, 145, 255), outline=BLACK, width=5)
    draw.ellipse([hx + 80, hy - 40, hx + 160, hy + 40], fill=(225, 185, 145, 255), outline=BLACK, width=5)
    
    # Speech bubble: "За яахав, зүгээр л азтай суга байна"
    sb_pts = [(hx - 350, hy - 260), (hx + 120, hy - 260), (hx + 120, hy - 160), 
              (hx - 120, hy - 160), (hx - 100, hy - 120), (hx - 180, hy - 160), (hx - 350, hy - 160)]
    draw.polygon(sb_pts, fill=WHITE, outline=BLACK, width=6)
    draw.text((hx - 330, hy - 225), '"За яахав, зүгээр л азтай суга байна..."', fill=BLACK, font=None)
    
    img_rgb = apply_chromatic_aberration(img, offset=3).convert('RGB')
    path = os.path.join(OUTPUT_DIR, "ch2_s4_shinee_dry_smirk_panel.png")
    img_rgb.save(path, quality=95)
    print("Saved:", path)

# ==============================================================================
# ASSET 7: Jared Tendler Portrait & Card (`ch2_s5_jared_tendler.png`)
# ==============================================================================
def generate_jared_tendler_card():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (10, 16, 32, 255))
    draw = ImageDraw.Draw(img)
    
    # Team Liquid Navy & Electric Blue Palette
    draw.rectangle([0, 0, w, h], fill=(12, 18, 36, 255))
    
    # Diagonal split with Team Liquid gold/cyan stripes
    draw.polygon([(0, 0), (w // 2 + 100, 0), (w // 2 - 100, h), (0, h)], fill=(18, 28, 56, 255))
    draw.line([(w // 2 + 100, 0), (w // 2 - 100, h)], fill=CYAN, width=8)
    draw.line([(w // 2 + 120, 0), (w // 2 - 80, h)], fill=YELLOW, width=4)
    
    # Ben-Day dots in background
    draw_halftone_pattern(draw, (40, 40, w // 2, h - 40), spacing=18, radius=3, color=(0, 240, 255, 90))
    
    # Jared Tendler Portrait (Right side)
    jx, jy = w // 2 + 320, h // 2
    
    # Suit / Team Liquid Coach Jacket
    suit_pts = [(jx - 240, h), (jx - 160, jy + 20), (jx, jy - 40), (jx + 160, jy + 20), (jx + 260, h)]
    draw.polygon(suit_pts, fill=(15, 22, 45, 255), outline=BLACK, width=7)
    # White dress shirt collar
    draw.polygon([(jx - 40, jy + 30), (jx, jy + 90), (jx + 40, jy + 30)], fill=WHITE, outline=BLACK, width=3)
    # Team Liquid Shield Logo on lapel
    draw.polygon([(jx - 120, jy + 90), (jx - 80, jy + 90), (jx - 100, jy + 130)], fill=CYAN, outline=BLACK, width=2)
    
    # Face & Head
    draw.ellipse([jx - 95, jy - 190, jx + 95, jy + 30], fill=(235, 195, 160, 255), outline=BLACK, width=6)
    
    # Neat professional hair
    hair = [(jx - 105, jy - 140), (jx - 95, jy - 210), (jx - 30, jy - 230), (jx + 70, jy - 220), (jx + 105, jy - 160), (jx + 70, jy - 160)]
    draw.polygon(hair, fill=(50, 40, 35, 255), outline=BLACK, width=4)
    
    # Rectangular Modern Glasses
    draw.rectangle([jx - 75, jy - 110, jx - 15, jy - 70], fill=(220, 245, 255, 160), outline=BLACK, width=5)
    draw.rectangle([jx + 15, jy - 110, jx + 75, jy - 70], fill=(220, 245, 255, 160), outline=BLACK, width=5)
    draw.line([(jx - 15, jy - 90), (jx + 15, jy - 90)], fill=BLACK, width=5)
    # Eyes behind glasses
    draw.ellipse([jx - 55, jy - 95, jx - 35, jy - 80], fill=BLACK)
    draw.ellipse([jx + 35, jy - 95, jx + 55, jy - 80], fill=BLACK)
    
    # Calm, analytical smile
    draw.arc([jx - 35, jy - 40, jx + 35, jy - 5], start=0, end=180, fill=BLACK, width=4)
    
    # Left Information Card: Jared Tendler Quote & Credentials
    card_x, card_y = 100, 160
    draw.rectangle([card_x, card_y, card_x + 540, card_y + 440], fill=(8, 12, 26, 245), outline=BLACK, width=7)
    draw.rectangle([card_x, card_y, card_x + 540, card_y + 80], fill=CYAN, outline=BLACK, width=6)
    draw.text((card_x + 30, card_y + 25), "JARED TENDLER // MENTAL GAME", fill=BLACK, font=None)
    
    draw.text((card_x + 30, card_y + 110), 
              "• Team Liquid Спортын Сэтгэл Зүйч\n"
              "• 'The Mental Game' номын зохиолч\n\n"
              '"Тилт бол гэнэтийн дэлбэрэлт биш...\n'
              ' ХАРИН ГАЛТ УУЛЫН ХУРИМТЛАЛ ЮМ."\n\n'
              "Жижиг алдаа бүр мартагддаггүй,\n"
              "далд ухамсарт хадгалагдсаар байдаг.", 
              fill=WHITE, font=None)
              
    img_rgb = apply_chromatic_aberration(img, offset=3).convert('RGB')
    path = os.path.join(OUTPUT_DIR, "ch2_s5_jared_tendler.png")
    img_rgb.save(path, quality=95)
    print("Saved:", path)

# ==============================================================================
# ASSET 8: Volcano Infographic Cross-Section (`ch2_s6_volcano_diagram_bg.png`)
# ==============================================================================
def generate_volcano_diagram():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (18, 14, 28, 255))
    draw = ImageDraw.Draw(img)
    
    # Top 30% = Calm Mountain Peak Landscape ("ГАДНАА: ТАЙВАН")
    for y in range(240):
        t = y / 240.0
        draw.line([(0, y), (w, y)], fill=(int(60*(1-t)+120*t), int(120*(1-t)+180*t), int(200*(1-t)+230*t), 255))
        
    # Peaceful Mountain Silhouette with snow cap
    mountain_pts = [(0, 240), (w // 2 - 250, 180), (w // 2, 70), (w // 2 + 250, 180), (w, 240), (w, h), (0, h)]
    draw.polygon(mountain_pts, fill=VOLCANO_ROCK)
    # Snow cap on peak
    draw.polygon([(w // 2 - 70, 120), (w // 2, 70), (w // 2 + 70, 120), (w // 2 + 30, 140), (w // 2, 130), (w // 2 - 30, 140)], fill=WHITE)
    
    # Dividing Ground Crust Line
    draw.line([(0, 240), (w, 240)], fill=BLACK, width=6)
    
    # Underground Basalt Rock Layers with Ben-Day dots
    draw_halftone_pattern(draw, (0, 240, w, h), spacing=16, radius=2, color=(50, 42, 65, 255))
    
    # Magma Chamber Cavity (carved out underground chamber)
    chamber_pts = [
        (w // 2 - 30, 140), # Vent opening
        (w // 2 + 30, 140),
        (w // 2 + 45, 340),
        (w // 2 + 240, 460),
        (w // 2 + 300, 680),
        (w // 2 - 300, 680),
        (w // 2 - 240, 460),
        (w // 2 - 45, 340),
    ]
    draw.polygon(chamber_pts, fill=(12, 10, 16, 255), outline=BLACK, width=8)
    
    # Geological depth scale marks (10%, 30%, 50%, 80%, 100%)
    levels = [
        ("10% - Раунд 2: Сумаа алдах (+10%)", 620, YELLOW),
        ("30% - Раунд 5: Смоукноос үхэх (+30%)", 540, NEON_ORANGE),
        ("60% - Далд ухамсарт буцлах үе", 440, LAVA_RED),
        ("100% - БҮРЭН ДЭЛБЭРЭЛТ (ТИЛТ)", 320, MAGENTA),
    ]
    for text, ly, col in levels:
        draw.line([(w // 2 - 280, ly), (w // 2 + 280, ly)], fill=col, width=3)
        draw.rectangle([w // 2 + 320, ly - 16, w - 80, ly + 16], fill=(10, 8, 16, 230), outline=col, width=2)
        draw.text((w // 2 + 335, ly - 7), text, fill=col, font=None)
        
    # Headers
    # Surface label
    draw.rectangle([60, 40, 360, 95], fill=WHITE, outline=BLACK, width=5)
    draw.text((80, 58), "ГАДНАА: ТАЙВАН (SURFACE)", fill=BLACK, font=None)
    
    # Underground label
    draw.rectangle([60, 270, 420, 325], fill=MAGENTA, outline=BLACK, width=5)
    draw.text((80, 288), "ДОТРОО: ГАЛТ УУЛЫН ХУРИМТЛАЛ", fill=WHITE, font=None)
    
    img_rgb = apply_chromatic_aberration(img, offset=3).convert('RGB')
    path = os.path.join(OUTPUT_DIR, "ch2_s6_volcano_diagram_bg.png")
    img_rgb.save(path, quality=95)
    print("Saved:", path)

# ==============================================================================
# ASSET 9: Glowing Magma Fill Cutout (`ch2_s6_volcano_magma_glow.png`)
# ==============================================================================
def generate_magma_fill_cutout():
    w, h = 1376, 768
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Molten lava reservoir inside the subterranean chamber
    magma_poly = [
        (w // 2 - 280, 720),
        (w // 2 - 230, 490),
        (w // 2 - 40, 380),
        (w // 2, 360),
        (w // 2 + 40, 380),
        (w // 2 + 230, 490),
        (w // 2 + 280, 720),
    ]
    draw.polygon(magma_poly, fill=LAVA_RED)
    
    # Internal glowing molten core
    core_poly = [
        (w // 2 - 200, 700),
        (w // 2 - 160, 520),
        (w // 2, 420),
        (w // 2 + 160, 520),
        (w // 2 + 200, 700),
    ]
    draw.polygon(core_poly, fill=NEON_ORANGE)
    draw.ellipse([w // 2 - 80, 480, w // 2 + 80, 640], fill=YELLOW)
    
    # Bubbles and ember sparks
    for i in range(25):
        bx = w // 2 + int(math.sin(i * 1.7) * 180)
        by = 460 + (i * 9)
        br = 4 + (i % 6)
        draw.ellipse([bx - br, by - br, bx + br, by + br], fill=YELLOW, outline=WHITE, width=2)
        
    img = apply_chromatic_aberration(img, offset=4)
    path = os.path.join(OUTPUT_DIR, "ch2_s6_volcano_magma_glow.png")
    img.save(path)
    print("Saved:", path)

# ==============================================================================
# ASSET 10: Subconscious Stress Meter Card (`ch2_s6_subconscious_meter.png`)
# ==============================================================================
def generate_subconscious_meter():
    w, h = 1920, 1080
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = w // 2, h // 2
    
    # Comic HUD Card: "ДАЛД УХАМСАР ДАХЬ ТИЛТИЙН ХУРИМТЛАЛ"
    card = [(cx - 480, cy - 280), (cx + 480, cy - 280), (cx + 480, cy + 280), (cx - 480, cy + 280)]
    draw.polygon(card, fill=(12, 10, 22, 245), outline=BLACK, width=8)
    draw.polygon([(p[0]+12, p[1]+12) for p in card], outline=CYAN, width=4)
    
    # Card Header
    draw.rectangle([cx - 480, cy - 280, cx + 480, cy - 190], fill=CYAN, outline=BLACK, width=6)
    draw.text((cx - 380, cy - 250), "SUBCONSCIOUS TILT ACCUMULATION // TENDLER MODEL", fill=BLACK, font=None)
    
    # Meter 1: Round 2 - Missed easy shot (+10%)
    draw.rectangle([cx - 420, cy - 140, cx + 420, cy - 50], fill=(22, 20, 36, 255), outline=BLACK, width=4)
    draw.text((cx - 400, cy - 130), "ROUND 2: Амархан сумаа алдах (+10%)", fill=WHITE, font=None)
    # 10% bar
    draw.rectangle([cx - 400, cy - 90, cx - 400 + 75, cy - 65], fill=YELLOW, outline=BLACK, width=2)
    draw.text((cx - 310, cy - 90), "10% [Анзаарагдахгүй өнгөрнө]", fill=YELLOW, font=None)
    
    # Meter 2: Round 5 - Random smoke deagle headshot (+30%)
    draw.rectangle([cx - 420, cy - 20, cx + 420, cy + 70], fill=(22, 20, 36, 255), outline=BLACK, width=4)
    draw.text((cx - 400, cy - 10), "ROUND 5: Смоукны цаанаас азтай суманд үхэх (+20% -> 30%)", fill=WHITE, font=None)
    # 30% bar
    draw.rectangle([cx - 400, cy + 30, cx - 400 + 225, cy + 55], fill=NEON_ORANGE, outline=BLACK, width=2)
    draw.text((cx - 160, cy + 30), "30% [Далд ухамсарт хуримтлагдав]", fill=NEON_ORANGE, font=None)
    
    # Psychological Truth Warning Box
    draw.rectangle([cx - 420, cy + 100, cx + 420, cy + 240], fill=(35, 12, 22, 255), outline=MAGENTA, width=4)
    draw.text((cx - 390, cy + 125), 
              "ТАЙЛБАР:\n"
              "Шинээ өөрийгөө 'зүгээр' гэж хуурч байгаа боловч,\n"
              "тархи нь жижиг бухимдал бүрийг хадгалж,\n"
              "дотоод галт уул аль хэдийн 30% халсан байна!", 
              fill=WHITE, font=None)
              
    img = apply_chromatic_aberration(img, offset=4)
    path = os.path.join(OUTPUT_DIR, "ch2_s6_subconscious_meter.png")
    img.save(path)
    print("Saved:", path)

def main():
    print("=== Generating Chapter 2 Assets ===")
    generate_mirage_aramp_bg()
    generate_dense_smoke_cutout()
    generate_fps_rifle_cutout()
    generate_running_deagle_cutout()
    generate_headshot_card()
    generate_shinee_dry_smirk_panel()
    generate_jared_tendler_card()
    generate_volcano_diagram()
    generate_magma_fill_cutout()
    generate_subconscious_meter()
    print("=== All 10 Chapter 2 Assets Successfully Created ===")

if __name__ == "__main__":
    main()
