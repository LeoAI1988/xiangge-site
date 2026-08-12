import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds a GitHub Pages-only frontend with the QR contact flow", async () => {
  const pagesRoot = new URL("../dist-pages/", import.meta.url);
  const [indexHtml, assetNames] = await Promise.all([
    readFile(new URL("index.html", pagesRoot), "utf8"),
    readdir(new URL("assets/", pagesRoot)),
    access(new URL("wechat-qr.jpg", pagesRoot)),
    access(new URL("skill-downloads/manifest.json", pagesRoot)),
  ]);

  const jsNames = assetNames.filter((name) => name.endsWith(".js"));
  const cssNames = assetNames.filter((name) => name.endsWith(".css"));
  assert.ok(jsNames.length > 0, "expected a bundled GitHub Pages script");
  assert.ok(cssNames.length > 0, "expected bundled GitHub Pages styles");
  assert.match(indexHtml, /\/xiangge-site\/assets\//);

  const scripts = (await Promise.all(jsNames.map((name) => readFile(new URL(`assets/${name}`, pagesRoot), "utf8")))).join("\n");
  assert.match(scripts, /添加微信获取资料/);
  assert.match(scripts, /wechat-qr\.jpg/);
  assert.match(scripts, /skill-downloads/);
  assert.doesNotMatch(scripts, /13751196386|\/api\/leads/);
});
