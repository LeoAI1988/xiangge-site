# 翔哥 AI 业务工作流个人网站

本目录是该项目唯一的后续工作目录。旧版静态网页已完整迁移到 `legacy-static/`，仅作为历史备份。

## 正式访问地址

- 网站首页：https://xiangge-ai-workflow.gaoxiang19881119.chatgpt.site
- 管理后台：https://xiangge-ai-workflow.gaoxiang19881119.chatgpt.site/admin

## 当前功能

- 面向访客的个人介绍、课程大纲、赠品和 30 个 Skill 展示。
- 手机号、微信号、称呼和关注方向登记。
- 表单数据保存到 Sites 云端 D1 数据库。
- 密码保护的独立管理后台。
- 支持搜索、逐条勾选、一键全选、导出所选和一键导出全部。
- 每次导出生成一个 ZIP，内含 `.xlsx` Excel 文件和 `.md` Markdown 文件。

## 管理后台密码

正式后台密码由 Sites 的加密环境变量 `ADMIN_PASSWORD` 管理，不写入代码仓库。需要更换密码时，应在 Sites 项目环境变量中更新 `ADMIN_PASSWORD`，保存新版本并重新部署。

本地开发密码仅记录在被 Git 忽略的 `.dev.vars` 中，与正式后台密码分开管理。

## 本地运行

```text
npm run dev
```

## 目录说明

- `app/`：页面和接口。
- `components/`：前台与管理后台交互组件。
- `db/`、`drizzle/`：数据库结构和迁移。
- `public/`：网站图片。
- `legacy-static/`：迁移前的静态版完整备份。
- `output/pdf/`：处理后的本地 PDF 成品及说明。

## 本地 PDF 成品

成品文件：`output/pdf/刘思毅-2026超级个体AI生存手册-清理终版.pdf`

该文件仅保存在本项目文件夹内，没有上传到网站或代码仓库。具体处理范围见 `output/pdf/README.md`。

## 内容边界

网站没有上传或公开分发第三方付费视频、PDF 和课程文件。当前领取流程为：访客完成登记后，翔哥通过微信联系并人工发放资料。
