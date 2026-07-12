"use client";

import { CheckSquare, Download, FileSpreadsheet, LogOut, RefreshCw, Search, Square } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { buildLeadsExportZip } from "@/lib/export-leads.mjs";

type Lead = {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  wechat: string;
  scenario: string;
  source: string;
  status: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", hour12: false }).format(new Date(value));
}

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/leads", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    if (!response.ok) {
      setLoading(false);
      throw new Error("表单数据加载失败");
    }
    const data = (await response.json()) as { leads: Lead[] };
    setLeads(data.leads);
    setAuthenticated(true);
    setLoading(false);
  }, []);

  useEffect(() => { loadLeads().catch(() => setLoading(false)); }, [loadLeads]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return leads;
    return leads.filter((lead) => [lead.name, lead.phone, lead.wechat, lead.scenario].some((value) => value?.toLowerCase().includes(keyword)));
  }, [leads, query]);

  const allFilteredSelected = filtered.length > 0 && filtered.every((lead) => selected.has(lead.id));
  const selectedLeads = leads.filter((lead) => selected.has(lead.id));

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setLoginError(result.error || "登录失败");
      return;
    }
    setPassword("");
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setLeads([]);
    setSelected(new Set());
  }

  function toggleAll() {
    setSelected((current) => {
      const next = new Set(current);
      if (allFilteredSelected) filtered.forEach((lead) => next.delete(lead.id));
      else filtered.forEach((lead) => next.add(lead.id));
      return next;
    });
  }

  function toggleOne(id: number) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function exportLeads(items: Lead[]) {
    if (!items.length) return;
    setExporting(true);
    try {
      const { blob, filename } = await buildLeadsExportZip(items);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  if (authenticated === false) {
    return <main className="admin-login"><form onSubmit={login}><div className="brand-mark">翔</div><p>翔哥 AI 工作流</p><h1>表单管理后台</h1><label>管理密码<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required /></label><button className="button primary" type="submit">登录后台</button>{loginError && <p className="form-message error">{loginError}</p>}<a href="/">返回网站</a></form></main>;
  }

  return (
    <main className="admin-shell">
      <header className="admin-header"><div><span className="brand-mark">翔</span><div><p>翔哥 AI 工作流</p><h1>表单管理后台</h1></div></div><button className="icon-text-button" type="button" onClick={logout}><LogOut size={18} />退出</button></header>
      <section className="admin-summary"><div><span>全部登记</span><strong>{leads.length}</strong></div><div><span>今日新增</span><strong>{leads.filter((lead) => lead.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)).length}</strong></div><div><span>已选择</span><strong>{selected.size}</strong></div></section>
      <section className="admin-workspace">
        <div className="admin-toolbar">
          <label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索姓名、手机号、微信号或方向" /></label>
          <div className="toolbar-actions">
            <button className="icon-text-button" type="button" onClick={() => loadLeads()} disabled={loading}><RefreshCw size={18} />刷新</button>
            <button className="icon-text-button" type="button" onClick={toggleAll} disabled={!filtered.length}>{allFilteredSelected ? <CheckSquare size={18} /> : <Square size={18} />}{allFilteredSelected ? "取消全选" : "全选"}</button>
            <button className="button secondary-dark" type="button" onClick={() => exportLeads(selectedLeads)} disabled={!selectedLeads.length || exporting}><Download size={18} />导出所选</button>
            <button className="button primary" type="button" onClick={() => exportLeads(leads)} disabled={!leads.length || exporting}><FileSpreadsheet size={18} />{exporting ? "正在生成..." : "一键导出全部"}</button>
          </div>
        </div>
        <div className="table-wrap">
          <table><thead><tr><th><button className="check-button" onClick={toggleAll} aria-label="全选当前结果">{allFilteredSelected ? <CheckSquare size={19} /> : <Square size={19} />}</button></th><th>登记时间</th><th>姓名</th><th>手机号</th><th>微信号</th><th>关注方向</th><th>状态</th></tr></thead>
            <tbody>{filtered.map((lead) => <tr key={lead.id} className={selected.has(lead.id) ? "selected" : ""}><td><button className="check-button" onClick={() => toggleOne(lead.id)} aria-label={`选择记录 ${lead.id}`}>{selected.has(lead.id) ? <CheckSquare size={19} /> : <Square size={19} />}</button></td><td>{formatDate(lead.created_at)}</td><td>{lead.name || "-"}</td><td>{lead.phone}</td><td>{lead.wechat}</td><td>{lead.scenario || "-"}</td><td><span className="status-badge">新登记</span></td></tr>)}</tbody></table>
          {!loading && !filtered.length && <div className="empty-state">{leads.length ? "没有匹配的记录" : "还没有人提交表单"}</div>}
          {loading && <div className="empty-state">正在加载表单...</div>}
        </div>
      </section>
    </main>
  );
}
