# P1契约0.35.0：固定来源的可恢复AI整理

2026-10-17，接续已发布0.34.0及[六状态Figma与UI流程](../../docs/client/source-reduction.md)。新增source-reduce v1和八个机器定义；提示词、结果字段与业务规则归模板，宿主提供有界请求、实际收据、原子检查点和完整覆盖。流程1.0、包2.0、SDK1.0和既有SQLite表保持；历史快照不改写，无旧客户端兼容层或隐式数据清理。

## 节点、能力与任务

节点含id/type/version、来源binding、aiBinding、instructions、schema、seed（Value）、maxRequests（1–16）；name/timeoutMs可选。schema为根object，指令不能为空白。必需source-reduce-v1、conversation-source-read-v1、ai-node-v1；入口须声明本入口conversation-source/read及ai/use资源，嵌套节点也核对。消费者必须实际实现权限、存储和执行，不能只放宽枚举。maxRequests默认8、仅为本批次数上限；每批运行有限，安全时间边界保存后释放运行槽。

宿主生成SourceReductionRef，任务归准确流程或实例/入口/节点；recipe固定provider、model、instructions、schema和解析后的seed，摘要绑定准确来源。改变配方或来源建立独立任务，旧记录保持；maxRequests不改变配方。只对seed解析Value引用，Schema/指令保持字面定义，不把Schema中的$ref误当流程变量。公开ZIP不带任务、尝试、草稿、来源引用、Key或私人seed；新使用者重新绑定自己的资源。

## 真实请求与响应

参考sourceReductionRequest从已登记来源、实际记录及前序行生成准确下一ConversationSourceRead，输入固定为format/source/manifest/fragment/prior；prior含上一检查点修订、摘要与完整accumulator。沿用16KiB连续Unicode片段，保留角色/未完标记；片段可能跨JSON字符串，不能当作独立JSON解析。客户端不内置招聘提取规则。

一次AIRequest（instructions/input/schema）最多196,608 UTF-8字节，accumulator最多65,536字节、32层/10,000项。配方schema最多64KiB；不支持异步schema。无效Unicode、非有限JSON/稀疏数组/保留键或超界均在网络前拒绝，不裁剪片段、跳来源或覆盖旧进度。既有planning适配器最多16,384输出token/120秒；这不是精确总token或费用上限。Provider/model及本人配置修订固定，无隐式重试和备用服务。

SourceReductionAttempt记录本机单调sequence、准确任务/检查点、run/nodeInstance、配置修订、实际AIRequest摘要、实际transport和完整AIOutcome。attemptId固定ra_加canonical({jobId,sequence})的SHA-256前32位，不允许重复身份改序号。sequence由宿主事务分配；被放弃尝试仍占用序号，不循环利用。requestSha256覆盖语义AIRequest，transport.sha256覆盖实际HTTP正文UTF-8；不能互相代替。

transport.body不含请求头/Authorization/Key；须为当前适配器的实际无图片/工具请求。参考sourceReductionWire规定两家既有请求形状及输出预算，sourceReductionTransport核对完整实际正文、语义输入和字节摘要。当前适配器采用JSON.stringify紧凑编码；重复键或其他不能无损重编码的正文拒绝。消费者在真正fetch前捕获/核对并持久化同一正文，再发送，不能自己重新构造一个相似记录冒充实际发送。Provider适配器未来改变字段须相应发布新契约。

prepared不代表发出；发出意图与实际正文先持久化后进入dispatched。完整成功响应进入response；响应不完整/结构失败进入failed，取消/超时/崩溃且结果不可靠进入unknown。旧尝试不再采用时为abandoned；完整原始响应可补记旧尝试，但不自动修改新草稿。记录由真实Provider路径产生，本参考模块不授权调用者或模型自报实际收据。

## 原子检查点与恢复

Checkpoint绑定job、revision、next、accumulator、chunks/records/bytes、chainHash、lastAttemptId和自身sha256。初始revision/chunks为0、原始seed和首游标一致；每个已采用完整响应推进一次。参考advanceSourceReduction只接受response，核对真实原行、请求正文、上一步数据及结果Schema；生成新accumulator/next及摘要链。宿主在同一事务中复核实际任务/尝试修订与活跃身份，提交新检查点及committed尝试。失败保持原值，重复回执不二次推进。

草稿摘要覆盖除自身sha256外的全部字段。chainHash关联上一链/检查点、准确attemptId、语义请求摘要、实际HTTP正文摘要、完整响应及片段摘要。原记录末片段才增加records，清单最后末片段才next=null。达到批次上限只返回ready，不假装complete；未知请求返回attention。重开/读取不发请求，进行中的任务须先核对未提交尝试。

response已落盘但事务未提交时，用户核对准确任务修订后可采用同一响应，不调用模型。无法恢复的unknown/failed须本人明确再试；单次授权绑定准确任务修订/尝试/未提交片段，新尝试取新sequence。旧响应迟到不能自动采用。原任务和实际收据属于本机登记数据，不接受Renderer/Worker任意对象作为权威；单纯通过JSON形状和哈希不构成真实性。

## 完整覆盖与Skill

SourceReductionCoverage从真实清单和seed开始，按已采用日志有序回放，每次重验实际片段/上一步草稿/实际语义及HTTP请求/完整响应。只保留当前检查点，接收递增已采用序号，拒绝缺片段、重读、重排、换源、提前终点。finish与登记的最终检查点完全一致且达到清单固定末尾，才生成SourceReductionProof。使用者必须提供宿主真实登记日志；自己构造数据运行参考模块不等于真实模型已处理。

SourceReductionOutput含任务/阶段/任务修订/检查点/待核对尝试/累计次数/已报告总token/未知用量请求/证明。reportedTotalTokens仅累加实际报告值，缺失单独计数，不填0；包括失败、取消、重试，同尝试一次。complete当且仅当检查点到末尾且证明与草稿、计数及链一致，无待核对尝试。摘要校验不能代替宿主完整日志回放与登记证明核对。

SkillEvidence新增source-reduction包装，携label和准确proof。Skill提案、编辑、试聊、确认、读取必须走宿主登记证明与来源当前性核对，不能把任意证明或SourceRef直接当事实授权。完整覆盖仅说明全部来源进入连续实际模型输入并取得完整结构化响应；事实准确性、手工修改、试聊与本人最终确认、发布写出及外发权限仍各自独立。

## 发布与消费者顺序

格式/参考核对、实际tag发布、客户端存储/Worker/白名单IPC/UI、真实本人Key整理与公开模板独立复导分开记录。消费者先拒绝未实现的新能力和Evidence，不自动转化旧14次来源或旧Skill。当前实现和核对范围以[本批记录](../../docs/client/source-reduction.md)为准；本README不代表已生成本人Skill。当前阶段不新增或运行应用单元测试。
