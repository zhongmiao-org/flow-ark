# P1 契约 0.24.0：会话来源与草稿试聊

2026-10-15，接续0.23.0。补齐引导流程的两项通用缺口：已确认会话输出可核验来源，以及未确认Skill草稿的内部试聊。业务访谈、事实分类和求职规程仍归独立模板。

本批为G1规范和Figma状态，发布以实际tag为准；客户端当前采用0.23.0，尚未实现本批能力。包2.0、SDK1.0、流程1.0及现有节点输入保持；ConversationOutput新增必填sequence/evidence，ConversationSnapshot可带skillTrial。依赖来源的流程须声明`conversation-evidence-v1`，需要草稿试聊的模板声明`skill-trial-v1`。旧端遇到未知必需能力须在执行前拒绝；不开发旧客户端兼容层，不改写旧Run。SQLite表布局不变，新增加密文档及白名单IPC，禁止清库。治理发布→固定tag/摘要采用→客户端能力与原生核对→作者继续可视化制作，分别记录。

## 已确认会话来源

ConversationOutput包含sessionId/status/revision/sequence/transcript/evidence。未确认时transcript必须为空、evidence为null；确认后输出实际完整消息的role/text及ConversationEvidence。此结构与SkillEvidence.conversation一致，模板直接引用`steps.<node>.evidence`，不让模型生成摘要、序号或确认时间。

摘要为UTF-8 canonical(`{version:1,snapshot:<完整已持久化确认快照>}`)的SHA256。canonical采用[包规范](package-format.ts)的递归键排序和原数组顺序。快照包括指令、所选上下文、消息、尝试身份/用量、序号、确认时间及模型，不含API Key。确认后不可编辑。展示标签可修改；核验时标签不参与比较，sessionId/revision/sequence/sha256必须逐项一致。摘要仅证明本机快照一致，不证明模型说法真实，全文仍须用户核对。

宿主从受保护会话存储读取真实快照并计算，不能相信Renderer、模板或模型提交的形似快照。创建Skill草稿、保存修改、预览确认及确认前均重新核对会话来源；异步工作区/文件检查后再次核对草稿修订，避免把结果套用到新内容。缺失、未确认、摘要不符或试聊来源明确阻止新版本确认并保留输入；不能自动改成手工/空来源绕过。真正手工来源须由用户明确录入。已确认旧版本保持不可变，读取旧版本不伪称另一工作区也核验过原会话；不复制或自动导出会话全文。

`skillTrial`会话即使点击会话确认也不可自动作为个人事实来源；试聊回答不是本人经历。新增本人事实应回到独立访谈由本人明确回答并确认。来源及完整输出只经受保护本机结果通道展示，日志仍脱敏，公开包不带消息正文/来源摘要/本机身份。

## 固定草稿预览

SkillTrialSource为version=1/proposalId/revision/sha256。sha256为canonical(`{version:1,key,base,draft}`)的UTF-8 SHA256，draft包括title/markdown/data/evidence，base是准确父确认版本或null。另带proposalId/revision，内容相同的另一草稿不能冒用身份；修订变化即使内容改回也须重新核对。

SkillTrialPreview返回完整source/key/base/draft，由宿主从真实草稿生成。仅draft/failed/conflict可建立试聊，publishing/unknown/confirmed/discarded禁止。父版本冲突可供内部核对，不能跳过正式确认的差异/发布检查。工作区缺失、迁移或权限失效须先处理，不替换目录继续。异步检查后再次读取草稿和工作区身份，以同修订/摘要建立会话。

未保存输入先显式保存；失败/冲突保留输入，不使用旧草稿假装采用本次编辑。预览不创建确认版本、不调用模型、不启动Run、不授予外发权限。

## 建立内部试聊

SkillTrialRequest固定requestId/source/provider/model/instructions。provider仅显式deepseek或openai-codex，model为非空实际标识；instructions为用户核对的可选补充要求，最多16000字符，不由客户端内置业务问题。宿主通用指令明确未确认草稿仅供内部试聊，依固定内容回答、未知明确说明、不调用外部动作；业务边界来自草稿或补充要求。完整最终指令、固定上下文和历史须可读，再由用户逐轮核对后发送。

使用真实草稿sourceFlowId/sourceNodeId建立独立会话，不得伪造已执行节点、Run或正式Skill绑定。context包含固定完整SkillTrialPreview，snapshot.skillTrial等于source，maxRequests固定10（失败/重试也计一次）。会话继续受既有1MiB上限约束，过大阻止，不静默截断。每次建立使用独立请求身份；同requestId同完整请求幂等返回同SkillTrialResult，不同内容拒绝。不同requestId建立独立历史。

SkillTrialResult为version/requestId/source/sessionId。宿主同一事务持久化固定会话、索引、原请求及回执后才返回。提交失败不返回成功；响应丢失后重复同请求只读原回执；重开不调用模型，不自动执行或外发重放。

建立会话不调用模型或预扣Token；Key缺失时可查看固定内容并保留输入。每轮send/retry复用已有reviewed、串行请求、取消及恢复，由宿主读取用户自己的受保护Key。禁止开发者Key、共享额度、桌面登录态或静默切服务/模型。配置与绑定不符先修正，未知用量为null。

## 修改、取消、恢复与乱序

SkillTrialStatus为source/current/usable/reason/message。current表示本机当前草稿revision/sha256/status或null，reason为ready/changed/unavailable/workspace/blocked。仅身份/内容匹配、状态允许且工作区有效时usable=true。UI回执不构成发送许可；宿主每次send/retry及异步读取配置/Key之后、网络开始前再次核对来源与绑定，未通过不得调用Provider。

修订变化、来源缺失、目录不可用、丢弃/确认/发布或结果未知时，旧试聊保留历史并显示原来源，停止新模型请求，返回当前草稿重新建立；不得自动重绑、继续消耗Token或把旧回复应用于新稿。已开始请求固定旧source，结束/取消只写原会话并显示来源变化，不覆盖当前草稿。只读查看/刷新不调用模型。

消息沿用conversation.snapshot完整事件、单调sequence、onmessage串行归并、身份去重/缺口恢复、订阅解绑及旧请求隔离，不建第二套按到达顺序聊天逻辑。持久化恢复不重试，取消后迟到分片不改变终态。试聊消息/费用、会话确认及Skill确认分别记录，回复不自动写回草稿、生成确认版本或获得业务发送权限。

## 机器资料与验收边界

[skill-trial.ts](skill-trial.ts)只核对有限JSON、Schema及关联摘要，不代替真实记录、所有权、Key、事务、网络前复核或UI验收。上限2MiB/50000值/40层；会话和Skill更严格上限继续生效。拒绝无效Unicode、非有限数字、循环、稀疏数组及保留键。

[格式用例](skill-trial.cases.json)和[关联用例](skill-trial.semantic.json)仅含虚构资料。分别取得真实Runtime/Worker来源、错误来源零确认、草稿变化/网络前竞态零调用、取消/迟到、同请求恢复/幂等、多草稿隔离、自有Key成功/失败、原生Light/Dark/紧凑及独立工作区可视化复导证据。格式检查不能标记G2/G3通过。当前不新增/运行单元测试，类型/构建、规范资料核对及人工界面按阶段执行。
