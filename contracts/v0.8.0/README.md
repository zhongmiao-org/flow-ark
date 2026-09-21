# 契约 0.8.0

2026-09-21，破坏兼容的开发阶段版本。发布前状态：未发布。

移除招聘节点与业务协议；业务 Schema 归模板仓库。新增 TemplateArchiveManifest（包格式 2.0）、通用 AIRequest/AIResult、TemplateInstanceRef。旧 JSON 模板不再导入，历史版本目录保持不可变。通用 FlowDefinition 1.0 语义继续使用；TemplatePackage 仅保留为内存中的单流程定义辅助结构，不是正式导入格式。

包、SDK、生命周期与兼容规则见 [模板包规范](../../docs/templates/package-format.md)。SDK 1.0 见 [SDK 约定](../../docs/templates/sdk.md)。客户端和模板仓库固定复制本版本机器可读文件，独立构建；不能在运行时读取治理目录。
