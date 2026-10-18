# Skill 更新字段核对草案

状态：**未发布、不可由客户端采用**。本草案不分配后续发布版本，不建立tag，不修改已发布0.36.0或其他固定快照。先行设计、实际缺口和宿主义务见[更新规格](../../../docs/client/skill-update-review.md)。

`wire.schema.json`给出语言无关的Content/State/Target/Field/VersionRef/Review/Selection/Apply/Receipt定义，[examples.json](examples.json)包含虚构正反格式资料。`reference.mjs`是无应用依赖的纯比较/应用参考，不是宿主、IPC或授权实现。公开包只携带节点和业务提示词，本文中的提案、核对、选择、私人内容与回执均为本机数据。

## 候选节点与私有接口

正式发布时新增Skill v2 `operation:propose-update`及`skill-update-review-v1`，独立于v1。节点输入仍用已有Value引用：工作区逻辑binding、准确父base、候选title/markdown/data及新来源evidence；key从实际父版本取得，宿主读取并核验父内容，不能信任调用方提供基线。来源沿现行已发布SkillEvidence格式和真实性校验。来源格式/覆盖不保证模型事实或手工保真。

提案保存原基线和模型建议的独立不可变加密记录，普通可编辑草稿初始等于父内容并保留父来源。父确认头变化、工作区不一致或外部文件未核验时进入冲突处理。新建议与父内容完全相同、且没有可应用内容时返回独立无变化结果，不创建重复版本；其正式节点输出需在发布时与现有SkillProposeOutput区分，不能伪造已保存的新版本。旧v1提案不回填无法追溯的“原模型建议”。

候选白名单`skill.update.review`严格接受Selection，仅按宿主已登记提案及当前草稿读取；`skill.update.apply`严格接受Apply，仅从宿主registry按reviewId取原核对。比较不收费；应用只改草稿，不能被Worker、脚本或模型用于最终确认。最终确认继续使用原Skill保存协议及本人操作。

Review绑定proposalId/revision、epoch、base（key/versionId/sha256完整引用）、三份内容摘要、sourceSha256和workspaceRevision、生成/失效时间及字段列表。sourceSha256必须来自实际已核验来源集合，workspaceRevision来自工作区/当前头/外部文件的宿主观察；两者不是Renderer或模型自报。期限最多五分钟，不能自动刷新或沿用旧选择。

## 比较语义

完整可编辑Content包含title/markdown/data，来源单独核验。State用present区分不存在与显式null。Target是area和**自有对象键段数组**，不是字符串表达式/RFC6901/变量引用。data路径至少一段；标题与Markdown的路径为空。数组是原子项，不能以相同值或下标猜记录身份。

仅当三份对应值都存在且都是普通对象时递归；否则新增/删除/类型变化或数组按整项处理。字段状态：

| 状态 | 条件 | 操作 |
| --- | --- | --- |
| candidate | 当前与基线相同，建议不同 | 可选，replaceManual=false |
| conflict | 当前与建议各自不同于基线且互不相同 | 默认不选，单项明确replaceManual=true才可采用 |
| manual-only | 建议等于基线，当前已修改 | 不可选，保留当前 |
| already-applied | 当前等于建议，且基线不同 | 不可选，无需再应用 |

三者相等不列项。字段ID对target/三份State/status整体canonical SHA256，不是授权或模型提供的ID。目标互不包含，选择中重复/未知/不可选字段或错误的replaceManual标记拒绝。未选择默认保留当前；应用从**当前**内容复制，不从建议重建。JSON别名的内存共享不扩散到未选字段，特殊对象键只作字面量处理。

## 格式、预算与原子确认

先检查有限JSON、UTF-8/Unicode、结构与字节预算，再运行递归Schema校验。每份Content沿用1MiB、32层、10000值，title最多200、Markdown最多60000个UTF-16码元，均不得仅含空白；配对补充字符占两个码元，不能仅靠Schema的Unicode字符计数放宽宿主限额。每个对象键同样最多1024个码元。Review最多256字段和4MiB、40层、40000值。任意超限拒绝完整核对，不偷偷省略变化；这些是设计预算，消费者采用前须核对真实IPC、数据库与UI开销。JSON中-0按0、对象键按UTF-16码元序、数组保序、字符串不归一化计算canonical摘要。

Apply只含version/proposalId/revision/reviewId/reviewSha256/requestId/choices/reviewed。宿主先按requestId查询完整已提交回执；同内容重复返回原结果，不因过期/重启或当前草稿后来变化而再次应用。没有可靠回执时按原registry与当前实际上下文验证，事务中只应用所选字段、追加真实证据、推进一次草稿修订并保存请求摘要/回执；没有内容变化时修订保持。模型、脚本和调用方都不能扩大选择范围或替换当前草稿。

Receipt的changed、revisionBefore/After与contentSha256须对应实际事务结果；changed=false时修订不变，changed=true时只加1，且不能超过安全整数。相同requestId不同完整确认内容拒绝，确认丢回包/存储故障不能按“未应用”自动更换请求。原子事务、审计和回执真实性属于消费者责任，纯参考模块不保存数据或伪装验证它们。

`projectApplication`只计算所选结果与预期回执，尚未持久化，不能作为成功通知。`matchCommittedReceipt`只核对**宿主按提案/请求查出的可信已提交回执**与完整确认内容是否关联；不接收当前草稿或时间，便于先于过期检查处理真实重复请求，但不会证明调用方提供的对象确实来自Store。选择数组保持原顺序参与摘要，同请求身份改变顺序也不能被当作完全相同的确认。

人工编辑、来源/父版本/工作区变化、重启、过期以及发布/unknown等不可编辑状态均使新应用失效。应用后旧试聊与发布预览失效；只有完成最终写出/登记才通知成功。现有Run/版本/模板绑定不被本草案修改，个人Skill、历史、Key不进入公开ZIP。

## 正式采用门槛

正式发布必须补完整v2节点/输出、能力及既有Skill真实性/来源/提案状态关联，而非只把本独立格式加入客户端。随后核对原子创建/应用、CAS、并发/迟到/取消/重启、重复确认、无差异、手工冲突/空值/数组/特殊键、来源/目录变化、字段和读取预算、独立原生制作导出与复导、最终文件保存/通知和旧引用。真实用户付费重试仍需既有待答复批准，不因新增协议而恢复。

## 本机参考核对

2026-10-18，使用虚构资料直接调用参考模块及现有Ajv 2020：20组关联观察、21份正反格式资料全部通过。包括扁平分类/嵌套手工内容保留、逐项冲突允许、数组与类型原子项、缺失和六类空值、全部当前性字段、过期/回拨、自洽伪造核对、特殊键、内存别名、有限JSON、字节/结构/256项上限、摘要、回执关联和安全修订上限。未新增或运行单元测试；未调用模型、访问用户历史、修改生产数据或运行客户端。本结果不证明宿主原子事务、实际幂等、原生UI或业务验收。
