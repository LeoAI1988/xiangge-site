import { isAdminRequest } from "@/lib/admin-auth";
import { ensureLeadsSchema, getD1 } from "@/lib/leads-db";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  await ensureLeadsSchema();
  const result = await getD1()
    .prepare("SELECT id, created_at, name, phone, wechat, scenario, source, status FROM leads ORDER BY created_at DESC LIMIT 5000")
    .all();
  return Response.json({ leads: result.results });
}
