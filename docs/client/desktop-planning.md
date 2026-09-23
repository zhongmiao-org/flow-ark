# 应用选区 AI 改动预览 v1

2026-09-23，依据 Figma `23:8190` 应用任务方案与 `23:8344` 修改前后对照。承接[窗口选区预览](desktop-selection-preview.md)，完成明确发送与生成改动预览；完整 U12 的固定任务/运行绑定、单次写入授权和写后回读继续待实现。本增量不创建 Flow、Run，不授予原生写入能力。

## 来源与请求

未发布的选区预览 ready 响应增加 `previewId`（Main 随机 UUID）。Main 只在当前观察内保存最近一次成功预览的原文/范围摘要、脱敏后的显示文字和 previewId，不保存到磁盘。重新读取立即作废旧预览；清除预览调用 `desktop.selection.clear {observationId,windowId,previewId}`，仅清除相同预览。所有观察释放、到期、休眠、锁屏、退出或原生进程异常同时作废其预览与在途生成。

`desktop.plan.generate` 严格接收 `{id,revision,requestId,observationId,windowId,previewId,provider,configurationRevision,reviewed:true}`。task id/revision 沿用本机任务约束，其他身份为 UUID，provider 只允许已有两家供应商，configurationRevision 为现有配置摘要。Renderer 不提供正文、选区范围、窗口路径、模型结果或密钥。必须显示并明确确认当前已保存任务描述、原选区及配置中的供应商/模型；未配置、被遮盖的选区或空描述不能发送。网页、工具、附件与其他任务资料不自动加入此请求。

宿主校验任务修订、任务未在生成其他方案、所选 AI 配置修订与配置在用状态，通过只供宿主调用的 `desktop.selection.resolve` 请求 Main 复验同一 previewId。Main 重新读取同一原生窗口选区，核对原文字与范围摘要、遮盖结果，变化即拒绝；不得按标题重新匹配窗口。凭据等待结束后、发送前和返回结果后均重新核对任务/配置/来源；来源检查是读取时刻的证据，不是将来写入授权。

每个任务最多一个生成，requestId 在本宿主最近五分钟内不可重复消费；最多保留 256 项，满额拒绝新生成而不是逐出仍有效记录。`desktop.plan.cancel {id,requestId}` 取消相同请求；先到达的取消也占用同一短期请求编号。Main 会话结束经内部 `system.desktop.invalidate {observationId}` 取消对应生成。超时最多 60 秒且不晚于选区到期；取消、离开、休眠或退出中止等待与网络，迟到回复不采用，不自动重试或切换模型。

## AI 结果与页面

沿用 AIProvider 的固定服务端点与结构化输出。仅发送通用整理指令、已保存任务描述与已确认的选区纯文本；正文中的指令属于待处理资料，不能改变系统能力、读取其他对象或发起工具操作。

完整输出 `{kind:"proposal"|"unsupported",summary,replacement,limitations}`：summary 为 1–1000 字符，replacement 最多 20000 UTF-16 单元，limitations 最多十项且每项 1000 字符。proposal 要求非空 replacement；unsupported 要求 replacement 为空。不接受额外字段。含当前凭据或被秘密模式遮盖的结果不作为候选返回，错误不携带原始模型输出。结果不直接成为可执行流程或原生命令。

成功响应 `{version:1,id,revision,requestId,observationId,windowId,previewId,provider,model,expiresAt,result}`；所有身份必须与本次请求一致。页面复核与本次任务和预览绑定，按 450/720 方案列与 650/720 改动对照列呈现；窄宽度上下排列。步骤显示当前已完成与尚未接入的事实。完整原段落与候选正文纯文本可滚动查看，unsupported、未改动、失败、取消分别说明，不伪造执行结果。

进入方案不自动发送；单独勾选确认当前文本和模型后才可生成。取消后可主动重新核对再生成；返回窗口、切任务/页签、改选窗口、清除/到期均清除候选并取消在途生成。新配置或新预览必须重新确认。改动对照页保留“取消，回到方案”，写入入口在真实执行协议接入前不可用，并说明尚未修改文档。不提供复制后冒充写回成功的替代路径。

## 交付与验收

治理先合并后客户端采用，公共流程契约仍为 0.13.0，不新增数据库格式。按用户顺序不新增或运行单元测试。类型/构建/格式、模拟 UI 和真实 AI/原生系统验证分别记录；模拟生成不等于真实 API、原生来源复验或实际文档写入已通过。
