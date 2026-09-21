# P1 AI 任务体验与验收

2026-09-21。按用户对 129 张既有画板的复核，保留蓝灰配色、组件、手动编排、条件/串行循环、运行状态和导航守卫；补齐普通用户从需求到结果的主路径。Figma 是产品界面基线，本文约束行为和验证边界。此次不修改客户端代码，不代表真实模型、MCP 或桌面任务验收通过。

## 范围与主路径

AI 完整流程生成/修改、内置 MCP 客户端及 macOS 明确绑定窗口的有限桌面操作进入 P1。服务端、管理台、远程执行、手机自动化、录制和在线商店不随本次设计展开。招聘等业务仍归独立模板；通用教学使用网页标题归档，不在客户端增加站点专属逻辑。

首次实操 → 描述与附件 → 选择对象 → 理解与补问 → 确认步骤 → 试运行前检查 → 执行 → 可读结果 → 继续修改。未配置 AI 从原任务进入 DeepSeek，填写、保存、验证后回到原草稿。教学支持跳过、继续和重新学习；学习进度与任务执行进度分开保存。本机状态、证据推进和并发规则见[首次教学规范](first-task-learning.md)。

首页优先显示目标输入和可操作示例，已有任务、手动创建、正在运行与需要处理保持可达。统计不占据新用户的主要开始位置。输入区的文件/网页/截图只能来自用户选取；发送前说明哪些上下文会给哪个供应商。没有选取的窗口、文件、账号和全量历史不隐式加入。

## 理解、方案与版本

理解卡明确输入来源、应用/网页/账号/工作区、修改范围、输出位置；缺失信息通过短选项补齐。对象变化时重新核对能力和授权，不能只更新显示标题却沿用旧目标引用。

清单与流程图是同一份流程草稿的投影，共享步骤身份、条件/循环、分支和引用。AI 返回完整且可校验的提案，不将流式片段或未完成 JSON 直接当作流程执行。生成中可取消；失败保留原描述和旧草稿，重试不创建运行。缺少工具或不支持的能力明确提示，不生成伪可执行步骤。

修改展示基线版本、影响步骤、原值/新值、资源和权限变化；只有采纳才更新草稿。不采纳保留原版；撤销恢复上一草稿。期间手动编辑导致基线变化则拒绝覆盖并重新计算差异。已创建的运行/计划继续绑定原快照，下一次运行重新确认版本。静态原型用 v1/v2 分支演示一致性，正式实现不得保存为两份互不关联的任务。

## 应用与工具

普通入口命名“应用与工具”。预设卡展示连接方式、来源、账号/工作区、能力、测试状态与授权范围。连接向导包括来源确认、认证/系统授权、只读测试、能力检查和保存。失效显示影响任务及原因，重连不自动重放已完成或结果未知的动作。删除/新增权限要明确影响，已有任务不自动获得新增能力。

高级入口提供自定义 MCP 远程地址或显式本地程序/参数、认证方式及能力发现。发现结果必须显示对应连接身份，不能跳到其他预设服务的成功页；保存前核对工具和范围。连接不静默安装程序。MCP 提供上下文与工具协议，规划和用户交互由 FlowArk 负责；参见 [MCP 架构](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)。

连接成功、系统权限已授予、本次任务已授权分别显示。执行由宿主校验绑定和权限，模型不直接持有原生浏览器/桌面对象。桌面示例限定文本编辑的已选文档段落：读取 → 整理预览 → 确认修改 → 写入并回读；窗口/选区改变时停止并重新选择。不能据示例承诺任意 App 操作。新增协议在实现前定义，不把设计字段视为现有 IPC。

## 工作区、导航与编辑

| 当前活动 | 主区域 | 应保持的上下文 |
| --- | --- | --- |
| 描述、理解、方案 | AI 对话＋可读步骤 | 任务、附件、目标、补问、草稿版本 |
| 手动编辑 | 动作库＋画布＋当前步骤属性 | 步骤身份、选中项、未保存编辑 |
| 网页定位 | 网页＋当前步骤，动作库收起 | 同一网页会话、原坐标、来源步骤 |
| 执行或异常 | 当前对象/结果＋步骤＋必要操作 | 固定运行快照、真实进度、已完成影响 |

顶部返回到来源页面；面包屑祖先可点击、当前项不点击；网页浏览历史按钮和任务返回不能混用。从配置返回保留任务输入和列表/画布位置。全局导航及未保存守卫继续遵循 [导航规范](design-navigation.md)，不因新增 AI 页面引入第二套返回逻辑。原型未模拟文件选择器和每个键盘编辑事件，正式实现按此规范验收。

“试运行/运行”为主要操作；保存状态常驻，“导出 ZIP”等低频操作收纳到更多。长流程稿展示 40 步的大纲、分支折叠、搜索定位和当前第 32 步；不是把 40 步缩成不可读的全图。Excel 映射提供来源/目标列、表格预览、空值策略与冲突定位；脚本提供代码编辑、输入输出及依赖/超时说明。稿中代码为说明示例，实施时使用实际版本 SDK，不从样稿推断新接口。

紧凑网页增加总览、全宽与 100% 聚焦，保持 1920 CSS px 执行布局。原生视图裁剪和平移需先技术验证；真实文字/表格/控件及输入映射标准见 [内置浏览器](embedded-browser.md#2026-09-21-设计增量紧凑窗口的清晰观察)。

## 执行结果与失败修复

试运行会执行列出的真实操作，不能表示成天然无副作用的预览。执行前确认对象、读写范围、输出目录、权限及固定版本。结果页依据运行证据展示完成内容、修改影响、未完成项、结果位置和下一步；JSON、原始输出和脱敏日志在详情。未知不能总结为成功，AI 不能补造结果。

执行投影及只读文件预览接口见 [执行与可读结果](run-results.md)；副本存在不等于新建文件或外部副作用全部核对。

失败页显示具体步骤、原因、已完成操作、未完成部分和副作用情况。重新选择目标后回到修复差异；AI 不能声称用户已重选而跳过拾取。采纳后确认执行起点，创建关联旧运行的新 Run。P1 默认从头重新运行，不承诺任意步骤或脚本内部续跑；提交结果未知先人工核对，不因修复/重连自动重复提交。打开结果、返回和修改草稿均不触发运行。

## 客户端验收清单

以下全部为待验证要求；设计检查不能替代这些验收。

| ID | 必须实际验证 |
| --- | --- |
| U01 | 首次教学可完成、跳过、跨重开继续、重新学习；进度真实保存 |
| U02 | 描述/附件增删和取消保留；发送上下文范围可核对 |
| U03 | 网页/应用/账号/工作区身份明确，目标或权限变化阻止旧绑定执行 |
| U04 | 缺信息补问、生成取消/失败/重试、无工具和不支持能力都有可恢复状态 |
| U05 | AI 差异采纳/拒绝/撤销、草稿并发冲突、固定运行快照保持一致 |
| U06 | 同一流程清单/图切换、条件/循环引用、选中步骤和编辑状态保持 |
| U07 | 预设与自定义 MCP 连接、能力发现、认证失败、断连、重连及权限变化 |
| U08 | DeepSeek 实接，首次写入、脱敏回显、重开、替换/失败、迟到测试结果及原任务返回 |
| U09 | 试运行影响确认、真实进度/产物回读、部分完成与未知结果展示准确 |
| U10 | 失败定位、重新选目标、修复范围、重跑起点、关联新 Run；不重复副作用 |
| U11 | 1040×700 的真实网页可读和正确拾取；40 步定位；Excel 映射冲突；实际脚本编辑 |
| U12 | macOS 所选窗口读写并回读；窗口/选区变化停止；非技术用户独立完成完整主路径 |

U12 用户测试计划：邀请 3–5 位未使用过编辑器的用户，从第一次打开完成一个无需账号的小任务。记录是否独立完成、是否知道当前操作对象、是否找到产物、失败后是否知道下一步；记录需要帮助的位置和失败原因。尚未开展此用户测试，不报告通过率或转化提升。

## Figma 与本轮证据

主入口：[AI 开始任务](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-1941)。原 129 张画板保留，新增任务主页面与连续状态。

本轮没有输入真实 API Key，没有调用模型或 MCP 服务，没有执行设计示例中的文件或应用操作。Figma 文件使用既有 55 个变量、8 个文字样式和按钮/输入/状态组件；外部示例账号、文件和结果均为虚构。

最终结构审计：新增 57 张，合计 186 张（含原有辅助状态）；55 个变量、8 个文字样式，顶层自动布局审计无溢出，新增画板的目标链接无缺失、无失效。结构审计不等于所有交互或真实客户端行为通过。

### 新增画板索引

| 画板 | Figma |
| --- | --- |
| AI · 开始任务 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-1941) |
| AI · 第一次实操 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2106) |
| AI · 描述与附件 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2280) |
| AI · 选择操作对象 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2440) |
| AI · 应用窗口与能力 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2609) |
| AI · 理解与补问 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2766) |
| AI · 确认任务方案 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2928) |
| AI · 步骤清单 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3109) |
| AI · 同一流程图 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3290) |
| AI · 修改差异 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3467) |
| AI · 采纳后的方案 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3618) |
| AI · 试运行前检查 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3799) |
| AI · 试运行中 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3957) |
| AI · 可读结果 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4127) |
| AI · 结果详细信息 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4283) |
| AI · 失败与引导 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4425) |
| AI · 修复提议 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4575) |
| AI · 修复后运行起点 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4724) |
| 应用与工具 · 连接目录 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4867) |
| 应用与工具 · 连接向导 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5033) |
| 应用与工具 · 已连接 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5195) |
| 应用与工具 · 失效重连 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5348) |
| 应用与工具 · 高级 MCP | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5493) |
| AI · 模型未配置 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5656) |
| AI · 模型配置后返回 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5795) |
| AI · 全宽网页查看 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5921) |
| AI · 紧凑网页总览 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6084) |
| AI · 紧凑目标聚焦 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6221) |
| 编排 · 四十步任务 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6333) |
| 配置 · Excel 映射编辑 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6516) |
| 配置 · 脚本编辑 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6726) |
| 编排 · 更多操作 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6890) |
| AI · v2 步骤清单 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7031) |
| AI · v2 流程图 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7158) |
| AI · v2 运行检查 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7281) |
| AI · v2 试运行 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7385) |
| AI · v2 结果 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7501) |
| AI · v2 结果详情 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7603) |
| AI · 修复时重新拾取 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7691) |
| AI · 修复版运行检查 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7765) |
| AI · 修复版运行 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7869) |
| AI · 修复版结果 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7985) |
| AI · 应用窗口已就绪 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8087) |
| AI · 应用任务方案 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8190) |
| AI · 应用任务确认 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8344) |
| AI · 应用任务执行 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8492) |
| AI · 应用任务结果 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8631) |
| 应用与工具 · 自定义能力检查 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8773) |
| 应用与工具 · 自定义已连接 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8920) |
| AI · 任务中填写模型 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-9067) |
| AI · 任务中验证模型 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-9182) |
| AI · 正在生成方案 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10659) |
| AI · 生成失败与重试 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10802) |
| AI · 当前能力不支持 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10940) |
| AI · 任务中替换 Key | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-11076) |
| AI · 修复版结果详情 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-11195) |
| AI · 继续修改当前版本 | [打开](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=27-13212) |

### 原型实际点击核对

- 首次教学 → 描述 → 选择网页 → 理解补问 → 生成 → 方案。
- 生成取消回到补问；失败后重试回到生成并查看完整方案。
- 修改差异拒绝回到 v1，采纳后进入 v2；v2 流程图 → 运行检查 → 执行 → 可读结果，运行标识保持 R-DEMO-003。
- 目视检查本轮导出画板，ZIP 完整性校验通过。

以上为桌面 Figma 原型实际点击，不发真实 API 或执行任务。57 张稿中的其余分支完成结构连线检查；未把所有字段编辑、快捷键、外部授权、滚动/坐标、并发、持久化和真实业务报告为已经实测。后续用户测试仍待开展。
