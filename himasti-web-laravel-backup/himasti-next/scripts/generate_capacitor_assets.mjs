import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SOURCE_ICON = "public/icons/icon-512x512.png";
const RES_DIR = "android/app/src/main/res";

async function generateAssets() {
  console.log("Generating Android App Icons & Splash Screens...");

  // Update background XMLs to Slate-900 (#0F172A)
  const bgXmlValues = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0F172A</color>
</resources>
`;
  writeFileSync(path.join(RES_DIR, "values/ic_launcher_background.xml"), bgXmlValues);

  const bgXmlDrawable = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportHeight="108"
    android:viewportWidth="108">
    <path
        android:fillColor="#0F172A"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`;
  writeFileSync(path.join(RES_DIR, "drawable/ic_launcher_background.xml"), bgXmlDrawable);

  // Mipmaps
  const mipmaps = [
    { dir: "mipmap-mdpi", icon: 48, fg: 108 },
    { dir: "mipmap-hdpi", icon: 72, fg: 162 },
    { dir: "mipmap-xhdpi", icon: 96, fg: 216 },
    { dir: "mipmap-xxhdpi", icon: 144, fg: 324 },
    { dir: "mipmap-xxxhdpi", icon: 192, fg: 432 },
  ];

  for (const m of mipmaps) {
    const targetDir = path.join(RES_DIR, m.dir);

    // ic_launcher.png (composite on #0f172a square)
    const iconBase = await sharp({
      create: {
        width: m.icon,
        height: m.icon,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    }).png().toBuffer();

    const resizedLogoForIcon = await sharp(SOURCE_ICON)
      .resize(Math.round(m.icon * 0.8), Math.round(m.icon * 0.8), { fit: "contain" })
      .toBuffer();

    await sharp(iconBase)
      .composite([{ input: resizedLogoForIcon, gravity: "centre" }])
      .toFile(path.join(targetDir, "ic_launcher.png"));

    // ic_launcher_round.png
    const circleSvg = Buffer.from(
      `<svg><circle cx="${m.icon / 2}" cy="${m.icon / 2}" r="${m.icon / 2}" fill="#0f172a"/></svg>`
    );
    const roundBase = await sharp(circleSvg).resize(m.icon, m.icon).png().toBuffer();
    await sharp(roundBase)
      .composite([{ input: resizedLogoForIcon, gravity: "centre" }])
      .toFile(path.join(targetDir, "ic_launcher_round.png"));

    // ic_launcher_foreground.png (Adaptive icon foreground, transparent canvas with safe padding)
    const fgBase = await sharp({
      create: {
        width: m.fg,
        height: m.fg,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).png().toBuffer();

    const resizedLogoForFg = await sharp(SOURCE_ICON)
      .resize(Math.round(m.fg * 0.55), Math.round(m.fg * 0.55), { fit: "contain" })
      .toBuffer();

    await sharp(fgBase)
      .composite([{ input: resizedLogoForFg, gravity: "centre" }])
      .toFile(path.join(targetDir, "ic_launcher_foreground.png"));

    console.log(`Generated icons for ${m.dir}`);
  }

  // Splash screens
  const splashes = [
    { dir: "drawable", w: 480, h: 800 },
    { dir: "drawable-port-mdpi", w: 320, h: 480 },
    { dir: "drawable-port-hdpi", w: 480, h: 800 },
    { dir: "drawable-port-xhdpi", w: 720, h: 1280 },
    { dir: "drawable-port-xxhdpi", w: 960, h: 1600 },
    { dir: "drawable-port-xxxhdpi", w: 1280, h: 1920 },
    { dir: "drawable-land-mdpi", w: 480, h: 320 },
    { dir: "drawable-land-hdpi", w: 800, h: 480 },
    { dir: "drawable-land-xhdpi", w: 1280, h: 720 },
    { dir: "drawable-land-xxhdpi", w: 1600, h: 960 },
    { dir: "drawable-land-xxxhdpi", w: 1920, h: 1280 },
  ];

  for (const s of splashes) {
    const targetPath = path.join(RES_DIR, s.dir, "splash.png");
    const logoSize = Math.round(Math.min(s.w, s.h) * 0.35);

    const bg = await sharp({
      create: {
        width: s.w,
        height: s.h,
        channels: 4,
        background: { r: 15, g: 23, b: 42, alpha: 1 },
      },
    }).png().toBuffer();

    const logo = await sharp(SOURCE_ICON)
      .resize(logoSize, logoSize, { fit: "contain" })
      .toBuffer();

    await sharp(bg)
      .composite([{ input: logo, gravity: "centre" }])
      .toFile(targetPath);

    console.log(`Generated splash for ${s.dir} (${s.w}x${s.h})`);
  }

  console.log("All Android assets successfully generated!");
}

generateAssets().catch((err) => {
  console.error("Error generating assets:", err);
  process.exit(1);
});
