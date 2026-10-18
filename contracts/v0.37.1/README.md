# P1 契约 0.37.1：更新应用请求恢复

2026-10-18。接续[0.37.0](../v0.37.0/README.md)，原定义、节点、能力和参考模块保持；新增SkillUpdateApplication、SkillUpdateDetail，以及格式关联参考。实际发布身份以远端contracts-v0.37.1准确标签为准，消费者不得提前采用候选。先行[配置与应用回执恢复Figma](../../docs/client/skill-update-review.md)已补入现有文件，不改变最终Skill本人确认或用户Key边界。

## 缺口与私有格式

0.37.0规定原请求回执幂等，但未定义重开界面如何找回未取得回包的原请求。不能只在Renderer内存保存requestId，或重开后换新身份再次选择。`skill.detail`原严格输入 `{id}` 保持，返回SkillUpdateDetail：原proposal/实际workspace及application；旧v1或没有请求为application=null，不重建无法追溯的旧建议。

application严格含status/input/receipt。input为完整原SkillUpdateApply（只含身份和选择，不含正文/Key），status为pending/applied/rejected：pending和rejected必须receipt=null，applied必须带关联完整原确认的SkillUpdateReceipt。pending可能仍在处理，也可能重启中断；没有回包不能猜成未执行。rejected仅在健康Store中核对无提交回执、事务未应用内容并明确终止该请求后记录，不是模型声明或基于超时推断。applied的回执修订不得高于当前草稿修订；草稿后续编辑不改写旧回执。

详情中的应用身份必须属于同一proposal，原input.revision不高于当前修订。返回本机Store已核验的最近操作及真实状态，不能接收Renderer回传的所谓状态。完整详情至多2MiB、48层、50000键和值；其内原Skill草稿限额不放宽。未知字段、错提案/修订或错误回执关联拒绝，不泄露其他提案内容。

## 持久化及本人操作

宿主在第一次异步观察之前，通过同一加密Store事务保存完整原input及确认摘要、准确提案/工作区归属、pending状态和最近请求索引；一个提案只允许一个尚待核对应用。重复请求先读取真实已提交回执并核对完整input，同ID不同内容拒绝，不能借pending改变选择。

实际所选草稿、证据、修订、回执和applied状态/索引在同一事务写入。重开不重放pending，不恢复旧epoch Review许可。UI读取详情后恢复原input和待核对提示，锁定新选择/确认；本人点击核对原应用请求时，继续调用原 `skill.update.apply`，不添加自动重试或新身份。

已有可信回执先返回原结果，先于期限/当前草稿检查。没有回执时，原Review仍有效且当前性通过才可继续原请求；否则健康Store证明没有本次事务提交后记录rejected，保留原input和拒绝状态，让本人重新查看当前草稿、重新核对建议。存储故障/无法核验提交结果保持pending，不谎称未应用。旧请求rejected后即使另建了新核对，也不能用其原身份执行其他选择。

UI核对详情读取序号、准确提案和单调修订，迟到详情或应用回复不能清除更近的请求/手工输入。一次请求回包丢失保留原input并读取原记录；applied显示本机草稿应用结果，不通知Skill已更新或自动发布。正常访谈发送不增加任何确认步骤。

## 参考与采用边界

`skill-update-application.ts`只验证严格格式、原请求/回执、提案及修订关联，不证明Store归属、原子提交或状态真实性。宿主必须实现真实持久请求、读取及重启/故障验证，之后再有原生UI/打包验收；格式资料通过不代表客户端已实现。本机虚构资料5组关联观察/13份正反格式资料通过，无模型或生产写入，不新增或运行单元测试。

`../build_skill_update_recovery.py --output <空目录>`从固定0.37.0复制，拒绝覆盖已封存目标。除p1.schema.json版本及两个新增定义外，115份原机器资料中其余114份保持逐字节一致；新增参考、正反资料和示例形成118份机器快照。最终发布及消费者版本另记，不改写0.37.0。
