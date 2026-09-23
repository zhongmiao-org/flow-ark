# 契约 0.15.0

2026-09-23，增加 MCP 工具节点成功回复的 McpToolResult v1。节点输入、流程 1.0、模板包 2.0 和 SDK 1.0 不变。开发快照标识 contracts-v0.15.0；实际发布以远程不可变 tag 为准，契约发布不代表工具已接入或完成真实验收。

输出是 version:1、content（最多 64 个 MCP 内容对象）、isError 布尔值及可选 structuredContent 对象。仅成功且 isError:false 的回复成为步骤输出；isError:true 记录为工具报错并终止该步骤。协议失败、取消、超时、回复无效或关闭未确认均不能伪装成功。引用例如 steps.lookup.structuredContent.name 或 steps.lookup.content.0.text。

额外限制及固定绑定、单次尝试、回执与展示规则见[工具试运行](../../docs/client/mcp-execution.md)。内容是外部数据，链接、资源、图片和音频不自动打开、下载或执行。现有已发布快照保持不变。
