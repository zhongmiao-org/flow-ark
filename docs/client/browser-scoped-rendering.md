# 正文选区检查与祖先空格

2026-10-19，接续[真实拒绝位置](browser-rendering-diagnostics.md#合并安装与真实-ui-证据)。已安装 v6/v1 会因选区祖先的非空生成内容拒绝正文；不能原地改变旧策略或删除该原因。本次增加 browser v7/collect、`browser-rendered-fields-v2` 和 `bounded-rendered-text-v2`，显式形成新草稿和新执行快照，原 v5/v6 与已保存结果保持。

## 设计先行

在原 Figma 文件 `sVciNUZHG9yx81gCpYzjH9`、Product Screens 页 `1:3`、Section `487:7024` 复用既有字段诊断页、按钮/Input、语义主题和 Noto Sans SC/Inter。三状态六板均为1440×1080、7个组件实例、无图片填充的可编辑图层，已整图查看；不是186画板完成或客户端验收。

| 状态 | Light | Dark |
| --- | --- | --- |
| 本人更新当前草稿的正文检查规则 | [953:10050](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10050) | [953:10159](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10159) |
| 核准无绘制祖先空格，仍需本人核对全文 | [953:10268](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10268) | [953:10377](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10377) |
| 空格带绘制或不明排版，仍拒绝 | [953:10486](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10486) | [953:10595](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=953-10595) |

普通字段配置对 v6 显示当前规则和“更新检查规则”，仅改当前草稿为v7；未应用字段/字段过期时先处理原编辑。更新不运行、不覆盖历史或原固定模板。新添加的关联正文动作默认v7；当前v5及v6仍能如实显示，不隐式升级。v7说明只检查候选，仍须完整阅读；“查看拒绝位置”沿当前节点策略检查，显示本次核准祖先空格数量，保持原取消/身份/失效边界。无拒绝不显示“正文完整”。

## 语言无关策略 v2

原 v1 的同次同步DOM、同源祖先/框架、隐藏/裁切/排版/嵌入内容检查、2000元素/6000节点/64祖先、20字段及字节上限全部保留。唯一增量：对目标以外的祖先（包括同源框架祖先）::before/::after，只有满足下述全部条件，才不把该生成内容列为 generated-content。目标自身或任何后代一律不适用；不沿隐藏/被拒绝子树继续搜索。

1. 计算content必须是一对相同单/双引号，其中仅一个或多个U+0020普通空格；无转义、无其他字符。不是对所有Unicode/ASCII空白的豁免。空content/none/normal沿原规则，不扩大本次变更。
2. 计算display限block/inline/table；white-space限normal/nowrap；background-color限transparent或rgba(0, 0, 0, 0)；四边border-width均为0px；transition-duration每项均为0s。
3. 下列计算值必须准确匹配；缺失、未知或其他序列化均拒绝，不尝试猜测等价CSS。此表是有限准入条件，不声称通用浏览器遮挡证明。

| 属性 | 必须值 |
| --- | --- |
| position / float / z-index | static / none / auto |
| background-image / border-image-source / outline-style | none / none / none |
| box-shadow / text-shadow / text-decoration-line / text-emphasis-style | 均none |
| -webkit-text-stroke-width | 0px |
| filter / backdrop-filter / transform / perspective | 均none |
| clip / clip-path / mask-image / -webkit-mask-box-image-source | auto / none / none / none |
| opacity / mix-blend-mode / visibility / content-visibility | 1 / normal / visible / visible |
| animation-name / contain / overflow-x / overflow-y | none / none / visible / visible |
| -webkit-box-reflect / rotate / scale / translate / zoom | none / none / none / none / 1 |

不更改任何网页样式，不滚动/展开/删除节点，不把textContent作为正文替代，不把伪元素原content发给模型。文字、转义空格、NBSP、保留空白、背景/边框/阴影/描边/强调/变换/脱离普通流等任一不符都保留generated-content，正文为null。祖先自身其他拒绝仍生效，核准一个空格不抵销其他原因。

依据：[CSS生成内容](https://www.w3.org/TR/css-content-3/)指出伪元素可能插入文字或图像；[CSS空白处理](https://www.w3.org/TR/css-text-3/#white-space-processing)区分折叠、保留和控制字符。以上额外绘制准入是FlowArk的保守有限规则，是工程选择，不是标准对任意网页完整性的保证。

## 协议与关联

候选0.43.0新增独立BrowserScopedRenderedFieldsNode（v7）/FieldResult/Result；输入字段仍用BrowserRenderedField。结果version=3、renderPolicy固定v2，每个字段增加必需ignoredAncestorSpaces（0–128）；非rendered-text或count!=1时必须0。其余字段状态、原因顺序/唯一性、null/值、完整性、准确根/框架/字段顺序和字节关系沿v1。计数仅为同次扫描核准的祖先伪元素数，不是正文丢弃字符数，也不是外发资格。v7不得接受结果v2/v1，v6不得接受v3。

流程、包/作者入口必须声明browser与browser-rendered-fields-v2，当前入口仍须自己的browser/use资源。不支持新能力的客户端明确阻止，不回退旧驱动/策略或自动改包。模板规则和站点定位继续在独立模板仓库，客户端没有BOSS分支。

临时诊断内部请求增加可选policy（v1/v2，缺省v1），响应policy须与请求一致；v2数据另有必需ignoredAncestorSpaces（0–128），v1保持原字节形状。响应不重复可选请求policy以覆盖已验证的必需策略。其余来源/requestId/定位/预算/32项位置及失效约定沿[诊断内部契约](browser-rendering-diagnostics.md)。诊断仍不读取正文或持久化。

## 当前证据与后续

项目自带Electron在隔离本机合成网页上观察了16个候选CSS条件：普通table/inline/nowrap空格可准入，文字、保留空白、绝对定位、背景、边框、阴影、下划线、图像、变换、混合、强调、滤镜、描边均拒绝。它只验证候选谓词的计算值，不证明正式驱动、宿主、原生UI或真实BOSS通过；没有应用单元测试或模型请求。

0.43.0候选固定147份机器资料，旧222个定义除Node追加分支外保持。39项新格式及34项原格式核对、有效v7样例/六项错误关联拒绝/错误能力拒绝通过；格式资料不构成真实DOM或宿主验收。重建摘要与治理链接检查另验，当前尚未发布。

先完成正式契约/规范关联与发布，再由客户端独立采用、相同策略执行/诊断和字段UI、类型/构建/受控浏览器及原生复验，打包保留原资料/Key/登录。随后通过作者UI更新BOSS局部草稿与严格来源校验，原始ZIP独立复导并核对真实JD候选。个人原任务只有上次已获准的单次重试已执行，不自动追加付费请求；完整个人Skill、账号/会话与招聘动作主线继续。
