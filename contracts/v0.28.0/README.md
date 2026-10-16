# P1契约0.28.0：结构化AI请求结果与显式失败分支

2026-10-16，接续0.27.0。JD/来信入口需要在模型鉴权、限流或格式失败时进入模板自己的提醒分支；现行ai v1直接抛错，后续节点不会运行。本版增加ai v2和ai-outcome-v1，只识别通用请求故障，提醒与业务选择仍归模板。设计见[四状态Figma与实施门槛](../../docs/client/ai-failure-outcome.md)。这是先行G1，客户端采用和真实请求另验。

## 节点与结果

ai v2沿用id/name/timeoutMs/binding/instructions/input/schema，新增必填failureMode，仅stop和result。新建默认stop；作者明确选择result才允许把请求失败交给后续步骤。流程与所属模板入口同时声明ai-node-v1及ai-outcome-v1；不支持v2/新能力的消费者在执行前拒绝，不能忽略策略按v1运行。

两种策略的成功形状一致：AIOutcome的`{status:"success",result:AIResult}`。后续先判断status，再读取result.output。result策略遇到受控请求故障返回AIRequestFailure：`{status:"failed",provider,model,requestId,usage,error}`，没有result/output/部分正文。stop策略遇到相同故障仍终止Run，不返回可供后续采用的失败值。result不自动建立提醒、重试或执行动作。

v1节点、原AIRequest/AIResult和SDK1.0的ai.generate保持原义；公开包和旧Run不改写。新建v2或明确改用v2须调整所有后续output引用为result.output并检查分支，不静默迁移。schema只约束模型output，状态包装由宿主产生；输入/模型自报status、error不能成为宿主成功状态或扩大权限。

## 受控请求故障

error严格包含code、固定中文message和实际httpStatus或null；Schema逐项约束文案与HTTP关系，不含服务正文、堆栈、资料、Key、任意cause。分类由供应商适配器在明确阶段产生，宿主不对任意异常正则分类或统一吞错。

| code | 来源与HTTP |
| --- | --- |
| authentication | 已发起请求得到401/403；本机缺Key不属于本项 |
| rate-limit | HTTP429，不自动重试或按Retry-After重发 |
| http | 其余非2xx，排除401/403/429；不解析错误正文 |
| network | fetch/响应体网络失败；状态未取得为null，已取得2xx可保留 |
| request-timeout | 请求自身等待期限，当前标准45秒；状态未取得为null，已取得2xx可保留 |
| refused | 明确拒绝或内容过滤，无可用正文 |
| incomplete | 截断、输出上限、未完成状态或服务明确未完成，不采用部分JSON |
| invalid-response | 响应JSON/结构、完整输出JSON或输出Schema校验失败 |

refused/incomplete/invalid-response取得HTTP时只能是2xx，否则null。适配器实现异常、类型错误或本地记录错误不能猜成网络/格式失败。没有取消、节点期限、存储、权限或未知兜底分类。

## 生命周期与捕获范围

宿主先核对真实活动Run、不可变节点快照、调用身份/重复调用、绑定与权限、指令/输入/Schema、配置修订及受保护Key，之后才发请求。Key读取、本地Schema编译和上述检查在请求故障捕获之外；失败不能返回AIRequestFailure。重入拒绝，既有取消墓碑保持。

取消、节点/祖先期限、休眠、退出、失去所有权或运行撤销优先。收到成功或受控故障后，在记收据及返回前重新检查取消和所有权；失败中断，不为写提醒吞掉取消。默认60秒的节点总期限包含前置读取/调用/返回，原NodeDeadline保持；请求45秒与节点期限谁先实际触发按对应原因处理。短节点期限不能等到请求超时后返回失败。迟到结果/错误不推进后续节点，不接收旧调用回执。

收据写入在故障捕获之外；存储失败沿原Run故障/中断报告，不转换模型故障后继续，不自动重试请求/收据。取消前已提交本机数据保留，未确认外部副作用仍按原规则核对。

## 元数据、用量与持久化

provider来自显式绑定。model采用合法实际响应模型，否则采用已核对请求模型；限定ASCII标识1–100字符，不接受对象/控制字符。requestId只接受1–200字符ASCII字母/数字/下划线/点/冒号/连字符，不能从错误正文猜测；可取合法响应ID或HTTP请求ID。未取得或不合法时，失败/收据用null；成功result保留AIResult的空字符串表示未取得。

AIUsage只保留Schema声明的非负安全整数计数及有限明细，包括input/output/prompt/completion/total、缓存及推理等。未知字段忽略，非法计数不采用，空明细忽略；没有可靠计数为null。明确0可保留，未知不补0，不用局部计数推算总计。最多4KiB UTF-8；超限置null，不截断。响应JSON可读但正文截断/格式不符时保留已经取得的合法ID/模型/用量，不能一律丢弃已有消耗证据。不据此推算账户额度/成本。

成功AIOutcome.result在AIResult上增加安全模型/请求ID/AIUsage约束，不改变旧AIResult。AINodeReceipt为成功有界元数据或完整AIRequestFailure，绝不含output/result/部分正文。新事件ai-outcome沿既有runId/nodeInstance/seq身份和加密持久化；v1的ai-result保持。只有宿主适配器及生命周期核对完成才登记，Worker/模型同名数据不成为可信回执。

完整AIOutcome沿原受保护输出通道保存，元数据事件按原脱敏/有界展示。status=failed显示“请求失败，已交给后续处理”，不能把节点完成或Run成功处理失败分支显示成“模型请求成功”。Run终态保持SUCCEEDED/FAILED/CANCELLED/INTERRUPTED；处理失败分支后SUCCEEDED仅代表流程完成。重开/查看不调用模型或自动补跑分支。

## 版本与验证

新增AIRequestError、AIRequestFailure、AIOutcome、AINodeReceipt、AIUsage及ai v2；保留0.27.0资料。Flow1.0、ZIP2.0、SDK1.0、IPC调用形状及SQLite通用表不变。不回填旧Run，不自动升级包/节点/引用，不做旧客户端迁移或隐式清库。能力须覆盖导入、作者带回/导出、复制/保存及预检，不能只增加动作库选项。

`ai-outcome.cases.json`是语言无关格式正反例，样例均虚构。流程样例用原condition/value节点读取成功正文或失败码，不发送消息或建立真实提醒。格式通过不证明生命周期、网络、持久化、取消或UI。发布不可变tag后消费者再固定采用。

G2补配置、明确v1/v2路径、变量/结果/事件展示、能力推导及类型化故障。当前不新增/运行单元测试，使用类型/构建及受控人工矩阵核对成功、八类失败、元数据、两策略、短期限/取消/迟到、缺Key/权限/失去所有权、存储故障、导出复导/重开和原v1保持。受控响应不计真实Key/API通过；真实蒸馏、登录JD/会话/外发另验。
