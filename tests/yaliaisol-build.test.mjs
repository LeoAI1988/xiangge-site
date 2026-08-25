import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the yaliaisol.com static site at the domain root", async () => {
  const siteRoot = new URL("../dist-yaliaisol/", import.meta.url);
  const [indexHtml, assetNames] = await Promise.all([
    readFile(new URL("index.html", siteRoot), "utf8"),
    readdir(new URL("assets/", siteRoot)),
    access(new URL("wechat-qr.jpg", siteRoot)),
    access(new URL("xiangge-profile.jpg", siteRoot)),
    access(new URL("skill-downloads/manifest.json", siteRoot)),
  ]);

  assert.match(indexHtml, /src="\/assets\//);
  assert.doesNotMatch(indexHtml, /\/xiangge-site\//);

  const scripts = (
    await Promise.all(
      assetNames
        .filter((name) => name.endsWith(".js"))
        .map((name) => readFile(new URL(`assets/${name}`, siteRoot), "utf8")),
    )
  ).join("\n");

  assert.match(scripts, /亚里士多翔的 AI 世界/);
  assert.match(scripts, /添加微信获取资料/);
  assert.match(scripts, /粤ICP备2026089185号-2/);
  assert.match(scripts, /粤公网安备44030002015092号/);
  assert.match(scripts, /beian\.miit\.gov\.cn/);
  assert.match(scripts, /beian\.mps\.gov\.cn\/#\/query\/webSearch\?code=44030002015092/);
  assert.doesNotMatch(scripts, /虎子的时间星河|13751196386|\/api\/leads/);
});
