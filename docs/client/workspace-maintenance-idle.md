# 普通工作区启用前的空闲检查

2026-11-11独立只读审查发现：原Main maintenanceIdle只查Run、队列和启用计划，Runtime.shutdown却会终止工程AI、provider测试、工具/OAuth调用、规划、会话、归档、整理、Skill发布和模板导出。Run闲置不能证明这些活动为空。取消过程会写入原documents/events，因而来源CAS正确拒绝；此前任务已被取消，属于准入缺陷，不能通过放宽CAS修复。

无活动时shutdown不必然写document：stopAll/cancelAll依赖实际jobs；批次仅非终态permit更新；模板导出仅writing、Skill仅publishing改unknown；executionBlock只有真实回收错误才写提醒。Store.close只关闭连接和清零密钥。CAS是表行指纹而非WAL文件摘要，所以不因空事务/正常close自动失效。

实施最窄Main专用维护hold/assert/release，不进入Renderer方法表、MCP工具或公共SDK。Runtime同步检查所有manager真实活动及普通request进行中计数后原子持有不可猜nonce；等待中的request即使尚未登记manager也算busy。持有期间拒新普通request/CLI请求，tick不启动新批；仅Main生命周期shutdown和nonce控制可进入。检查只读，不取消任务制造idle、不写Store。

Main在认证及参数校验后、任何await之前登记普通IPC，仅存method与数量，不留args/凭据；maintenance/status不把自身计入。storageBusy阻新Renderer调用，已越过早期guard的普通IPC会阻止维护，不允许先改Vault再因host锁拒绝metadata。CLI桥由Runtime门禁覆盖，不靠关闭桥取消既有任务。

preview hold→建立候选→finally release；enable重新hold→精确nonce再检查→才停止桥/host并执行原CAS。preview或停host前失败释放；停host后失败保持不可运行、要求重新打开，不伪造启用。活跃任务、排队、计划、非终态批次、真实回收错误、未收尾发布/导出均明确拒绝维护。

使用临时fixture的真实异步边界验证：非Run busy、await中的普通request、CLI并发、锁内请求拒绝、release恢复、错误nonce。fixture不使用单元runner、正式数据库、API或迁移。与完整类型/构建/安装/实际enable分别记录；此文档不代表启用已验收。

本轮源码检查：客户端 `pnpm typecheck`、`git diff --check` 分别退出0。临时 `.mts` fixture（非单元runner）验证Gate的7项异步/nonce边界，并通过真实Runtime原型逐一验证16类manager busy、进行中request、锁内拒绝普通请求、shutdown准入及release恢复；未构造Runtime、未打开数据库、未调用API。第一次临时`.ts`因/tmp按CJS处理而不支持顶层await，改`.mts`后退出0。构建、安装和真实普通工作区preview/enable尚待独立验收，未据fixture宣称真实迁移通过。

收尾另用临时fixture执行真实`Runtime.shutdown`函数体与idle manager原型方法（内存字段替身，未构造宿主/数据库）：持锁期间成功收尾，`available`回调探针调用0次、Store写入/事务探针0次，退出0。它证明idle收尾不会被维护许可本身拒绝；不替代真实资源关闭与CAS验收。静态候选/预览缓存不计busy；DesktopRuns保留取消句柄不计busy，仅独立activeBindings；Sessions只计owner、启动/关闭中及closing，ownerless ready缓存允许在enable内正常关闭。
