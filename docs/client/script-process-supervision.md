# 脚本进程监护与持久回收确认

2026-09-20。针对 P1 单机可信 JS/TS 脚本的生命周期修复；此文定义消费者后续实现，验收结果单独写入[客户端验收](acceptance.md)。网页仍仅使用内置浏览器和本地复杂表单，1920 CSS 像素布局不变。

## 问题与归属

0.1.30 的脚本是 Worker 创建的独立 detached 进程。用户模块顶层或默认函数同步忙循环时，脚本无法响应自己的 disconnect 回调；外部 SIGKILL Worker 后它可继续运行，宿主却释放运行槽。2026-09-20 隔离复现两种忙循环均确认旧脚本存活时后续两次 HTTP 请求已到达本地接收端。测试持有确切 PID、启动时间和随机标记，finally 清理完成，独立哨兵始终存活；原始证据 `/private/tmp/flowark-orphan-baseline-60wi3V/summary.json`。不扫描或终止日常进程。

宿主直接持有每次调用的监护进程（supervisor）。监护进程只执行受控生命周期代码，是独立 POSIX 会话/进程组 leader；实际 script.cjs 以非 detached 子进程运行在同一组，继续提供现有 Node 主线程和 SDK。Worker 仅发私有 script.execute/script.cancel 请求，执行核心不依赖进程管理。监护进程随本次调用创建和回收，不安装服务或后台守护程序。

父进程退出、kill 调用返回、RPC 超时都不是资源已消失的证明。Node 对 detached 及进程终止的语义见 [Node 24.3 child_process](https://nodejs.org/download/release/v24.3.0/docs/api/child_process.html#optionsdetached)。本方案保证可信脚本及留在同组的普通子进程；用户主动 detached/setsid 逃离组不在保证范围，不能称为安全沙箱。旧版本已经产生且没有登记的孤儿不由新版本自动认领或盲杀。

## 启动许可和通信

每次调用具有独立 invocationId/nonce，并绑定 Run、节点执行实例及当前 OS bootId。循环复用节点不复用调用身份。宿主从不可变快照解析编译路径与摘要，不接受 Worker 指定任意文件；script.cjs 导入前继续核对摘要。

启动次序：

1. 宿主先持久化 allocating 意图，尚无 PID，无用户代码执行许可。
2. 创建受控 supervisor，记录本次 ChildProcess 的正整数 PID/PGID；supervisor 只可等待初始化、取消或 EOF，此时不 fork/import 用户模块。
3. 持久化具体身份，核对同 nonce 的 ready、确切 PID 与组 leader 身份，再允许 execute。
4. 每个异步等待后复验 Run 仍有效、未取消、存储正常和资源门禁。迟到 ready/ACK 不得重新取得已撤销的执行资格。

Worker 在发 execute 前生成 invocationId，取消使用同一 ID；宿主保留本 Run 的取消记号，覆盖 cancel 先到、execute 后到的竞态。Rpc.close 不会撤销已经进入的异步 handler，故不能以关闭通信代替资格复验。SDK 的 log/progress/artifact/credential 继续白名单路由，同时核对所属 Run 和本次调用；不得泛化为任意 Runtime 方法。

ready 预算 3 秒，单次回收预算 5 秒，重开遗留核对预算 5 秒；内部结果等待仍受节点期限和 Run 取消约束。预算集中定义，不在每个调用各自隐含叠加。未 ready 的 supervisor 超期自行退出，绝不自行开始用户代码。

## 停止与确认

宿主保存脚本结果或原错误后，请求仍由本次 IPC 绑定的 supervisor 停止。存活 supervisor 核对自己为组 leader，再向自己的进程组发 SIGKILL，覆盖忙循环和普通同组后代。Host EOF 同样由不运行用户代码的 supervisor 执行此步骤，因此不依赖忙脚本的事件循环。结果/错误在收尾前不得返回 Worker；函数返回也不能放任其遗留定时器或子进程继续运行。

回收确认同时要求确切 ChildProcess 的 exit，以及只读组探测返回 ESRCH。组仍存在、EPERM、其他探测失败或 supervisor 自身异常死亡均不能当作已回收。仅在组确已消失后清除持久租约，再返回节点结果。绝不向历史 PID/PGID 补发 kill；组 ID 被复用最多造成保守阻断，不得误杀其他进程。

Worker 丢失、节点取消和退出立即撤销启动资格，并发收尾本 Run 所有 supervisor、Worker 和浏览器。启动中调用也纳入同一个关闭 Promise；单项写库或清理失败不跳过其他回收。既有 Worker 协作宽限 2 秒、网页关闭确认 8 秒、Main 等宿主 15 秒保持；脚本回收与它们并发。

回收未知或进程意外丢失为 INTERRUPTED；主动取消且资源确认消失才为 CANCELLED；节点异常/超时且资源已回收为 FAILED；完整执行并确认回收才可为 SUCCEEDED。未知先设置独立内存阻断，初始租约已持久存在，即使后续诊断写入失败也不会丢失恢复门禁。

## 持久恢复和存储兼容

加密 documents 增加内部 script-lease 记录，至少包括 recordVersion、invocationId/nonce、Run、节点实例、bootId、创建时间、阶段和取得后的 PID/PGID。不重复保存源码、输入或密钥，不纳入流程导出或公共 RunEvent，不向 Renderer 暴露原生控制身份。仅 Host 写 SQLite。

应用重开先按既有规则将活动和排队 Run 记为 INTERRUPTED；独立 ready 核对未清租约，不自动恢复旧队列或旧操作。核对有界完成，未知以 runtimeBlock 展示，历史与流程编辑仍可用。所有新执行、重跑预览/确认、计划启用/触发及 pump 均等待或检查 ready，异步预检后再核对；阻断期间的计划不补跑。关联未知脚本的 Run 产物不能清理。

遗留记录只在以下证据之一成立后清除：同 OS bootId 且组探测 ESRCH；或可靠的当前 OS bootId 与记录不同。macOS 使用 kern.boottime 的规范化值，Linux 使用内核 boot_id；不用应用随机 ID 或 uptime 推算。bootId 获取失败、无 PID 的遗留 allocating、非法记录、组仍在或探测错误均保留阻断。无 PID 记录仅本次存活宿主能以“从未执行且确切受控子进程已退出”清理；跨重启不能猜测，必要时提示重启系统再核对。普通应用重开不保证解除脚本阻断，也不提供强制解锁。

SQLite user_version 从 1 提升为 2。物理表和既有加密文档/事件字节不变，但旧 reader 会忽略新的资源语义，因此必须阻止降级：0.1.30 已拒绝 >1，新版只接受 0/1/2，v1→v2 在单事务内提升最低 reader 版本，>2 拒绝。迁移失败保留旧数据，不新建空库。公共流程/模板契约继续 0.7.0，节点与快照无需迁移；应用采用治理提交后再交付消费者。

执行许可落库失败时不启动用户模块，仍收尾受控 supervisor；确认清理后的租约删除失败保持 Store.fault 和原租约，重开重新核对。不能为了更新 unknown 而先清除租约，不能在同步 SQLite 事务中 await 原生回收。

当前实施针对 macOS，Linux CI 验证 POSIX 逻辑；Windows 脚本准入明确报告尚不支持此监护方式，不回退到未经确认的树清理。Windows 的实际支持与其他浏览器兼容仍属后续独立验收。

## 验证条件

- default 与模块顶层忙循环分别外部强杀 Worker、Host，核对脚本/普通后代实际消失，下一节点及 FIFO 副作用只能在确认后发生，独立哨兵不受影响。
- ready、持久许可和 execute 间取消/断连、迟到消息、提交失败零用户执行；结果已返回但组未消失不得继续流程。
- supervisor 丢失/停止和探测失败形成持久阻断，重开仍拒绝手动、重跑、计划和队列；历史可读、关联产物不能清理、历史 PID 零终止信号。
- 同 boot+ESRCH 和新 boot 只读解除旧租约，原 Run 保留中断，旧队列及错过计划不补跑。
- 真 SQLite 写失败、v1→v2 密文保留、迁移失败回滚、未来版本拒绝和旧版实际降级拒绝。
- 原脚本 SDK、固定摘要、超时/取消及正常错误行为回归；内置复杂表单、1920 CSS 像素、候选包升级分别留证。故障注入与实际观察到的系统事件分开记录。
