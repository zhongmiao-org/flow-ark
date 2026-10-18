# 入口结果只读视图草案

状态：**未发布、不可由客户端采用**。这是独立于现有v0.35.1和待审来源核对草案的设计材料，不分配后续契约发布版本，不建立tag，不修改任何已发布快照。`formatVersion:1.0`仅为本草案文档内的格式身份。

先行设计与源码缺口见[入口结果规格](../../../docs/client/entry-result-view.md)。本目录包括语言无关[wire.schema.json](wire.schema.json)、[正反格式资料](examples.json)、[范围资料](boundaries.json)及无应用依赖的[关联条件参考](reference.mjs)。后者不证明生产数据归属、文件完整性、并发事务或IPC验收。

## 读取接口与状态

候选白名单方法`run.entryResult`，严格输入`{runId}`，不接收路径、实例ID、Schema、结果、执行/重试/授权开关。Run缺失或记录自身格式无效作为固定读取错误拒绝；不得把其他Run的数据返回给调用者。正常返回固定`run:{id,flowId,versionId,state}`及只读视图：

| viewStatus | 含义与内容 |
| --- | --- |
| available | 终态Run、固定来源和已保存结果均核验通过，携带脱敏值、展示摘要及标签。SUCCEEDED仅标`completion:run-succeeded`；FAILED/CANCELLED/INTERRUPTED标`saved-only`，不推断业务成功 |
| missing | 终态Run且来源核验通过，但准确结果记录不存在；无value、无用量补零、无步骤输出回填 |
| pending | Run尚未终止，不返回可被覆盖的入口值；现有步骤与活动状态继续显示 |
| not-applicable | 固定快照核验通过，明确不属于正式模板或制作副本；普通输出保持 |
| unavailable | 固定快照/来源/Schema/结果无效、缺失、预算超限、存储不可用或读取期间变化；仅固定reason，不回传失败值、原始异常或其他来源内容 |

无结果记录与值为`false`、`0`、空文本、空对象、空列表、`null`严格区分。只能以记录存在性/undefined判断缺失，不能用真值判断或`?? output`替代已保存null。现有正式模板完成路径使用`get(...) ?? output`，后续消费者必须修正并独立核对，不能靠本草案宣称已修复。读取不补写、重建、修复或迁移任何旧记录。

## 固定来源与读取顺序

1. 先验证Run和同Run快照的flowId/versionId关系；快照缺失不得归为not-applicable。正式模板与作者SDK身份同时存在时返回owner-conflict，不能任选其一。
2. 正式来源来自Run快照的template binding。核对固定packageKey、实际归档完整性和contentDigest、准确入口及其resultSchema文件；schemaPath使用既有包路径语义，不限扩展名、不接受绝对/空段/点段/穿越或外部来源。读取历史不借用当前实例配置或要求当前入口仍对应同一可编辑flow；依赖现行Templates.context中“当前实例/当前flow”校验不能直接充当历史结果读取。缺包/入口/Schema明确不可核验，不改用最新版或同名入口。
3. 制作副本来源只取Run快照固定authorSdk上下文及其中owner、definitionSha256和resultSchema；核对author-sdk-result的runId/contextId/definitionSha256，沿已发布作者SDK定义校验。当前制作草稿、checkout或修订变更不替换旧Run来源，也不伪装正式实例。现有AuthorSdk.read/prepare还依赖当前checkout/flow登记；历史读取须独立核对固定快照的可信持久来源，不能直接套用当前登记或放松实际执行时的准入校验。旧快照本身缺乏足够来源证据时返回unavailable，不回填。
4. 从准确Run key读取正式template-result或author-sdk-result。已保存结果须按固定完整Schema在宿主校验；formal既有记录无法证明是显式sdk.result还是完成回填，返回kind只表示固定正式来源，不新增虚构的调用者、保存时间或调用次序。没有记录时不从output、最后节点、当前表单、待办或模型重建。
5. 包与Schema读取可能异步。读取后再次核对Run状态、快照身份、结果记录存在性/内容和相关存储可用性。发生变化返回changed-during-read，不把前后两次数据拼成视图。活动Run一律pending；终态记录也不假定磁盘或维护操作永不变化。
6. Schema校验使用完整已核验结果，禁止远程引用/下载。校验失败不回传原始AJV错误、Schema pattern、未知属性名或失败正文，按固定result-invalid/schema-invalid返回。随后才脱敏；不能把脱敏后的显示值重新按原业务Schema校验成“失败”。
7. 隐私策略沿宿主现有秘密值/敏感字段及文本范围保护，响应固定`privacy:host-redacted-v1`。`displayChanged`表示脱敏或现有文本裁剪是否改变canonical值；为true时UI必须提示这是显示投影，非资料全文。不得因此读取凭据、扩大资源授权或把保护前的值/摘要传给Renderer。

正式source包含固定模板身份/包摘要/入口及Schema字节摘要；作者source包含固定checkout/draft/entry/flow/baseRevision/context/definitionSha256及Schema摘要。这里的描述信息也是不可信模板内容；不执行、不导航、不授予动作。UI同时核对最新读取序号和预期Run，旧回复不能覆盖新Run或选择。

## 展示标签与原文

完整业务Schema可以使用现行允许的本地引用，不能为了显示把它改写成配置Schema子集。宿主只提取可明确归属的title/description，返回有界`labels:[{path,label,description?}]`；path指向已脱敏value的实际RFC6901位置。无标题按原字段名展示，不在客户端加入岗位或招聘词典。

仅使用无歧义的直接properties/items或本地引用链；循环、动态引用、组合Schema分支的冲突或解释不足不猜标签，保留字段原名并令labelsComplete=false。缺少title本身不构成Schema无效。对象字段名与数组项次序不改，0/false/null不互换。原字段名在脱敏时改名、路径含秘密值或显示结构已经被保护替换时跳过不再准确的标签，不能输出旧私有路径。

同一path只允许一个标签，必须在响应value中存在；根路径空文本合法。数组路径只接受实际的非负规范下标，不接受前导零、负数、`-`、越界或原型继承字段；转义和求值顺序沿[RFC6901](https://www.rfc-editor.org/rfc/rfc6901)。title/description仅作纯文本注解，沿[JSON Schema验证规范](https://json-schema.org/draft/2020-12/json-schema-validation)的注解边界；不解释HTML、Markdown指令、脚本、URL、公式或模型命令。模板声明“成功”不构成宿主业务回执。

UI的摘要范围沿既有通用展示能力并明确省略；完整脱敏原文仍可显式展开。若result payload本身超出读取预算则返回unavailable/read-limit，不偷偷截取value并称完整。现有资料、Skill、来源、失败信息和动作回执继续独立显示；Schema视图不替代受保护专用结果，也不把缺省标题或读取错误当成入口没有输出。

## 预算、摘要与当前性

- Schema资源读取/解释预算64KiB；超过预算不提供这个入口预览，但不删除原Schema或结果。采用前实际消费者须核对PackageLibrary的整包读取开销，不能把响应预算说成全部I/O/内存开销上限。
- value的canonical UTF-8最多196608字节，整个响应最多524288字节，canonical编码整体嵌套最多64层；非法非JSON值、非有限数字或稀疏数组拒绝。UI摘要限制仍与完整读取预算分开。
- 传输字节限额及JSON深度/合法值预算在递归JSON Schema校验前核对，避免先递归校验再发现过深输入；reference中的assertWireBudget须先于格式校验调用。响应范围内再检查严格格式、关联条件和来源，不能仅相信valueBytes声明。
- 标签最多256项，path最多2048字符、label120、description500；超出解释范围省略相应标签并标labelsComplete=false，不改写value。包/流程/业务Schema现行限额不因本草案放宽。
- 标签集合使整体响应超过范围时先减少可选标签并标labelsComplete=false，不切value；最终仍不满足预算才返回unavailable/read-limit。显示省略标签不表示原Schema无效。
- canonical沿现行包契约原则：对象键按UTF-16码元序排序，数组保序，字符串不做Unicode归一化，以JSON字符串/数字编码；-0按JSON编码为0。valueSha256/valueBytes核对**实际交付脱敏值**；不冒充原保护值的摘要或字节数。
- readStamp为移除readStamp后的整个响应body的canonical SHA256，用于读取完整性和失效关联；不是签名、来源授权或真实业务证明。真正的归属、完整Schema校验与异步重读必须由宿主完成，不能由Renderer或模型声明。

## 不变项与采用门槛

读取不创建Run、模型请求、费用、会话确认、Skill版本、状态写入、业务重试、动作授权或持久化变更；不修复Schema失败，不消费原付费重试许可，不修改实例/作者/浏览器或原始资料。恢复/重开不重放。供应商Key仍只归用户且留在受保护宿主，不返回Renderer。

本草案经格式和关联条件核对后仍须治理审查、确定正式契约归属/发布版本并通过CI发布，再生成类型和接入白名单宿主读取、UI以及真正历史Run。不能绕过未发布v0.36.0来源核对草案或把本草案塞入旧快照。客户端采用、完整Schema标签、正式/作者历史、缺失/冲突/活动/终态、资料保护与全UI复用逐项验证；当前没有生产实现、安装更新或完整G3–G5验收结论。
