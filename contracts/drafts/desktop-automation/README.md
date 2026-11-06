# Desktop automation v1（未发布草案）

配套 docs/client/macos-desktop-automation.md。与原desktop-selection-v1并存，不替换旧Run。

- discovery：权限状态及有限应用窗口元数据，不读取正文。
- bind：本人明确选择应用/窗口并批准读取及操作范围，返回私人短期bindingId；公开工程不得携带绑定。
- observe：固定bindingId，返回observationId、控件树、窗口边界和可选PNG；控件引用仅本次观察有效。
- act：bindingId、observationId、唯一actionId、固定动作及参数；缺失/过期观察、身份/焦点/几何改变拒绝。动作执行前占唯一桌面租约，副作用先持久化预留；相同actionId不再执行。
- receipt：not-executed / performed / unknown；performed仅说明原生动作返回，不代表发送/保存成功，业务需独立观察证据。unknown不得重试。
- release：取消、退出、睡眠/锁屏时销毁原生会话及窗口引用。重开不复用旧绑定，不重放动作。

通用能力不提供任意Shell/AppleScript、内部IPC或系统环境访问；AI只能使用正式工具。Windows明确unsupported。权限、截图/模型信息范围与费用确认独立；预算耗尽暂停保留记录。
