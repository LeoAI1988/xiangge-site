---
name: multi-speaker-recording-annotation
description: Use when annotating multi-speaker recording notes, resolving speaker relationships from evidence, and updating note titles or content without exposing real identities.
---

# 多人录音人物关系标注

## 核心原则

只依据当前录音、用户提供的关系表和可核验的上下文判断人物身份。不要把年龄、地点、职业、口头禅等单一线索当成确定身份的证据。

所有人物默认使用角色标签，例如“讲述者 A”“家长”“孩子”“长辈”。只有用户明确要求且输出范围是私密环境时，才使用真实姓名。

## 输入

开始前确认：

- 待处理的录音笔记或笔记 ID
- 用户提供的角色关系表
- 允许写回的字段：标题、正文或两者
- 是否允许使用真实姓名；默认不允许

关系表建议采用以下结构：

| role_id | 关系 | 常见称呼 | 可核验线索 |
|---|---|---|---|
| speaker-a | 家长 | 爸爸、家长 | 由用户确认 |
| speaker-b | 孩子 | 孩子、小朋友 | 由用户确认 |
| speaker-c | 长辈 | 奶奶、姥爷等 | 由用户确认 |

不要在 Skill 文件、日志或公开下载包中固化真实姓名、家庭经历、地址、学校、公司、精确年龄或原始笔记 ID。

## 执行流程

### 1. 读取原始材料

优先读取录音逐字稿。若笔记同时有摘要与原始转写，以原始转写为主要证据，摘要只用于定位。

### 2. 建立候选人物表

对每位说话人记录：

- 候选角色
- 支持证据
- 冲突证据
- 置信度：高、中、低

低置信度人物保持匿名标签，不强行命名。

### 3. 处理称呼歧义

“爸爸”“妈妈”“奶奶”等称呼依赖说话人视角。先确定谁在说话，再换算关系。无法确定时保留原称呼并加注“身份待确认”。

禁止机械全局替换“孩子”“老人”“家长”等词。泛指、引用、他人家庭成员和社会话题必须保留原义。

### 4. 生成标注块

```markdown
📌 **人物关系标注**
- 讲述者 A：家长（高置信度，依据：用户确认）
- 讲述者 B：孩子（中置信度，依据：对话称呼与上下文）
- 讲述者 C：身份待确认

> 场景：家庭日常对话。未公开真实姓名与可识别信息。
```

### 5. 更新标题与正文

标题格式建议：

```text
【日期·场景】核心内容（角色列表）
```

标题只保留任务需要的最少信息，不写详细地址、单位、学校、账号或其他可识别信息。

### 6. 写回并回验

写回前保留原文副本或使用支持恢复的更新方式。写回后重新读取笔记，确认：

- 标注块只插入一次
- 标题与正文更新成功
- 未误替换泛指词
- 未新增真实姓名、地址、账号、笔记 ID 或凭证

## Get笔记调用模板

凭证只从环境变量读取，不要写入脚本、Skill 或日志。

```python
import os
import requests

base = "https://openapi.biji.com"
headers = {
    "Authorization": os.environ["GETNOTE_API_KEY"],
    "X-Client-ID": os.environ["GETNOTE_CLIENT_ID"],
    "Content-Type": "application/json",
}

note_id = os.environ["TARGET_NOTE_ID"]  # 始终按字符串处理
detail = requests.get(
    f"{base}/open/api/v1/resource/note/detail",
    params={"id": note_id},
    headers=headers,
    timeout=30,
).json()

assert detail.get("success") is True
note = detail["data"]["note"]
```

更新时只发送用户授权修改的字段，并以 API 返回结果和再次读取结果为准。

## 隐私检查

交付前检查正文、标题、日志和下载包：

- 无真实姓名、昵称或家庭成员画像
- 无手机号、邮箱、证件号、账号、地址、单位和学校
- 无笔记 ID、知识库 ID、内部链接或本地路径
- 无 API Key、Client ID、Token、Cookie 或其编码形式
- 示例全部使用通用角色和占位变量
