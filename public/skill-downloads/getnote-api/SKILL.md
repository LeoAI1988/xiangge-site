---
name: getnote-api
description: Use when integrating or troubleshooting the Get笔记 API for saving, searching, listing, updating, deleting, tagging, or organizing notes and knowledge bases.
---

# Get笔记 API

## 安全边界

- Base URL 固定为 `https://openapi.biji.com`。
- 凭证只从 `GETNOTE_API_KEY` 和 `GETNOTE_CLIENT_ID` 环境变量读取。
- 不把真实凭证、编码后的凭证、个人笔记 ID、知识库 ID、分享追踪参数或本地路径写入 Skill、代码仓库、日志和公开下载包。
- API 返回的 ID 一律按字符串处理。JavaScript 在 `JSON.parse` 前要保护超出安全整数范围的 ID。
- 未实际调用 API 并验证响应前，不得声称保存、更新或删除成功。

## 认证

每次请求都带：

```text
Authorization: $GETNOTE_API_KEY
X-Client-ID: $GETNOTE_CLIENT_ID
Content-Type: application/json
```

Python 基础模板：

```python
import os
import requests

BASE = "https://openapi.biji.com"
HEADERS = {
    "Authorization": os.environ["GETNOTE_API_KEY"],
    "X-Client-ID": os.environ["GETNOTE_CLIENT_ID"],
    "Content-Type": "application/json",
}
```

环境变量缺失时停止请求并提示用户完成配置，不要猜测或拼接凭证。

## 常用端点

| 操作 | 方法 | 路径 |
|---|---|---|
| 保存文本、链接或图片 | POST | `/open/api/v1/resource/note/save` |
| 查询异步保存进度 | POST | `/open/api/v1/resource/note/task/progress` |
| 笔记列表 | GET | `/open/api/v1/resource/note/list` |
| 笔记详情 | GET | `/open/api/v1/resource/note/detail` |
| 更新笔记 | POST | `/open/api/v1/resource/note/update` |
| 删除笔记 | POST | `/open/api/v1/resource/note/delete` |
| 创建分享链接 | POST | `/open/api/v1/resource/note/sharing` |
| 添加标签 | POST | `/open/api/v1/resource/note/tags/add` |
| 删除标签 | POST | `/open/api/v1/resource/note/tags/delete` |
| 全局语义搜索 | POST | `/open/api/v1/resource/recall` |
| 知识库语义搜索 | POST | `/open/api/v1/resource/recall/knowledge` |
| 知识库列表 | GET | `/open/api/v1/resource/knowledge/list` |
| 知识库笔记 | GET | `/open/api/v1/resource/knowledge/notes` |
| 创建知识库 | POST | `/open/api/v1/resource/knowledge/create` |
| 添加笔记到知识库 | POST | `/open/api/v1/resource/knowledge/note/batch-add` |
| 从知识库移除笔记 | POST | `/open/api/v1/resource/knowledge/note/remove` |

## 读取笔记

详情接口的查询参数名是 `id`：

```python
note_id = os.environ["TARGET_NOTE_ID"]
response = requests.get(
    f"{BASE}/open/api/v1/resource/note/detail",
    params={"id": note_id},
    headers=HEADERS,
    timeout=30,
)
data = response.json()
assert data.get("success") is True
note = data["data"]["note"]
```

录音笔记优先读取 `data.note.audio.original`，摘要只用于定位。字段不存在时再检查正文内容。

## 搜索笔记

```python
response = requests.post(
    f"{BASE}/open/api/v1/resource/recall",
    json={"query": "搜索词", "cursor": "0"},
    headers=HEADERS,
    timeout=30,
)
data = response.json()
assert data.get("success") is True
```

搜索结果可能是片段。需要全文时，用结果中的字符串 ID 调用详情接口，不要把片段当成完整正文。

## 保存与异步轮询

文本保存通常同步返回结果；链接和图片可能返回 `task_id`。收到 `task_id` 后必须轮询任务进度，直到 `success` 或 `failed`。

```python
import time

task_id = "TASK_ID_FROM_API"
while True:
    status = requests.post(
        f"{BASE}/open/api/v1/resource/note/task/progress",
        json={"task_id": task_id},
        headers=HEADERS,
        timeout=30,
    ).json()
    state = status.get("data", {}).get("status")
    if state in {"success", "failed"}:
        break
    time.sleep(10)
```

失败时报告 API 返回的错误原因。异步保存最多自动重试一次。

## 更新与删除

更新只发送用户授权修改的字段。修改前读取当前内容，修改后再次读取回验。删除属于破坏性操作，执行前确认目标 ID 和用户意图。

不要编造 ID，也不要把内链当作公开分享链接。需要公开分享时调用分享接口并使用其真实返回值。

## JavaScript ID 精度保护

```javascript
const safe = rawText.replace(
  /"(id|note_id|parent_id|follow_id|live_id)"\s*:\s*(\d+)/g,
  '"$1":"$2"',
);
const data = JSON.parse(safe);
```

所有后续请求继续传字符串 ID。

## 错误与限流

| 情况 | 处理 |
|---|---|
| 参数错误 | 对照端点检查参数名和请求位置 |
| 鉴权失败 | 检查环境变量与授权范围，不输出凭证 |
| 数据不存在 | 重新确认字符串 ID，不猜测 |
| 非会员或权限不足 | 向用户说明所需权限 |
| HTTP 429 或限流码 | 按响应中的 `retry_after` 等待后重试 |
| HTTP 5xx 或超时 | 等待数秒后重试一次，再报告错误 |

每次响应都检查 `success`、`error` 和 `request_id`。限流时优先遵守服务端返回的等待时间。

## 发布前隐私检查

- 示例仅使用环境变量和通用占位符
- 无真实或可还原的 API Key、Client ID、Token、Cookie
- 无个人笔记 ID、知识库 ID、分享短链和追踪参数
- 无姓名、联系方式、账号、投资记录、家庭关系和个人经历
- 无用户目录、服务器目录或私有域名
