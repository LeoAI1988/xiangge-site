import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the public landing page with final branding", async () => {
  const [layout, landing] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/LandingPage.tsx", import.meta.url), "utf8"),
  ]);

  await access(new URL("../dist/server/index.js", import.meta.url));
  assert.match(layout, /翔哥 AI 业务工作流课/);
  assert.match(layout, /og\.png/);
  assert.match(landing, /让 AI 从一个工具/);
  assert.match(landing, /AI BUSINESS OPERATING SYSTEM/);
  assert.match(landing, /添加我的微信获取资料/);
  assert.match(landing, /13751196386/);
  assert.match(landing, /navigator\.clipboard\.writeText\(wechatNumber\)/);
  assert.match(landing, /setCopyMessage\(`复制未成功，请手动复制微信号 \$\{wechatNumber\}。`\)/);
  assert.doesNotMatch(landing, /<form className="lead-form"/);
  assert.doesNotMatch(landing, /<(?:input|select)\b/);
  assert.doesNotMatch(landing, /\bname="consent"/);
  assert.doesNotMatch(landing, /\btype="checkbox"/);
  assert.doesNotMatch(landing, /\/api\/leads/);
  await assert.rejects(access(new URL("../app/api/leads/route.ts", import.meta.url)));
  const claimCtas = [...landing.replace(/\{[^{}]*=>[^{}]*\}/g, "").matchAll(/<a\b(?=[^>]*\bhref="#claim")[^>]*>([\s\S]*?)<\/a>/g)];
  assert.ok(claimCtas.length > 0, "expected public resource-acquisition CTAs");
  for (const [, content] of claimCtas) {
    assert.equal(content.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(), "添加我的微信获取资料");
  }
  assert.doesNotMatch(`${layout}\n${landing}`, /codex-preview|react-loading-skeleton|上线方案/);
});

test("keeps the public Skill library categorized, aligned, and package-complete", async () => {
  const root = new URL("../public/skill-downloads/", import.meta.url);
  const [manifestText, landing, css, entries] = await Promise.all([
    readFile(new URL("manifest.json", root), "utf8"),
    readFile(new URL("../components/LandingPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readdir(root, { withFileTypes: true }),
  ]);
  const manifest = JSON.parse(manifestText);
  const slugs = manifest.map((skill) => skill.slug);
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  const zips = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".zip")).map((entry) => entry.name.slice(0, -4)).sort();

  assert.equal(manifest.length, 17);
  assert.deepEqual([...new Set(manifest.map((skill) => skill.category))], ["创作与发布", "投资与研究", "商业与策略", "通用工具"]);
  assert.deepEqual(directories, [...slugs].sort());
  assert.deepEqual(zips, [...slugs].sort());
  assert.doesNotMatch(slugs.join("\n"), /agent-match-platform|getnote-api|memory-sync|memory-system|xiangge-product-design-philosophy|multi-speaker-recording-annotation|short-drama-iwasaki/);
  assert.match(landing, /skillDownloadsByCategory/);
  assert.match(css, /\.skill-grid article \{ display: flex; flex-direction: column;/);
  assert.match(css, /\.skill-grid \.button \{ width: 100%; margin-top: auto;/);

  const skillTexts = await Promise.all(slugs.map(async (slug) => {
    await access(new URL(`${slug}/agents/openai.yaml`, root));
    return readFile(new URL(`${slug}/SKILL.md`, root), "utf8");
  }));
  const allSkillText = skillTexts.join("\n");
  assert.doesNotMatch(allSkillText, /翔哥|高翔|LeoAI|gaoxiang|HK-hifly8082|advisorWechat|copyWechat|\/home\/|[A-Z]:\\\\Users\\\\/i);
  assert.match(allSkillText, /岩井俊二/);
  assert.match(allSkillText, /霍华德·马克斯/);
  assert.match(allSkillText, /咪蒙/);
});

test("builds the protected admin dashboard shell", async () => {
  const [page, dashboard] = await Promise.all([
    readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/AdminDashboard.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /表单管理后台/);
  assert.match(page, /index: false/);
  assert.match(dashboard, /管理密码/);
  assert.match(dashboard, /一键导出全部/);
});

test("keeps durable lead storage and protected export features wired", async () => {
  const [hosting, schema, adminRoute, dashboard, exporter] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/admin/leads/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../components/AdminDashboard.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/export-leads.mjs", import.meta.url), "utf8"),
  ]);

  assert.match(hosting, /"d1":\s*"DB"/);
  assert.match(schema, /sqliteTable\("leads"/);
  assert.match(adminRoute, /isAdminRequest/);
  assert.match(dashboard, /一键导出全部/);
  assert.match(dashboard, /buildLeadsExportZip/);
  assert.match(exporter, /import\("xlsx"\)/);
  assert.match(exporter, /import\("jszip"\)/);
  assert.match(exporter, /\.md`/);
});

test("exports a ZIP containing a readable Excel workbook and Markdown file", async () => {
  const [{ buildLeadsExportZip }, { default: JSZip }, XLSX] = await Promise.all([
    import("../lib/export-leads.mjs"),
    import("jszip"),
    import("xlsx"),
  ]);
  const { blob, filename } = await buildLeadsExportZip(
    [{ id: 1, created_at: "2026-07-12T07:32:00.000Z", name: "验收测试", phone: "13800000000", wechat: "codex_test", scenario: "内容创作", status: "new" }],
    new Date("2026-07-12T08:00:00.000Z"),
  );

  assert.equal(filename, "翔哥网站表单_2026-07-12.zip");
  const archive = await JSZip.loadAsync(await blob.arrayBuffer());
  const fileNames = Object.keys(archive.files).sort();
  assert.deepEqual(fileNames, ["翔哥网站表单_2026-07-12.md", "翔哥网站表单_2026-07-12.xlsx"]);

  const markdown = await archive.file("翔哥网站表单_2026-07-12.md").async("string");
  assert.match(markdown, /验收测试/);
  assert.match(markdown, /13800000000/);

  const excelBytes = await archive.file("翔哥网站表单_2026-07-12.xlsx").async("uint8array");
  const workbook = XLSX.read(excelBytes, { type: "array" });
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets["表单记录"]);
  assert.equal(rows[0].微信号, "codex_test");
  assert.equal(rows[0].状态, "新登记");
});
