# 本地运行产物接口

2026-09-20 导出修复：`flow.export` 改为提交当前流程及可选配置定义，不再按 ID 导出旧记录；严格载荷、固定快照、取消语义与兼容规则见 [导出快照与退出确认](export-and-exit.md)。

2026-09-16 增量接口说明。2026-09-20 新登记产物增加独立副本、摘要与 integrity 状态，见[产物副本约定](artifact-snapshots.md)；下述 available 仅检查可访问性的语义继续适用于没有摘要的旧记录。仅用于客户端 Renderer → Main → 本地宿主，不属于平台设备协议。请求在 Main 按白名单校验；产物定位不接受 Renderer 指定任意文件路径。

- `run.detail` 请求为 `{"id":"运行 ID"}`。保留 run/events/output/snapshot/artifacts；每条 artifact 返回既有 artifactId/runId/name/path/size/time，增加布尔值 `available`。每次读取按登记的真实路径检查普通文件是否仍存在；路径被换成其他符号链接也视为不可用。此字段是当前可访问性，不是内容完整性证明。新增响应字段兼容既有客户端，不改写历史记录或 Run 状态。
- `artifact.reveal` 请求仅接受 `{"id":"产物 ID"}`，成功返回 `true`。Main 通过宿主私有 `artifact.resolve` 查找已登记产物并重验可用性，再调用系统文件管理器定位文件。未知 ID 或丢失/替换的路径返回错误；不执行文件。
- `artifact.resolve` 为 Main → 宿主内部方法，输入同上，返回登记的绝对路径。不得加入 Renderer/Preload 白名单。

无 SQLite 迁移，available 不入库；旧版本仍能读取相同历史数据。新增客户端保持已有来源帧校验及 2 MiB IPC 输入上限。验证需覆盖未知 ID、任意路径注入、正常文件、删除文件、符号链接替换和历史成功状态不变。

脚本依赖增量（0.1.3）：白名单 `script.package.inspect` 只读取用户所选包目录的元数据；`flow.save` 的本地 bindings 接受 scriptPackages；`run.detail` 增加 scriptBundles（无本地依赖路径）。请求/响应和快照兼容规则见 [本地脚本依赖](script-dependencies.md)。

2026-09-17 调试增量（0.1.5）：`flow.run` 增加可选 `debug: boolean`，仅手动运行可启用。创建不可变快照后，在第一个节点前进入 PAUSED；`run.control` 增加 `step`，仅 PAUSED 接受，一次放行一个节点入口（条件/循环会逐步进入实际子路径）。`resume` 改为连续执行，`pause` 仍在下一节点边界停下；WAITING_INPUT 只通过 resume 明确确认。宿主拒绝重复未消费的 step/resume，不能把双击积累成多步执行。取消或重启不重放步骤。

Run 本地记录增加可选 debug，缺省 false；不写入模板或计划，旧历史可读，无 SQLite 结构迁移。状态事件在暂停时附带 nodeInstance、nodeName，供界面显示下一个节点。调试节点完成时记录经统一脱敏、最多 4000 字符的输出预览；失败前已完成的预览仍可查看，预览不是完整输出或副作用回执。现有流程 wire 格式与节点版本不变，调试为客户端内部运行控制。

2026-09-18 内置网页面板（0.1.7）：`browser.embedded.enable` 与 `status` 无参；`visibility` 接收 visible 布尔值；`viewport` 仅接受 x/y/width/height 整数（0～20000），Main 再限制在主窗口内容区域；`navigate` 仅接受最长 8192 字符的 HTTP(S) URL，宿主在活动 Run 为 RUNNING/CANCELLING 时拒绝手动导航。状态返回 started/visible/url/title，不返回登录态。创建、perform、close、binding 与 system.browserLost 是内部方法，不进入 Renderer 白名单。详见 [内置浏览器](embedded-browser.md)。

0.1.8 编辑器目录修复：按嵌套分支、循环中的 file/excel 以及 browser upload 字面量引用显示本地目录名，保留既有绑定。选择 work 目录不再错误写入固定 workspace；不改变流程、IPC、契约或数据库格式。

2026-09-18 元素拾取增量（0.1.9）：新增受控 start/status/cancel/validate 方法，生命周期、字段限制与兼容约定见 [元素拾取](element-picker.md)。不开放任意 CDP 或脚本执行 IPC，不改变公共契约 0.7.0。

2026-09-20 上传资源校验：沿用已有 upload 的 `{binding,name}` 与文件目录绑定，补齐静态/参数目录的运行预检和上传执行边界复验；不增加 IPC 或响应字段。见 [上传资源检查](upload-resources.md)。

2026-09-20 产物清理增量：新增 run.artifacts.preview/clear，run.detail 增加 artifactCleanup，产物增加 clearedAt 与 cleared 完整性状态。只接受运行 ID、预览摘要和显式核对确认；范围、失败恢复与兼容规则见[产物清理](artifact-cleanup.md)。

2026-09-20 历史分页增量：新增 run.list 的有界分页与筛选，bootstrap 增加完整记录的 runOverview；请求、游标边界及兼容说明见[运行历史](run-history.md)。实现及验收状态以验收记录为准。

2026-09-20 计划更新（0.1.24）：新增带 revision 的 schedule.update，默认保留固定版本与启停状态，仅显式选择后采用已保存流程；schedule.save 专用于创建。字段、异步冲突与旧记录兼容见[本机计划显式更新](schedule-editing.md)，源码、包及安装证据见[验收记录](acceptance.md)。

2026-09-20 重跑增量：运行详情预览并核对后创建关联的新手动 Run，默认原执行快照，可选当前已保存流程；本地接口、幂等、授权复验和兼容规则见 [人工核对后重新运行](run-rerun.md)。实际交付状态见验收记录。

2026-09-20 运行观察增量：bootstrap/run.detail 新增可选 execution 只读观察，run.detail 同时返回可选存储 fault；采样时序、状态解释、历史兼容与验证见[运行详情与实时观察](run-observation.md)。请求、公共契约 0.7.0 和 SQLite v2 不变。
