# 结果页的按需回执与完整普通阅读

2026-10-21。真实BOSS长Run在读取状态时达到结构化结果容量限制；进入失败结果页后，可访问树读取及点击曾无法正常返回。没有证据证明应用崩溃。先修复源码已确认的无关加载与批量渲染，再继续通用执行容量和跨有限Run自动续批；不以界面改进代替后两项。

## 现有行为与本次范围

`RunOutputWorkspace`始终挂载`RunContextOperations`。后者在挂载/Run状态变化时直接调用`context.operations`，并为所有已提交回执同时挂载完整`ContextResultView`。宿主当前还扫描整个状态操作命名空间后按Run筛选。这会在用户尚未要求核对写入时传输和渲染大量重复历史状态。

`ContextResultView`和入口整体结果当前使用总计200项、深度8的摘要，超出范围引导高级原文；已有`CompleteValue`则支持逐层展开、每页最多200项及长文本继续阅读。本次复用后者，使普通阅读覆盖已取得值，不把手改JSON变为正常路径。

这次仅改变Renderer的读取时机和显示：不更改IPC方法、参数/返回值、凭据、Schema、SQLite或流程格式，继续采用发布0.49.0。`context.operations({runId})`仍返回本Run已有回执，`context.inspect({runId,operationId})`仍按原规则核对原操作，既有准备中/未知核对与权限边界保持。首次展开仍使用现有整列表IPC，宿主全命名空间扫描和返回负载尚未优化；本次分页是显示分页，不能宣称服务端分页或容量治理完成。

## 普通交互与异步边界

- 初始仅显示“查看状态写入回执”；未展开不发出回执列表请求、不挂载历史状态。主要步骤结果、入口整体结果与产物仍独立可看。
- 展开后显示读取中、可收起。关闭、切换Run或离开页面后忽略迟到读取，不将旧运行列表/错误覆盖当前页面。关闭只停止界面采纳，不声称取消了宿主已接收的读取或原操作核对。
- 列表每页10条，显示人可读步骤、提交状态和修订；上一页/下一页保留焦点，显示实际范围与总数。只允许一条完整状态展开，切换条目/翻页收起旧详情；没有记录时明确0条，失败提供重新读取。
- 已提交值经普通字段树逐层展开，对象/数组先显示20项，扩展至每页最多200项后翻页，长文本每次继续4000字符。0、false、空文本、null与空列表分别显示；阅读范围不改变已保存值或动作权限。
- 准备中/未知的“核对原操作”保持独立明确按钮，不因展开详情、翻页、刷新或关闭触发。连续点击只处理一个在途核对；原操作可能在页面关闭后结束，重新打开按原记录核对。
- 入口整体结果是宿主的脱敏显示投影。若原投影被裁剪，继续展开只能阅读已保存投影，不恢复被裁剪来源，不标为完整原始资料。
- 原始格式保留为高级诊断。选择另一结构化步骤时重置该值的展开范围，固定来源、摘要与原Run保持；不创建Run、请求模型或招聘外发。

## Figma先行

现有文件`sVciNUZHG9yx81gCpYzjH9`、产品页`1:3`，复用原阅读页`943:9996 / 943:10090`，Semantic Light/Dark及Noto Sans SC/Inter。每张有4个原Button实例和可编辑文字/矢量，无整页图片、新主题或新组件库。

| 状态 | Light | Dark |
| --- | --- | --- |
| 未展开 | [1088:10847](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-10847) | [1088:10942](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-10942) |
| 读取中与收起 | [1088:11037](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11037) | [1088:11132](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11132) |
| 分页回执 | [1088:11227](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11227) | [1088:11322](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11322) |
| 单条完整状态 | [1088:11417](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11417) | [1088:11512](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11512) |
| 无回执 | [1088:11607](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11607) | [1088:11702](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11702) |
| 读取失败及未知边界 | [1088:11797](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11797) | [1088:11892](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1088-11892) |

12张结构/字体/变量已核对，实际查看全部6张Dark和Light分页/详情共8张整图；修正复用来源的导航选中状态后再查看Light分页和Dark详情，无裁切或重叠。界面示意不作为真实运行证据，原186画板验收结论不变。

## 实施及验收门槛

当前仅先行设计与治理。接续客户端类型/构建/定向格式检查，按当前阶段约定不新增、不运行单元测试。完成PR、打包并更新旧应用后，用原真实失败Run和已完成Run核对普通阅读、展开/收起/翻页、原操作仍保留及重开，不以虚构招聘或新外发代替。读取中离开、迟到、失败/重读、空值与不同Run隔离仍须分别给出证据；没有观测的分支不标通过。

此前治理[#998](https://github.com/zhongmiao-org/flow-ark/pull/998)已实际压缩合并为`f2e85faf54c9d0ec070eaa686860f0b751f66271`，准确源`341aef6e8869ff5d0942bbd0b7771a1f3adcd05b`与合并同树。CI39462903187/118766703349明确账户计费未启动、0步骤，按既有授权交付，未计通过；较早同head工作流并发取消另记。真实今天9条确认招呼、昨天原1条预留未知、个人Skill/自有Key/北京与薪资交集保持。完整执行容量、自动续批、网站150次弹框和回复后附件/有序聊天继续。
