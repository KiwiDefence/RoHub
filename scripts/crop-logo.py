from PIL import Image

SRC = r"C:\Users\Motan\.cursor\projects\c-Coding-Rohub\assets\logo3-5f5ecaf0-e47e-4372-b43d-42bb6414fa73.png"
OUT_MARK = r"C:\Coding\Rohub\public\brand\rohub-logo-mark.png"
OUT_LOGO = r"C:\Coding\Rohub\public\brand\rohub-logo.png"
OUT_CIRCLE = r"C:\Coding\Rohub\public\brand\rohub-logo-circle.png"

im = Image.open(SRC).convert("RGBA")
px = im.load()
w, h = im.size

row_counts = [0] * h
col_counts = [0] * w
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        # Keep visible ink only (colored mountains + white text)
        if a >= 48 and (r + g + b) >= 48:
            row_counts[y] += 1
            col_counts[x] += 1

ROW_THR = 24
COL_THR = 12
ys = [i for i, v in enumerate(row_counts) if v >= ROW_THR]
xs = [i for i, v in enumerate(col_counts) if v >= COL_THR]
if not ys or not xs:
    raise SystemExit("No dense content found")

pad = 6
left = max(0, min(xs) - pad)
top = max(0, min(ys) - pad)
right = min(w, max(xs) + pad + 1)
bottom = min(h, max(ys) + pad + 1)
cropped = im.crop((left, top, right, bottom))

print(
    "source",
    im.size,
    "bbox",
    (left, top, right, bottom),
    "cropped",
    cropped.size,
    "aspect",
    round(cropped.size[0] / cropped.size[1], 3),
)

cropped.save(OUT_MARK, "PNG", optimize=True)
cropped.save(OUT_LOGO, "PNG", optimize=True)

side = max(cropped.size)
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
sq.paste(
    cropped,
    ((side - cropped.size[0]) // 2, (side - cropped.size[1]) // 2),
    cropped,
)
sq.save(OUT_CIRCLE, "PNG", optimize=True)
print("saved")
