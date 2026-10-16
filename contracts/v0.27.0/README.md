# P1契约0.27.0：作者副本的结果与提醒SDK上下文

2026-10-16，接续0.26.0。实际BOSS可视化制作发现：正式实例能调用result/attention，但独立编排副本调用相同SDK会因没有模板实例而失败。本版先让这两个本机操作在明确的作者上下文中运行，解除已有六步来源入口的作者调试阻碍；不是把副本伪装为正式实例，也不宣称全部SDK或BOSS完成。Figma及实现门槛见[作者SDK调试](../../docs/client/author-sdk-debug.md)。

## 固定来源与宿主登记

TemplateAuthorSdkOwner固定kind=author-checkout、checkoutId、draftId、entryId、flowId、baseRevision。标识有界且不可含路径/空白；entryId为小写字母开头的小写字母/数字/连字符。baseRevision为1至Number.MAX_SAFE_INTEGER-1。

TemplateAuthorSdkContext固定version=1、宿主id、owner、创建副本时的resultSchema和capabilities、definitionSha256及createdAt。摘要为canonical({owner,resultSchema,capabilities})的SHA256，沿用现有按对象键排序的规范编码，数组顺序保留；摘要不替代宿主登记或权限。字段严格无额外属性，数据最多2MiB、40层、50000项，结果Schema须通过既有Schema校验且不含外部引用/自定义$id。

创建副本时，与AuthorCheckout、独立流程及调试配置在同一宿主事务登记上下文，不从实例复制。capabilities为当前作者入口显式声明能力与公开流程所需能力的去重集合，不从任意脚本字符串推断。宿主保存RunSnapshot.authorSdk；没有制作来源的普通流程不能自报绑定成为作者副本。运行与重新运行必须核对当前真实checkout/flow登记、固定上下文身份及摘要，不接受Renderer/脚本/模型指定的上下文。

制作草稿之后变化不改写旧上下文；原副本仍明确采用创建时的结果结构及能力。采用更新后的Schema/能力须保存制作修订后创建新副本。旧副本缺上下文时不按当前草稿回填；含脚本的作者SDK调试在启动前给出重新创建副本的明确提示，原副本、草稿、历史和原始资料保留。已保存的旧Run仅查看，不通过补写元数据伪造当时来源。Run固定后编辑副本不改变当前执行；作者副本仍不可定时。

## 本版允许的SDK操作

调用形状仍为SDK1.0的result(value)和attention({key,title,detail?})，不新增流程节点或业务能力。两者要求固定capabilities中有template-sdk-v1；attention还需attention能力。未知/未开放操作在任何读取、网络请求、写入、通知或授权提示前明确拒绝，不回落正式实例或普通脚本路径。configuration/resource/validate/state/file/browser/ai/human/effect等其他SDK操作仍需正式实例，本批不能据此计完整作者SDK通过；原有context节点、资料/Skill节点和其他原生节点继续遵守各自独立契约。

result按固定resultSchema校验，值为有界有限JSON。TemplateAuthorSdkResult保存version=1、runId、contextId、definitionSha256、value和createdAt；必须与原Run固定上下文及宿主登记一致。只写作者本机结果，不写template-instance、template-state、template-result或正式外发台账。完成时采用原Run已保存作者结果（若存在），否则核对原执行输出；不把SDK调用返回成功冒充外部业务完成。旧结果不能随草稿变化重解释为新结构。

attention仍保留任意JSON详情（省略为空对象，显式null保留），但来源由宿主独立生成。作者提醒与正式实例共用template类展示，origin采用严格version=2的TemplateAuthorAttentionOrigin：runId、checkoutId、draftId、entryId、baseRevision。没有instanceId，不能假造实例。正式来源version=1保持原形；TemplateAttentionOrigin变成两种严格来源的联合。脚本detail中的同名字段不参与来源判定。

同一checkout和key只保留首次作者提醒、来源、时间、详情和已读；另一副本/正式实例完全独立。去重命名空间为author-sdk-attention:<checkoutId>:<key>，不能与既有实例命名空间混用。宿主从实际活动Run固定authorSdk产生来源并检查脚本owner/终态；取消前已提交的本机结果/提醒保持，取消后不得新提交；提交边界与故障按现有Store事务处理。通知失败保留应用内记录，不自动重新运行。

## 展示、隔离和恢复

编排器展示“作者调试”与固定入口/制作修订/结果结构摘要，允许查看固定来源；缺失时明确提示新建副本。原结果页面标明作者调试，模板提醒详情区分作者来源与正式实例，并核对真实Run快照后链接原Run。来源缺失或不一致保留原身份及错误，不跳转其他Run；详情自报runId/runIds/origin不能补链。查看、返回、已读、重开及上下文检查均不运行模型或创建Run。

SDK上下文、值、结果、提醒、调试绑定和具体运行标识均留本机受保护存储，不带回AuthorDefinition或导出ZIP，不隐式建立模板实例，也不继承实例凭据/动作。记录仍使用当前通用加密documents/events表，不新增表、清库、回填或旧客户端迁移。包2.0、SDK1.0、公共FlowDefinition和既有已导出检查点字节不变。

## 发布与验收

这是先行G1；客户端尚未采用，实际不可变tag发布后消费者再固定采用。新增三个作者SDK定义、作者提醒来源及RunSnapshot可选authorSdk；旧正式来源归入TemplateInstanceAttentionOrigin，已有引用保持。旧消费者可能拒绝新来源/快照，不能宣称向旧客户端兼容。规范无IO模块及正反例只检查数据，不证明宿主真实身份/事务、SDK执行或界面通过。

G2须实际验证：宿主原子创建/缺登记/伪造上下文/能力缺失、两种结果Schema及运行中定义变化、正式/双副本隔离、先后取消及提交后保留、同键首次/已读、原始null/对象/伪造字段、终态拒绝、重新运行/重启不重放、导出无私有元数据。最终在原生客户端从已保存BOSS入口创建新副本，选择明确合成文件与原生确认的合成Skill，完整运行通过/缺口分支、查看提醒并往返原Run，重新导出/独立复导逐字节验证。真实Key个人蒸馏及登录后业务独立验收，UI/UE阶段不新增或运行单元测试。
