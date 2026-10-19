# 关联字段中的已排版正文

2026-10-20，[内置关联采集的框架核验修复](browser-collect-scope.md)已复现无关iframe/Worker误使来源失效，以及固定路径交换后旧框架被采纳。两主题失败页面先行更新；拟按既有顶层/所选框架语义修复，不改本页同步文字策略或封存协议。当前尚未修改客户端或安装，不把隔离观察当真实BOSS返回验收。

2026-10-18，接续[网页 JD 来源](boss-web-jd-source.md)。现有 browser v5 的 textContent 不承诺可见性，已有 v1 read/innerText 在未渲染根上还可能返回后代文本。此处增加独立有界策略和节点版本，不能直接更换旧节点的读取实现或把页面文字当作可信指令。

## 设计先行

沿用原 Figma 文件 sVciNUZHG9yx81gCpYzjH9、页面 1:3、Section 487:7024，从现有关联采集四状态复用组件、Noto Sans SC/Inter 与 Semantic 两主题，新建八张 1440×1080 可编辑页面；原 186 与旧 v5 八板保留。

| 状态 | Light | Dark |
| --- | --- | --- |
| 配置混合字段与正文方式 | [898:9334](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9334) | [898:9446](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9446) |
| 正文候选可读、仍待本人核对 | [898:9558](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9558) | [898:9667](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9667) |
| 隐藏/裁切/无法判定，不采用正文 | [898:9776](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9776) | [898:9885](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9885) |
| 页面变化或预算等整次拒绝 | [898:9994](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-9994) | [898:10103](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=898-10103) |

每板 33 Frame/3 Ellipse/21 Vector；配置板 45 Text/9 Instance，其余 44 Text/7 Instance，零图片填充。八板修正实例覆盖后全部查看整图，清除继承跳转；Section 扩为 4480×85900。只是静态规格，不计可点击原型、客户端或真实业务通过。

作者从动作库选择新关联正文采集，在已有字段 UI 中选择 DOM文字、原始属性或“已排版正文（待核对）”，维护定位/变量和必填，无需编辑 JSON。旧 text/attribute 字段仍可混用。结果展示全部正文的滚动区域、主要状态、原因码和来源；null、空白、缺失、重复、隐藏、裁切、无法判定分别展示，高级原文折叠。失败保留配置，不自动点击展开、滚动、换驱动或重试。

## 契约与实施顺序

[0.39.0 候选](../../contracts/v0.39.0/README.md)定义 browser v6/collect、browser-rendered-fields-v1 与 version=2 的关联结果。旧 v5、SDK 1.0、包 2.0、IPC 和数据库格式保持。新策略只产生本次检查通过的已排版文字候选，明确包括正常可滚动区域，不等于当前屏幕像素、完整业务正文或账号身份。

正文读取先检查渲染与有限 DOM/祖先范围，再读取 innerText；隐藏、裁切或策略无法判定时 value=null。不能先取得隐藏文本再过滤、截断或由模型补全。DOM文字仍是原始 textContent，不得混称为正文。具体预算、状态关联与策略义务以契约为准。该策略不能证明覆盖层、虚拟列表未加载内容、站点删节或页面真实性，最终完整性仍需本人核对。

技术依据：[HTML innerText 的未渲染回退](https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute)与[CSSOM View checkVisibility 的有限检查](https://drafts.csswg.org/cssom-view/#dom-element-checkvisibility)。不以仅调用这两个接口代替完整策略检查。

先发布治理契约，再由客户端独立采用：生成类型/白名单、动态引用、固定节点与实际结果核对、内置/所选 Chrome 驱动、宿主成功结果关联、作者和正式包能力校验、字段 UI、动作库及结果详情。不能证明文档代次或策略的模式明确阻止；Firefox/Safari 不因 API 名称相似而计为支持。之后从普通 UI 从零编排、原始 ZIP 导出、独立空工作区复导/自选浏览器并运行，再串行打包更新旧应用，保护原访谈与凭据。

本阶段不新增/运行客户端单元测试；类型、构建、契约资料格式核对与受控实际浏览器观察分别记录。需覆盖普通/可滚动正文、隐藏根/后代、opacity/content-visibility、line-clamp/overflow、遮罩/变换/生成/嵌入内容、空白/缺失/多匹配、扫描与文字预算、导航/同网址刷新/框架/取消、变量和正式入口结果来源。G1 资料不能替代真实驱动或 UI 验收。

随后通过客户端升级公开 BOSS 模板：先做站点和登录遮挡预检，明确遮挡时不运行正文采集；无明确遮挡仍需正文策略通过及本人核对，再固定配置/Skill、用用户自己的 Key 生成三路内部建议。不能用一般可见性检查绕过登录、读取隐藏站点数据或自动取得发送权限。暂不登录、待批准付费重试与被拒状态写边界保持；完整 G3–G5/186/Agent 不缩减。

## G1 本机资料核对

候选包含 124 份固定机器资料，完整重建字节相同；原 0.38.0 的 121 份资料中，118 份完全保持，仅 Schema、正式包与作者定义校验各增加新版本入口。34 份正反格式资料、61 项纯参考关联/预算/能力/作者/正式包核对通过；参考模块与依赖 TypeScript 检查通过。核对包括正文 64 KiB 边界、UTF-8 与转义后总预算、原因/状态/null 的准确关联、隐藏优先级、可选正文失效仍不完整、旧能力不足、错误来源/字段顺序/定位及非法引用。

这些参考仅验证协议资料与确定性规则，没有 DOM、真实驱动、用户 Key、模型、Run 或单元测试套件执行，不能证明渲染策略已经实现。已安装客户端仍 #313/0.38.0，个人 0.7.0/BOSS 0.2.6 不变；发布/消费者/安装与原生复导随后分别记录。临时核对材料留在本机，不进入公开模板。

## G1 实际发布与 G2 接续

[PR #870](https://github.com/zhongmiao-org/flow-ark/pull/870) 最新 [CI 39123796882](https://github.com/zhongmiao-org/flow-ark/actions/runs/39123796882) 的 Validate 117664624057 明确因付款/支出限制未启动，steps=[]，不计检查通过。GitHub PR diff 接口对本次 2,966,455 字节差异返回 HTTP406（超过 20,000 行）；改为核对远端 base/head 的完整提交树、完整分页变更清单和 132 个文件的完整内容与 blob，而非省略大文件。全部与准确本地源一致、本地检查通过，按用户授权 `gh pr merge --squash --match-head-commit`。

实际合并 `c80712a6c98e6fc25e499e6042b5e41c79fd571f`（2026-10-18T11:38:05Z），与源 `e323c325b7d8dcfdc22751a1921016080c545db0` 内容树均 `0f8114de2866db896cffec6e2354a4508cacc877`。不可变 `contracts-v0.39.0` 已实际推送，远端 tag object `48c99114ad04110ea73243212052483669061c58` 准确解引用上述合并；124 份机器资料固定。[结构化证据](browser-rendered-fields-g1-20261018.json)区分规范资料、真实驱动及客户端状态。标签内“候选”是封存前历史，以本段实际发布为准。

G2 从该 tag 独立采用，先实现有界同步渲染检查和文档当前性、宿主准确节点关联，再接既有字段维护/动作库/结果展示。真实内置/所选 Chrome、原生 UI、独立 ZIP 复导、打包及旧应用更新分别取证；不可因为普通网页、规范模块或标签成功就宣称真实正文/完整 BOSS 通过。当前日常应用及公开模板保持，无本人计费请求或招聘动作。


## G2 实现、原生 UI 与独立复导

2026-10-18，客户端 [PR #314](https://github.com/zhongmiao-org/flow-ark-client/pull/314) 独立采用固定 `contracts-v0.39.0` 的 124 份机器资料及治理基线 `01eb02eefe8bb9085b25827669d464478550c81f`。生成类型与 CSP 静态校验器，新增闭包无关的同步正文策略函数；内置与已选 Chrome 在原采集路径显式分发 v6，继续固定顶层/逐层框架文档身份，结果前后核对导航/刷新/关闭/取消。宿主按准确固定节点版本、实际解析输入及入口能力核对，配置证明与完整结果同事务登记；没有新增 IPC、数据库格式或招聘业务。v5 仍使用原 DOM文字/属性读取与预算，已有节点不隐式升级。

字段 UI 在既有 Ant Design 编辑器显式选择 DOM文字/原始属性/已排版正文（待核对）；支持变量、字段重排和必填。可读结果增加隐藏/裁切/无法判定及原因，受影响正文为 null，可选正文失败同样使 complete=false；完整候选保留段落和滚动阅读，高级 JSON 仍是折叠核对。使用既有 Figma 八状态及主题组件，浅/深色结果均已实际查看。通用策略不是像素验证、全站正文或账号证明；无法检查的跨域框架祖先返回 unsupported/null，不回退 textContent。

### 实际驱动观察

生产 EmbeddedPage 与真实 Electron WebContents 的 32 项、生产 PlaywrightDriver 与本机已装 Chrome 的 31 项受控本机页面观察符合预期。包括普通段落、正常滚动全文、隐藏根/后代、opacity=0/中间值、content-visibility、line-clamp/overflow、滤镜/变换/裁剪/paint containment/活动动画、生成文字/嵌入内容/自定义元素、空白/缺失/多项、混合原始字段、同源框架及跨域祖先不可判定、元素/节点/祖先预算、64 KiB 边界/单项与总量超限，以及同网址刷新、不同导航、选中页更换或取消后的结果拒绝。Chromium 对有效 webkit clamp 的 flow-root 计算样式在观察中补严后复核通过。

这些是合成页面和显式收据期间故障注入的驱动证据，不能证明所有实际站点、任意字体/布局、真实操作系统磁盘故障或完整并发矩阵。没有新增或运行单元测试、没有用户 Key/供应商/token 或招聘动作。完整策略/故障/变量/预算边界与 Firefox/Safari 各自验收仍保留。

### 原生 UI 制作和独立实例

空作者工作区用普通 UI 创建“正文采集 · UI 可复用核对”，添加打开本机合成页及 v6 采集两步，设置唯一根和正文定位/读取方式、保存并选择内置浏览器。正常 Run `02ab071e-e0e1-4204-9088-168f16ddc8d0` 实际完成，结果展示两段正文与本次准确来源。标准 UI 直接导出原始 ZIP，6 文件/1916 字节，SHA256 `aefcc94adfdb62446b896eaf5242a9d37a2e45c16d06b30551722fd83274b771`，明确声明 browser/browser-rendered-fields-v1 及自身 browser/use，无作者绑定或授权。

另一个空工作区通过 UI 导入同一未经手改的 ZIP、摘要校验/安装/创建新实例并单独启用/绑定浏览器。正式入口 Run `ced28c57-1fcf-4a58-9b4d-0f99e7a735e0` 完成并显示相同准确来源和两段正文；不是直接改库/流程 JSON 或手工改导出包。作者正常重开后原流程/Run 仍可见，UI 将目标改为含隐藏后代的合成区域，Run `9c80a6ee-8bfe-4e77-9bff-b28de84dc3f0` 完成但 complete=false，正文 null/“后代含隐藏区域”，未泄露其剩余文字。浅/深色查看同一已保存结果没有重新执行。

闭合作者工作区为 18 份加密文档/14 事件/2 Run/2 份原输入证明，消费者为 14 文档/7 事件/1 正式 Run/1 份原输入证明。临时 ZIP/本机合成网页是通用 UI 复用证据，不进入公开 BOSS 包，不冒充真实 JD、参数化公开业务模板或完整 UI 矩阵。只读工程检查用于核对原包摘要和真实记录计数，正常制作及使用全程 UI。

### PR、CI 与安装层次

准确源 `ce7422a0ca519cf44aabe5e313b4be322668d7a8` 的 [CI 39125664920](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/39125664920) Validate `117670132259` 因付款/支出限制没有启动，steps=[]，不记作检查通过。完整远端 996936 字节差异、base/head Git 树、分页 32 文件清单及所有 Git blob 内容与本地逐一相符；按用户明确授权 `gh pr merge --squash --match-head-commit`。实际合并 `ee9d4781dfb9bd1cd7433b038908a0242e550b4a`（2026-10-18T12:04:04Z），源/合并树均 `b46d6de950e063fc918328877a25a586df8fc303`。PR 附件遇线程身份上限，保留现有附件并在文档提供直接链接。

`pnpm contracts:generate`、124 份 SHA256、`pnpm typecheck`、`pnpm build`、相关源文件 Prettier 与 `git diff --check` 通过；大 chunk 提示保持。已从实际合并 main 完整执行 `pnpm package:mac` 生成 arm64 ZIP/DMG；未下载自动化浏览器，现有可选跨平台依赖/未签名开发包提示保持。

公开个人 0.7.0/BOSS 0.2.6 本批保持。网页正文接入模板、本人的最终 Skill、真实两供应商调用/token、实际账号/JD/外发与 G3–G5/186/Agent/S08 全矩阵继续；暂不登录、原付费失败片段待批准重试及被拒状态写边界保持。


### 安装与原个人工作区恢复

完整合并源码包已实际串行更新 `/Users/mac/Applications/FlowArk.app`。候选与安装 ASAR 均 `9e7883c76aa074bb68fe17a5c51216c9e91b837cb9c880779a22e574546b810b`；ZIP SHA256 `a4c071cc90a3d61a28024c2bb893fd0f581d197f1c595ab1f0d659663bed5307`，DMG SHA256 `6372605b205a214606bfc62df22482783254e31bc76a7433e88a6267add852f1`。旧 App 与闭合原资料备份保存在本机临时验收目录，未删除或修改原输出、登录态、Key 和原访谈。

实际安装版经 UI 重开同一独立消费者正式 Run，仍显示准确来源和两段正文；14 文档/7 事件/该工作区保护凭据逐项字节摘要保持，无新增 Run。正常退出后不用观察 hook、以原个人目录恢复日常应用，247 加密文档/94 事件/两份原保护凭据/7 Run/31 流程及22次来源索引全部逐项保持，实际只有一个日常主进程。安装重开与原资料保护取得证据，但没有因此触发原失败片段付费重试、生成最终 Skill 或接通 BOSS 正文/外发。
