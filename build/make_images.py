"""Generate PNG icons and the social share image into dist/assets/img (run after build.js)."""
import glob, os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), '..', 'dist', 'assets', 'img')
os.makedirs(OUT, exist_ok=True)

def find(patterns):
    for p in patterns:
        hits = sorted(glob.glob(p, recursive=True))
        if hits:
            return hits[0]
    return None

SERIF = find(['/usr/share/fonts/**/NotoSerifCJK-Bold.ttc', '/usr/share/fonts/**/NotoSansCJK-Bold.ttc', '/usr/share/fonts/**/*CJK*.tt[cf]'])
MONO = find(['/usr/share/fonts/**/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/**/*Mono*Bold*.ttf']) or SERIF

def font(path, size):
    try:
        return ImageFont.truetype(path, size, index=0)
    except Exception:
        return ImageFont.load_default()

def icon(sz):
    im = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, sz - 1, sz - 1], radius=int(sz * .22), fill='#C8102E')
    d.rounded_rectangle([sz * .06, sz * .06, sz * .94, sz * .94], radius=int(sz * .17), outline='#F3D98A', width=max(2, sz // 60))
    d.text((sz / 2, sz / 2), '吉', font=font(SERIF, int(sz * .6)), fill='white', anchor='mm')
    im.save(os.path.join(OUT, f'icon-{sz}.png'), optimize=True)

icon(192)
icon(512)

W, H = 1200, 630
im = Image.new('RGB', (W, H), '#FBF8F3')
d = ImageDraw.Draw(im)
for i in range(0, H, 6):
    d.line([(0, i), (W, i)], fill=(251 - i // 40, 244 - i // 30, 235 - i // 25))
d.rectangle([0, 0, W, 14], fill='#C8102E')
d.rectangle([0, H - 14, W, H], fill='#C9971C')
fm = font(MONO, 190)
x = 80
for ch, col in zip('00338', ['#C8102E', '#C8102E', '#1B1613', '#1B1613', '#C8102E']):
    d.text((x, 120), ch, font=fm, fill=col)
    x += fm.getlength(ch) + 6
d.text((84, 360), 'Number Lab · 生生发', font=font(SERIF, 64), fill='#1B1613')
d.text((84, 460), 'Chinese lucky number meanings, decoder & tools', font=font(SERIF, 40), fill='#5A4F47')
d.rounded_rectangle([900, 90, 1120, 310], radius=40, fill='#C8102E')
d.text((1010, 200), '吉', font=font(SERIF, 150), fill='white', anchor='mm')
im.save(os.path.join(OUT, 'og.png'), optimize=True)
print('images written to', os.path.normpath(OUT))
