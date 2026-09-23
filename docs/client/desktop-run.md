# 桌面选区单次试运行 v1

2026-09-23，承接[桌面流程](desktop-flow.md)与契约 0.14.0，覆盖已保存方案的窗口重新绑定、统一 Run 确认、单次替换和写后回读。对应 Figma 应用确认、执行与结果页面；设计、代码、真实系统访问和实际文档验收分别记录。

## 重新绑定

只接受当前任务所属、没有其他操作对象、仅一个顶层 desktop v1 replace-selection 步骤的已保存流程。步骤 target 为 selected-text，替换文字摘要必须与采纳记录一致；手动修改文字或流程后须重新生成/核对来源，不能继承原授权。每次重新运行都要重新绑定，不支持定时、批量或循环重放。

在试运行检查页明确选择 TextEdit 窗口并读取原选区。`desktop.run.bind` 严格输入 flowId、taskId、revision、flowHash、requestId（UUID）、observationId/windowId/previewId。宿主核对任务修订、完整草稿摘要、原文摘要与候选摘要，重新检查替换和范围读取能力均可用；Renderer 不提交正文、范围、进程或原生定位。原文字需与采纳时完全相同，重新选择允许用户明确选择新的窗口/选区，不自动按名称匹配。

Main 将这次观察从界面所有权转为短期 bindingId，保留原生窗口对象、唯一编辑区的来源、原范围和原文；不延長五分钟期限。旧界面离开/释放只针对原观察，不回收已移交的绑定。未被 Run 认领的旧绑定可被明确的新绑定替换；被 Run 认领的绑定不得抢占。任务/草稿在异步过程中变化、取消或晚到回复均不得恢复旧绑定。`desktop.run.cancel` 以同一 requestId 取消在途绑定，完成后释放未认领绑定须提供 bindingId；取消不重试、不删除已创建 Run。

本地 FlowRecord.desktopTarget 增加 binding（bindingId、expiresAt、windowTitle、sourceHash、replacementHash），仅本机存储，不进入可移植 Flow。这个记录不是授权，重启、到期、锁屏、休眠或助手退出后失效；真实能力由 Main 当前会话复核。

## 统一运行确认

复用 flow.run.preview/confirm、RunReviewSession、flow-run-request 去重与不可变 snapshot。检查返回桌面目标的窗口、原文/替换文字及单次修改范围；界面明确勾选后由“开始试运行”提交。含桌面步骤的确认额外要求 desktopReviewed:true，不能用普通调用或调度路径绕过；固定任务/草稿/来源/绑定进入检查 token 与快照授权。

确认重新检查后，以新 Run id 在 Main 认领 binding，再以现有事务固定 version、snapshot、Run、state 和确认回执。事务失败回收认领，不写文档；确认结果未知使用同一 requestId 查询，不能另建运行重放。离开界面只释放未被 Run 认领的绑定。排队/逐步暂停不延长绑定期限；过期在执行前失败。

执行仍由现有 Worker/核心派发 desktop 节点，Worker 只传当前节点 id/instance；宿主从固定快照读取文字和 binding。执行前复验同一 Run、授权与目标。仅受支持的单步应用流程允许此通路，普通手动/定时/脚本接口不取得桌面写能力。

## 单次副作用和回读

宿主在发出原生命令前持久化该 Run/节点的写入尝试，初始结果 unknown。记录存在即禁止再次发送，不能因为超时、断连、取消或应用重启而重试。Main 再次核对 binding 的 Run 所有权、未消耗状态、期限、原文和范围，在发送前消耗本次权限。

原生程序复验 TextEdit 进程启动身份、同一窗口/标题、唯一编辑区、当前原选区及文字，可写性与原范围读取。只调用一次 AXSelectedText setter，不改变选区、不激活窗口、不发送按键、不用剪贴板或全文替换回退。setter 调用前的拒绝为 not-written；一旦调用，即使 API 返回错误也按 unknown 处理，除非随后确实取得一致回读。

setter 成功后按原起点和替换文字 UTF-16 长度执行 AXStringForRange，重新核对窗口和编辑区，文字完全一致才返回 verified。结果仅描述当前文档缓冲区，不宣称文件保存、格式保真或外部业务完成。失败不尝试撤销或写回原文。用户确认页提示运行期间保持文档/选区不变。

宿主加密保存 receipt（Run、节点、时间、verified/not-written/unknown、原因与已核对文字），事件和展示沿用脱敏；unknown 建立去重待办并明确“可能已修改，请人工核对，未自动重试”。既有 Run 状态、取消和结果回执分别展示，不把 cancelled 或 setter 返回成功当作原文未改/已核对。回收原生助手需核对退出；退出未确认时不允许新桌面绑定夺取所有权。运行结束回收该 Run 的绑定，单次授权不可用于另一 Run。

## 当前实施与验收边界

本规范先经治理 PR 合并，客户端随后采用。公共节点契约仍为 0.14.0，新增本机 IPC 与加密记录类型，不增加 SQLite 表结构、平台或远程执行。按用户要求不新增、不运行单元测试；类型、Swift 编译、构建和模拟 UI 不能替代真实 macOS 授权、TextEdit 可写能力、实际修改/回读、取消与未知结果验收。完整 186 画板 / U01–U12 目标保持不变。

API 依据：[Apple 选中文字属性](https://developer.apple.com/documentation/applicationservices/kaxselectedtextattribute)、[Apple 参数化属性读取](https://developer.apple.com/documentation/applicationservices/1461203-axuielementcopyparameterizedattr)。系统查询不保证 TextEdit 实际支持 setter，消费者必须尊重目标返回的能力与错误。
