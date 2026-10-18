# 通用操作记录节点

2026-10-19，继续[个人蒸馏与BOSS计划](guided-skills-boss-plan-20261015.md)。当前客户端#318/契约0.39.0、公开个人0.7.0/BOSS0.2.9保持。源码核对：templates/service.ts已有effect.prepare/resolve及Run结束未知处理，但动作库/节点格式尚无独立操作记录节点。外发主线不能只停在内部草稿；先将持久准备/去重和结果登记变成可见通用步骤，再接模板实际动作和真实账号核验。

## Figma先行

原文件sVciNUZHG9yx81gCpYzjH9、页面1:3、Section487:7024；复用配置与状态529:5533的布局、Ant Input139:2、Button1:146/1:148、Semantic Light/Dark及Noto Sans SC/Inter，不新增组件/变量或客户专属业务界面。

| 状态 | Light | Dark |
| --- | --- | --- |
| 准备操作、声明动作与去重键 | [927:9756](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9756) | [927:9862](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9862) |
| 可选人工核对目标与完整内容 | [927:9968](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-9968) | [927:10074](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10074) |
| 登记本次准备回执、状态与证据 | [927:10180](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10180) | [927:10286](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10286) |
| 命中旧记录、结果未知停止 | [927:10392](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10392) | [927:10498](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=927-10498) |

每板1440×1080、37 FRAME/35 TEXT/9 INSTANCE/21 VECTOR/3 ELLIPSE，无图片填充，原型继承连接已清除；Section扩为4480×112000。首次整板发现组件属性管理的旧文案未正确覆写，改用TEXT组件属性后重新看全部八板，旧配置读取文案已清除，字体明确核对Noto Sans SC/Inter。当前是可编辑静态状态规格，不把示意按钮或设计稿记作实际导航、客户端实现或业务通过。

## 通用范围与消费者门槛

[0.40.0候选](../../contracts/v0.40.0/README.md)定义effect v1 prepare/resolve、effect-node-v1和严格回执。准备不执行；同实例/action/key只创建一次submitting，同键任意已有状态execute=false，包括失败/未知。需要确认时使用既有人工核对，取消/期限不重试。登记只接受宿主实际账本中本实例/当前Run尚提交的本次记录，核对完整action/key/runId，不信任参数自报execute；confirmed/failed/unknown不是模型自行扩大权限的输入。

实际动作仍需条件分支、独立浏览器/文件节点和业务回执；此节点不证明站点、对象、内容正确，不能兜底错误连接。key的账号/对象/消息或文档版本组成归模板，不能自动换键重放unknown。授权/快照/取消检查复用宿主，不改变旧SDK1.0或账本表；公开导出无确认、真实证据、授权或历史。

客户端随后固定真实发布tag，补动作库、普通字段/变量配置、嵌套能力检测、宿主桥接和中文结果；入口无声明动作或未授权时阻止，非模板及作者副本不得偷借真实实例。需要局部复用既有模板SDK内部实现时，仍检查当前执行owner、活动Run和持久回执，Renderer不能直接写账本。

实际验收须通过UI制作“准备→execute条件→有界本机虚构操作→核对→登记”，原始ZIP导出、空工作区自行导入/授权；分别核对新键、同键跨Run/重开、deny/confirm拒绝/取消、失败/未知、回执不符/跨Run/终态、准备后中断及回包丢失。无新增/运行单元测试，保留类型/构建/格式及有意义人工运行。正式BOSS动作、登录/JD/会话校准、发送前复验、日限额和真实回执仍独立实施，不以通用节点或虚构文件操作代替。

本批只完成先行设计和契约资料，尚未改变客户端/模板或调用真实模型、写状态、登录或招聘外发。G3–G5/S01–S08/186/Agent目标、原付费重试待批准及暂不登录边界保持。

## G1实际发布与G2接续

治理[PR #887](https://github.com/zhongmiao-org/flow-ark/pull/887)源`531faaa23fc10cbc4b46c3846ba835d027525bfa`，实际合并`d0a8b181a2309d40a6651d759e23977cfb5d70ae`，源/合并树均`9a57876ecc764540293d36fe643222e320b4e66d`。最新准确head的[CI39150577588](https://github.com/zhongmiao-org/flow-ark/actions/runs/39150577588)，Validate117743213248为steps空数组，注释明确账户付款失败或支出限制，不能称为CI通过。核对准确base/head完整远端树、全部变更路径和135个远端Git blob与本机文件逐字身份后，按用户授权使用`gh pr merge --squash --match-head-commit`，未使用admin或直推main。

远端此前无同名tag；合并后发布注释tag对象`4afae99a7c532b3005e6011bf0a64cd339613130`，真实`contracts-v0.40.0^{}`精确为上述合并提交。127份机器文件已固定；空目录重建全部129文件（含README/封存摘要）逐字相同，121份继承机器文件与0.39.0保持。30份格式资料、41项纯参考/作者/包关联检查通过，effect-node.ts/package-format.ts/template-authoring.ts独立类型检查通过，治理链接/边界/封存校验及diff-check通过；临时类型配置先修正编译器已移除的baseUrl及显式Node类型加载后取得成功，未改产品或契约以绕过错误。

这些检查没有启动宿主、写操作账本或执行本机业务，只验证格式和关联参考。构造的作者/包内存格式资料不是客户端模板制作成果，未新增或运行应用单元测试。[机器记录](visual-effect-node-g1-20261019.json)分别记录证据层次。客户端仍为已安装#318/0.39.0，模板仍个人0.7.0/BOSS0.2.9；没有本批重打包、用户模型消耗或授权变化。

G2现在可从准确tag独立采用，补动作库与字段/变量、输出引用、准确入口/owner宿主检查和持久准备/登记；不能先标记effect-node-v1可用再补执行。须完成虚构本机操作的正常/重复/deny/confirm/拒绝/取消/失败/unknown/跨Run/重开及原始ZIP全UI复导，再由作者接招聘动作。作者副本和非模板流程缺正式上下文仍阻止真实effect。实际BOSS账号/页面/会话、简历发送/回复/不感兴趣/投递与结果仍独立校准和验收。

## G2客户端实现与全UI复导

2026-10-19，客户端[PR #319](https://github.com/zhongmiao-org/flow-ark-client/pull/319)源`cfca6e441c7db955d6718611e9de0d216368a6b0`，实际压缩合并`40a39840d6ebdacdd035828732f08ec23c29d762`，完整树无差异。独立采用真实发布的`contracts-v0.40.0`和127份封存机器文件；元数据治理基线为`b64797255bc3428bf6c95dbc6653486659609e26`。下面的实现与运行证据更新前文G1时的“客户端尚未实现”状态，不将完整业务或全故障矩阵标为通过。

动作库提供通用“操作记录”，普通字段维护准备/登记、当前入口声明动作、去重键、可选目标/完整正文、前序完整准备回执、固定终态与证据；可展开既有样式的完整工作区，变量由当前可访问范围选择。递归补齐effect/effect-node-v1/human-review-v1能力，结果页区分历史准备时状态、原运行当时允许执行与登记终态。同键来源可跳回原运行，JSON仅在可选高级查看中出现。

Worker以独立effect.node/cancel宿主请求执行，Main没有业务编排。宿主先核对正式实例/准确入口/固定节点/活动Run/注册节点实例；准备在等待前后与事务内检查最新实例动作权限和取消状态，复用既有SDK账本；同键任何状态不再授权。登记只接受真实账本中当前实例、当前Run仍提交的准确action/key/id回执；伪造execute、旧Run、其他实例、终态均拒绝。Run结束和恢复将未登记准备保留为unknown待办；系统通知失败不移除本机事项。旧SDK1.0、IPC对Renderer和数据库布局不变，未增加招聘专属节点。

### 原生普通UI证据

作者在无Key的全新工作区从“制作模板”创建空白模板、资源和默认deny动作，普通字段树维护三个文本输入，动作范围显式选择。编排“准备→允许执行等于true→新建不覆盖文件→回读→相等断言→登记confirmed”六个独立节点；实际操作均在成立分支内，不使用脚本。先因公开文件名为空被安全路径校验拒绝，再通过UI补明确虚构文件名默认值，保存/核对带回修订9后正常导出，未绕过校验或编辑包源文件。

原始ZIP共8文件/0脚本，归档SHA256`dd6bb502b9eaa81e8f16854b125a196c81251d52cc5ec1b203b9265281568e6e`，内容摘要`86b852d09ca8d708b8aa1d08eb7d1dc874066ed34f55e59a7a9dcfbc4bdc00d0`。它是本机通用验证成果，尚未作为公开招聘模板版本发布。另一个全新工作区经UI原样导入、安装、创建实例，起始目录缺失且两动作deny；选择自己的目录后仍不能运行，直到本人明确配置保存动作每次确认、流程写入范围内自动并保存入口输入。

| 原生Run | 实际观察 |
| --- | --- |
| `da05ec0c-e71b-44ac-8005-c8ce86583579` | 人工页显示准确虚构文件名和完整正文；确认后创建/回读/断言/confirmed，1产物。 |
| `5084427f-1fd1-4b54-8e63-40ebf81cb648` | 同键跨Run命中已确认，execute=false，原Run保留；没有再次确认或新产物。 |
| `d8e8246d-5ceb-492c-a33b-e7e274543247` | 等待核对时取消，后继未执行，无新操作账本。 |
| `4173c9bd-00d6-4b20-8381-21e89dcf7ddb` | 拒绝人工请求，Run失败，无新操作账本。 |
| `d11bd267-c26a-450d-8e0a-0bd21fe81e72` | 新意图确认后文件已存在，未覆盖原文件；未登记准备转unknown并产生本地待核对事项。 |
| `d3affd10-80e2-4c0a-be92-3ffaaccd8818` | 同一unknown键再次运行，execute=false、无确认/产物；界面明确不能换键补发。 |

正常关闭/重开后46加密文档、53事件、1保护文件逐项摘要相同，6Run保持、没有自动新运行。虚构文本72字节，SHA256`50b73880284a67716e649fbc807d7afe18345af82dcc97f6b76cd2cc7ecc1414`，内容回读一致；深色配置/结果与浅色unknown结果已实际查看。完整键盘/窄窗口/主题及原生故障矩阵未全部覆盖。

### 受控宿主观察和检查

独立临时目录使用同一UI原始ZIP、真实PackageLibrary/Templates/EffectNodes/TypedResults及加密SQLite，32项手工受控观察完成：非正式上下文/能力/声明/deny拒绝；auto准备、跨Run同键与并发同键唯一execute；id/key/action/runId/execute/state篡改、跨Run/实例、固定状态替换和终态二次登记拒绝；false/0证据保持；失败/未知终态去重、本地待办在系统通知失败后保持；准备后丢失后继回执、确认期间撤权、节点取消、signal期限取消、owner失效、已中止信号、重新打开Store恢复及存储fault阻止写入。这个受控调用层不是原生UI或完整Runtime/Worker故障矩阵，不把注入状态称为真实崩溃/磁盘故障。

`pnpm contracts:generate`、`pnpm typecheck`、`pnpm build`、受影响文件Prettier、`git diff --check`及127发布资料SHA256核对通过；无新增或运行应用单元测试。临时观察脚本首次缺外部模块搜索路径，补项目NODE_PATH后成功；未修改产品依赖或安全边界。初次GitHub内容接口不提供大型生成文件正文，改核对准确base/head完整远端树、全部变更路径和34个Git blob身份，完整内容身份一致后才合并。

最新[CI39153648724](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/39153648724)的Validate117752260433为steps空数组，注释明确付款失败或支出限制，不能称CI通过。带automerge的非草稿PR按用户授权用准确head的`gh pr merge --squash --match-head-commit`，未使用admin/默认分支直推。PR附件工具仍报identity超过100，保留原附件并使用直接PR链接。[分层机器记录](visual-effect-node-g2-20261019.json)记录源码、原生Run、受控观察与本机证据摘要。

本批真实模型请求、本人Skill更新、登录和招聘外发均为0；公开个人0.7.0/BOSS0.2.9保持。接续须通过客户端UI将此节点用于BOSS真实动作前的准确意图准备、执行条件及发送后核对，补实际账号/JD/会话、限额、重复和结果不明处理，不能用本机文件样例代替招聘验收。原本人付费失败片段重试未执行，暂不登录选择保持；完整G3–G5/S01–S08/186/Agent仍继续。

### 实际打包与原工作区保持

从准确实际合并源执行`pnpm package:mac`成功后，先完整备份#318应用、原SQLite与保护文件，再只读挂载DMG并串行替换既有`/Users/mac/Applications/FlowArk.app`。ZIP SHA256`20e0def4c80999a07e7246c7efcb876b1f4968fe811f50b4634f27e6fdfdfc36`、DMG`58f9fc929afe544be655fb71ae21fde2aa2171197a3a0e7fb6cc331c2bbf7922`，构建/DMG/安装ASAR均`e54945408e3dfadc58b8f9891f15638e0d424eb14bb95f02ec7d87e726ce9392`。打包复用已发布Electron内核，未下载浏览器；本机开发包未代码签名，未计正式发布。

正常重开原个人目录后，真实安装版动作库可见“操作记录”；只查看已有编排，没有改保存流程、运行或授权。原247份加密文档、94事件、2保护文件、7Run和31流程全摘要保持，DeepSeek配置仍可见，原22次来源及访谈未重放。回退包和数据备份保留在本批临时证据目录。安装证据不代表BOSS真实业务或完整故障矩阵通过。
