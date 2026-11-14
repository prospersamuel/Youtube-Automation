import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { frames } from "../src/StyleFrame";

const root = path.resolve(__dirname, "..");
const out = path.join(root, "style-frames");
const only = process.argv[2];

const fontFace = [500, 600, 700]
  .map((w) => {
    const file = path.join(root, `node_modules/@fontsource/fredoka/files/fredoka-latin-${w}-normal.woff2`);
    const b64 = fs.readFileSync(file).toString("base64");
    return `@font-face{font-family:'Fredoka';font-weight:${w};src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  })
  .join("");

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  for (const { id, Component } of frames) {
    if (only && !id.includes(only)) continue;
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontFace}html,body{margin:0;background:#000}</style></head><body>${renderToStaticMarkup(
      <Component />
    )}</body></html>`;
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(out, `${id}.png`);
    await page.locator("#frame").screenshot({ path: file });
    console.log(file);
  }
  await browser.close();
})();
