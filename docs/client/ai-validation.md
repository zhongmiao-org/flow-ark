# AI 实接记录

## DeepSeek：2026-09-16

通过客户端既有 `ai.test` 白名单接口和已保存的 DeepSeek 凭据验证；密钥由 Main 解密后交给本地宿主，未读取到测试脚本、Renderer、日志或治理文档。使用程序内虚构的 TypeScript 经历与问题，没有上传真实简历或聊天内容，也没有发送招聘消息。

模型保持 `deepseek-flash`，接口为 `https://api.deepseek.com/chat/completions`。当前模型和 JSON 输出能力已核对 [官方 Chat Completions 文档](https://api-docs.deepseek.com/api/create-chat-completion/) 与 [模型说明](https://api-docs.deepseek.com/quick_start/pricing/)。JSON Output 只保证 JSON 形式，应用继续用契约 Schema 和事实规则独立校验。

三次调用分别对应不同代码状态，不是失败后的自动重试：

| 代码状态 | 实际结果 | 处理 |
| --- | --- | --- |
| 已安装 0.1.4 | API 返回，但 `needsHuman` 不是数组 | Schema 拒绝，未使用草稿；保留失败证据 |
| 0.1.5 加入 JSON Schema 后 | 格式通过，正文存在未被事实或固定礼貌短语覆盖的内容 | 事实校验拒绝，未放宽规则 |
| 0.1.5 统一礼貌短语规则后 | 完整草稿通过 Schema、上下文与事实校验 | 客户端记录 `ai-validation`，接口返回模型与用量 |

最终通过时间：2026-09-16 20:01（UTC+8）。实际响应模型 `deepseek-flash`；prompt 514、completion 290、total 804 tokens，其中 reasoning 227。推理内容未当作草稿或外发正文。

修复方式：DeepSeek 系统消息包含既有 `AIReplyDraft` JSON Schema，明确数组类型；提示词与正文校验器共用原有固定礼貌短语列表，允许的正文范围未扩大。不转换错误字段，不添加自动重试，不切换 Provider 或模型，无契约版本或数据库迁移。

`pnpm check` 通过类型检查、54 项单元测试和构建。新增回归验证 `needsHuman` 为字符串/null/布尔/对象时都拒绝且仅调用一次；合法草稿通过，额外开场词仍被阻止。真实验证由开发版主进程、宿主和适配器完成，正常退出。

证据在客户端忽略目录：`test-results/deepseek-format-failure.json`、`test-results/deepseek-body-failure.json`、`test-results/development-deepseek.json`；最终日志 `/private/tmp/flowark015-deepseek-final-live.log`。0.1.5 仍因 Chrome 恢复缺口暂未打包安装；已安装 0.1.4 不含上述提示词修复。

## Codex 与剩余验收

当前客户端未配置 OpenAI/Codex 凭据，尚未发起该 Provider 的真实请求。已有 Responses API 适配与模拟验证，不能据 DeepSeek 的成功宣布 Codex 通过。密钥需要用户在客户端设置，不借用 Codex CLI、ChatGPT 或桌面登录态。

DeepSeek 的本次通过仅覆盖虚构事实下的真实请求与完整草稿校验；真实招聘上下文、账号权限、回复回执及另一 Provider 仍待验收。J-13 保持部分通过。
