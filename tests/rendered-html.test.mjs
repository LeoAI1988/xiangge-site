import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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
  assert.match(landing, /navigator\.clipboard\.writeText\("13751196386"\)/);
  assert.doesNotMatch(landing, /<form className="lead-form"/);
  assert.doesNotMatch(landing, /\/api\/leads/);
  assert.doesNotMatch(`${layout}\n${landing}`, /codex-preview|react-loading-skeleton|上线方案/);
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
