# 模板工具栏与深色流程节点修复

2026-10-15，按用户两张截图处理并行缺陷。设计先行见[跨页规范](shared-actions-design-20261015.md#模板筛选对齐与流程图主题修正)。

## 原因与修改范围

- 模板工具栏：通用label规则比原局部覆盖更具体，实际仍有上下16/8px外边距；Select另有8px顶部外边距。局部选择器明确排除Ant包装标签并覆盖该规则，统一40px高、同排居中和16px间距，紧凑时继续换行。
- 流程图：TaskDiagramShape以外部img加载Figma SVG，其中process/decision/document固定白色填充，不能继承文档主题变量。改为仅内联构建时导入的可信静态SVG，填充/描边改用已有语义变量，join同样随主题；保持原width/height/viewBox/path及放置偏移。选中/悬停使用主题描边。
- 无业务、IPC、执行或数据库变化，无新增依赖。未把不可信内容或用户SVG插入内联槽。

## 分层证据

Figma：原1:3200、23:3290和471:5124完成补充；原186节点与已有验收结论保持。

生产组件隔离人工核对：真实TemplateLibrary和buildTaskDiagram/FlowNode，虚构本地数据，禁止宿主请求。宽窗实际CSS视口1082px时四个控件top一致、height约39.996px（声明40px）；紧凑601px时逐行等高并换行，文档scrollWidth590px，无横向溢出。Dark新增网页步骤、切Light再切Dark保留步骤；process/decision/document填充rgb(23,32,51)、边框rgb(52,64,87)，join为rgb(168,180,202)，选中描边rgb(45,83,211)；Light恢复白底。SVG原始尺寸分别262×66、224.833×102.197、242×74、8×8保持。以上是组件核对，不代表原生安装或业务执行。

本地类型检查、构建、格式与diff检查通过；按UI/UE阶段约定未新增、未运行单元测试。客户端及原生交付见下方。本批不将186整板或BOSS闭环标为通过。


## PR、安装与原生核对

- 设计/组件记录：[治理#741](https://github.com/zhongmiao-org/flow-ark/pull/741)最新Validate/Auto Merge通过并实际合并。
- 客户端：[PR#272](https://github.com/zhongmiao-org/flow-ark-client/pull/272)与[最新CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38714978075)的Validate/Auto Merge通过，实际合并`c51e90968f8209b34692994c1b7ec7462fbf1966`。使用最新检查，不沿用取消的旧检查结果。
- `pnpm package:mac`成功。正常退出旧实例并完成本机备份后串行更新安装，使用原工作区，仅启动一个原生实例。详细安装记录、备份及截图留在本机，不提交本机路径或存储明细。
- 原生Dark模板库：搜索/能力/排序/本地实例同排对齐。没有导入、卸载、运行或修改模板。
- 原生Dark编排：打开原有零步骤流程，通过动作库依次添加“打开网页”“填写内容”；实际流程图的普通与选中节点均为深色底、可读文字和主题描边。随后连续撤销本轮两次添加，恢复已保存的零步骤状态并返回原流程列表，未保存或执行步骤。
- 只读核对确认升级前后的全部加密文档内容和记录数量一致，无新增持久流程或运行。原生Light和四类形状组合未再次逐项验证；组件级Light/Dark证据范围见上文。

此次修复验收限定上述两项缺陷，AI真实API、招聘网站与完整186板仍按原计划独立推进。
