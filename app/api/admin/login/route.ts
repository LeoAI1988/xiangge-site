import { adminCookie, createSessionToken, verifyPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || !(await verifyPassword(body.password))) {
    return Response.json({ error: "管理密码不正确。" }, { status: 401 });
  }

  const secure = new URL(request.url).protocol === "https:";
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": adminCookie(await createSessionToken(), secure) } },
  );
}
