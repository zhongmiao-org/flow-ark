# P1 契约 0.39.0：有界已排版正文与关联采集

2026-10-18，接续不可变 [0.38.0](../v0.38.0/README.md)。新增 browser v6、browser-rendered-fields-v1 与 version=2 的关联采集结果；保留 v1–v5、SDK 1.0、包 2.0、IPC 和数据库格式。本候选尚未发布，不提前由消费者采用。先行[八种两主题 Figma 与实施门槛](../../docs/client/browser-rendered-fields.md)。

## 输入与来源

BrowserRenderedFieldsNode 沿用 v5 的唯一根 selector、最多八层 framePath 和有序 1–20 项 fields，但 version=6。BrowserRenderedField 增加 operation=rendered-text；与 text 一样 attribute 必须 null，可与原 text/attribute 混合。定位/属性名支持既有作用域引用，执行前解析为严格文字；字段键唯一且禁止保留键。原 text 仍是 textContent，不更换成已排版正文。

一次驱动调用在选定框架的同一同步 DOM 执行内定位根、各字段、检查渲染并取得文字；不允许 await、轮询、滚动、点击、展开、改 CSS 或 DOM。只查询根后代，不穿越 Shadow DOM/其他框架。宿主前后核对本会话及顶层/目标框架文档代次，包括同网址刷新；变化、框架脱离、错误选择器、根零项/不唯一、取消或期限使整次拒绝。网址相同不是文档身份证明；不能保证的驱动应明确拒绝，不回退或切换。

## bounded-rendered-text-v1 策略义务

此模式返回的是**本策略检查通过的已排版文字候选**，包括通常可滚动到的正常文档和 scroll/auto 区域；不是当前屏幕像素提取，不宣称已证明整页或业务正文完整。不得读取私有接口、页面隐藏数据或用模型补全。

读取 innerText 前必须先检查目标、祖先和有限后代范围。任一被检查范围无法证明支持时不读取该字段正文，返回对应原因及 null；不能先读取隐藏正文再过滤。根/祖先隐藏或自身非 HTMLElement/无可支持布局不能依赖 innerText 的未渲染回退。原 text 字段保持 DOM 文字模式，不与正文混称。

1. 目标及祖先 display:none、visibility 非 visible、opacity=0、content-visibility:hidden/当前跳过内容，或目标无布局盒，记 hidden-target。可判定隐藏后代记 hidden-descendant，不再进入该隐藏子树。存在隐藏边界时，不能只返回剩余可见片段并称成功。
2. 目标、祖先或受影响后代存在有效 line-clamp，记 line-clamp。overflow hidden/clip 且观察到 scroll 尺寸超出 client 尺寸、或相关布局矩形越出裁切区域，记 overflow-clip。不得把裁切前的 innerText 当作已显示文字。普通视口外正文和可滚动 auto/scroll 容器本身不是裁切证据。
3. 无法支持的布局/渲染记 unsupported-layout，至少包括 display:contents/缺少判定 API、clip/clip-path、mask、filter、非平凡 transform/perspective、paint containment、非 0/1 透明度、影响范围内活动动画/过渡、字体尚未就绪或无从可靠检查的框架祖先样式。后代含 Shadow DOM/自定义元素、iframe、canvas、SVG/MathML、图像/音视频/对象或表单控件等非纯文字承载时记 embedded-content，不提取其隐藏 DOM/属性替代视觉内容，不做 OCR。before/after 存在非空生成内容记 generated-content，不拼造或遗漏后宣称完整。
4. 无上述原因时才调用已渲染 HTMLElement 的 innerText；保留结果，不 trim/重新排版/截断（仅用 trim 判断空白）。每项检查一次，不自动等待样式变化。不得以单个 checkVisibility() 或 innerText 调用代替上述边界。

原因顺序固定为 hidden-target、hidden-descendant、line-clamp、overflow-clip、unsupported-layout、embedded-content、generated-content，去重；同字段含多类原因时状态优先 hidden → clipped → unsupported。允许只返回已观测的原因，不要求继续进入隐藏或不支持的子树来穷举原因。

每次 collect 合计最多检查 2000 个元素、6000 个 DOM 节点；每条目标祖先链最多 64 层。计数含重复访问、祖先及检查 before/after 的所属元素，伪元素不额外算节点；先检查预算再访问下一项。达到上限允许，下一项使整次拒绝；不能返回部分扫描结果。实现可以更早因统一节点期限/取消拒绝，不能悄悄采用更小范围。范围内闭合 Shadow DOM 无可靠探测时，其自定义元素按不支持处理。

该有限策略**不证明**任意覆盖层、站点删节/虚拟列表未加载内容、页面或公司真实性、阅读后的变化，也不能作为绕过访问控制的依据。需要完整业务正文时，模板仍须先检查站点限制，再用完整候选与来源的人工核对；完整声明不改变账号或外发权限。页面可以恶意伪造文字，不能据此获得宿主授权。

## 输出与预算

BrowserRenderedFieldsResult 严格含 version=2、operation=collect、renderPolicy=bounded-rendered-text-v1、url/documentUrl、selector/framePath、complete、有序 fields。每项准确重复 key/selector/operation/attribute/required，附 count/status/value/issues；issues 总是数组，原始字段、零项/多项均为 []。

| 情况 | status | value / issues |
| --- | --- | --- |
| 零项 / 多项 | missing / ambiguous | null / [] |
| 唯一属性不存在 | missing-attribute | null / [] |
| 唯一文字/属性为空或仅空白 | empty | 原始空白 / [] |
| 唯一有效值，正文已通过本策略 | ok | 原始文字 / [] |
| 唯一正文存在隐藏边界 | hidden | null / 包含隐藏原因 |
| 唯一正文存在裁切证据 | clipped | null / 包含裁切原因且无隐藏原因 |
| 唯一正文无法按策略判定 | unsupported | null / 仅不支持原因 |

正文不可采用时不返回片段，即使该字段可选也 complete=false；多匹配或必填非 ok 同样 false。可选 missing/missing-attribute/empty 不单独使不完整。complete 只描述本次字段检查，不代表完整 JD 或身份。

原 text/attribute 值仍最多 8192 UTF-8 字节；rendered-text 值最多 65536 字节，网址各 16384 字节，整个非美化 JSON.stringify 结果最多 131072 字节（含元数据）。严格 Unicode，任何超限/无效字符整次拒绝，不 truncate 或返回预算内部分。数据 Schema 字符上限不替代字节/关联检查。

## 能力、持久化与采用

流程/入口明确声明 browser 与 browser-rendered-fields-v1，入口还要自己的 browser/use 资源；只有 v6 不自动满足旧 browser-fields-v1，v5 不自动获得新能力。作者草稿与正式 ZIP 都须校验，不支持客户端在导入/预检阻止，不从 v5 隐式升级或改写旧 Run。

宿主按当前不可变节点和真实解析输入核对顺序/范围，调用前后复验文档与取消。内部证明与受保护结果按准确 Run/节点实例登记；公共结果不允许脚本伪造该证明，失败或未登记结果不能被下游当作可信宿主来源。输出/UI/导出使用完整文字和明确状态，公开包只携带配置，不含运行文字、账号或 Key。此处不新增数据库 DDL 或任意 IPC 方法，也不扩展动作授权。

browser-rendered-fields.ts 仅是语言无关规则的格式/关联参考；不能执行 DOM 或证明渲染。格式资料、发布 tag、实际驱动、UI 操作、安装、公开模板复导及真实业务分别验收。`../build_browser_rendered_fields.py --output <空目录>` 从固定 0.38.0 重建；已封存摘要不得覆盖。
