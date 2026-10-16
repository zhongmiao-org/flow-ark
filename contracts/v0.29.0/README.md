# P1契约0.29.0：模板数组数量与重复规则

2026-10-16，实际多资料制作发现受限Schema拒绝minItems。新增明确array类型的minItems与uniqueItems；已有maxItems继续使用。minItems/maxItems若提供必须为非负安全整数，且minItems不能大于maxItems；uniqueItems仅布尔。缺省最小值0，uniqueItems缺省false；显式false保留同义。

重复按JSON结构相等：对象键顺序不影响，数组顺序影响；不修剪文本、忽略大小写或合并文件。数组项仍按items Schema逐项校验。语言无关格式资料见configuration-array.cases.json；其中schemaValid检查受限声明与本地编译，valueValid按JSON Schema检查值。空公开默认数组可保留为未填状态，不能为了满足最小值自动创建占位条目或填入个人资料。

configuration-schema.ts为发布的受限声明检查器；完整数据校验仍由package-format.ts及宿主现有本地编译执行。作者Schema检查、实例配置/入口保存、编排带回/导出、导入和运行前采用同一固定模块。旧消费者已拒绝未知关键字，不允许静默剥离或忽略新规则；只有采用0.29.0并完成实现后才能制作使用这些规则的新包。没有新增业务能力或SDK调用、Flow/ZIP/SDK主版本、IPC字段或SQLite迁移。

数组表单分别显示不足、超限、重复；无效值阻止保存/运行，未编辑空值不被误称未保存。上下移动只重排当前草稿，稳定条目身份、未完成原始输入、焦点与已保存基线保护保持；首尾/禁用状态不越界，不自动保存/运行。可视化作者提供最少/最多项数及不允许重复项；高级JSON不是唯一入口，切换字段类型移除不适用规则。

Figma与实施门槛见[通用数组规则](../../docs/client/template-array-rules.md)。G1格式资料不代表客户端采用、原生交互或真实业务通过；当前不新增/运行单元测试，消费者类型/构建及受控人工持久化、导出复导、复杂值重复和移动未完成输入分别取证。
