import { ensureLeadsSchema, getD1 } from "@/lib/leads-db";

const phonePattern = /^1[3-9]\d{9}$/;

function text(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const phone = text(body.phone, 11).replace(/\s+/g, "");
    const wechat = text(body.wechat, 40);
    const name = text(body.name, 40);
    const scenario = text(body.scenario, 80);
    const website = text(body.website, 100);

    if (website) return Response.json({ ok: true }, { status: 201 });
    if (!phonePattern.test(phone)) {
      return Response.json({ error: "请填写正确的 11 位手机号。" }, { status: 400 });
    }
    if (wechat.length < 2 || /\s/.test(wechat)) {
      return Response.json({ error: "请填写正确的微信号。" }, { status: 400 });
    }
    if (body.consent !== true) {
      return Response.json({ error: "请先同意联系方式使用说明。" }, { status: 400 });
    }

    await ensureLeadsSchema();
    const createdAt = new Date().toISOString();
    const result = await getD1()
      .prepare("INSERT INTO leads (created_at, name, phone, wechat, scenario, source, status) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(createdAt, name, phone, wechat, scenario, "xiangge-ai-workflow-site", "new")
      .run();

    return Response.json({ ok: true, id: result.meta.last_row_id }, { status: 201 });
  } catch (error) {
    console.error("Lead submission failed", error);
    return Response.json({ error: "提交暂时没有成功，请稍后再试。" }, { status: 500 });
  }
}
