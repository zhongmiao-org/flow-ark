# 内置网页元素拾取

2026-09-18，0.1.9 已实现网页元素拾取与表单式动作配置。用户提供影刀 6.0 产品视频后，优先补齐从空白流程搭建复杂表单的编辑体验。交付与验证证据见 [客户端验收](acceptance.md)；自动录制、AI 生成与模板商店不属于本次实现。

## 交互

浏览器节点提供“从网页选取”与“验证定位”。选取展开主窗口右侧内置网页，鼠标悬停高亮，点击选定目标并结束拾取，Escape 或取消退出。选取只取得目标，不执行网页按钮、提交、输入或自动开始 Run。节点保留原操作与填写值；首次选取可提供可读名称。选择器与 iframe 路径支持高级手工编辑。原生下拉选项可以显示可读标签，输入内容由用户填写，不复制网页现有输入值。

目标必须能由现有 BrowserDriver 唯一定位：顶层页面、嵌套 iframe（包括跨源）、可唯一定位的开放 Shadow DOM。优先稳定属性，缺少属性时使用结构路径并提示其易变性；不能唯一表达的目标明确拒绝，不能选择第一个相似元素。拾取时和验证时均检查唯一性。密码、输入框当前值、Cookie、登录态与整页 DOM 不进入结果或日志。

## 分层与本地 IPC

网页保持无 preload、无 Node、无工作台 IPC。适配器经现有单 WebContents CDP 连接启用原生检查模式，生成并校验定位；Main 只负责视图和拾取生命周期，宿主检查运行互斥。Renderer 不接受网页脚本、原生 CDP 方法或任意执行入口。

| 白名单方法 | 请求 | 响应 |
| --- | --- | --- |
| `browser.embedded.pick.start` | requestId，非空字符串，最多 100 字符 | 拾取状态 |
| `browser.embedded.pick.status` | 同上 | 同请求状态，或已失效 |
| `browser.embedded.pick.cancel` | 同上 | true；不能取消另一请求 |
| `browser.embedded.pick.validate` | selector（1～4000 字符）、framePath（最多 8 个同界限选择器） | 唯一目标信息，或明确错误 |

拾取状态包含 requestId、phase（picking/selected/cancelled/error）、可选 target 与 error。target 包含 selector、framePath、label（最多 100 字符）、tag、inputType、multiple、structural（是否结构定位）、options（最多 200 个 value/label/disabled，字符串有长度上限）。状态只驻留内存，旧请求失效后不能覆盖新请求或其他节点。所有字段仅当作数据，界面不渲染原始 HTML。

启动与验证只允许没有活动运行或已暂停/等待人工、且没有待消费继续指令时进行。运行开始、单步/继续后的浏览器操作必须先退出拾取；关闭面板、切换节点、导航、页面丢失、最小化/隐藏窗口、超时和退出清理高亮与会话。不能因取消拾取关闭正常网页或重新执行业务步骤。异步旧结果必须丢弃。

公共流程沿用契约 0.7.0 的 browser v2/v3：仅将 selector/framePath/name 写入现有草稿；target 元数据不进入流程协议或数据库，不改变不可变 Run。无 SQLite 迁移，无模板格式变化；旧客户端仍可执行保存后的标准节点。治理约定先提交并通过 PR/CI，客户端记录实际采用的治理 SHA 后交付。

## 验收

`pnpm test:picker` 验证真实内置网页目标与生命周期；`pnpm test:picker-ui` 从空白流程完成点选、填写、保存重开和五步重放。跨站 OOPIF 的输入使用正式驱动同一路径的 CDP Input 触发；顶层配置 UI 使用原生 WebContents 输入。自动化通过不等同于所有复杂网站人工验收。

`pnpm test:picker-lifecycle` 在隔离的真实 Electron 中暂停目标解析，关闭网页后释放旧请求，核对没有未处理异常且新会话可以拾取；另验证高亮清理前关闭，以及三轮面板收起、窗口隐藏、最小化、导航、关闭重建后的点选、填写和实际绘制。此脚本使用当前源码构建适配器夹具；安装包另用 `test:picker-ui` 与 `test:embedded` 验证，不能把源码夹具称为安装版测试。

- 在真实内置 WebContentsView 点选 input、radio、checkbox、select 与按钮，拾取不改变输入、勾选或提交状态。
- 嵌套跨源 iframe、特殊字符属性、重复标签、开放 Shadow DOM；保存后的定位由正式适配器重放核对。
- 从界面选取、编辑值、保存、关闭重开草稿，再逐步执行复杂表单；核对实际值与服务端提交回执。
- Escape、取消、重复请求、切换节点、页面导航、隐藏与关闭清理；旧结果不覆盖新目标。
- 活动 Run 与拾取互斥，继续/单步前清理检查模式；多匹配、失效目标返回明确错误，不自动点击。
- 输入白名单、无网页权限提升、现有浏览器回归、本地检查、打包和安装版验证分别留证。仅本地虚构表单，不测试 BOSS/智联，不依赖 AI Key。

参考：[CDP Overlay](https://chromedevtools.github.io/devtools-protocol/tot/Overlay/)、[CDP DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/)。原生检查模式的实际支持以本机 Electron 验证为准。
