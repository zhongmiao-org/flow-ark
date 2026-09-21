# 契约 0.10.0

2026-09-21，增加 `excel` v3 `map` 节点及 `ExcelColumnMapping`，实现设计稿中的记录字段映射、预览与新建工作簿。流程格式仍为 1.0，模板包仍为 2.0，SDK 仍为 1.0；v1 整表读写和 v2 模板填充是不同操作，现行规范继续包含它们，不做旧客户端迁移或自动转换。已有快照保持不变。

开发快照标识为 `contracts-v0.10.0`，只有远程 tag 存在才算发布。旧消费者不认识 excel v3，必须在执行前拒绝。含映射节点的流程声明 `excel-mapping-v1` 能力，模板入口也需声明；本版本不代表客户端已实现或验收。客户端消费固定副本和生成类型，不运行时读取本目录。

规范语义见 [Excel 字段映射](../../docs/client/excel-mapping.md)，正例为 [example.excel-mapping.json](example.excel-mapping.json)。Schema 校验字段形状；重复列、列上限、数据类型、空值、文件存在与运行时引用等规则由消费者语义校验和实际写入保证。
