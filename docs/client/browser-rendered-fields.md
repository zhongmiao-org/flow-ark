# 关联字段中的已排版正文

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
