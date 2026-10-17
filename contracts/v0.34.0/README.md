# P1契约0.34.0：固定来源资源与有界读取节点

2026-10-17，接续0.33.0及[四状态Figma与UI使用路径](../../docs/client/conversation-source-reading.md)。增加`conversation-source`只读资源、`source` v1节点的`manifest`/`read`操作、四个机器定义和`conversation-source-read-v1`必需能力。流程1.0、包2.0、SDK1.0及旧语义保持；不支持的客户端必须拒绝新节点/资源/能力，不能仅把枚举加入支持列表便声称已实现。

本版是通用来源使用能力，不新增招聘逻辑，也不生成SkillEvidence或AI处理覆盖。原0.33.0来源固定和完整性语义不变。已发布历史快照不改写；消费者从实际发布tag采用，安装、原生使用和模板独立复导分别取证。

## 资源、作用域及导出

模板及作者定义声明`kind: conversation-source, access: read`资源；入口显式列出资源与能力，节点binding指向该逻辑资源。宿主同时验证流程能力、入口能力/资源集合及资源类型/访问；嵌套条件/循环也同样检查。不得通过任意Value、脚本、同名key或原会话标题扩大读取范围。

本地资源值为准确ConversationArchiveRef，绑定到目标流程/实例，不进入可移植定义。UI按名称分页选择已登记且已确认的清单；保存对准确目标资源、修订和宿主预览做CAS核对。未确认候选不能选择；新实例、导入公开ZIP和新作者调试副本不自动继承私人来源。导出只保留资源声明，除去本地绑定、正文、路径和凭据。旧Run快照保留自己的来源，修改草稿或实例绑定不改变已运行范围。删除/撤销与来源引用保护、缺失行或无法核对原始资料时必须可见阻断。

来源后来追加不自动更新绑定。只读查看旧固定来源允许继续，UI明确展示当前性；生成最新Skill之前仍须本人固定并明确采用新来源。选择、准备、资源保存、清单及片段读取不调用模型。

## 节点与输出

- `source` v1 `manifest`：id/type/version/name/binding/operation，timeoutMs可选。输出ConversationSourceManifestOutput的version/source/manifest/current。current由宿主以原始会话和资料实际修订计算，不取模型或Renderer提供的布尔值。读取旧来源时返回准确false，无法取得记录与故障不能冒充false或true成功。
- `source` v1 `read`：以上字段及必需cursor（Value）；null表示从第1记录第0字节开始，否则为ConversationSourceCursor，可通过变量选择上一步next。输出ConversationSourceRead的version/cursor/chunk/next/done；只返回一个有界片段。next=null当且仅当末记录的末片段已返回，done与之精确一致。null重读从头不收费，也不计AI覆盖。

普通使用只需资源选择、表单和变量选择器；公开模板作者不得要求用户复制粘贴JSON游标或ID。结果UI按记录身份/角色/原文入口显示，机器编码和摘要可选高级查看。保留字、超深/循环/稀疏/非法Unicode/超预算JSON拒绝，不自动修复或裁剪。

## 无损编码与固定游标

format固定`canonical-record-json-v1`。每条完整ConversationArchiveRecord按既有package-format canonical规则编码为UTF-8，保留全部payload字段和原始字符串，包括本人失败输入、部分助手回复、重试、资料、角色/身份、unknown用量及历史更正。canonical只排序对象键，不重排数组、不去重、不选择消息或删除字段；分块只是传输表示，片段本身可能跨越JSON字符串或转义序列，不能当作独立JSON文档解析；普通UI不要求用户处理这种编码，模板的后续读取/合并必须保留片段元信息和完整原文。模型输入的角色/可信边界仍由模板和宿主处理。

每片段最多16,384个UTF-8字节。起点从0开始，每次选不超过该预算的最长完整Unicode标量前缀；禁止拆分代理对/UTF-8多字节标量、空片段或在记录边界拼入下一条。原1MiB记录的封装预算仍0.33.0规定的1MiB+4KiB，读取不得以单次AI预算截断它。单次输出最多131,072字节，包含JSON转义及身份。数字为安全整数；累计字节或片段数耗尽则停止，不回绕。

ConversationSourceCursor固定version/format/source/recordOrdinal/byteOffset/previousHash。previousHash始终是该原记录的前序记录摘要（首条为清单rootHash），同一记录内部多个片段保持它。offset必须是从0按上面固定算法迭代得到的真实分界；任意字节/Unicode边界不等于合法游标。宿主从固定来源取得真实行和前序行，核对archive/ordinal/链摘要及清单末行tailHash，不能仅信任调用者提供的hash或重新计算的外层摘要。

ConversationSourceChunk绑定同一来源/format、recordOrdinal/recordKind/recordHash、完整canonical记录recordBytes、byteOffset/byteEnd、正文text和sha256。sha256按既有canonical规则覆盖除自身sha256外全部字段。正文须等于真实原记录在该准确区间的UTF-8内容；自身摘要正确但伪造正文/起点/长度/角色仍拒绝。非末片段的next为同一记录和byteEnd；读完非末记录的next为下一序号、offset0、previousHash=当前真实记录sha256；末记录读完才next=null。记录缺失、摘要/顺序不同或预算超限时停止，不跳过。

参考ConversationSourceScan按首游标开始，只保留下一位置/累计字节/片段数。每次append要求调用者从权威存储提供真实行/前序行，核对本片段与实际记录，拒绝缺片段、重读、乱序、换源、跳首条或提前终点，失败不推进进度。finish只证明来源传输读取完整；来源清单必须事先已完整核对并登记，真实存储归属/授权、持久事务和模型处理仍归消费者。

## 实际AI覆盖另行接续

片段读完不代表模型处理。后续按真实模型请求输入、固定片段引用、Provider/model及宿主收据、合并结果和持久位置来核对覆盖；来源变化、部分/失败/unknown、取消、重开及迟到回复不自动重复收费。来源清单、读取统计和模型自述均不可以单独作为完整蒸馏证据。本人Key、预算、草稿编辑/手改保留、试聊、最终确认、写出读回与成功通知，以及独立公开模板复导仍须完成。

机器快照固定p1.schema.json、既有参考模块与新增conversation-source.ts、格式/关联资料及示例。G1格式/参考核对、实际tag发布、G2宿主/Worker/IPC/UI和真实个人生成分别记录；本README不声称客户端或Skill已完成。
