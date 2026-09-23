# 本机窗口选区预览 v1

2026-09-23。依据 Figma `23:8087`、`23:8190`、`23:8344` 的选中窗口与原段落核对，继续完成 U12 的前置交互。当前仅限 macOS TextEdit；本规范不包含 AI 发送、任务持久绑定、执行授权或替换文字，完整目标仍为选区规划、确认修改、写入回读及失效阻断。

2026-09-23 后续[应用选区 AI 预览](desktop-planning.md)在未发布 ready 响应中增加 previewId，并定义明确发送及清除接口；本文件描述的本地读取仍不会自动发送 AI。

## 发现 v2 与本机会话

取代未发布的[初始发现 v1](desktop-window-discovery.md)请求/响应，无旧版兼容路径。`desktop.windows.list` 严格输入 `{requestId}`（UUID），返回发现 v2：保留 platform/accessibility/availability/windows/truncated/observedAt，version 改为 2，增加相同 requestId；仅 available 时附带 `{observationId,expiresAt}`。observationId 由 Main 生成，expiresAt 为最多五分钟后的 Unix 毫秒。窗口 id 仍由 Main 生成，仅映射到本次辅助程序保留的原生窗口对象。

一次发现启动一个固定本机程序，由 Main 通过有大小/超时限制的管道维持。相同 requestId 的并发发现合并；不同请求立即作废并回收旧会话，不共享同名窗口身份。辅助程序只接受固定发现和选区读取命令；原生窗口引用与应用启动身份仅在程序内存，不交给 Renderer，不接受 PID、路径、AX 属性名或可执行命令。到期、进程异常、系统休眠、退出及刷新均回收会话；超时不自动重新发起读取。

`desktop.windows.release` 严格输入 `{observationId}`，只释放相同的当前会话，旧页面的迟到释放不得停止新会话。离开页签/任务时释放并清除预览；请求未返回时离开，迟到成功回复也需释放自己的 observationId。

## 明确读取所选段落

`desktop.selection.preview` 严格输入 `{observationId,windowId}`，两者均为 UUID。Main 只接受当前未过期观察中的窗口映射，不以标题或窗口列表下标查找另一个窗口。输出为：

- ready：`{version:1,observationId,windowId,status:"ready",readAt,expiresAt,text,redacted,range:{location,length}}`。text 不超过二万 UTF-16 单元，range 为原生选区范围；range 不因为显示脱敏而改写。readAt 为 ISO 时间，expiresAt 不延长发现会话。
- 失败：`{version:1,observationId,windowId,status,reason}`。status 为 `expired`、`permission-required`、`window-changed`、`no-selection`、`ambiguous`、`unsupported`、`selection-changed`、`too-large` 或 `unavailable`；不附带上一次文字或原始错误、路径、进程输出。

读取前重新检查辅助功能、原应用未退出/重启、原生窗口对象仍在该应用当前窗口集合、原始完整窗口标题未变。只遍历该窗口的角色与子对象，找到唯一文本编辑区；数量/深度/时间超过上限或多个编辑区时停止，不能随意选择第一个控件。只读取 AXSelectedTextRange 与 AXSelectedText，不获取全文 AXValue、其他窗口、文件路径、账号或截图。多选区、空选区、超大选区与不支持的控件分别拒绝。

读取窗口身份、选区范围和文字后再次读取核对；读取期间窗口/范围/文字变化不返回成功。检查只证明本次读取得到一致快照，不承诺之后内容不变。Main 对显示文本应用现有秘密值和模式脱敏，redacted 说明显示文字被遮盖；不把脱敏文字或客户端回传范围作为将来可直接写回的依据。

## 界面

选择窗口仅查看元数据；“读取选中段落”单独明确触发内容读取。预览用纯文本展示文字、字符数、检查时间及“仅本地查看、尚未发送、尚未绑定任务”的事实。可重新读取或清除预览。重新读取前清除旧正文；失败不继续显示旧正文为当前选区。

空选区提示回到 TextEdit 选中段落，窗口变化/会话到期要求重新检查窗口。已读预览也显示有效期；到期、刷新、更换窗口、切任务或离开后失效并清除正文，迟到回复需核对请求代次、窗口和观察身份后才采用。副作用、AI 生成或持久保存接口不由预览触发。

## 实施与验收边界

治理先合并，客户端采用后实现；不改变公共流程契约 0.13.0、SQLite 或 Worker 执行。按当前要求不新增或运行单元测试，进行类型、原生编译、构建及人工 UI 核对。真实 TextEdit 选区、多个/同名/关闭窗口、标题变化、权限撤销、会话到期、读取中变化与休眠需独立验收；模拟响应不代表真实原生读写通过。后续写入仍需固定任务/运行快照、单次确认、重新校验选区与写后回读，不能复用本预览作为写入授权。

API 依据：[Apple 选区范围](https://developer.apple.com/documentation/applicationservices/kaxselectedtextrangeattribute)、[Apple AXUIElement](https://developer.apple.com/documentation/applicationservices/axuielement)。
