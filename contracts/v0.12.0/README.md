# 契约 0.12.0

2026-09-22。新增 `file` v4 `operation:create`、`onConflict:number`，实现同名自动加序号且保留原文件。单独声明 `file-create-numbered-v1` 能力；不认识节点或能力的消费者执行前拒绝，不退回覆盖写入或同名停止。现行 file v3 create 的同名停止语义保持，已有运行与计划快照不改写。

开发快照标识 `contracts-v0.12.0`，以远程不可变 tag 为发布依据。流程格式 1.0、模板包 2.0、SDK 1.0 不变，无 SQLite 迁移或旧客户端升级路径。规范发布不代表教学闭环完成。

完整语义见[同名序号输出](../../docs/client/file-create-numbered.md)，正例见[示例](example.file-create-numbered.json)。Schema 约束固定策略与值引用，原子提交、文本/路径、候选上限和取消由消费者执行并验证。客户端固定纳入副本和生成类型，不在运行时读取治理仓库。
