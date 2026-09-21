# P1 设计修订与再次核对

2026-09-21。用户授权修正上一轮设计审计发现的问题，再次核对，并由用户继续描述业务流程。

## 结论与证据边界

- 四处明确偏差已修正：分钟间隔计划、现有节点能力、安装/实例/入口生命周期、流程图语义。
- 两条通用路径已补画：从零搭建至调试/结果/导出；标准 ZIP 安装至实例/资源授权/多入口/人工确认/结果。
- 原有 11 个核心页面的顶层节点 ID 保持；新增画板包含流程页、配置规格、状态目录和紧凑布局。业务场景仍由用户描述后独立校准。
- Figma 文件已正式命名 FlowArk · P1 Product Design。结构导出记录 59 个画板、545 个组件实例、784 个含交互的节点；自动布局检查无子内容溢出。这些数字不是功能完成率。
- 原型仅模拟页面/状态跳转，不真实选择文件、保存 Key 或执行 Run；字段校验和操作互斥仍需客户端行为验证。
- 六宫格节点/日志页是设计规格目录，不是产品要同时展示六个编辑器；复杂 Excel 矩阵、完整脚本编辑器和筛选控件展开态仍需模块实施时按规格细化。

## 修正项与入口

| 问题 | 修正结果 | Figma 节点 |
| --- | --- | --- |
| F-01 计划语义 | 改为每 N 分钟，包含启停、显式版本采纳和冲突状态 | [本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3673) |
| F-02 未定义节点 | 示例改为读取文字与写文件；动作目录对应现有通用节点 | [流程编排](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-394) |
| F-03 模板生命周期 | 安装与实例分开，资源/动作授权及入口输入分别设计 | [模板实例](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-973) |
| F-04 流程图语义 | 条件两侧分支与汇合，文件波浪底、工作簿叠页、人工梯形、循环六边形与回边 | [条件与串行循环](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1758) |
| G-01 参数与编辑 | 类型化参数、变量来源/路径、结构编辑与引用保护 | [流程参数与资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1398) |
| G-02 调试与结果 | 首步暂停、单步/继续、输出/产物、核对后新运行 | [逐步调试](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2534) |
| G-03 人工与授权 | 本次动作目标/内容确认、过期拒绝、动作权限选择后的保存状态 | [人工确认与输入](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2911) |
| G-04 AI与本机资源 | Provider/模型/Key、文件凭据、外部浏览器及错误状态 | [AI 服务配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3118) |
| G-05 生命周期与小窗口 | 退出/托盘/存储故障，1040×700 两栏与配置状态 | [紧凑窗口与网页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5152) |
| G-06 实际点击发现的问题 | 补授权选择后状态与真正的历史第2页/筛选页 | [运行记录：第2页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-8100) |

## P1 验收编号映射

这里映射设计，不将 C/J 验收标为通过。当前阶段和业务归属仍由 ROADMAP 顶部最新决定约束。

| 编号 | 对应设计 |
| --- | --- |
| C-01 | 单机导航、首次进入；业务闭环待模板校准 |
| C-02 | 参数/变量、条件循环、节点表单 |
| C-03 | 固定运行快照、计划显式采用版本 |
| C-04 | 浏览器故障、脚本依赖与期限、运行控制 |
| C-05 | 人工请求与待核对、证据与重跑 |
| C-06 | 排队、暂停请求、已暂停、人工等待、取消/收尾 |
| C-07 | 退出确认、中断/休眠恢复、最后保存状态 |
| C-08 | 间隔计划、占用跳过、错过不补跑 |
| C-09 | FIFO队列、资源占用与会话回收阻断 |
| C-10 | 凭据保护、脱敏输出、ZIP排除绑定 |
| C-11 | ZIP失败/冲突与运行前资源/能力检查 |
| C-12 | 实际数量、无报告与循环实例，禁止虚构完成率 |
| C-13 | 存储不可写、产物缺失与清理结果 |
| C-14 | 本机环境与退出重开界面；安装与系统验证另记 |
| C-15 | 本机浏览器选择/检测/失效，显式内置模式 |
| C-16 | 不下载或静默替换浏览器的提示；工程验证另记 |

J-01—J-14 业务验收未因设计修订而通过。通用授权、AI、人工待办、结果与模板生命周期为业务提供界面承载；招聘字段/提示词/选择器仍归模板。前程无忧流程待用户描述后映射，不能先猜测业务入口。

## 全部画板索引

| 画板 | 节点 | 尺寸 |
| --- | --- | --- |
| 我的流程 | [1:198](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-198) | 1440×960 |
| 流程编排 | [1:394](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-394) | 1920×1080 |
| 网页操作与拾取 | [1:2229](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-2229) | 1920×1080 |
| 模板库 | [1:3125](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3125) | 1440×960 |
| 导入模板 | [1:3256](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3256) | 1440×1080 |
| 运行记录 | [1:3376](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3376) | 1440×960 |
| 运行详情 | [1:3539](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3539) | 1440×960 |
| 本机计划 | [1:3673](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3673) | 1440×1080 |
| 待办与提醒 | [1:3794](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3794) | 1440×960 |
| 本地设置 | [1:3896](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3896) | 1440×960 |
| 首次使用 | [1:4023](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-4023) | 1440×960 |
| 安装完成 | [2:812](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-812) | 1440×1080 |
| 实例列表 | [2:892](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-892) | 1440×1080 |
| 模板实例 | [2:973](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-973) | 1440×1080 |
| 资源与动作授权 | [2:1083](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1083) | 1440×1080 |
| 入口输入与执行 | [2:1199](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1199) | 1440×1080 |
| 只读入口 | [2:1314](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1314) | 1440×1080 |
| 流程参数与资源 | [2:1398](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1398) | 1440×1080 |
| 变量选择 | [2:1545](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1545) | 1440×1080 |
| 步骤编辑与位置 | [2:1650](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1650) | 1440×1080 |
| 条件与串行循环 | [2:1758](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1758) | 1920×1080 |
| 网页动作配置 | [2:1866](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1866) | 1440×1080 |
| HTTP文件与表格配置 | [2:2033](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2033) | 1440×1080 |
| 流程控制配置 | [2:2200](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2200) | 1440×1080 |
| 脚本与依赖配置 | [2:2367](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2367) | 1440×1080 |
| 逐步调试 | [2:2534](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2534) | 1440×1080 |
| 输出与运行产物 | [2:2640](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2640) | 1440×1080 |
| 日志与步骤输出 | [2:2744](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2744) | 1440×1080 |
| 人工确认与输入 | [2:2911](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2911) | 1440×1080 |
| 核对后重新运行 | [2:3014](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3014) | 1440×1080 |
| AI 服务配置 | [2:3118](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3118) | 1440×1080 |
| 凭据与本机资源 | [2:3227](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3227) | 1440×1080 |
| 本机浏览器绑定 | [2:3333](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3333) | 1440×1080 |
| 创建计划 | [2:3431](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3431) | 1440×1080 |
| 安装校验与版本冲突 | [2:3565](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3565) | 1440×1080 |
| 输入与保存状态 | [2:3672](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3672) | 1440×1080 |
| 保存与离开确认 | [2:3779](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3779) | 1440×1080 |
| 运行前检查 | [2:3884](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3884) | 1440×1080 |
| 拾取与会话状态 | [2:3991](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3991) | 1440×1080 |
| 浏览器故障与恢复 | [2:4104](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4104) | 1440×1080 |
| 运行控制状态 | [2:4209](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4209) | 1440×1080 |
| 人工请求与结果核对 | [2:4316](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4316) | 1440×1080 |
| 产物状态与清理 | [2:4421](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4421) | 1440×1080 |
| 计划状态与冲突 | [2:4526](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4526) | 1440×1080 |
| AI连接与输出状态 | [2:4629](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4629) | 1440×1080 |
| 资源与存储异常 | [2:4732](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4732) | 1440×1080 |
| 模板版本与导出 | [2:4837](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4837) | 1440×1080 |
| 导出 ZIP | [2:4940](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4940) | 1440×1080 |
| 退出与运行环境 | [2:5045](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5045) | 1440×1080 |
| 紧凑窗口与网页 | [2:5152](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5152) | 1040×700 |
| 紧凑配置抽屉 | [2:5253](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5253) | 1040×700 |
| P1 操作路径总览 | [2:6948](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-6948) | 1440×1080 |
| 动作授权：每次确认 | [2:7749](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7749) | 1440×1080 |
| 动作授权：自动范围 | [2:7867](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7867) | 1440×1080 |
| 入口输入：自动范围 | [2:7985](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7985) | 1440×1080 |
| 运行记录：第2页 | [2:8100](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-8100) | 1440×960 |
| 运行记录筛选 | [2:8270](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-8270) | 1440×1080 |
| 模板运行：写入中 | [2:9120](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-9120) | 1440×960 |
| 模板运行：结果 | [2:9260](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-9260) | 1440×1080 |

## 验证记录

- 对照当前治理规范和客户端节点/模板/计划目录；不是基于旧版招聘内置功能推断。
- 先导出52张稿并全量查看联系表，修正7处布局溢出；点击复核发现的权限选中态和历史导航另行修正。
- 最终59张画板结构报告无溢出；原生文本/组件/变量仍可编辑，原始核心节点ID保留。
- 最终导出 ZIP 完整性检查通过，内含59张 PNG；在前52张全量缩略检查基础上，补查最终7张新增状态稿。
- Figma 桌面原型实际点击通过：路径总览 → ZIP导入 → 确认安装 → 安装完成 → 创建实例 → 共享配置 → 资源授权 → 选择每次确认 → 保存授权 → 入口执行 → 人工确认 → RUN-0921-025第4步写入 → 同一运行结果与产物。
- 实际点击另确认：运行记录下一页进入第2页；我的流程打开样例进入流程编排，再进入首步暂停的逐步调试页。
- 人工确认后误入其他运行的示例已拆成独立写入中/结果稿并再次点验。未逐一点击全部784个交互节点；输入、原生文件选择、真实运行和所有状态组合仍由后续客户端验证。
- 本轮不修改客户端源码、安装包、实际业务模板或平台状态。
