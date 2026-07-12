import { env } from "cloudflare:workers";

const schemaSql = `CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL,
  wechat TEXT NOT NULL,
  scenario TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'xiangge-ai-workflow-site',
  status TEXT NOT NULL DEFAULT 'new'
)`;

let initialized = false;

export function getD1() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("D1 database binding is unavailable");
  return db;
}

export async function ensureLeadsSchema() {
  if (initialized) return;
  const db = getD1();
  await db.batch([
    db.prepare(schemaSql),
    db.prepare("CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)"),
  ]);
  initialized = true;
}
