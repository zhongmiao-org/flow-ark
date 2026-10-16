# P1契约0.30.0：通用模板入口停止后执行

复用已安装模板的正式入口、白名单IPC和原执行宿主，提供template.handoff.preview/confirm/get/list。不是业务节点、并发执行槽、发送权限或模板状态直接写接口。Flow/ZIP2.0/SDK1.0不变；旧节点、实例和SQLite物理表不迁移。

preview输入EntryHandoffSelection，只读核对选定实例、入口、完整来源修订、包摘要、当前和排队Run集合及入口资源/授权。只有同实例存在未结束Run且实际活跃Run属于该实例时可核对；若无活跃Run允许仅取消该实例排队Run。其他实例正在运行时拒绝，不抢占它。最多100条、核对token仅当前宿主会话5分钟内有效。保存参数/配置/绑定或运行集合变化、休眠/重开使核对失效；来源键与业务暂停范围仍归模板。

confirm输入EntryHandoffRequest：先核对token、reviewed、source、精确Run集合和准入代次，持久化stopping回执后发出取消；不排在待取消Run之后。重复requestId与相同内容只读取同一回执；同id不同内容拒绝。同token不允许以新id再次执行。存在未结束切换请求时不再创建第二个切换。新普通/计划Run准入暂时拒绝，pump保留单槽且不启动任何下一Run；不改变其他实例已存排队记录。

只停止预览列出的同实例Run。取消活跃Run时沿用协作取消、超时回收和能力撤销；先发取消再等待，当前/排队原Run逐项保留终态、输出和未确认外部结果。仅在全部目标终态且进程/能力确认回收、未休眠/退出/存储故障且来源及资源授权再次通过时，以固定入口快照创建一次新Run；新Run/snapshot/created回执同事务写入。失败或未知不创建替代Run，不恢复原Run，不静默覆盖变更或自动重试。停止不回滚已发生的副作用，不保证第三方撤回在途请求。

EntryHandoffReceipt状态stopping/created/failed/interrupted，revision单调推进；created必须保存唯一runId，不表示入口执行成功或业务控制状态已提交。回执包含source/原Run列表和有界错误，不含凭据或个人参数正文。内部持久快照可含受保护配置，不能导出。get按requestId读取；list按instanceId返回最近20条固定回执，新回执不可被旧响应覆盖。UI请求失败保留requestId，只读核对，不重新confirm或生成新id。恢复时未完成stopping改为interrupted及本地待办，不自动续跑；created的既有Run按正常恢复规则核对，不创建另一Run。

格式定义见p1.schema.json的EntryHandoffSelection/Preview/Request/Receipt；entry-handoff.cases.json仅检查格式，不能替代时序/原生运行。实现需覆盖活跃模型取消、队列/实例隔离、重复请求、核对过期/变化、取消回收未确认、存储失败及重开无重放。先行Figma/规则见[入口切换](../../docs/client/entry-handoff.md)。当前G1，客户端采用与实际业务另验。
