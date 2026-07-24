# Task 1 report: landing-page regression contract

## Scope

Updated only `tests/rendered-html.test.mjs` to define the landing-page replacement contract and to retain only the historic-lead admin/export storage checks.

## GREEN baseline

Command:

```powershell
node --test tests/rendered-html.test.mjs
```

Result before the contract change: exit code 0; 4 passing, 0 failing.

## RED contract check

Command:

```powershell
node --test tests/rendered-html.test.mjs
```

Result after the contract change: exit code 1; 3 passing, 1 failing.

Expected failure: `builds the public landing page with final branding` does not find `添加我的微信获取资料` in `components/LandingPage.tsx`. The output also shows the legacy `<form className="lead-form"` and `fetch("/api/leads")`, so the new test is red for the intended missing implementation rather than a test error.

## Files changed

- `tests/rendered-html.test.mjs`
- `.superpowers/sdd/task-1-report.md`

## Self-review

- The landing-page test now requires the exact CTA, WeChat number, clipboard call, absence of the public form, and absence of `/api/leads`.
- The durable-storage test no longer reads or asserts against `app/api/leads/route.ts`; it continues to cover D1 schema, admin protection, dashboard export, and ZIP export dependencies.
- No production code, configuration, documentation, or unrelated tests were changed.

## Concerns

The repository is intentionally red until Task 2 replaces the landing form and removes the public lead route. An unrelated pre-existing `.gitignore` modification remains uncommitted and is excluded from this task's commit.
