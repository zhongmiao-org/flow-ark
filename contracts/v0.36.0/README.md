# P1 契约 0.36.0：来源整理运行核对（未发布）

2026-10-17。接续不可变 0.35.1，新增八个定义及 source-reduction-review.ts。流程 1.0、包 2.0、SDK 1.0、source-reduce v1 和既有能力保持；核对协议仅用于本机宿主与客户端，不新增业务节点或可移植权限。没有发布 tag、客户端采用或真实模型完成证据。先行设计与消费者门槛见[运行范围核对](../../docs/client/source-reduction-review.md)。

## 格式与来源

SourceReductionReviewSelection 只含原 Run/节点/节点实例和 jobId。宿主按实际 Run 快照和登记索引解析，核对原 Run 已终止且不忙、任务所有权、来源可用和当前授权；不能接受客户端提供的任务正文或自行算出的范围。nodeInstance 为完整精确身份，最多 4000 字符，循环/嵌套实例不能折叠为节点 ID。

SourceReductionRunReview 由宿主生成，字段全部必需且不允许额外属性。最多 32768 UTF-8 字节、2000 个遍历值、16 层；字符串必须有效 Unicode，数字有限，数组连续，不接受循环对象或保留原型键。createdAt/expiresAt 为规范 UTC 毫秒时间，期限大于 0 且不超过十分钟。reviewId 与本进程 epoch 由宿主随机生成，至少 128 位随机性，不从 Renderer、任务 ID 或时间戳推导。

- target 指原运行中登记过的准确实例；mode 固定 snapshot。executionVersionId 是实际执行版本摘要；snapshotSha256 是宿主对归一化执行快照（流程、绑定、授权和固定依赖，不含 Key）的 canonical JSON SHA-256。预览和确认按同一规则重算，同时核对当前授权；历史快照不是永久授权。
- job 来自实际任务；jobRevision 与 checkpoint 修订分开。checkpoint 仅投影 revision/sha256/next/chunks/records/bytes，不包含 accumulator。fragment 是真实下一次 conversationSourceRead 的 chunk 去掉 text，保留原始 sha256；不能对删字段后的投影另算 chunk 摘要。宿主使用真实清单、记录及前序记录核对，不接受自报 hash 作为读取证据。
- ready → continue-batch/requestLimit=batchLimit；attention → retry-one/requestLimit=1；complete → use-complete/requestLimit=0。batchLimit 始终是固定节点 maxRequests（1–16）。running/未回收任务不得预览。attention 必须有准确待处理尝试，允许 prepared/response/failed/unknown。hasSavedResponse 仅在实际 state=response 且完整响应通过既有校验时为 true，界面优先提供零调用采用入口，不把 response 当作已采用。
- complete 必须没有 next、fragment 或 pending，且已有 0.35.1 完整覆盖证明。其他两态有真实片段；片段对应准确 next，范围不超过 16384 字节。预览或摘要不能成为覆盖证明。
- provider/model 来自实际任务配方；configurationRevision 来自当前 Key 配置元数据，不读取 Key。非 complete 不允许 null；complete 可以为 null，读取已完成结果无需配置 Key。完整流程其他节点的 AI 需求独立检查。
- attempts/reportedTotalTokens/unknownUsageRequests 来自真实日志累计，包含失败/取消，未知不补零。requestScope 固定 source-node-instance、runStartsAtFirstNode 固定 true；上限不代表整个流程、token 或金额上限。
- sha256 为除自身字段外整个对象的 canonical JSON SHA-256。预览不含片段正文、请求/响应正文、seed、指令/Schema、草稿或 Key；这些仍留在宿主原任务中供当前性核对。

## 确认、回执与执行

宿主在有界临时登记中保存完整预览。SourceReductionRunConfirmation 只含 version/reviewId/reviewSha256/requestId/reviewed=true；须查到本进程原登记，再核对实际原目标、来源/任务/检查点/待处理尝试、解析后配方、执行版本/快照、Key 配置修订和当前权限。摘要不是签名或授权，不能把自洽的 Renderer 对象当成宿主登记。

创建唯一新 Run 的同一事务中保存 SourceReductionRunReviewReceipt：原完整预览、requestId、新 runId、confirmedAt 和除自身外的 canonical SHA-256；确认时间位于 [createdAt, expiresAt)。同 requestId/同内容幂等返回同一 Run，即使后来过期也不能新建或补发；相同 requestId 的不同内容拒绝。一个 reviewId 只能绑定一个新 Run，取消不会释放为可再次使用的许可。回执、预览、任务进度均为本机私有登记，不进入公开定义或 ZIP。

以下义务必须由消费者执行，参考格式校验本身不能保证：

1. 目标节点解析动态 seed 后，在创建/切换任务、读 Key 和请求之前，比对原 job/source/recipe。变化即停止，不能静默创建新 jobId。原 Run/节点实例与新 Run 映射来自登记回执，不能以相同 nodeId 或另一个 Run 借用。
2. 新 Run 首次登记目标批次启动时，再核对未过期、epoch 相同且原预览仍当前，原子消费许可。重启后的未启动/在途批次不自动继续付费，记录保留并需新核对。目标启动后的同一有限批次按固定 requestLimit 执行，并逐次复验当前授权/配置/检查点归属；正常推进检查点不要求重用原始修订。旧批次不得并发或第二次启动。
3. retry-one 至多登记一次实际发出，不因失败、取消、未知或下一片段而自动调用；continue-batch 最多原节点 maxRequests。实际意图、计数、收据及检查点沿 0.35.1 分层保存。有效期内已发请求的完整响应可在到期后按既有 CAS 提交，不能因到期丢弃已付费响应。
4. 此许可不覆盖其他来源实例。重跑从首节点执行时，其他来源实例只有已登记完整结果可零调用返回；需要新来源请求时阻止并另行核对。不能静默重放或注入中间结果。其他普通 AI/文件/网页节点继续自己的权限与通用重跑核对，不能声称整个 Run 只调用一次或没有副作用。
5. 来源/配方、配置、任务/检查点/待处理尝试、授权变化及过期必须显式提示重新核对，不自动刷新并保留旧勾选。切换当前保存流程是另一项完整核对，不能悄悄切换。零调用采用 response 与另发付费请求是两个明确动作。

## 参考实现及交付

createSourceReductionRunReview 从调用方提供的宿主真实资料校验来源、配方、检查点、片段和待处理请求后投影；assertSourceReductionRunReviewCurrent 在确认/首次发出前重新生成并完整比较；确认/回执函数只负责格式与关联。调用方仍负责所有权、登记查找、事务幂等、epoch、唯一 Run、调用计数和网络入口。

example.source-reduction-review.json 全部采用既有合成来源，包含三态、一次确认及新 Run 回执，不含个人资料或真实 Key。继承的机器文件与 0.35.1 保持逐字节一致（仅 p1.schema.json 的版本与新增定义变化）。生成器 ../build_source_review.py 从固定 0.35.1 复制继承资料并生成本草案 Schema；新增参考模块、示例和本文按本版本维护，封存后不可改写。

当前不新增/运行单元测试。本批参考类型检查和受控合成调用另记录，不代表客户端、本人整理完成、Skill 保存或 BOSS 验收。实际经 PR/最新 CI 合并并发布固定 tag 后，消费者再独立采用；计费门槛不能用手工合并绕过。
