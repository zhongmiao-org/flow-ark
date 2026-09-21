# 契约 0.8.0

2026-09-21，破坏兼容的开发阶段版本。已固定开发快照 `contracts-v0.8.0`，对应治理提交 `aff8f5e3ce56d410e52173f736f4327bed156ffa`；这不是产品正式发版或旧客户端兼容承诺。

移除招聘节点与业务协议；业务 Schema 归模板仓库。新增 TemplateArchiveManifest（包格式 2.0）、通用 AIRequest/AIResult、TemplateInstanceRef。旧 JSON 模板不再导入，历史版本目录保持不可变。通用 FlowDefinition 1.0 语义继续使用；此不可变快照中的 TemplateManifest/TemplatePackage 为历史辅助定义，客户端已删除相关运行辅助代码；唯一正式导入格式为 TemplateArchiveManifest 的标准 ZIP。

包、SDK、生命周期与兼容规则见 [模板包规范](../../docs/templates/package-format.md)。SDK 1.0 见 [SDK 约定](../../docs/templates/sdk.md)。客户端和模板仓库固定复制本版本机器可读文件，独立构建；不能在运行时读取治理目录。
