# Desktop automation v1（未发布草案）

配套 docs/client/macos-desktop-automation.md。与原desktop-selection-v1并存，不替换旧Run。

- discovery：权限状态及有限应用窗口元数据，不读取正文。
- bind：本人明确选择应用/窗口并批准读取及操作范围，返回私人短期bindingId；公开工程不得携带绑定。
- observe：固定bindingId，返回observationId、控件树、窗口边界和可选PNG；控件引用仅本次观察有效。
- act：bindingId、observationId、唯一actionId、固定动作及参数；缺失/过期观察、身份/焦点/几何改变拒绝。动作执行前占唯一桌面租约，副作用先持久化预留；相同actionId不再执行。
- receipt：not-executed / performed / unknown；performed仅说明原生动作返回，不代表发送/保存成功，业务需独立观察证据。unknown不得重试。
- release：取消、退出、睡眠/锁屏时销毁原生会话及窗口引用。重开不复用旧绑定，不重放动作。

通用能力不提供任意Shell/AppleScript、内部IPC或系统环境访问；AI只能使用正式工具。Windows明确unsupported。权限、截图/模型信息范围与费用确认独立；预算耗尽暂停保留记录。

SDK原生子动作必须关联本Run已有正式template-effect预留凭据effectId；原模板action/entry/grant校验保持，默认deny不因窗口绑定放开。desktop-effect仅为原生子动作回执，performed不能代替业务confirmed。readSelection仅复制所选前台窗口当前选区并回读到本地，保护并恢复剪贴板，不隐式交给模型；复制未确认或焦点/来源变化时停止。坐标为窗口逻辑点，截图像素必须按图像/窗口尺寸换算；人工移动鼠标或按住修饰键拒绝提交。

模型审计完整保存，发送模型的上下文按内容摘要复用重复工具文档和递归Schema定义，并显式标注引用策略，不静默裁剪。新增flowark_project_context批量读取公开文件/SDK，最多64KiB源文件，返回遗漏清单；静态读取不调用模型。不因换调试实例或重新绑定清空同一工程活动批次的已用模型次数，桌面效果防重以正式工程归属跨其调试实例保留。

2026-11-09 工程故障接续：project.ai.get可附带本工程最近失败运行的只读恢复摘要及待核对数量；不覆盖本人选择的历史runEvidence。摘要只包含运行/节点身份、状态、脱敏诊断及动作结果，不发送完整业务输出或更改待办。内置协作AI可读取本工程history/status；status投影为相同摘要，不能借状态工具获得运行、重放、确认unknown或读取其他工程的权限。技术诊断允许在已批准节点及相同规划内局部修正；宿主继续拒绝越界和过期确认。

project.ai.start/resume新增可选intent=analyze|plan（省略保持原规划模式）。analyze由宿主只公布只读规范/源码/工程history/status工具，并跳过组装/业务完成判断；模型无法通过措辞绕过阶段限制。get返回的recovery与显式选择的runEvidence分开，含最近检查范围、待办身份与运行摘要；不清除、批准或重放任何记录。

run.detail可返回宿主从固定快照实例引用唯一推导的developmentProject.id，供现有失败页进入原工程AI对话；不存在唯一所属工程时不返回，不依据UI传入路径猜测归属。该引用不授权修改、运行或确认业务结果。

2026-11-10：run.detail的desktopReceipts仅包含文档替换回执，desktopAutomationReceipts包含原生动作记录（runId/actionId/effectId、at/completedAt、performed|not-executed|unknown及原因）。两种回执不能混用，缺少时间不得显示Invalid Date，performed不等于业务成功。内置AI的runtime_instance/preview限定为配置结构、资源ID/授权/绑定状态和准入诊断摘要，不发送资源值、路径、Key、业务输出或隐式批准运行。
