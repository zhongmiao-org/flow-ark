# 应用修改条件检查 v1

2026-09-23。承接[选区 AI 预览](desktop-planning.md)，依据 Figma `23:8344` 的原文、候选、影响范围与授权条件。本增量实现确认页的真实只读检查，不发起修改；固定 Flow/Run、单次授权、执行和写后回读仍须后续接入，完整 U12 目标不变。

## 候选来源

宿主保留当前任务最近一次成功生成的候选及来源，最多保留到原观察到期，正文仅在内存；新生成、明确取消、清除/刷新选区、观察释放、休眠或退出作废。候选不是执行授权，也不因缓存而成为已采纳流程。`desktop.plan.inspect` 严格输入 `{id,revision,requestId,observationId,windowId,previewId}`，字段约束沿用生成接口，requestId 指向已完成生成而不是新请求。Renderer 不回传原文或候选内容。

检查只接受相同任务修订与同一生成的 proposal 候选，unsupported 或与原文相同的候选不能进入修改检查。宿主从自己的缓存核对来源，异步前后核对任务/候选身份与观察期限。检查过程中开始新生成、改变任务或清除来源，迟到检查不得恢复旧候选。缓存到期主动清除；检查不会延长原观察期限。

## 原生只读能力检查

内部 `desktop.selection.inspect` 仅由宿主调用。Main 从相同 previewId 找到本次预览，再复验原窗口与原段落摘要；原生助手仅对这个窗口内的同一唯一编辑区执行：

1. 复验应用启动身份、窗口对象、标题、辅助功能权限；范围和文字重复读取并一致。
2. `AXUIElementIsAttributeSettable(AXSelectedText)` 查询系统是否报告选中文本可以修改，不调用 setter、不发送按键、不使用剪贴板或激活窗口。
3. 使用 `AXStringForRange` 参数化读取**当前原选区的相同范围**，返回必须与原选区文字一致；不读取全文或范围外文字。属性不支持与读取失败分别呈现。
4. 再次读取选区、唯一编辑区和窗口身份，确认检查期间未变化；超过既有遍历/时间上限即停止。

能力为 `available`、`unsupported` 或 `unavailable`；`available` 只表示本次查询或原范围读取通过，不保证未来写入、修改格式或实际写后回读成功。当前 SDK 的 AXSelectedText 注释与 AppKit setter 文档并不构成任意控件的统一承诺，必须尊重目标控件的实际查询结果。

原生回复 ready 包含 text/range 及 replacement/readback 能力；失败沿用 selectionReasons。Main 仅在原文/范围摘要、previewId、窗口和观察均一致且未遮盖时返回 `{version:1,observationId,windowId,previewId,checkedAt,expiresAt,replacement,readback}`，不将原生错误正文或额外文档内容交给 Renderer。

## 界面结果与生命周期

宿主返回相同生成身份和 `{version:1,checkedAt,expiresAt,replacement,readback}`。进入改动对照页响应用户“查看改动并核对”进行一次检查；可明确重新检查，不轮询原生窗口。新的检查先清旧状态，返回方案、离开、候选变化或到期清旧检查，迟到结果不恢复界面。失败提供返回窗口重新读取入口，清楚区分“来源仍一致”“系统报告支持/不支持/未能核对”“未授权修改”。

未变更候选显示“没有文字改动”，不执行原生修改条件查询。检查通过仍不自动勾选授权、创建运行或写入。本轮写入入口继续禁用，并如实说明固定运行和写后回读尚未接入；不能用可写性查询代替真实写入验收。

## 实施证据

治理先合并，客户端随后采用。公共契约仍为 0.13.0，不改变 SQLite 或流程格式。按用户要求不新增、不运行单元测试；类型、Swift 编译、构建、模拟 UI 与真实原生条件检查分别记录。

API 依据：[Apple 可写性查询](https://developer.apple.com/documentation/applicationservices/1459972-axuielementisattributesettable)、[Apple 可访问文本属性](https://developer.apple.com/documentation/appkit/nsaccessibilityprotocol)。
