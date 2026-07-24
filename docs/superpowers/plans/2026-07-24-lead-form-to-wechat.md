# Lead Form to WeChat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the public customer-information form with a static WeChat contact entry point and prevent new browser-originated lead submissions.

**Architecture:** `LandingPage` retains its existing `#claim` anchor and responsive layout, but it renders a static copy-to-clipboard WeChat card instead of a form. The public lead API route is removed; existing historic-lead data, database schema, admin UI, and export code remain out of scope.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node test runner, Vinext.

## Global Constraints

- The displayed WeChat number is exactly `13751196386`.
- Every public acquire-resource CTA uses the exact copy `添加我的微信获取资料`.
- The public landing page must have no lead form, customer fields, consent checkbox, or `/api/leads` request.
- Do not delete data, alter D1 configuration, or deploy the site.

---

### Task 1: Establish the landing-page regression contract

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: source text from `components/LandingPage.tsx`.
- Produces: an automated check that fails until the static WeChat entry point replaces the form and the public lead route is removed.

- [ ] **Step 1: Replace legacy lead-form assertions with the desired landing-page assertions**

```js
assert.match(landing, /添加我的微信获取资料/);
assert.match(landing, /13751196386/);
assert.match(landing, /navigator\.clipboard\.writeText\("13751196386"\)/);
assert.doesNotMatch(landing, /<form className="lead-form"/);
assert.doesNotMatch(landing, /\/api\/leads/);
```

- [ ] **Step 2: Update the durable-storage test so it validates only retained admin/export code**

```js
const [hosting, schema, adminRoute, dashboard, exporter] = await Promise.all([
  readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  readFile(new URL("../app/api/admin/leads/route.ts", import.meta.url), "utf8"),
  readFile(new URL("../components/AdminDashboard.tsx", import.meta.url), "utf8"),
  readFile(new URL("../lib/export-leads.mjs", import.meta.url), "utf8"),
]);
```

- [ ] **Step 3: Run the check and confirm the expected red state**

Run: `node --test tests/rendered-html.test.mjs`

Expected: the new landing-page test fails because the page still contains the form and does not yet contain the specified WeChat entry point.

### Task 2: Replace the public collection UI and endpoint

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `components/LandingPage.tsx`
- Modify: `app/globals.css`
- Delete: `app/api/leads/route.ts`

**Interfaces:**
- Consumes: `#claim` links throughout `LandingPage` and the fixed WeChat number `13751196386`.
- Produces: a static `#claim` section and a `copyWeChat` click handler that calls `navigator.clipboard.writeText("13751196386")` without sending data to the server.

- [ ] **Step 1: Extend the red contract so the public lead route must be absent**

```js
await assert.rejects(access(new URL("../app/api/leads/route.ts", import.meta.url)));
```

Run: `node --test tests/rendered-html.test.mjs`

Expected: the existing landing-page assertion remains red and the new route-deletion assertion fails because `app/api/leads/route.ts` still exists.

- [ ] **Step 2: Remove the form submission state, form-event import, submit handler, form markup, consent fields, and all user-data collection text**

```tsx
import { useState } from "react";

const wechatNumber = "13751196386";
```

- [ ] **Step 3: Add a copy handler and static WeChat contact card**

```tsx
async function copyWeChat() {
  try {
    await navigator.clipboard.writeText(wechatNumber);
    setCopyMessage("微信号已复制，打开微信添加我即可获取资料。");
  } catch {
    setCopyMessage("复制未成功，请手动复制微信号 13751196386。");
  }
}
```

```tsx
<section id="claim" className="section claim-section">
  <div className="section-inner claim-layout">
    <div className="claim-copy">
      <p className="eyebrow light">获取资料</p>
      <h2>添加我的微信获取资料</h2>
      <p>添加微信号后备注“资料”，我会把相关内容发给你。</p>
    </div>
    <aside className="wechat-card" aria-label="微信联系方式">
      <span>我的微信号</span>
      <strong>{wechatNumber}</strong>
      <button className="button primary submit-button" type="button" onClick={copyWeChat}>复制微信号</button>
      {copyMessage && <p className="copy-message" role="status">{copyMessage}</p>}
    </aside>
  </div>
</section>
```

- [ ] **Step 4: Change every resource-acquisition CTA that targets `#claim` to the exact copy `添加我的微信获取资料`**

```tsx
<a className="button primary glow-button" href="#claim">添加我的微信获取资料 <ArrowRight size={18} /></a>
```

- [ ] **Step 5: Replace form-specific CSS with contact-card CSS**

```css
.wechat-card { display: grid; gap: 16px; padding: clamp(23px,3vw,34px); border: 1px solid rgba(255,255,255,.18); border-radius: var(--radius); background: rgba(255,255,255,.96); color: var(--ink); box-shadow: 0 30px 90px rgba(0,0,0,.38); }
.wechat-card > span { color: var(--muted); font-size: 14px; font-weight: 850; }
.wechat-card > strong { font-size: clamp(26px,4vw,38px); letter-spacing: .04em; }
.copy-message { margin: 0; color: var(--teal-dark); font-size: 14px; font-weight: 800; }
```

Remove `.lead-form`, `.consent`, and `.honeypot` rules, because the public page no longer renders those controls. Keep existing responsive layout rules by changing the mobile selector from `.lead-form` to `.wechat-card` where necessary.

- [ ] **Step 6: Delete the public collection route**

Delete `app/api/leads/route.ts`; do not modify database records, migration files, `.openai/hosting.json`, or the protected historic-record admin code.

- [ ] **Step 7: Run the regression check and confirm the green state**

Run: `node --test tests/rendered-html.test.mjs`

Expected: all tests pass, including the check that the public page shows the WeChat entry point and no longer contains the form or `/api/leads` reference.

### Task 3: Verify the production build

**Files:**
- Verify: `components/LandingPage.tsx`
- Verify deletion: `app/api/leads/route.ts`

**Interfaces:**
- Consumes: completed Task 1 and Task 2 changes.
- Produces: a deployable static/contact landing page with no public lead route.

- [ ] **Step 1: Run the full project verification**

Run: `npm test`

Expected: Vinext build exits with code 0 and Node reports all tests passing.

- [ ] **Step 2: Confirm source-level acceptance criteria**

Run: `rg -n -- "<form className=\"lead-form\"|/api/leads|13751196386|添加我的微信获取资料" components/LandingPage.tsx app tests`

Expected: matches for the WeChat number and new CTA copy only; no matches for the former public form or lead API route.

- [ ] **Step 3: Inspect the final version-control diff before handoff**

Run: `git diff --check && git status --short && git diff -- components/LandingPage.tsx tests/rendered-html.test.mjs app/api/leads/route.ts`

Expected: no whitespace errors; only the planned landing-page, endpoint, test, and documentation changes are present.
