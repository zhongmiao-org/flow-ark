# P1 0.43.0: bounded rendered text v2

2026-10-19 formal candidate, unpublished. Client adoption is prohibited until the real merged tag is verified. Inherits immutable 0.42.0. Package 2.0 / SDK 1.0 stay unchanged.

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

临时诊断内部请求增加可选policy（v1/v2，缺省v1），响应policy须与请求一致；v2数据另有必需ignoredAncestorSpaces（0–128），v1保持原字节形状。响应不重复可选请求policy以覆盖已验证的必需策略。其余来源/requestId/定位/预算/32项位置及失效约定沿[诊断内部契约](../../docs/client/browser-rendering-diagnostics.md)。诊断仍不读取正文或持久化。


The three new definitions in p1.schema.json, ancestor-space-policy.json, browser-scoped-rendering.cases.json and example.browser-scoped-rendering.json are normative format/policy data. browser-rendered-fields.ts is a pure association reference; it does not establish rendering, host provenance, user confirmation or action eligibility.
