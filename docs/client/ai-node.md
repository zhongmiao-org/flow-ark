# 结构化 AI 通用节点

2026-10-16 G2已交付：客户端#287采用发布0.28.0并安装，ai v2显式failureMode及status/result/error引用、受控请求故障收据和结果视图已接入；[运行、原生制作与独立复导证据](ai-failure-outcome.md#g2客户端安装与原生复导)。默认stop，v1保留，明确升级才调整引用；资源/取消/期限/程序与存储错误仍中断。真实API及业务另验；下述先行与v1条目保留历史含义。

2026-10-16先行扩展：现有v1仍直接终止请求故障；[ai v2失败策略/结果/取消的四状态Figma及0.28.0契约](ai-failure-outcome.md)已定义，待真实发布及客户端采用。不自动改写现有节点、公开包或旧Run；下述原v1实现证据保持。

2026-10-15，长期计划G1/G2的首批能力。契约见[0.18.0](../../contracts/v0.18.0/README.md)。个人蒸馏、JD与回复仍由模板配置指令和输出格式，客户端不写业务判断。

## Figma先行

在原文件补充[节点配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5279)、[资源缺失](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5392)、[请求与取消](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5476)、[失败恢复](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5562)。复用Button/AntInput、原字体及Semantic主题，保留原186与上一批26场景。

节点位于动作库独立AI组，既可在步骤清单也可在编排检查器配置；绑定逻辑资源、用户供应商和明确模型，指令为多行文本，输入沿用ValueField来源选择。输出格式提供字段名/类型/必需的可视化编辑，复杂结构保留高级JSON Schema编辑。AI绑定独立于“允许脚本读取凭据”；切换供应商清空模型，不在节点中输入Key。保存/切换不调用模型。

配置区复用现有表单与未保存守卫，控件纵向排列并允许操作换行。运行前核对列出供应商、模型、网络发送和用户token消耗；节点结果沿用既有结果查看器呈现结构化输出、请求ID、实际模型及可取得的用量，未知用量为null。Key缺失或非法格式阻止调用，失败不输出可供后续步骤采用的结果。

## 本批证据与后续

- 治理[PR #738](https://github.com/zhongmiao-org/flow-ark/pull/738)已合并为 `86ddfdfd45a99f020a01761ee9c6d0c4d5688861`，Validate与Auto Merge通过；已发布不可变tag `contracts-v0.18.0`，包与SDK版本不变。
- 客户端[PR #271](https://github.com/zhongmiao-org/flow-ark-client/pull/271)实现动作库、配置、输入引用、宿主请求、运行核对与模板导出声明；采用上述治理提交和契约。最新提交`acf3f8f`的Validate与Auto Merge通过，实际合并为`b5e59a187f5fe51b8f54f6fd8c66ac1447f761fa`；创建PR时标签触发的旧检查取消，未将旧结果作为通过依据。
- 本地 `pnpm contracts:generate`、`pnpm typecheck`、`pnpm build`、变更代码Prettier、固定契约校验和及`git diff --check`通过；构建有现有大包提示。按当前阶段约定未新增、未运行单元测试。
- 使用实际生产配置组件做隔离人工预览，只有虚构模型元数据，不连接宿主或模型。已核对供应商切换清空模型、显式采用本地已存模型、字段增改/布尔类型、重复名称保留草稿、无效JSON恢复、明暗主题和窄栏。该核对不证明宿主执行、真实Key可用或模型请求成功。
- 原生安装后运行、两家真实API及鉴权/限流/取消回执、ZIP导出与独立复导仍待验收；保留当前日用客户端进程，未以并行原生实例或预览替代。

高级JSON Schema支持复杂嵌套配置；本批可视化字段编辑仅覆盖顶层字段，不声称已经具备完整嵌套Schema作者工具。多轮持久会话、Skill确认版本、资料解析及BOSS模板仍为长期计划待实现项。无Key或服务不可用时不能用受控响应记作真实API通过。


## 2026-10-18 输出结构的可视化接续

BOSS网页方向评估已从准确0.2.8通过客户端复制为0.2.9制作草稿，独立入口增加到十八步并正常保存；本人核对/拒绝、确认后网页复核、固定配置、五项组合输入、就绪条件、固定Skill及AI节点均在UI维护，尚未带回/导出/运行。实际制作证实当前AINodeConfiguration只提供顶层名称/类型/必需，数组items为空，枚举与字符/数组范围仍须高级Schema，不能以粘贴JSON跳过普通制作路径。先补本段设计及通用UI，再继续模板；原公开个人0.7.0/BOSS0.2.8、安装#316、原个人数据与授权边界保持。

复用既有组合编辑884:9178、Ant Input139:2、Button1:146/1:148/1:152与Semantic Light/Dark、Noto Sans SC/Inter，在原文件sVciNUZHG9yx81gCpYzjH9、页面1:3、Section487:7024追加六张1440×1080可编辑状态：

| 状态 | Light | Dark |
| --- | --- | --- |
| 字段树、选项与数组项 | [918:9684](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-9684) | [918:9803](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-9803) |
| 字段未完成或格式无效 | [918:9922](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-9922) | [918:10042](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-10042) |
| 原结构已变化 | [918:10162](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-10162) | [918:10282](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=918-10282) |

六板均12组件实例、零图片填充；修正选中字段与右侧内容一致后查看六张最终整板，继承跳转已清除，Section扩为4480×106900。采用通用示例而非客户端招聘业务文案。静态规格不计可点击原型、客户端或真实模型验收。

- 保留现有AI节点入口、顶层快捷字段和高级Schema，增加“编辑完整输出结构”进入覆盖内容区的字段树，复用既有通用Schema编辑能力及覆盖层/网页可见性/焦点协作；紧凑窗口纵排和自然滚动，不在窄检查器塞两栏。普通作者可逐层维护对象、数组项、标量可选值、必需、未声明字段策略、字符串/数值/数组范围，不要求手写JSON。原规则和本地引用原样保留，不自动展开引用或把Schema中的字面数据解释为流程变量；高级结构可选，不承诺可视化表达任意JSON Schema。
- 打开固定当前节点与原Schema副本，在局部草稿编辑。字段键/高级文本未应用时保护切换与整体应用；重名、无效格式、非对象根、超64KiB或既有AI深度/复杂度限制停止并保留输入。范围上下限冲突应明确指出，不能把失败转换为已保存。数组编辑其items；对象才可添加子字段，避免给标量隐式改类型。
- “应用输出结构”先核对AI格式与现有宿主Schema校验，再仅替换当前节点Schema；节点保存、运行与公开导出仍独立。父节点/原结构变化、取消、异步旧校验回执或应用失败不得覆盖最新值或关闭丢稿；校验中禁重入，结束前复核原结构当前性。未知JSON/引用不因普通字段编辑静默移除。
- 返回/Escape/关闭有修改时给继续编辑/明确放弃；取消保持原节点，未完成编辑阻止外层保存、运行、导出、切换节点及结构撤销。应用后回到原控件与节点；不读取凭据、不调用模型、不创建Run。只读/格式资料检查不等于真实输出语义验收。
- 仅Renderer通用编辑能力，复用既有白名单schema检查，不增加IPC、SDK、协议、数据库或业务提示词。公开0.39.0和包2.0不变，不改AI v1/v2、Provider请求、绑定/权限或历史Run；字段业务归模板。原生模板新入口保留未完成状态，不用高级JSON代替本项。

本批继续不新增/运行单元测试。实现后按需类型/构建/格式、生产组件受控观察及真实原生字段/数组项/选项、无效与未完成/取消/变化/两主题/紧凑/网页协作核对，再验证标准ZIP导出/复导与原记录保持。安装包生成、实际更新和业务分别记录；当前仅先行设计，客户端实现随后接续，完整G3–G5/186/Agent/S08保持。


## 2026-10-19 通用输出结构编辑交付

治理先行 [#881](https://github.com/zhongmiao-org/flow-ark/pull/881) 实际合并 `aed9c62865169cf451a2112cc2802e07030783c8` 后，客户端 [#317](https://github.com/zhongmiao-org/flow-ark-client/pull/317) 固定采用该基线，实际合并 `9e035782d5add4aded96fbbe161ee05fe0fb6844`；源提交 `4eda19c926520c7a24bca20d1e5be197aa394e2f` 与合并树相同 `053adf329614a09accc295d4867a9a9d328e456e`。最新 CI [39143437874](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/39143437874) 的 Validate `117722347335` 没有运行步骤，准确注释为账户付款失败或消费限制；本地检查、完整远端 diff 及六文件字节核对后按用户授权 CLI squash，不记 CI 通过。PR 附件已达一百条上限，保留既有附件并记录直接链接。

复用 `AuthorSchemaEditor`，普通入口可逐层维护对象/数组项、必需、标量 enum、未声明字段策略及范围，保留顶层快捷编辑和高级 Schema。本次普通 enum 编辑不转成 oneOf，已有组合规则保持；默认值/const/enum 中的字面数据不被误当成流程变量或 Schema。对象才可加子字段。局部草稿只有通过 AI 格式和既有 `author.schema.check` 后才回写节点，之后仍需保存流程；白名单、契约 0.39.0、Provider、SDK、数据库及运行权限不变。

- `pnpm typecheck`、`pnpm build`、变更文件 Prettier 和 `git diff --check` 通过；构建有既有大块提示。按阶段约定未新增或运行单元测试。
- 在原生隔离作者实例通过 UI 配置六个必需字段：decision 三项 enum、reason/targetRole 字符约束，以及 quotes/unknowns/conflicts 的数组上限和逐项字符串约束；没有粘贴 Schema 或手改流程/Store/ZIP。真实白名单宿主校验、应用、保存、正常退出后重开，六字段、三项 enum 与 quotes 上限 3 保持。
- 原生核对字段键未应用时保护切换/整体应用、返回后继续/明确放弃不丢输入、放弃不产生撤销记录、标量禁止加子字段；reason 下限 900/上限 800 时显示具体范围错误并禁用整体应用，修正后恢复。Dark 六字段及 Light 数组详情已查看，之后恢复跟随系统。未完成字段放弃后全部 35 文档/零事件/受保护文件摘要相同；实际保存后只有目标流程 `525dbc99-bc19-4681-acb9-75ad3a478a42` 变化，其余 34 文档、零事件及保护凭据保持，没有 Run。
- 实际生产组件的隔离人工观察使用合成校验服务，覆盖原结构在响应前变化、校验异常、取消/放弃后迟到响应，分别不采纳并保留适当草稿；正常响应只采纳一次且本地 `$ref`、定义及字面 `$ref`/范围数据保持。该观察不代表真实 IPC 故障注入、Provider 或业务验收；正常原生应用走真实宿主。
- 从准确合并源码 `pnpm package:mac` 生成 ZIP/DMG，通过 bundle 相对链接核对，从只读 DMG 更新 `/Users/mac/Applications/FlowArk.app`。新 ASAR `bc99e215d19a9b50134cf341dd8d012de90e5f1f675e6db7a0e620977b4db025` 与生成/DMG/安装一致；ZIP `e9241871d06cdb1d0caa87a84c930cfaf3fe4ecdbaddc5cecc3a1f3cdd711757`，DMG `af632fcf46ea49969a432c763e5bd5296753eb5da71a09c7113407f8772cf456`。旧 #316 应用和 SQLite/保护凭据备份位于本任务 `/private/tmp/flowark-scoped-picker-20261018/`，没有清库。
- 安装版在原个人目录实际重开、UI 显示 31 流程及原 DeepSeek 已配置；原 247 文档、94 事件、2 保护凭据逐项摘要完全相同，含 7 Run、31 流程及 22 完整来源索引，没有自动重放或新模型请求。作者目录另行正常重开核对上述结构。

原生紧凑窗口、完整网页面板协作矩阵、任意复杂 Schema、标准 ZIP 独立复导及真实模型语义仍未作为本批通过项。当前 BOSS 0.2.9 十入口/十八步只是未带回、未导出、未运行的制作草稿，AI 组合输入、标准结果和三路分支继续通过 UI 完成；公开个人 0.7.0/BOSS 0.2.8 保持。没有本人付费重试、登录、状态写权限或招聘外发；G3–G5、186、Agent 与 S08 保持完整目标。
