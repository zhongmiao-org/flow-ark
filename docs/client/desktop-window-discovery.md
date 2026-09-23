# 本机应用窗口发现 v1

2026-09-23。对应 Figma `23:2609`、`23:8087` 及 [U03/U12](design-ai-task.md)。首个适配对象按现有设计采用 macOS 文本编辑（`com.apple.TextEdit`）。本增量提供真实窗口元数据与系统权限状态；选区读取、任务绑定、AI 规划、替换选区和回读仍须独立实现，不表示完整桌面能力已验收。

## 边界与来源

Main 调用随客户端构建的固定本机辅助程序，通过 macOS Accessibility 只读枚举已经运行的 TextEdit 应用窗口。只读应用名称、窗口标题、是否最小化；不读取正文、选区、文档路径、其他应用、账号或截图，不激活窗口或启动 TextEdit，不申请屏幕录制权限。辅助程序使用 `AXIsProcessTrusted()` 检查自身访问状态，权限缺失时不请求或自动授予权限。

程序以固定路径、固定参数启动，不使用 Shell，也不接受 Renderer 传入的路径、命令、PID 或应用标识。仅 macOS 构建该程序，安装包携带可执行文件；目标机器运行时不依赖 Xcode，不临时下载或编译。构建失败应失败退出，不生成看似支持窗口发现的包。Main 对单次读取设置时限、输出上限和严格响应校验，并合并同时发生的读取请求；不能无限堆积进程。

## 白名单 IPC

`desktop.windows.list` 严格接收 `{}`。返回 `{version:1,platform,accessibility,availability,windows,truncated,observedAt}`：

- platform：`macos` 或 `unsupported`；accessibility：`granted`、`not-granted` 或 `unknown`。
- availability：`available`、`permission-required`、`unsupported`、`unavailable`。构建产物缺失、读取超时、协议错误或应用无响应返回 unavailable 与可读 reason，不能误报权限缺失。错误原因不得包含命令、原始进程输出、路径或窗口标题。
- windows：最多 30 个 `{id,application:"TextEdit",title,minimized}`。id 由 Main 为此次观察生成，不是系统窗口标识、任务绑定或可执行凭证。只有 available 可带非空窗口；缺失标题显示未命名，读取标题失败的窗口不假装识别成功。
- truncated：达到窗口上限或有窗口无法读取时为 true，界面说明清单可能不完整。observedAt 为观察时间；页面不将快照表述为持续追踪的实时身份。

`desktop.accessibility.openSettings` 严格接收 `{}`，仅响应用户点击，在 macOS 打开固定的系统辅助功能设置页；不授予权限、不代替系统授权、不接受任意 URL。其他平台明确报不支持。

沿用主窗口来源帧及 IPC 输入校验。响应仅留在当前页面内存，不写任务、Flow、Snapshot、数据库或日志，不自动传给模型或工具服务；不改变公共契约 0.13.0。

## 页面交互与过期

用户进入“应用窗口”页签后检查一次，显示检查中、尚需权限、不支持、无窗口、读取失败及可选窗口。选择仅用于查看该次观察的元数据与能力说明。显示窗口信息可读、选区读写尚未接入、本次任务尚未绑定或授权；禁止用这一选择调用规划或执行。

刷新立即清空旧清单及当前选择；切换任务、修订或离开页签时使未完成回复失效，不让迟到结果回填。刷新不自动选中同名窗口。多窗口同名可以展示，但不能用名称相等推断身份。保留原网页和工具目标，返回不隐式替换任务上下文。

权限设置仅由明确按钮打开，返回后用户点击“重新检查”。不轮询其他应用，不自动申请系统权限；授予系统权限之后仍不等于任务已授权。后续选区操作必须定义持有真实窗口对象的会话、失效与重选规则，并在写前核对窗口和选区摘要、写后回读，未知结果不重放。

## 验证与采用

治理合并后消费者采用。当前 UI 优先阶段不新增或运行单元测试，保留 TypeScript、原生编译、构建及人工页面查看；模拟响应只能证明页面交互。真实 macOS 授权、TextEdit 多窗口/关闭/最小化/同名、系统设置返回和安装包分发需单独验收。完整 U12 仍要求选区读写回读与失效阻断、3–5 名用户主路径，不因本增量完成而勾选。

系统 API 依据：[Apple Accessibility](https://developer.apple.com/documentation/applicationservices/1462060-axuielementcopyattributevalues)。
