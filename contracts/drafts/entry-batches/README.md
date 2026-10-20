# 连续有限批次协议候选

2026-10-21，独立未发布候选，依据[先行18张Figma](../../../docs/client/finite-run-continuation.md#figma先行)及[决策核心](../entry-batch-decision/README.md)。当前客户端仍0.49.0，无已可用的连续运行接口；本目录先固定消费者必须落实的完整协议。正式包/作者Schema整合、发布版本、消费者、原生复导和真实业务均须分别取证。

## 声明和启动

正式版本拟向作者入口与标准ZIP清单入口增加可选`batching: BatchDeclaration`，要求该入口声明`entry-batches-v1`，严格验证本入口完整结果Schema的三个字段关系；没有声明仍是单次运行。SDK不新增任意启动Run的方法，流程核心及业务脚本不能创建后续Run。

复用现有`run.review.preview / run.review.confirm`，仅在selection中增加可选`batches: BatchLimits`。同一值参与预检签名、token和确认requestId指纹；普通单次协议保持。连续模式不接受debug=true、task、rerun、desktop/MCP/选区目标，此类一次性目标必须由用户按原路径重新核对，界面明确不支持。模板/作者的独立可复用入口才可声明连续模式；不能将普通无来源流程或定时计划静默转成连续运行。

预览在原RunReview的资源/影响/检查基础上返回可选`batches: BatchPreviewDetails`，明确固定来源、实际有限设置和停止边界。未支持或关系无效时ready=false、不给可启动token；保留单次预检入口。确认沿原requestId幂等：同指纹读取原第一Run，同ID不同指纹拒绝，不重复生成会话或Run。会话记录、保护快照、原flow-run-request和第一Run/链接/事件在同一事务登记后才dispatch。确认仍返回原Run，新增可选`batch: BatchRunReference`；响应丢失读取原确认请求，不重新创建ID。

## 稳定授权与每批网页观察

采用独立`stable-scope-v1`：固定当前Host进程nonce、原flow/编译结果/入口定义与映射、参数、配置修订与值、绑定、Skill/完整来源/结果引用、当前实例动作授权，以及目录/文件与浏览器的身份。稳定授权素材沿原RunReview.environment完整保留paths/browsers/template等；仅将embedded的临时resourceId/documentRevision/url/title/loading观察从跨批稳定摘要中分开。浏览器绑定/驱动身份不移除，桌面/工具/修复目标不能套用此例外。

首次准入保存AISettings.capture、LocalCredentialSettings.capture和原prepared结果引用守卫的进程内闭包，只保存不含Key的进程证明；每批及执行前调用原守卫。凭据或AI配置在等待时变更，即使又改回，也失效。重开没有原守卫，全部未终止会话记interrupted，绝不重建许可或自动续跑。

每个后续批次重新按原RunReview完整prepare捕获当前网页临时观察并前后核对，比较稳定范围、原flow与编译/上下文配置仍相同；保存这次完整原runReviewAuthorization，再正常进入原checkExecution，而不是复制第一批网页观察或省略检查。异步结束后与提交事务内都再次核对会话代次、停止标记、截止、来源和进程守卫。每批账户/岗位/日期与业务材料正文仍由模板严格复验，模型不能扩大范围。

目录绑定固定目录身份，不承诺冻结其任意内容；直接文件资源沿原文件身份/大小/mtime规则。需要固定简历正文等业务资料时，模板保存准确摘要并逐批复验，不把固定路径误称内容不变。新导出不夹带这些个人值。状态账本按原CAS推进，不纳入稳定范围的可变状态修订；配置修订及Schema始终固定。

## 调度、时间和唯一登记

同一实例或作者副本同时至多一个未终止连续会话；其他手动入口仍走原单槽/权限和数据CAS，不获隐式连续许可。会话`revision`及`generation`单调安全整数，后者在停止、失效、收尾决定及新批预检占位时推进；任何await前捕获后复核。每个(sessionId,ordinal)至多一个Run，(sessionId,ordinal,runId,scopeSha256)同事务登记且不可改写；保存前不能派发Worker。

当前批收尾确认并完成最终秘密处理后，才采纳本Run完整、固定Schema及来源校验通过的入口原值。新未决操作/失败/取消/收尾不明先停止；否则通过三字段读取决策。complete须绑定当前Run原值证明，不能从历史末步、投影或模型猜。review停止并保留原因。continue还要求进度摘要与上批不同；首批continue可作为初始进度，但下一批相同即停止。原未知记录不可借会话、日期或新的批次ID重放。

等待时没有Worker/浏览器租约，按原队列公平让出槽。tick只读当前进程许可并为下一序号占唯一预检位置；同一会话同时最多一项预检/准入，已提交但回包不明只读原链接，不重试新ID。预检已知失败停止；崩溃后任何未完成预检均interrupted，即使没有新Run也不自动补建。

limits没有默认值：1–1000批、60000–86400000ms调度时限、1000–300000ms批间等待。调度时限从第一次确认开始，以本进程单调时钟为准；以进程许可建立时墙钟与单调时钟的对应关系核对，两者相对漂移绝对值超过5000ms即停止新批并说明。updatedAt仍保留实际观察的墙钟，不靠时间排序或篡改回拨后的时间；界面按revision/generation和批次序号防止乱序。到达时限只停止安排新批，正在执行的原Run仍按原节点预算结束或由用户取消，不承诺在时限一到强杀当前操作。排队批次到期且尚未执行则取消其排队；执行前再次复核。UI必须写“新批次调度时限”，不能标作全部执行的强制最长时长。

完成依据与停止请求分别保留：新未决结果/失败或来源变化优先停止；无上述问题且已核验complete时可以记录completed，已保存停止请求仍可核对；否则明确停止、review、进度不变、限制到达均记stopped，不冒充目标完成。原Run的状态和完整结果不因会话终态改写。

## 白名单接口与停止回执

- `run.batch.get(BatchGetRequest) -> BatchSessionView | null`：只读准确会话，不启动/恢复任务。
- `run.batch.list(BatchListRequest) -> BatchSessionPage`：按flowId的固定ceiling/before游标列出会话；每次最多扫描200条、返回20条。空页仍可能有nextCursor，不能据此标无历史。当前revision是读取时状态，不是冻结旧状态。
- `run.batch.history(BatchHistoryRequest) -> BatchHistoryPage`：同样有界读取此会话的不可变Run链接，状态/名称从准确Run派生；链接不授予动作。不能整库扫描解密后再分页。
- `run.batch.stop(BatchStopRequest) -> BatchStopReceipt`：请求ID与会话、模式指纹固定；重复只读原回执，不能重复触发取消。两种模式是after-batch与cancel-current。先同事务持久停止后续和推进generation，再向明确原currentRun请求原取消。后者回包不明保留needs-check，不换ID或取消别的Run。

停止回执的nextBatchesStopped=true仅表示后续安排已可靠失效；currentCancellation分别是not-requested/requested/already-terminal/needs-check，绝不把请求已接收写成Run已取消。停止已结束会话保持原终态与依据，回执可记already-terminal。等待/预检时停止立即stopped并令迟到预检失效；活动批次after-batch为stopping，原批结束后再定终态。全局退出、休眠及存储失败先使许可失效并阻止下一批；原Run收尾按原规则，重开只有历史核对。

## 数据、显示与引用

逻辑记录为受保护的batch-session、batch-session-private、batch-run-link、batch-stop-request，沿现有加密KV/宿主唯一写入，不新增Worker数据库通道或SQLite DDL。秘密、原参数、当前目录路径、完整控制原值及初始授权素材只存在私有保护记录，公开视图的live仅表示当前Host仍持有本会话监督许可，不等于Worker已执行；历史活动态或故障时live=false，UI须显示“最后保存状态”而非宣称仍在运行。公开视图只返回有限摘要、可读名称和经最终秘密集合保护的说明；进度只公开摘要。历史页不携带Key或完整结果，结果继续通过既有准确Run阅读。

会话与Run、固定版本/模板实例/作者副本/结果/Skill引用按现有引用保护登记；有引用的原Run/版本不可单独清理或卸载，普通UI说明被连续运行记录引用。v1不提供隐式历史删除或自动截断；显式开发数据维护仍按原预览/保留规则处理，不在启动时清库。会话/许可/历史不进入公开ZIP或其他实例，导入不能带来运行授权。

单批预算依然是独立交付条件：此协议不增加8MiB或1000项限额、不裁剪结果，不保证5项总能执行；必须另做新外部动作前的预算计量/空间保障、完整持久化与安全结束批次。正式发布及消费者采用、原生多批/竞争/失败/退出和可视化导出复导均未完成；BOSS150次真实网站弹框、回复后附件和有序聊天不能由本协议替代。
