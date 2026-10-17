#!/usr/bin/env python3
import argparse


def channel(value):
    value = value / 255.0
    return value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def luminance(rgb):
    r, g, b = map(channel, rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def parse_rgb(value):
    parts = [int(part) for part in value.split(",")]
    if len(parts) != 3 or any(part < 0 or part > 255 for part in parts):
        raise argparse.ArgumentTypeError("RGB must be r,g,b with channels 0..255")
    return parts


parser = argparse.ArgumentParser(description="Calculate WCAG contrast for two rendered RGB samples")
parser.add_argument("foreground", type=parse_rgb)
parser.add_argument("background", type=parse_rgb)
parser.add_argument("--floor", type=float, default=4.5)
args = parser.parse_args()
fg = luminance(args.foreground)
bg = luminance(args.background)
ratio = (max(fg, bg) + 0.05) / (min(fg, bg) + 0.05)
print(f"foreground_luminance={fg:.6f}")
print(f"background_luminance={bg:.6f}")
print(f"contrast={ratio:.2f}:1")
print("PASS" if ratio >= args.floor else "FAIL")
