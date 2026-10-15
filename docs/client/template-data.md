# 可视化配置与状态编排

2026-10-15，接续[作者工作区](template-author-workspace.md)与[长期目标](guided-skills-boss-plan-20261015.md)。实际源码核对：模板SDK的configuration/state.get/state.set已存在，变量选择只提供流程参数/前序步骤/当前循环；作者副本是独立普通流程，未固定共享配置/状态调试上下文。个人蒸馏多入口与BOSS批次需要这些数据，不能通过业务大脚本绕过。

先交付[0.23.0](../../contracts/v0.23.0/README.md)与Figma，再由客户端[PR #278](https://github.com/zhongmiao-org/flow-ark-client/pull/278)实现本批通用能力；交付与验收范围见下文。配置/状态节点不处理求职字段或站点逻辑；个人蒸馏规程继续归模板，并参考用户指定nuwa-skill的本地素材/表达/证据/边界方法作适配。

## 交互与语义

动作库增加通用“配置与状态”。在步骤配置中明确选择“读取本次配置”“读取最新状态”“按修订更新状态”；读取结果通过已有变量选择器的前序步骤value/revision引用。写入同时选择预期修订和完整新值，提示整值替换及冲突保留，不静默合并或隐式重试。

作者副本增加“调试配置与状态”入口，使用作者字段树中已固定的配置/状态Schema，初始值仅来自公开默认值。此表单保存的是私有调试值；配置/状态一起校验、双修订CAS提交，保存不运行、不带回、不进入ZIP。未完成字段/JSON、保存失败与并发修订保护保留输入和焦点。正式实例各入口共享状态，不同实例、不同作者副本独立。

Run固定上下文身份、包/Schema及配置，显式状态读取取得当前已提交值。更新必须拿到预期修订；SDK现有set也推进同一状态修订。状态值、修订与写入回执同事务提交，真实中断后核对同一操作；未知结果保持待处理，不重新写入。执行详情区分Run取消与已提交状态，完整数据通过受保护本地结果通道查看，普通日志保持脱敏。

正式实例状态写入有独立动作授权；作者运行前检查列出对本副本调试状态的持久修改。节点本身不调用模型、不读取浏览器或文件，不扩大后续外发权限。

## 本批门槛

已先补读取配置/状态、按修订写入、私有调试表单、表单/运行并发冲突、提交后取消/未知核对、资源/动作要求及紧凑Dark设计，沿用原Figma文件的组件、Semantic Light/Dark与Noto Sans SC/Inter。原186板及验收结论保持。

| 状态 | Figma节点 |
| --- | --- |
| 读取本次配置 | [529:5533](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5533) |
| 读取最新状态 | [529:5639](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5639) |
| 按修订更新 | [529:5745](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5745) |
| 私有调试表单 | [529:5852](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5852) |
| 修订冲突 | [529:5958](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-5958) |
| Run取消但写入已提交 | [529:6064](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6064) |
| 原写入结果待核对 | [529:6167](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6167) |
| 运行前检查及授权 | [529:6266](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6266) |
| 紧凑Dark未保存 | [529:6369](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=529-6369) |

[结构记录](template-data-design-audit-20261015.json)：八张1440×1080、一张1040×700；332Frame、300Text、72Instance、189Vector、27Ellipse，零图片填充，字体核对通过。内容区与底部未越界，68条实际导航目标均存在；没有逐条点击全部原型。写入、调试及紧凑Dark全板截图已查看，随后将流程/运行/制作导航选中态按页面所属调整。Section扩为4480×32200，其他画板保留。画稿不等于客户端完成。

G2实现宿主上下文/CAS、SDK修订联动、执行节点/变量、作者调试表单、运行前检查和完整结果。配置快照、入口/实例/副本隔离、重复及冲突、提交前后中断、重开及私有值导出边界取得以下分层证据。当前UI/UE阶段不新增或运行单元测试；不将已走查范围扩展为全部复杂界面或业务通过。

## G1格式与规范核对

0.23.0新增十个数据定义及一个context v1节点分支，RunSnapshot增加可选的固定templateData。已有定义除Node/RunSnapshot扩展外保持；包2.0/SDK1.0及Value语法不变。现有节点的type/version生成约束保持，新的操作沿用已用的条件字段校验形式。

AJV2020核对本批92个正反格式资料，以及既有AI/会话/资料/Skill/作者资料，共184项，无不符。规范模块另核对合法上下文/状态/编辑/回执、Schema/身份/内容/修订不符、有限JSON/Unicode/连续数组与预算等27项一致性，符合预期；独立TypeScript检查通过。42份机器文件摘要及治理链接/忽略边界另行检查。此范围只验证格式/规范数据，不证明真实CAS、权限或恢复行为；临时核对程序和详细结果仅留本机。


## G2实现与分层证据

客户端固定采用治理[PR #751](https://github.com/zhongmiao-org/flow-ark/pull/751)的 `d210d9170196ef6e65f1274bee262060b40139d6` / `contracts-v0.23.0`，42份机器资料与摘要进入应用仓库，独立生成类型及Renderer静态校验器。流程1.0、模板包2.0、SDK1.0和SQLite表结构保持。旧实例的状态值保留，首次需要修订时登记为0；所有SDK写入和新节点共用同一计数。旧作者副本不猜测历史Schema，缺少固定上下文时提示重新创建副本。

本批源提交 `e6fdb1df1d2af5ba0f6246afa29bc64b0d9dc29c`，客户端[PR #278](https://github.com/zhongmiao-org/flow-ark-client/pull/278)的最新[CI 38757660998](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38757660998) Validate/Auto Merge成功，实际合并提交 `d9a38c48ad697cd15b2cc6a42db6958be2f14ccc`。取消的旧CI不计为通过。

| 层次 | 实际取得的证据 |
| --- | --- |
| 契约与构建 | `pnpm contracts:generate`、`pnpm typecheck`、`pnpm package:mac`（含build）、本批源码Prettier检查、42份SHA256及`git diff --check`通过；未新增或运行单元测试 |
| 私有表单与固定配置 | 真实Runtime核对双修订原子保存、重复请求返回原结果、不同内容复用身份/旧修订拒绝；仅改私有配置后旧运行确认失效，保存不运行 |
| 状态与授权 | 真实Runtime/SQLite并发竞争只有一个提交，另一个冲突；重复写仅读原回执、不同内容拒绝。正式入口默认拒绝写入；同实例两入口共享状态，其他实例和两个制作副本独立 |
| SDK与导出 | SDK的实际`state.set`调用推进相同修订，新节点旧修订因此冲突。公开包同时保留状态写动作和文件/外部写动作，均默认deny；包内容未带入虚构私有调试配置/状态 |
| 真实Worker | 配置/读取/写入完整输出、循环两次写入使用不同节点实例、300ms节点超时等待授权后没有延迟写入；状态提交后取消Run，Run为CANCELLED，完整结果及written回执仍保留 |
| 真实进程终止 | 子进程在prepared持久化后SIGKILL，重开只核对原操作为未提交，状态保持原值；在事务提交后SIGKILL，重开读到written和同一修订/内容，没有第二次写入 |
| macOS原生Dark候选 | 导入公开包→复制独立制作草稿→打开副本→保存私有双列表单；未保存离开/继续编辑保留输入；变量选择读取结果修订，从动作库新增节点并切为状态读取，核对运行影响并完成五步骤真实运行 |
| 原生结果与重开 | 首次Run `94be5dfd-dad1-470f-84e7-dfade7bdd464`，私有配置修订2、状态1→2；重开后完整配置/写入回执可读。随后再次运行状态2→3，确认运行结束时回执刷新，完整值为虚构内容 |
| 最终安装 | 最新CI合并后串行更新并在原工作区启动，安装包内app.asar摘要与最终候选一致；原生动作库显示新节点，返回原流程列表，没有活动任务。原有加密文档逐条摘要、历史事件及受保护数据密钥保持一致 |

写入操作身份由宿主按Run/真实节点实例生成；prepared先持久化，状态/修订/written同事务。取消和超时先撤销该次未提交操作，提交后只读回执；未知不重写，重开建立持久待办。普通日志脱敏，完整配置/状态经本机加密结果通道读取，Run取消也不隐藏已提交回执。原生走查发现结果面板提前挂载会漏掉随后生成的回执，已补随运行状态刷新，并置于通用输出前。

人工驱动程序、原始观察、截图及备份只留本机，不上传用户记录、系统路径或进程信息。上述SDK核对为真实宿主调用；没有将其写成原生脚本编辑/运行已通过。原生复杂Schema、多窗口冲突、完整Light/紧凑布局、取消/未知核对全矩阵和另一工作区全链路复导仍待走查。真实用户Key、nuwa适配、个人蒸馏及BOSS外发均未在本批执行，G3–G5及原186/U01–U12/Agent完整流程目标保持。


最终候选及安装的app.asar SHA256为 `4613e57904ca6d224f000bfd7f0e034f3714dc88fea3e728317bdc51467b03ae`，DMG SHA256为 `5f5472de62ad3e704a8f309b0b23361fc763eadc16faa55ddadcbae83bda3b93`。产物未单独发布；CI自动合并不代表平台发版或真实业务通过。详细公开交付索引见[本批记录](template-data-delivery-20261015.json)。
