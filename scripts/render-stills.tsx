import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { frames } from "../src/StyleFrame";
import { branding } from "../src/Branding";

type Still = { id: string; Component: React.FC; dir: string; width: number; height: number; scale?: number };

const root = path.resolve(__dirname, "..");
const only = process.argv[2];

const stills: Still[] = [
  ...frames.map((f) => ({ ...f, dir: "style-frames", width: 1920, height: 1080 })),
  ...branding,
];

const fontFace = [500, 600, 700]
  .map((w) => {
    const file = path.join(root, `node_modules/@fontsource/fredoka/files/fredoka-latin-${w}-normal.woff2`);
    const b64 = fs.readFileSync(file).toString("base64");
    return `@font-face{font-family:'Fredoka';font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  })
  .join("");

(async () => {
  const browser = await chromium.launch();
  for (const { id, Component, dir, width, height, scale = 1 } of stills) {
    if (only && !`${dir}/${id}`.includes(only)) continue;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontFace}html,body{margin:0;background:#000}</style></head><body>${renderToStaticMarkup(
      <Component />
    )}</body></html>`;
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.join(root, dir), { recursive: true });
    const file = path.join(root, dir, `${id}.png`);
    await page.locator("#frame").screenshot({ path: file });
    await page.close();
    console.log(file);
  }
  await browser.close();
})();
