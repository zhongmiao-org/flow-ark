# 当前网页字段的正文拒绝位置诊断

2026-10-19，[本人登录校准](boss-real-login-20261019.md)发现真实正文被 `generated-content` 阻止，但结果只列原因，无法分辨目标、祖先或后代。先补现有 Figma，再在网页字段工作区提供独立的“查看拒绝位置”；保持正式 browser v6、`bounded-rendered-text-v1` 及公开 0.42.0 原字节，不以放宽正文规则修复站点。

这是客户端内部的只读 IPC / 临时编辑器交互，遵循[契约分层](../../contracts/README.md#契约分层)，不新增流程节点、业务分支、公共模板能力、数据库记录或平台接口。实现类型不能单独代替下列语言无关约定；客户端独立构建，不读取治理目录。

## 先行 Figma

文件 `sVciNUZHG9yx81gCpYzjH9`，Product Screens 页 `1:3`，原 Section `487:7024`；复用已排版正文不可采用页、FlowArk/Button、AntInput、Semantic Light/Dark 和 Noto Sans SC/Inter。没有 Code Connect 文件，组件从原页面实例确定；六板均为可编辑图层、7 个组件实例、无图片填充，1440×1080。修正组件文字属性后按两主题整图核对。这些是本地字段验证的静态状态规格，不是运行历史新增数据或完整 186 画板验收。

| 状态 | Light | Dark |
| --- | --- | --- |
| 当前元素存在生成内容，解释拒绝位置 | [947:10008](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10008) | [947:10117](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10117) |
| 位置记录达到上限，原因仍保留 | [947:10226](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10226) | [947:10335](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10335) |
| 尚未检查当前定位，不读取旧 Run 的当前网页替代值 | [947:10444](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10444) | [947:10553](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=947-10553) |

## 内部契约 1

方法 `browser.embedded.fields.rendering.inspect` 仅供受校验的 Renderer 通过白名单 IPC 请求，使用原字段拾取的根/框架定位和当前内置网页。它不调用 Worker、模板 SDK、模型、网络请求或任意脚本入口；不导航、滚动、展开或修改网页。定位只支持表单当前静态值，变量尚未解析时明确禁用，不解析为别的目标。

请求为严格对象：`version=1`、`requestId`（非空字符串，最多100字符）、`root={selector,framePath}`、`selector`（字段相对根定位）。每个定位非空、最多2000字符；框架路径最多8层。响应不包含任何正文、DOM文字、原始CSS生成内容、属性、截图或可执行页面代码。

响应为严格对象：

| 字段 | 约定 |
| --- | --- |
| version / requestId | 1 / 准确请求身份 |
| root / selector | 与本次请求逐项相同，不能换根、字段或框架 |
| source | `resourceId`（1–256字符）、`documentRevision`（非负安全整数）；仅用于当前页面身份关联 |
| policy | 固定 `bounded-rendered-text-v1`，不能借诊断改变策略 |
| issues | 既有七种原因，按原策略顺序唯一排列；空列表仅表示本次有限策略未拒绝，不证明完整正文、账号或动作资格 |
| locations | 本次最多32条；每条为 issue、scope、depth、scanIndex、tag、pseudo、contentKind |
| truncated | 因位置记录上限未能列出所有已发现位置时为 true；不是正文截断，不省略原拒绝原因 |
| scannedElements / scannedNodes | 本次同一策略实际访问数量，沿用元素2000、节点6000及祖先64层预算 |

位置 `scope` 为 target / ancestor / frame-ancestor / descendant / unavailable；depth 0–6000，scanIndex 1–6000。已知位置的 tag 只保留最多100字符的安全标签名；无法定位时 depth/scanIndex/tag 为 null，不能伪造目标位置。祖先深度为从目标起的原扫描链距离，框架祖先单独标记；后代为相对目标深度。scanIndex 仅为本次访问顺序，不是选择器、永久元素ID或再次操作授权。

`pseudo` 仅 before / after / null。只有 generated-content 可带 before/after；此时 contentKind 为 whitespace-string 或 other-generated。whitespace-string 仅代表计算样式中一对相同单/双引号内全部为 ASCII 空白且不含转义；其余非空生成内容（包括转义和无法解释的CSS）一律 other-generated。该分类不返回原字符串，也不豁免空白生成内容。其他原因 pseudo/contentKind 均为 null。

诊断与生产读取必须复用同一有限策略、同一扫描与拒绝路径；诊断分支在任何 textContent/innerText/属性读取前返回，只产生原因及位置。位置达到上限后继续原有限策略，保持原因/预算，不能为多收诊断进入隐藏或已拒绝子树。非唯一根/字段、非法定位、预算超限、无法关联文档、导航/刷新/框架或目标替换、关闭、取消、超时均整次拒绝，不返回其他目标或部分诊断。

显示期间使用内部只读方法 `browser.embedded.fields.rendering.status`，严格请求为 `{source:{resourceId,documentRevision}}`（与响应同一格式），严格响应为 `{current:boolean}`。只比较现存资源、显示/加载/占用状态及文档修订，不启动浏览器、返回网址、重新检查 DOM 或持久化结果。不得把 Main→Host 的 review 接口直接暴露给 Renderer。

## 生命周期与普通界面

1. 仅在网页字段工作区、静态根/字段且读取方式为已排版正文时显示“查看拒绝位置”。沿用展开网页、原宿主准入和单操作互斥；活动 Run 须先处于可人工操作的暂停/等待状态，不能抢占浏览器命令。
2. Main 在原资源操作锁内处理，沿用15秒期限及原取消通道，保留准确 requestId。同一文档中固定根、字段DOM身份和文档代次，调用前后复验；完成后再核对资源/显示状态/文档修订。响应经严格格式、请求关系、原因/位置及字节预算校验后才返回。
3. Renderer 按请求身份、字段配置和组件生命周期接收；修改字段/读取方式/根/框架、切换页面、取消或关闭后丢弃迟到响应。显示期间复核内置网页资源和文档修订，变化后清除当前诊断并提示重新检查。不会自动再次采集。
4. 普通结果区按中文列出目标/第几层祖先/后代、标签、原因及 before/after、生成内容分类，可滚动完整阅读最多32条；达到上限明确提示。无原因时显示“本次有限检查未发现拒绝原因”，不能显示“完整”或开启模型/外发。
5. 不把诊断写入流程、模板、Run、来源结果、待办或公开ZIP。旧运行仍只显示原已保存原因，不能反查当前页面补写历史。原生字段验证、既有 v5/v6 及所选 Chrome 的实际执行保持；该编辑器诊断仅在内置网页可用，不冒充其他驱动验收。

## 祖先空格检查解释增量

2026-10-19 独立真实 JD 详情当前只报告 BODY::before 空白生成内容和核准数量0，仍不知道是哪项既有条件未满足。先更新现有 Light `947:10008` / Dark `947:10117`，十个文本节点复用字体/组件/主题并查看两主题整图；深色主按钮另放大核对文字正常。说明每个位置最多解释8项未通过条件、仍最多32个位置；示例不代表已发现真实网站的具体样式值。不增加截图、正文或原始CSS读取入口，不改变正式正文策略。

在上述严格内部契约1中增加显式解释模式。请求可带 `details="ancestor-space-checks-v1"`，只允许同时明确 `policy="bounded-rendered-text-v2"`；省略时请求和响应保持原形状。响应仅在请求解释模式时带同值 details，每个 locations 条目另有 ancestorSpace：不适用为 null，适用为下述严格对象。返回的 details 必须与请求完全相同，不静默降级成没有解释的结果。此为编辑器内部、无持久化的只读扩展，不改变公开0.44.0、browser v6/v7或正式字段结果。

适用位置必须是 generated-content、scope 为 ancestor / frame-ancestor、contentKind 为 whitespace-string，且策略为v2。祖先普通空格检查未满足时 ancestorSpace 为 `{failures,more}`；failures 为1–8个严格 `{rule,state}`，state 只能 mismatch / unavailable，表示不满足原条件或浏览器未提供可判断值，均保持拒绝。非适用条目必须 null；未请求模式时不得出现 ancestorSpace。普通采集和诊断仍共享原有判定，不为了获得更多原因进入原来不扫描的隐藏子树。多余检查只解释已发现的祖先空格，不读取 textContent、innerText、属性、CSS原值、生成内容原文或URL。

rule 为固定有限枚举，顺序同时用于唯一/截断校验：ordinary-space；position、float、z-index、background-image、border-image-source、outline-style、box-shadow、text-shadow、text-decoration-line、text-emphasis-style、-webkit-text-stroke-width、filter、backdrop-filter、transform、perspective、clip、clip-path、mask-image、-webkit-mask-box-image-source、opacity、mix-blend-mode、visibility、content-visibility、animation-name、contain、overflow-x、overflow-y、-webkit-box-reflect、rotate、scale、translate、zoom；display、white-space、background-color、border-width、transition-duration。每项通过条件沿[既有v2有限规则](browser-scoped-rendering.md#语言无关策略-v2)，不新增准入条件或把无法判断的值补成默认。

不是仅含普通空格的字面量时只解释 ordinary-space，和原短路判定相同；否则解释当前已存在的样式检查。某项检查需要的值为空时归 unavailable，其余失败归 mismatch，不回传实际样式字符串。每个位置按上述顺序只显示前8个失败条件；确有更多时 more=true且显示项必须恰为8。失败列表不得重复或无序，more 不表示正文截断。仍沿32位置、2000元素/6000节点/64祖先、15秒及65536字节的原边界，来源、取消、位置和规则变化继续清除迟到结果。

普通UI在该拒绝位置下用中文显示“定位方式不符合现有规则”“换行规则：浏览器未提供可判断值”等实际检查项，更多时明确提示，不能显示未执行检查为通过，也不展示原内部属性键或猜测“可以忽略”。无原因、可解释或仅有少量不符都不代表完整正文、账号或动作授权。接续客户端类型/构建、正式读取结果前后对照、有限生产浏览器观察、打包原生真实诊断；当前仅先行设计与内部约定，不计真实JD采纳或招聘验收。

## 接续与验收

### 祖先空格解释的客户端交付

治理 [#930](https://github.com/zhongmiao-org/flow-ark/pull/930) 已合并为 `6c468dfa9a6a31cc004d93de3bed9967636b24e6`，客户端 [#334](https://github.com/zhongmiao-org/flow-ark-client/pull/334) 已合并为 `66607b85351a8ce197240a6671e96bffa890272c`。两个 PR 均非草稿、最新提交无冲突；逐项核对远端完整树、所有变更路径和 blob、本地检查及 CI 最新 Validate 的计费说明/空步骤后，按用户例外授权 CLI squash。CI 没有实际执行，不计通过。

客户端共享格式、页面采集器、EmbeddedPage/Main 和字段编辑器已接入显式解释模式。类型、构建、变更文件格式和差异检查通过。隔离 Electron 使用生产 EmbeddedPage 观察11个页面场景，正式采集与默认诊断共40次新旧结果对照一致；定位、绘制、框架祖先、目标/后代不得解释、前8失败项与32位置上限分别核对。缺失 CSS 值为明确受控的主世界注入，生产隔离世界不受覆盖影响；直接序列化的生产采集器将缺失值标为不可判断，不能将该观察写作真实网站缺失样式证据。另有6种非法解释结构被严格格式拒绝。没有新增或运行应用单元测试，既有取消/身份检查保持，不将上述观察当作完整原生故障矩阵。

从准确合并树执行 `pnpm package:mac`，生成 ZIP/DMG 并由只读挂载的 DMG 更新原应用；14个包内符号链接有效，挂载、构建与安装 ASAR 一致。ASAR 为 `b1ffc50dd5dd238b35aaaceb877d673febb2d3906ba3f52cb5f19033a3b47b78`，ZIP 为 `5f332d4cc872d4b80c41f2366e419b2fcffeba2e912aee6bbeee89b02e6f4d20`，DMG 为 `4a4c1f85261e81368d3524d23578c1eeaab595b4795c53cd0f97246835885777`。保留旧应用和原数据本机副本，以原工作区启动；重开时原3002文档、9885事件及所有凭据保护摘要逐项完全一致。

在既有制作修订25的十步 JD 副本中，通过普通网页动作配置、原 `.job-sec-text` 定位和实际独立职位页检查。新界面明确显示祖先第7层 `BODY::before` 的空白生成内容：定位方式、层级、背景图像、不透明度四项均不符合原规则；41元素/74节点，核准空格0处，没有无法判断项或更多项。现场暗色界面与网页均已查看；字段定位验证仅证明唯一匹配，不能计作正文完整。刷新后旧诊断失效并提示重新查看，显式重查再次得到四项。未应用字段/采纳正文，未创建 Run、请求模型或招聘外发，原公开包与制作草稿未改。原网页账户入口保持可见，不将此认定为账号关联验收。

因此不能把该伪元素当作无绘制空格直接忽略。接续须评估实际绘制对选区可读性的影响及可验证的通用策略，先更新治理/Figma/独立契约再实现；不修改既有v1/v2的含义，不用网页可访问性文本或本次截图代替生产完整正文证明。当前完整个人 Skill、真实职位筛选/投递回执、跨批接续及网站150次上限仍未通过。

先完成客户端共享严格格式、Main/EmbeddedPage的同源目标关联与取消、现有策略诊断分支和普通UI。类型/构建/格式及受控真实浏览器观察，与原生UI/两主题/取消和来源变化分别取证；当前不新增或运行应用单元测试。随后打包更新旧应用，保留本人资料、Key和已登录会话，再通过UI核对真实BOSS拒绝位置。不能以设计或诊断成功计作JD完整、账号核准、Skill发布或招聘动作完成。

客户端实现的类型检查和构建通过。使用项目自带 Electron 的本机合成页面做八项策略观察，正式采集与基线结果逐项一致，诊断分支未读正文；Main/页面联动、同请求取消、互斥、目标替换、导航、面板隐藏及关闭失效另有六项隔离观察。没有新增/运行应用单元测试。这些与原生 UI、打包和真实 BOSS 验收分别记录。

## 合并、安装与真实 UI 证据

治理先行 [#903](https://github.com/zhongmiao-org/flow-ark/pull/903)、[#904](https://github.com/zhongmiao-org/flow-ark/pull/904) 已实际压缩合并，提交分别为 `ddce542`、`46f9778`。客户端 [#324](https://github.com/zhongmiao-org/flow-ark-client/pull/324) 合并为 `9bbebb4`；原生 UI 首次复验发现 Preload 白名单遗漏，随后 [#325](https://github.com/zhongmiao-org/flow-ark-client/pull/325) 补齐两个既定方法，实际合并为 `64616ef`。这也说明此前 Main/页面观察不代表完整界面已通过。各 PR 最新 CI 都是 Validate 未启动、steps 为空的付款/额度阻塞；按用户 CLI squash 例外，分别核对最新头、完整远程树和所有变更文件后合并，没有声称 CI 通过。

最终 `pnpm package:mac` 完成 ZIP/DMG，实际更新原应用并以原记录目录启动。安装与打包 ASAR 均为 `2f90cf945ee7c2bff56ca5f39e975e4d795a06085a0df7c4b80105b4d88cc7b5`；ZIP 为 `40e88285f1f2a2dfd80402c12b7da174cb2ee5cd0f1f6f732a80bd521fe91d6d`，DMG 为 `a6aca024341a1a0d3f4d45e0eaece05739f27c4b152df0711095950c63a6a18a`。保留更新前应用及工作区本机副本。以本次单次重试已完成后的数据为基线，更新前后 360 条文档无丢失，仅浏览器元数据变化；原事件和两份凭据保护文件摘要一致，访谈/完整来源/整理进度保持。此前累计127,030 Token不因更新重置，未再调用模型。

通过原编排副本的普通网页字段配置打开真实职位并点击“查看拒绝位置”，界面显示：祖先第7层、BODY、::before、空白字符串；本次检查66元素/124节点。账号入口仍显示已登录。暗色整图中卡片、按钮与文字可读；原生刷新后旧诊断被清除并提示重新查看，不会自动重新采集，随后显式再次检查得到同一拒绝位置。未改流程/模板 JSON、未创建校准 Run、未请求模型或执行招聘动作。亮色仅有先行 Figma 核对，本次未做亮色原生复验。

这证明现有 v1 策略的阻断包含 DOM 选区祖先的空白伪元素，尚未核准其视觉影响，不能据此宣布正文完整或直接忽略原因。下一步先定义区分选区内容与祖先装饰的通用策略及验收，再处理正文采纳；原 v6/0.42.0 结果保持。公开个人0.7.0/BOSS0.2.13、未发布0.2.14局部草稿及完整账号、来源、本人 Skill、外发与去重主线继续，未标记完成。详细真实账号/运行标识与原生现场仅留本机，不进入本次新增治理提交。
