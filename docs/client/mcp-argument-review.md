# MCP 工具参数的只读核对 v1

2026-09-23。实现前契约，对应 Figma `23:3799` 的试运行检查及[工具节点 v1](mcp-tool-node.md)。本轮只核对已保存参数与已选工具的输入定义，不开放工具执行，不改变公共节点、流程格式、授权、运行输出或数据库结构。

## 检查与展示

`flow.run.preview.toolCalls` 的每项增加 `argumentCheck`，包含 `status`、`summary`、`issues`（最多 20 项，字段为 path、message），可选 `referenceCount`。状态分别为 `valid`（固定参数通过本机支持范围内的定义核对）、`invalid`（参数类型/值/大小不符）、`deferred`（含运行时引用，尚未求值）、`unsupported`（输入定义无效、超限或使用不支持规则）、`unavailable`（没有匹配工具定义）。

路径使用 JSON Pointer，空路径表示整组参数。问题文字仅包含规则及字段路径，不回显参数实际值、枚举候选或原始校验器异常。缺失/多余字段可显示对应字段路径；属性名按路径转义。页面显示可读状态、问题位置和下一步；通过仅意味着固定输入符合保存的定义，不能证明远端可用、账号权限、无副作用或本次已授权。

包含单键字符串 `$ref` 的 Value 为动态引用，嵌套引用也计入。先核对输入大小、结构和定义支持范围，再将整个输入标为待求值；不读取当前参数、步骤输出或循环项，不用占位值推断整体通过。引用解析后仍需在真实执行边界重新完整校验；本轮不替代该门槛。

## 支持范围及上限

定义与参数分别最多 65536 UTF-8 字节；JSON 结构最大深度 20、最多 4096 个值节点。Schema 根必须为 `type: object` 的对象；最多 256 个 Schema 节点、Schema 嵌套深度 12。超限明确拒绝核对，不截断后继续。

支持 JSON Schema 2020-12 的以下子集：type（含基本类型联合）、properties、required、additionalProperties、items、enum、const、minimum、maximum、exclusiveMinimum、exclusiveMaximum、multipleOf、minLength、maxLength、minItems、maxItems、minProperties、maxProperties。嵌套布尔 Schema 可用。允许 title、description、default、examples、deprecated、readOnly、writeOnly 说明字段，但不自动填充默认值，不把说明当作授权。`$schema` 如存在只接受 `https://json-schema.org/draft/2020-12/schema`。

未知关键字、远程/本地 `$ref`、定义引用、组合/条件 Schema、正则、format、uniqueItems、自定义扩展（含请求头映射）等均返回 unsupported。参数和定义先做有界结构检查，再由现有 Ajv 2020 校验支持的规则；禁止远程 Schema 获取、异步规则、类型转换、删除字段、默认值注入或自定义代码。校验器只在 Host 使用，Renderer 接收可读结果，不动态编译外部 Schema。

## 与运行检查的关系

核对使用固定已保存 FlowRecord 的节点和所选定义。缺少绑定或定义时保留原有对象错误，参数核对独立显示；不得依据 Renderer 提交的“已通过”标志准入。查看、重新检查、返回修改及展开参数不连接服务、读取凭据或调用 tools/call。输入校验不是远端预检，原有工具执行门槛继续关闭。

实施后需记录固定参数合法/不合法、缺失/多余字段、嵌套与整对象引用、不支持/无效定义、大小限制，以及窄窗口和长路径显示的实际证据。遵照当前用户要求，不新增或运行单元测试；真实解析参数、工具调用与完整 U03/U07 仍后续实现和验收。
