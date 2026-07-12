import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull(),
  name: text("name").notNull().default(""),
  phone: text("phone").notNull(),
  wechat: text("wechat").notNull(),
  scenario: text("scenario").notNull().default(""),
  source: text("source").notNull().default("xiangge-ai-workflow-site"),
  status: text("status").notNull().default("new"),
});
