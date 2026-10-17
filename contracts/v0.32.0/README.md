# P1契约0.32.0：持续会话与固定确认快照

2026-10-17，接续0.31.0。按[持续访谈完整边界](../../docs/client/continuous-profile-interview.md)及现有十状态Figma，增加通用conversation v2、按请求保存的持久历史、有界上下文核对和不可变确认快照。没有访谈总次数/总消息数上限；每个请求、对象和读取窗口仍有资源预算。个人事实字段、求职访谈、Skill更新规程和BOSS业务继续归模板。当前仅G1；实际发布tag、客户端采用、可视化制作和业务另验。

流程1.0、包2.0、SDK1.0、v1节点和旧确认来源不变。新节点流程须声明`conversation-v2`和`conversation-checkpoint-v1`；正式模板入口另外沿用`conversation`/`ai`及本入口的ai/use逻辑资源，不借用其他入口授权。采用新来源的Skill流程须声明conversation-checkpoint-v1。未知必需能力/节点版本在执行前拒绝，不静默退成有上限的v1。SkillEvidence新增`conversation-checkpoint`分支，不改写已发布快照。SQLite仍使用现有加密documents/events表；新增记录类别不构成启动迁移，不清库、不改写旧Run或确认记录。

## 节点、归属与创建

conversation v2保留binding/key/title/instructions/input，移除maxRequests，增加historyWindow（1–24个完整问答，作者建议12）。historyWindow只是单次选择上限，不是累计访谈次数；实际每轮选择在发送前可读。key求值须为1–100字符非空文本。AI资源仍是当前入口明确绑定的用户服务/模型，Key不进入节点或持久正文。

与v1相同，宿主以正式实例或普通流程作为scope，作者副本使用其独立调试身份；scope+key稳定关联一个持续会话。不同实例/普通流程不靠相同key合并。不以模型猜测用户或业务名。运行只创建/读取会话和当前输出，立即释放Run；不等待用户、不自动发模型请求。

初次创建保存ConversationContext和ConversationThreadSnapshot，origin=null、计数为0、无活动请求/确认/资料提议。相同来源重跑读同一记录。title/provider/model/instructions/context或historyWindow变化时，不隐式新建丢失历史，也不直接替换当前来源：保存来自本次固定Run的ConversationContextProposal，设置contextProposalId并使checkpointCurrent=false，返回context-review。已有不同待核对提议时拒绝覆盖，保留双方内容；同一提议幂等读取。生成期间不更新来源。

用户可以核对差异后采用新资料，或明确继续使用原资料。采用使用当前head修订CAS核对提议身份、base和来源Run，原子切换context引用/historyWindow、清除提议并保持全部历史/输入；旧确认仍可查但不再是当前输出。拒绝提议保留原context与记录，重新按实际历史/草稿判断旧确认是否仍可用。提议的revision是创建时head修订，可因保存输入落后，不能当成采用时CAS；采用仍须当前修订。失败不丢输入或自动接受新模型。

用户界面可显式把已确认的普通v1会话作为持续会话起点。宿主从自己的受保护Saved/确认快照取得scope、key、指令、上下文与真实ConversationEvidence，拒绝未确认/内部试聊或已有不同持续档案的键冲突；创建v2记录时保留原sessionId。旧v1记录、消息/请求ID和确认摘要完全不变，origin仅固定其引用；不把旧历史重新写成伪造v2请求。原始历史通过旧只读结果仍可查看，选择origin请求时核对真实原快照。此操作不调用模型、不新增Run、不改变旧流程/版本；已有v1节点输出继续是原v1来源，作者须明确改用v2才能消费后续确认。重复继续返回同一档案，不暗中合并多个来源或跨实例资料。

## 上下文、历史与摘要

ConversationContext固定version/id/flowId/nodeId/title/provider/model/instructions/context/sha256。sha256为UTF-8 canonical（递归键排序、保留数组顺序）去掉id和sha256后的完整对象摘要；id仍单独精确匹配，不按内容相等替换身份。每次采用来源固定新引用，历史请求保留原引用和实际发送内容。材料不直接随每次head事件广播，详情按准确引用读取。

v2新请求的完整发送快照ConversationThreadPrepared在调用模型前保存，包括input身份、head修订、历史尾部、context引用、选择、text、retryOf和完整input。input为provider/model/instructions/context/messages；context严格为`{value:固定context正文,history:{sessionId,count,sha256,origin,selection}}`，messages为宿主解析出的已选完整问答role/text加本次用户text。实际发送与该对象逐字段一致，不能加入未核对内容或漏发后仍标“完整历史”。sha256为去掉sha256后的完整Prepared摘要，包含id与修订。Key只在请求时通过原受保护存储取得。

ConversationHistorySelection最多24项且不超过historyWindow。origin引用原v1的真实requestId；history引用本会话终态条目的ordinal/sha256。原来源在前，之后v2条目按ordinal递增，无重复请求/轮次。仅选择完整成功且匹配用户/助手身份的问答；失败/取消的部分文本保留供查看，但不伪装完整上下文。默认建议最近完整问答，必须显示全部历史仍存在、本次选中/未选范围、固定资料及费用；用户逐轮明确核对后才发送。单次超限时让用户调整，不静默截断、删史、用未知摘要覆盖事实或自动付费总结。需要较早事实时明确选入或采用经确认的Skill内容；“未提供”不能被模板解释成“已撤回”。

每次终态请求保存一个ConversationThreadEntry：原用户/助手消息身份、turnId、requestId、text/answer、完成/失败/取消、模型/用量/供应商请求身份、input引用/摘要、context、retryOf、错误和规范UTC时间。条目终态后不可修改，重试使用新请求和助手消息身份、同一turn/userMessageId并引用最后失败/取消请求；旧部分回复与用量不覆盖。未知用量null，不能填0或把推理token重复相加。新用户文本新turn，不能编辑原始回答或仅凭新正文自动确认事实。

ordinal从1连续增长，仅计v2终态请求；origin原请求另外展示，不冒充v2新增收费。previousHash为前条sha256，第一条为canonical(`{version:2,sessionId,origin:<去掉显示label的真实来源身份或null>}`)摘要。条目sha256覆盖除自身sha256外的全部字段。head.historyCount/historyHash指向终态尾部；requestCount=historyCount+活动请求数（0或1），turnCount仅新用户轮次增长，重试不增长。origin不在这些v2计数里，界面累计统计须另加真实原会话数据并说明范围。

不持久保存无限数组或每轮扫描全部记录。宿主按会话/ordinal、会话/requestId和上下文/input/checkpoint身份直接取得受保护记录，用独立幂等索引查重；不能因从有界页面找不到旧requestId而重发。终态条目、历史尾部、请求索引和head在同一本机事务登记。错误/取消/崩溃恢复只固定当前已持久化部分为同一取消终态，不自动重试；事务已完成就不再追加第二条。存储故障关闭新工作，不报告已保存或清除未保存输入。

## 有界分页与onmessage

ConversationThreadSnapshot只含当前来源引用、计数/尾部、活动请求（或null）、最近终态条目（或null）、输入、最新确认引用/当前可用性、提议身份、修订/序号和错误，不携带全部历史。status=draft仅初始无v2历史；generating恰有一个active；ready/failed/cancelled匹配最近终态。新消息、待处理来源、活动请求或未保存输入使当前输出不可确认；旧快照仍保留。没有将整个持续档案设置为永久confirmed的状态。

onmessage发布`conversation.thread.snapshot`；eventId固定`thread:<sessionId>:<sequence>`，sequence与持久head一致，requestId/turnId取active或最近条目，均无则null。每个会话独立单调，异步持久/发布前捕获不可变副本；UI先核对身份/顺序，去重并处理缺口/重新读取。v1事件类型不同，不混入同ID的v2归并。头部刷新与历史分页独立；旧历史页不能覆盖当前输入或active，重连只恢复展示。终态取消、旧请求/旧订阅的迟到分片或回执不写入新消息/确认。

历史游标为sessionId/before/sha256：before指下一条不包含的ordinal，sha256为before-1条的真实尾摘要。首个游标为head.historyCount+1/historyHash；后续按返回next，不用当前head替换旧游标。每页最多20条，按字节预算从游标向前取得一个连续尾段，再以ordinal升序返回；next为最早条ordinal/previousHash，已到1则null。空页仅允许before=1且摘要等于起始摘要。校验条目摘要、相邻链、游标与边界；宿主每次从本会话真实记录核对游标摘要和范围，不能相信Renderer伪造的页。追加新请求后旧游标仍有效，不因全局列表变化跳号/重复；不在正常分页时删除记录。

输入max4000字符、助手max100000字符（字符预算按UTF-16码元计，Schema之外还须核对非BMP字符）；单个head/context/prepared/entry/checkpoint/输出最多1MiB，历史页最多2MiB且20条，JSON深度40/值50000，单次模型请求120秒、现有输出限制与取消规则保持。大小以严格UTF-8的JSON字节计算，不把字符数当字节。head最多一份active和一份lastEntry，可在预算内呈现终态切换；不以总历史长度阻断新轮次。单会话串行，同一宿主v1/v2/试聊共用最多四个活动会话请求，不用分服务绕过；等待用户不占槽。安全整数、磁盘容量和单对象预算是实际资源边界，不是访谈题数/终身请求额度。范围耗尽停止并提示，不回绕身份/序号。

## 核对、重试与确认

预览由宿主从真实head/context/已选条目构造Prepared，保存并返回可读范围；绑定本次text、retryOf、修订和摘要。发送还须用户明确费用/范围核对和宿主生成的最长5分钟一次授权，绑定Prepared身份/摘要、当前修订与凭据配置修订；Key/模型配置变化则重新核对，授权不能由Worker、模板或模型调用。采用CAS的当前修订与Prepared一致、没有active/待处理来源时才登记一次请求并调用自己的Key。重复requestId先查持久回执，同内容只读取；不同内容拒绝，即使修订已变化或Key被移除也不创建第二次请求。回执未知保留输入并核对原requestId，不能换ID当作自动重试。

显式重试只针对最后未完成轮次，text与该轮相同，使用新Prepared/授权/requestId，保留旧失败历史；历史选择可在新预览中核对。新请求的未完成助手正文不进入其他模型请求或确认。取消立即撤销当前身份，再回收；迟到输出不改变终态。更新上下文、切换会话和重新打开均不会自动发模型请求。

用户确认当前结果时，宿主固定ConversationCheckpoint：id/sessionId/title、确认前sourceRevision、完整历史尾部、固定完整context、origin、明确selection及所选完整transcript、确认时间/摘要。必须无active/待处理来源/输入，最近v2请求为complete（或尚无v2请求而有真实confirmed origin），选择非空且包含最近完整轮次。transcript逐消息保留messageId/requestId与原文；确认只固定本次所选来源，不把所有模型回答认定为本人事实，也不保存Skill。sha256覆盖除自身sha256外全部字段。

确认使用当前修订/选择/正文与宿主来源核对，并以幂等请求在事务中登记checkpoint和最新引用。重复确认相同来源/选择不凭空生成版本；继续补充后head仍可编辑，旧checkpoint与证据保持。ConversationCheckpointEvidence固定kind/label/sessionId/checkpointId/sha256；显示label可编辑，其他必须与本机不可变checkpoint逐项匹配。hash证明来源内容一致，不证明事实真实。

当前输出ConversationThreadOutput为pending/confirmed/context-review之一。仅checkpointCurrent且来源尾部/context匹配、无提议时，confirmed返回该确认的准确transcript/evidence；其余正文为空、evidence=null，context-review含真实proposalId。新回答或采用来源后不把旧确认套作新结果，旧Run输出仍是当时固定内容。宿主查原checkpoint可独立验证历史来源；新建Skill草稿、最终预览/发布和新试聊准入还必须核对它是当前来源，不能只看到不可变hash就忽略新补充。已经存在的草稿允许保存本人手工修改：先验证历史证据本体，再将不再当前的来源标成conflict并撤销旧确认/试聊准入，保留全部编辑和明确提示需更新来源，不通过丢弃输入或伪造手工来源恢复。已经登记的旧Skill/Run读取不追认最新事实，也不重写其版本。

## 采用边界与后续

`continuous-conversation.ts`是语言无关JSON格式/身份/摘要的参考语义；真实归属、授权、Store事务、预览令牌期限、供应商传输/用量、取消和文件写出由宿主独立完成。Schema/格式用例不是产品行为测试。Renderer仍只用静态生成校验器和白名单IPC，不运行AJV动态编译或持Key直连；Main不承载编排/业务流程。

公开包只带通用节点、逻辑AI绑定和模板自己的规程，不携带thread/origin/checkpoint/input正文、个人版本、精确本机ID、路径或Key；固定个人资料/来源仍阻止公开导出。对话确认、差异编辑、试聊、Skill发布与模板采用分开。Skill新版本写出/读回/登记和成功通知沿用现有机制，旧版/手工内容/活动Run与BOSS固定引用保护不能被本契约替代；完整增量合并、通知、引用切换须继续按持续访谈规格实施。

消费者顺序：治理PR最新CI实际合并→不可变tag及摘要→客户端固定复制/生成、通用宿主/配置/页面/导出及人工异常验证→作者在客户端制作个人蒸馏新版并独立复导→本人继续真实访谈/差异/确认保存→BOSS明确引用。不得以G1或受控输入宣称已解除安装版上限、完成Skill更新、S08/G3–G5或招聘验收。当前阶段不新增、不运行单元测试，保留类型/构建、格式与实际人工证据。
