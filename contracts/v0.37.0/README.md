# P1 契约 0.37.0：Skill 更新逐项核对

2026-10-18。接续固定0.36.0；先行[三个Figma状态与规格](../../docs/client/skill-update-review.md)，将[独立草案](../drafts/skill-update-review/README.md)补齐为正式候选快照。发布是否完成以远端 `contracts-v0.37.0` 的准确解引用为准，消费者必须在实际发布之后独立采用。契约发布、客户端安装、UI制作和业务验收分别记录。流程1.0、包2.0、SDK1.0、既有Skill v1及已确认文件格式不变；不修改旧快照，不加入招聘字段。

## 可编排节点与输出

新增Skill v2，固定 `operation:propose-update`，必须声明 `skill-v1` 和 `skill-update-review-v1`。binding为逻辑目录资源，base/title/markdown/data/evidence使用原Value语义；运行时解析成严格SkillUpdateInput。base必须是准确SkillVersionRef，不能为null；key由实际父版本取得，节点不能另传key、可信基线、目录路径或调用方自报归属。title/markdown/data/evidence组成完整建议，不是自动覆盖指令。对父内容和模型建议的语义取舍仍由模板及本人核对。

作者及正式包的规范校验器均在嵌套条件/循环内核对两项能力、入口声明和自己目录的write/readwrite访问。声明不是实际写权限；宿主另核对当前实例/作者上下文、实际目录身份与授权。此节点只产生提案，无模型调用、最终Skill写出或外发授权。

宿主先核对实际父版本登记、目标目录、当前头、外部文件及新来源，异步读取后再次核对，创建前在串行/CAS范围复验。目录不一致、读取失败、来源失效或未知文件不可作为“没有变化”。节点需从真实不可变Run/执行快照取得origin，不能信任Worker传入的完整FlowRecord或Renderer生成的记录。

SkillUpdateProposalOutput有三个严格分支：

- pending：version/status/base/proposalId/revision，真实已登记待核对草稿，没有ref。
- confirmed：上述身份及ref，仅用于同一提案已实际确认后的幂等读取；ref必须同key、不同于base，并由真实登记核验。
- unchanged：仅version/status/base。经过来源与父内容核验，建议的title/markdown/data与原基线全部相同；不创建重复提案或版本。新增证据或模型用量本身不是内容更新，原Run的日志、来源及输出仍保留。

“无变化”不能返回伪造proposalId、confirmed或新ref。创建身份按实际工作区、flowId/nodeId/准确nodeInstance、执行快照、固定基线和完整建议/来源指纹限定；跨Run幂等命中保持原origin及提案，不把后一次Run改写成首次来源。不同实例/目录/节点实例不能借用旧索引。原提案曾有人工编辑时不得由重跑重置；状态已discarded/unknown等时明确返回不可继续或要求本人处理，不能另建身份绕过。

## 不可变建议与当前草稿

SkillUpdateBundle为本机不可变加密记录，绑定proposalId、逻辑workspaceBinding、origin、准确原base、完整baseline、baselineEvidence、完整suggestion、createdAt和除sha256外整体canonical摘要。origin包含实际runId/flowId/nodeId/准确nodeInstance/执行快照摘要；执行版本为宿主对实际固定执行内容的摘要，不能把任意字符串版本号冒充SHA256。摘要不是来源授权或真实性证明，宿主必须核验实际登记关系。

普通SkillProposalSnapshot继续使用已有有界当前快照；初始draft为原父内容及父来源，模型建议不得先写进去。bundle、可编辑提案和创建索引在同一Store事务登记；不得先发“已创建”事件后再写不可变建议。没有可靠bundle的旧v1提案返回不适用，不能从已被手改的draft或模型摘要重建原始建议。

候选私有白名单 `skill.update.info` 严格接受SkillUpdateSelection，返回有界SkillUpdateInfo或旧v1的不适用null；meta仅含身份、修订、基线和摘要，不含三份正文。`skill.update.review`严格接受同一Selection，返回宿主原登记SkillUpdateReview。`skill.update.apply`只接受SkillUpdateApply，返回实际已提交SkillUpdateReceipt；这三个接口不提供给Worker、脚本或模型以代替本人采纳。

原建议的base/baseline和bundle永不因rebase而改名。本人沿现有UI明确核对新父版本后，snapshot.base作为publishBase供最终保存；原base与publishBase必须同key，最新当前头及外部内容仍需独立核验。Review同时绑定两份完整引用和bundleSha256，并明确展示建议相对原基线生成。不能声称旧模型已阅读新父内容。复制/新键若成为普通人工草稿，不伪造该bundle对新key的适用性；原建议及旧Run保持可追溯。

## 比较与本人选择

SkillUpdateContent包含title/markdown/data。State用present区分不存在与null；Target为area及字面自有键数组，不是表达式或RFC6901。标题、Markdown各按一整项比较；仅三份值都存在且均为普通对象才递归，数组、新增/删除或类型变化为原子项，不能猜数组记录身份。

三份内容相同不列项。模型改动、当前未动为candidate；仅当前改动为manual-only只读；当前已等于建议为already-applied只读；双方不同改动为conflict。默认所有建议不选；candidate要求replaceManual=false，conflict必须本人单项明确replaceManual=true。重复、未知、不可选字段及错误允许标记全部拒绝。字段ID绑定完整target/三份State/status；不是模型提供的字段权限。

应用复制当前手工草稿，只改所选项。额外手工字段、未选内容、已有来源和旧引用保持；空值、false、0、空文本/对象/列表不等同缺失。字面 `__proto__`、constructor、`$ref`、点、斜杠不触发原型写入或求值。内存对象别名也不能把一个选项的修改扩散到另一项。

## 证据、当前性与原子回执

Review绑定proposalId/revision、随机reviewId、本进程epoch、原base、publishBase、bundleSha256、三份内容摘要、sourceSha256、workspaceRevision及时间/字段/整体摘要。reviewId和epoch由宿主产生，至少128位随机性。sourceSha256为宿主核验后的 `{baselineEvidence,suggestionEvidence,currentEvidence}` 有序集合摘要；workspaceRevision为实际目录身份、当前头、实际publishBase及可靠文件观察的摘要，不读取Key。字段/来源变化、人工保存、重启、过期或不可编辑状态使旧核对不可用。有效期大于0且不超过5分钟，不自动刷新并保留旧选择。

应用在提案写入队列及事务中重验当前状态、修订、归属、父版本/外部文件、来源与原核对。长期有效性不由Renderer的自洽摘要证明，必须取宿主内存registry中的原Review并比较当前实际上下文。registry最多64项/32MiB，清理已过期项；超限明确拒绝，不挤掉仍在使用的核对或静默截字段。退出/重启不恢复旧epoch许可。

宿主先按提案/请求查可信已提交回执，同完整确认内容返回原回执，先于当前草稿/时间/epoch检查；确认丢回包或重启不能再次应用。同requestId但完整确认内容不同拒绝，选择数组次序也属于内容。没有回执时才执行原registry及当前性核对；无可靠存储不能断言未发生或换新requestId自动重试。

同一加密Store事务只更新所选内容、合并证据、推进一次修订、作废旧试聊/最终预览并保存完整确认摘要与回执。未选、空选择或最终内容无变化时不推进修订、不合并仅证据变化、不发布版本。changed=true时revisionAfter=revisionBefore+1，否则不变；不超过安全整数。提交后才能发已有有序onmessage，收到更新应用回执不等于Skill发布成功。UI核对预期提案/读取序号/修订，迟到回复不得覆盖新选择或手工输入；不每次推送bundle/三份大正文。

证据沿既有SkillEvidence，由宿主按角色核验：已登记原父版本或明确核对后的publishBase继承证据只核对历史真实性，不要求它仍是持续访谈的最新确认头；本次建议和新加证据必须核对准确当前来源。只能由真实父版本/bundle归属确定历史证据身份，Renderer或模型不能把失效的新来源改标为历史。试聊和最终确认也沿此区分，不能因继续访谈而一概拒绝保留的旧证据，或用历史模式放过本次过期建议。实际内容变化时保留当前证据的顺序，再按完整canonical身份追加建议证据去重，最多100项，不能截断旧证据。合并后重新检查完整草稿预算与来源；失败整个应用回滚。隐私删除是另一项明确操作，不能由模型建议或此次合并暗中删除证据。原始来源、证明及草稿都只是本机数据，不进入公开ZIP。

## 预算、参考与交付边界

有限JSON、有效Unicode/非有限数字/连续数组/非访问器等检查先于递归Schema。单份Content及完整SkillDraft至多1MiB、32层、10000个键和值；title200/markdown60000/对象键1024个UTF-16码元，正文不只空白。Schema字符计数不代替较严格码元/字节预算。Bundle最多4MiB/48层/50000项；Review最多4MiB/40层/40000项和256字段。组合后超限拒绝完整操作，不声称每份单独达到上限时仍必定能组合。现有proposal、IPC、最终文件等限额不放宽，消费者须按真实读取/写入开销复核。

canonical使用UTF-16键序、数组保序、JSON数值（-0为0）和不归一化字符串；摘要是canonical UTF-8的SHA256。禁止把摘要当签名、权限或已保存证明。`skill-update-review.ts`只提供格式、比较、建议/回执投影及关联；projectApplication不是持久化，matchCommittedReceipt不证明调用方对象来自Store，mergeSkillUpdateEvidence不证明来源真实。

最终确认仍走既有preview/confirm、本人核对、准确写出/读回/登记。更新应用或无变化不通知“Skill已更新”；新版本真正登记后才建立一次带版本/来源的通知，系统通知失败仍保留应用内待办。BOSS绑定与既有Run继续引用原确认版本，显式选择新版本另行核对；不自动发送消息或扩大授权。所有模型调用仍用用户自己的Key，此核对过程不调用模型。

机器资料由 `../build_skill_update.py` 从固定0.36.0复制；新增Schema、规范作者/正式包节点门槛、参考模块、格式资料和示例属于本版。生成器拒绝覆盖已封存目录，可用空 `--output` 目录重建比对。实际消费者、原子事务/故障与重启、有序事件/原生UI、普通模板作者制作和独立使用者复导、最终写出/通知及旧引用仍须随后逐项取证。格式核对不能计作这些能力已实现。本阶段不新增或运行单元测试。
