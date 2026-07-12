function formatExportDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: false,
  }).format(new Date(value));
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

export async function buildLeadsExportZip(items, now = new Date()) {
  const [{ default: JSZip }, XLSX] = await Promise.all([import("jszip"), import("xlsx")]);
  const rows = items.map((lead) => ({
    编号: lead.id,
    登记时间: formatExportDate(lead.created_at),
    姓名: lead.name,
    手机号: lead.phone,
    微信号: lead.wechat,
    关注方向: lead.scenario,
    状态: lead.status === "new" ? "新登记" : lead.status,
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [{ wch: 8 }, { wch: 20 }, { wch: 14 }, { wch: 16 }, { wch: 20 }, { wch: 22 }, { wch: 12 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "表单记录");
  const excel = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const mdRows = rows
    .map((row) => `| ${row.编号} | ${escapeMarkdown(row.登记时间)} | ${escapeMarkdown(row.姓名)} | ${escapeMarkdown(row.手机号)} | ${escapeMarkdown(row.微信号)} | ${escapeMarkdown(row.关注方向)} | ${escapeMarkdown(row.状态)} |`)
    .join("\n");
  const markdown = `# 翔哥个人网站表单\n\n导出时间：${formatExportDate(now.toISOString())}\n\n共 ${rows.length} 条记录。\n\n| 编号 | 登记时间 | 姓名 | 手机号 | 微信号 | 关注方向 | 状态 |\n| --- | --- | --- | --- | --- | --- | --- |\n${mdRows}\n`;

  const date = now.toISOString().slice(0, 10);
  const zip = new JSZip();
  zip.file(`翔哥网站表单_${date}.xlsx`, excel);
  zip.file(`翔哥网站表单_${date}.md`, markdown);
  const blob = await zip.generateAsync({ type: "blob" });

  return { blob, filename: `翔哥网站表单_${date}.zip` };
}
