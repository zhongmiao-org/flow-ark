# 186 项设计复核 · 2026-10-14

2026-10-14。原文件保留一套原生画板与组件，`FlowArk / Semantic`（`VariableCollectionId:1:5`）含 Light `1:1` / Dark `199:0` 两个模式。切换同一节点的模式即可改变外观；旧深色副本隐藏归档。

本轮先完成设计：读取全部原节点的字段、正文、按钮与原型连线，并逐张导出 / 查看按画板比例截图（最长边 1440 px）；针对发现的问题改画板、组件与后续状态。表中的设计核对不等于实际点击了全部原型，也不等于客户端 / Worker / 业务通过。原 [客户端逐板状态](design-board-coverage.md)保持。

## 复核证据

- Light 首轮截图查看：001–186，186 / 186；单行控件修订后重点回查。Dark 同节点复看：018、030、066、119、120、137，加配色说明 177:2。
- 原 186 个节点全部存在且可见。可见原型的缺失、隐藏、自导航和内层画板目标均为零；色值解析结果见 [审计 JSON](design-antd-audit.json)。
- 410 个历史单行 Control 复用 AntInput / AntSelect；一套 8 组 / 36 变体，选中导航反白，危险按钮反白，只读 / 错误 / 禁用保持独立语义。
- macOS 红黄绿窗口标记维持平台颜色；网页示例自身固定浅色，应用观察面板随主题切换。
- 截图保存在本机 `/Users/mac/.codex/visualizations/2026/10/13/01a13426-afa8-7532-9d62-08a90058cdad/186-theme-review-20261014`；这是本机 QA 路径，不要求其他克隆具备该路径。图片不纳入治理仓库。

## 设计闭环规则

| 对象 | 操作与后续状态 |
| --- | --- |
| 参数 | 固定值保留；params 依赖解析；数字 / 文本有效类型分开；缺失 / 循环阻止；保存回执 / 只读刷新 / 放弃 / 继续分别设计；原 018 是主入口 |
| 步骤引用 | 生产者输出只读；消费者只选可用前序输出 / 当前参数；数组集合不选文本或自身循环项；类型不符禁用确认 |
| 保存 / 应用 | 普通保存停留来源页；未保存离开三选；失败保留输入；保存回执与执行分开 |
| 安装 / 人工确认 | 原生复选状态和布尔门槛；未勾选不继续；安装不授权、不运行 |
| 运行 | 请求暂停 / 步骤边界暂停 / 恢复；请求取消 / 收尾 / 已取消；单步结果保留暂停；条件不成立为跳过，产物数为 0 |
| 重跑 | 原快照 / 当前已保存流程二选一；带来源 Run；检查绑定权限及外部结果；确认后新建排队记录，旧记录保持 |
| 产物 | 已清理保留索引与清理标记，无定位操作；外部丢失和清理失败单列；原始业务文件保留 |
| 计划 | 编辑当前计划保留入口 / 间隔 / 原快照；创建时固定已保存入口版本，初始暂停；不把保存当立即执行 |
| 模板 / 实例 | 各模板详情分开；实例共享配置、入口输入和资源各有归属；资源浮层保存回当前实例，取消保留原绑定；动作授权与资源选择分开 |
| Excel / 脚本 | 增加第五映射保留原四行；空 / 重复 / 类型冲突阻止；保存不写工作簿；脚本检查 / 结构预览不执行代码，不称安全沙箱 |
| 异步服务 | 连接 / 模型测试中、成功、失败、取消、重试区分；失败保留草稿及原配置，不自动换 provider |
| 观察 / 分页 | 显示网页保留原页和对象；收起返回原页；分页加载保留筛选 / 滚动，成功更新条目与页码，失败保留数据并显式重试；越界禁用 |
| 主题 / 输入 | 正常页隐藏保存失败说明；失败保留当前外观，显式重试后恢复正常；切换仅外观；草稿、未完成文本、焦点、选区和滚动由客户端保持；原型只验证固定示例的变量模式和状态连接 |

## 原 186 项逐板记录

本表记录设计复核。未列专门修订的稿保留原有状态语义，本轮检查布局、文字 / 控件和返回连线；146 张页面 / 状态加 40 张独立确认场景。确认状态的背景导航仍被锁定，选中标签和只读规格不为制造点击率添加动作。

| 编号 | 节点与画板 | 本轮设计核对 / 修订 |
| --- | --- | --- |
| 001 | [我的流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-198) | 今日计数补齐状态构成；五个非网页流程卡片转向各自步骤概览 |
| 002 | [流程编排](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-394) | 普通保存与应用反馈保持编辑来源；输出只作为生产者只读引用 |
| 003 | [网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-2229) | 保留宽屏网页协作；共享显示 / 收起网页保留来源页 |
| 004 | [模板库](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3125) | 文件 / 表格 / 网页填写模板有独立详情和实例 |
| 005 | [导入模板](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3256) | 未核对来源禁用安装；原生复选门槛 |
| 006 | [运行记录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3376) | 第一页上一页禁用；分页示例与加载状态分开 |
| 007 | [运行详情](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3539) | 暂停请求 / 已暂停 / 恢复 / 取消收尾与终止分开；返回保留主状态 |
| 008 | [本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3673) | 三条计划带入各自入口 / 间隔；编辑取消返回列表 |
| 009 | [待办与提醒](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3794) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 010 | [本地设置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-3896) | 外观进入单页 variable-mode 切换 |
| 011 | [首次使用](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=1-4023) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 012 | [安装完成](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-812) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 013 | [实例列表](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-892) | 第二个项目记录实例保持独立身份 |
| 014 | [模板实例](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-973) | 取消共享配置返回精确实例列表 |
| 015 | [资源与动作授权](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1083) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 016 | [入口输入与执行](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1199) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 017 | [只读入口](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1314) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 018 | [流程参数与资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1398) | 在原节点并入来源、有效预览、固定值保留与本机资源边界 |
| 019 | [变量选择](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1545) | 消费者引用范围与类型校验；不展示当前生产者自己的输出 |
| 020 | [步骤编辑与位置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1650) | 保存反馈保持步骤编辑 |
| 021 | [条件与串行循环](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1758) | 循环集合为数组；循环 item / index 不作为集合来源 |
| 022 | [网页动作配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-1866) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 023 | [HTTP文件与表格配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2033) | HTTP / 文件配置进入完整配置稿 |
| 024 | [流程控制配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2200) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 025 | [脚本与依赖配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2367) | 脚本入口签名与实际 ABI 对齐；配置规格保持只读说明 |
| 026 | [逐步调试](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2534) | 单步完成后保持暂停；继续 / 取消有后续阶段 |
| 027 | [输出与运行产物](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2640) | 清理返回已清理列表；定位与重跑互不冒充执行 |
| 028 | [日志与步骤输出](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2744) | 日志目录改为只读查看操作 |
| 029 | [人工确认与输入](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-2911) | 人工核对复选后才可确认 |
| 030 | [核对后重新运行](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3014) | 在原节点并入原快照 / 当前已保存流程及核对门槛 |
| 031 | [AI 服务配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3118) | 重新测试与失败保留；不静默换模型 |
| 032 | [凭据与本机资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3227) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 033 | [本机浏览器绑定](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3333) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 034 | [创建计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3431) | 创建时固定入口版本；成功后初始暂停 |
| 035 | [安装校验与版本冲突](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3565) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 036 | [输入与保存状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3672) | 保留数字原始错误输入、来源和草稿 |
| 037 | [保存与离开确认](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3779) | 保存、离开守卫、复制回执区分 |
| 038 | [运行前检查](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3884) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 039 | [拾取与会话状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-3991) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 040 | [浏览器故障与恢复](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4104) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 041 | [运行控制状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4209) | 请求暂停、已暂停、恢复、取消收尾分开 |
| 042 | [人工请求与结果核对](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4316) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 043 | [产物状态与清理](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4421) | 清理完成 / 清理失败 / 外部丢失分开 |
| 044 | [计划状态与冲突](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4526) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 045 | [AI连接与输出状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4629) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 046 | [资源与存储异常](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4732) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 047 | [模板版本与导出](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4837) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 048 | [导出 ZIP](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-4940) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 049 | [退出与运行环境](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5045) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 050 | [紧凑窗口与网页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5152) | 紧凑观察与执行页布局不重置任务对象 |
| 051 | [紧凑配置抽屉](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-5253) | 配置抽屉关闭回到原紧凑观察页 |
| 052 | [P1 操作路径总览](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-6948) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 053 | [动作授权：每次确认](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7749) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 054 | [动作授权：自动范围](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7867) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 055 | [入口输入：自动范围](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-7985) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 056 | [运行记录：第2页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-8100) | 下一页不回跳第一页；补第三页固定示例与加载浮层 |
| 057 | [运行记录筛选](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-8270) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 058 | [模板运行：写入中](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-9120) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 059 | [模板运行：结果](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=2-9260) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 060 | [DeepSeek · 未配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10378) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 061 | [DeepSeek · 首次填写](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10487) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 062 | [DeepSeek · 替换 Key](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10599) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 063 | [DeepSeek · 测试中](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10715) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 064 | [DeepSeek · 已验证](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10835) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 065 | [DeepSeek · 连接失败](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-10955) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 066 | [DeepSeek · 移除确认](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-11077) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 067 | [模板 AI 资源配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=4-11164) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 068 | [导航与返回演示](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18364) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 069 | [模板入口 · 待配置 AI](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18463) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 070 | [模板入口 · AI 已配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18569) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 071 | [流程参数 · 未保存](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18679) | 保留四种类型输入练习；与主参数来源示例分开 |
| 072 | [DeepSeek · 来自模板配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18826) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 073 | [DeepSeek · 返回模板前](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-18938) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 074 | [DeepSeek · 模板来源已验证](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-19057) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 075 | [运行详情 · 来源第2页](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-19176) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 076 | [返回来源已失效](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-19310) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 077 | [离开确认 · 流程参数](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-20277) | 离开三选及保存失败保持；确认背景控件不参与操作 |
| 078 | [离开确认 · 模板 AI](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-20443) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 079 | [离开确认 · 首次配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-20559) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 080 | [离开确认 · 替换 Key](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-20678) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 081 | [保存失败 · 保留参数](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-20801) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 082 | [选择变量 · 来源 网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-23606) | 步骤引用范围与参数来源选择范围区分 |
| 083 | [选择变量 · 来源 流程参数与资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-23758) | 仅其他参数候选；数字来源进入对应详情 |
| 084 | [选择变量 · 来源 条件与串行循环](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-23910) | 循环集合只展示数组候选；隐藏当前循环变量 |
| 085 | [选择变量 · 来源 输入与保存状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-24062) | 无效状态保留修复入口和原值 |
| 086 | [选择变量 · 来源 紧凑配置抽屉](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-24218) | 紧凑配置返回入口保持 |
| 087 | [选择变量 · 来源 流程参数 · 未保存](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-24374) | 与 083 同一参数来源语义 |
| 088 | [RUN-0921-018 · 输出与产物](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-24539) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 089 | [RUN-0921-018 · 日志与步骤](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-24669) | 日志状态目录只读；重跑来源 Run 上下文带入核对页 |
| 090 | [AI · 开始任务](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-1941) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 091 | [AI · 第一次实操](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2106) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 092 | [AI · 描述与附件](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2280) | 附件核对有保留上下文的详情 |
| 093 | [AI · 选择操作对象](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2440) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 094 | [AI · 应用窗口与能力](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2609) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 095 | [AI · 理解与补问](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2766) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 096 | [AI · 确认任务方案](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-2928) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 097 | [AI · 步骤清单](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3109) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 098 | [AI · 同一流程图](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3290) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 099 | [AI · 修改差异](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3467) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 100 | [AI · 采纳后的方案](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3618) | 撤销采纳前展示影响范围并显式确认 |
| 101 | [AI · 试运行前检查](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3799) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 102 | [AI · 试运行中](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-3957) | 模拟完成入口移到产品外审稿导航 |
| 103 | [AI · 可读结果](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4127) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 104 | [AI · 结果详细信息](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4283) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 105 | [AI · 失败与引导](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4425) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 106 | [AI · 修复提议](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4575) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 107 | [AI · 修复后运行起点](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4724) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 108 | [应用与工具 · 连接目录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-4867) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 109 | [应用与工具 · 连接向导](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5033) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 110 | [应用与工具 · 已连接](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5195) | 连接重新测试进入检查状态 |
| 111 | [应用与工具 · 失效重连](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5348) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 112 | [应用与工具 · 高级 MCP](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5493) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 113 | [AI · 模型未配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5656) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 114 | [AI · 模型配置后返回](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5795) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 115 | [AI · 全宽网页查看](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-5921) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 116 | [AI · 紧凑网页总览](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6084) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 117 | [AI · 紧凑目标聚焦](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6221) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 118 | [编排 · 四十步任务](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6333) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 119 | [配置 · Excel 映射编辑](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6516) | 添加映射、确认第五行、预览与保存返回分开 |
| 120 | [配置 · 脚本编辑](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6726) | 语法检查与输入结构预览；签名为 async({ input, logger }) |
| 121 | [编排 · 更多操作](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-6890) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 122 | [AI · v2 步骤清单](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7031) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 123 | [AI · v2 流程图](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7158) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 124 | [AI · v2 运行检查](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7281) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 125 | [AI · v2 试运行](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7385) | 模拟完成移到产品外 |
| 126 | [AI · v2 结果](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7501) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 127 | [AI · v2 结果详情](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7603) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 128 | [AI · 修复时重新拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7691) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 129 | [AI · 修复版运行检查](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7765) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 130 | [AI · 修复版运行](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7869) | 模拟完成移到产品外 |
| 131 | [AI · 修复版结果](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-7985) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 132 | [AI · 应用窗口已就绪](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8087) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 133 | [AI · 应用任务方案](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8190) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 134 | [AI · 应用任务确认](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8344) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 135 | [AI · 应用任务执行](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8492) | 模拟结果移到产品外 |
| 136 | [AI · 应用任务结果](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8631) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 137 | [应用与工具 · 自定义能力检查](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8773) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 138 | [应用与工具 · 自定义已连接](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-8920) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 139 | [AI · 任务中填写模型](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-9067) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 140 | [AI · 任务中验证模型](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-9182) | 任务内模型测试中 / 失败 / 重试 / 返回草稿分开 |
| 141 | [AI · 正在生成方案](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10659) | 生成中仅保留产品取消；结果审稿入口在画板外 |
| 142 | [AI · 生成失败与重试](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10802) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 143 | [AI · 当前能力不支持](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-10940) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 144 | [AI · 任务中替换 Key](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-11076) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 145 | [AI · 修复版结果详情](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=23-11195) | 保留该状态；已查看截图和读取字段 / 按钮 / 返回连线，统一语义主题 |
| 146 | [AI · 继续修改当前版本](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=27-13212) | 新请求从当前版本修改；空输入保持禁用 |
| 147 | [离开 流程参数 · 未保存 → 我的流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-26305) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 148 | [离开 流程参数 · 未保存 → 模板库](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-26472) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 149 | [离开 流程参数 · 未保存 → 运行记录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-26639) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 150 | [离开 流程参数 · 未保存 → 本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-26806) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 151 | [离开 流程参数 · 未保存 → 待办与提醒](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-26973) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 152 | [离开 流程参数 · 未保存 → 本地设置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27140) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 153 | [离开 流程参数 · 未保存 → 网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27310) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 154 | [离开 流程参数 · 未保存 → 输入与保存状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27477) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 155 | [离开 DeepSeek · 来自模板配置 → 我的流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27644) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 156 | [离开 DeepSeek · 来自模板配置 → 模板库](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27761) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 157 | [离开 DeepSeek · 来自模板配置 → 运行记录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27878) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 158 | [离开 DeepSeek · 来自模板配置 → 本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-27995) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 159 | [离开 DeepSeek · 来自模板配置 → 待办与提醒](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28112) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 160 | [离开 DeepSeek · 来自模板配置 → 本地设置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28229) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 161 | [离开 DeepSeek · 来自模板配置 → 网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28348) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 162 | [离开 DeepSeek · 来自模板配置 → AI 服务配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28466) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 163 | [离开 DeepSeek · 来自模板配置 → 凭据与本机资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28583) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 164 | [离开 DeepSeek · 来自模板配置 → 脚本与依赖配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28700) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 165 | [离开 DeepSeek · 来自模板配置 → AI连接与输出状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28818) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 166 | [离开 DeepSeek · 首次填写 → 我的流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-28935) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 167 | [离开 DeepSeek · 首次填写 → 模板库](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29055) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 168 | [离开 DeepSeek · 首次填写 → 运行记录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29175) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 169 | [离开 DeepSeek · 首次填写 → 本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29295) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 170 | [离开 DeepSeek · 首次填写 → 待办与提醒](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29415) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 171 | [离开 DeepSeek · 首次填写 → 本地设置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29535) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 172 | [离开 DeepSeek · 首次填写 → 网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29658) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 173 | [离开 DeepSeek · 首次填写 → 凭据与本机资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29780) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 174 | [离开 DeepSeek · 首次填写 → 脚本与依赖配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-29900) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 175 | [离开 DeepSeek · 首次填写 → DeepSeek · 未配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30020) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 176 | [离开 DeepSeek · 首次填写 → AI连接与输出状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30140) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 177 | [离开 DeepSeek · 替换 Key → 我的流程](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30260) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 178 | [离开 DeepSeek · 替换 Key → 模板库](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30384) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 179 | [离开 DeepSeek · 替换 Key → 运行记录](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30508) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 180 | [离开 DeepSeek · 替换 Key → 本机计划](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30632) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 181 | [离开 DeepSeek · 替换 Key → 待办与提醒](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30756) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 182 | [离开 DeepSeek · 替换 Key → 本地设置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-30880) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 183 | [离开 DeepSeek · 替换 Key → 网页操作与拾取](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-31007) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 184 | [离开 DeepSeek · 替换 Key → 凭据与本机资源](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-31133) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 185 | [离开 DeepSeek · 替换 Key → 脚本与依赖配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-31257) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |
| 186 | [离开 DeepSeek · 替换 Key → AI连接与输出状态](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=8-31382) | 独立离开目标与三选确认保持；背景操作锁定，危险操作文字反白 |

## 新增状态与证据边界

原节点不删除；完整新节点见 [单套索引](design-theme-board-map.md)。原型文件绑定、映射数据和服务结果是固定的虚构示例，实际文件选择、焦点恢复、任意输入校验、持久化、取消收尾、系统主题响应和服务结果必须在客户端验证。本轮没有修改客户端 / 模板代码，没有运行单元测试、浏览器任务、API、脚本或工作簿。不会把图中的保存 / 排队 / 成功文案作为系统已保存或已执行的证据。


## 2026-10-14 最终逻辑闭环增量

本轮补齐参数来源/取消/清空、精确实例与 Run 返回、Excel 五列映射保存、当前计划更新、确认对象隔离、分页与异步恢复及详情后的操作。原 186 ID 保留，新增 36 个缺失状态共用 Light/Dark。最终看图范围为原 186 × 2，关键实际点击与未复验组合见[最终闭环记录](design-final-closure-20261014.md)；六项交接字段及证据层次见[逐板矩阵](design-final-closure-board-matrix.md)和[审计 JSON](design-final-closure-audit.json)。前文为首轮记录；当前语义变量数为 65（新增遮罩透明度），旧 Dark 别名仍为 64。此增量不改变客户端验收状态。
