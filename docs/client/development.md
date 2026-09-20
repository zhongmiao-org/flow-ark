# FlowArk 客户端

客户端仓库负责 P1 macOS 单机客户端，Electron / React / TypeScript / pnpm / SQLite。当前为开发阶段，真实业务与兼容状态只以 acceptance.md 的证据为准。

统一规则入口：主目录存在时先读 [AGENTS.md](../../AGENTS.md)、[架构](../architecture.md)、[ROADMAP](../../ROADMAP.md)。远程 [flow-ark](https://github.com/zhongmiao-org/flow-ark)，0.1.35 采用治理基线 `f708195eabb5088d13500f02d23fa837f6886f3b`。契约为应用 `contracts/` 中固定的发布副本，版本及发布状态见 [契约采用记录](contracts-adoption.md)；不得伪造已发布 tag。

独立克隆仍适用：Renderer 只用白名单 IPC；Main 仅系统集成；host 统一 SQLite、队列和调度；core 不依赖 Electron/React/SQL；Worker 与独立浏览器会话通过消息访问宿主。可信脚本单独进程，不称安全沙箱。凭据由系统保护，不明文降级。副作用先落盘，未知不重放。Chrome 仅 playwright-core 显式本机路径，Firefox/Safari 仅明确本机原生驱动，不下载浏览器、接管默认 Profile 或静默切换模式。2026-09-18 新增显式内置模式，使用主窗口右侧 WebContentsView、隔离网站 Renderer 和专用 Session，见 [内置浏览器](embedded-browser.md)。AI 仅草稿，动作逐项授权。真实外发需要账号、目标、内容与范围的明确配置。P1 无服务端、管理台、平台注册、商店或常驻服务。

Git 每次写操作前确认本仓库根；Conventional Commits，中文描述。按 2026-09-17 的统一规则，每次提交走客户端自己的功能分支 PR，添加 `automerge` 标签，等待当前提交的 CI 检查通过并由 CI 自动合并，核对实际合并结果后再从最新默认分支继续开发；不直接推送默认分支。具体规则见 [AGENTS.md](../../AGENTS.md)。不额外添加 Husky、commitlint 或自动发布。依赖与构建不读父目录，不跨仓库源码导入。私密业务数据、Profile、凭据、产物不得提交。

命令（定义见 package.json；执行结果另记）：`pnpm install --frozen-lockfile`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm dev`、`pnpm test:browser`、`pnpm test:browser-recovery`、`pnpm test:vault`、`pnpm test:desktop`、`pnpm test:picker`、`pnpm test:picker-ui`、`pnpm test:picker-lifecycle`、`pnpm test:embedded-capture`、`pnpm package:mac`。默认浏览器测试全部使用内置网页与本地虚构数据；本机 Chrome 兼容命令为 `pnpm test:chrome` 和 `pnpm test:chrome-recovery`，本次不执行。不执行 playwright install。原 Chrome 恢复回归的历史失败状态及边界见 [恢复缺口](browser-recovery.md)；凭据测试使用虚构数据，见 [凭据存储](credential-storage.md)。修改状态、副作用、取消、调度须有行为测试。代码、检查、打包、安装运行、真实业务与 Git 推送分开报告。

目录：src/main 系统集成，src/host 持久化/调度，src/core 执行语义，src/workers 进程入口，src/adapters 能力，src/recruiting 业务，src/renderer 界面，src/shared IPC/类型，contracts 固定规范与生成类型，tests 虚构数据回归。完整总体架构不复制到本仓库。

表单实验室：`pnpm forms:serve` 启动本地开发页面；`pnpm test:forms` 经真实宿主验证控件、提交与预期失败。页面在 fixtures/form-lab，测试服务和流程在 scripts/fixtures；不随安装包发行，也不属于产品服务端。验证记录见 [表单实验室](form-lab.md)。

动作库：`pnpm test:action-library` 验证分类、跨分类搜索、键盘添加、条件和嵌套循环目标、删除目标后重新选择；`pnpm test:picker-ui` 从空白草稿经动作入口搭建 12 种网页操作的 13 步流程，拾取 input/radio/checkbox/select，配置上传和下载，保存重开后逐步运行并核对控件、产物内容和截图。均使用内置浏览器与隔离虚构数据，支持 `FLOWARK_TEST_EXECUTABLE` 验证安装路径。

流程编辑：`pnpm test:flow-editing` 验证相对插入、子树复制、明确目标移动、引用保护、分组撤销/重做、输入框快捷键、绑定配置、保存重开、最窄窗口和暂停 Run 的快照隔离。支持 `FLOWARK_TEST_EXECUTABLE`，只使用内置浏览器与虚构表单；语义见[流程结构编辑](flow-editing.md)。

值与变量：`pnpm test:value-editor` 从界面配置文本、数字、布尔、空、数组参数及引用，验证候选作用域、搜索/取消、固定值切换/撤销、参数删除保护、未完成输入保存阻止、保存重开与 1040×700 网页面板。实际执行填写、单选、下拉、分支、循环与脚本并核对网页和输出；未知子字段报错而不回退。支持 `FLOWARK_TEST_EXECUTABLE`，语义见[通用值与变量选择](value-editor.md)。

资源配置：`pnpm test:resource-editor` 从界面创建 HTTP、文件和 Excel 流程，验证 HTTP 请求体引用的来源删除/移动和参数删除保护、请求头/请求体、目录绑定、复制和 ZIP 列表、矩阵分页、类型与引用、模板单元格映射、撤销和保存重开。实际执行后核对请求、文件字节、ZIP 条目、Excel 类型和模板保留格式，以及内置网页上传；故意 HTTP 失败只请求一次，越界路径阻止写入。支持 `FLOWARK_TEST_EXECUTABLE`，使用隔离目录与本机虚构数据，语义见[资源节点配置](resource-node-forms.md)。0.1.20 增加参数引用上传目录的发现、未绑定准入阻止和先生成再上传，边界见[上传资源检查](upload-resources.md)。

产物清理：`pnpm test:artifact-cleanup` 用内置复杂表单实际生成文件、上传、下载和截图，验证活动运行阻止、预览取消、内容变化后确认失效、保留另一运行与原业务文件、清理后重开和历史标记。支持 `FLOWARK_TEST_EXECUTABLE`；语义见[产物清理](artifact-cleanup.md)。构建会重建 dist，先完成构建，再运行依赖 dist 的运行或桌面测试，不与打包构建并发。

运行历史：`pnpm test:run-history` 在隔离 Electron 中准备 257 条同时间旧格式样例，并用真实 Worker 生成前后两个文件 Run；验证超过 200 条的翻页、查询、状态/来源交集、详情返回、旧产物清理、重开及三类迟到响应。小窗口同时使用 1920 CSS 像素内置复杂表单。支持 `FLOWARK_TEST_EXECUTABLE`，语义见[运行历史](run-history.md)。

产物历史：`pnpm test:artifact-history` 验证同名产物独立副本、源文件删除、宿主重开、新旧记录显示及真实定位 IPC；篡改和丢失后按钮禁用、宿主拒绝定位。旧记录由隔离测试库按旧格式准备，不读取或修改日常数据。支持 `FLOWARK_TEST_EXECUTABLE`，语义见[产物副本](artifact-snapshots.md)。

桌面网页宽度：`pnpm test:browser-viewport` 验证 1920 CSS 像素排版、首次隐藏面板导航、三种窗口尺寸、收起/恢复、最小化和导航后的宽度与内容保留；通过真实原生点击输入框/单选框检查坐标。支持 `FLOWARK_TEST_EXECUTABLE`，独立临时数据与本地表单，不访问招聘站点。

编排布局：`pnpm test:editor-layout` 验证右侧网页展开、收起、窗口缩放及长流程中的当前节点。使用隔离数据与本地表单；支持 `FLOWARK_TEST_EXECUTABLE` 对安装版执行。工作台与子网页分别采集截图，不能用工作台 WebContents 的截图推断原生子网页是否绘制。真实桌面整窗显示另行验收。

逐步调试：`pnpm test:debug` 经真实 Electron IPC 和本机 Chrome 验证单步、输出、表单上传、取消及重开。设置 `FLOWARK_TEST_EXECUTABLE` 可针对安装版执行；数据和 Profile 均使用独立临时目录。见 [调试交付](debugging.md)。

本文件只在治理仓库维护。客户端仅保留 README 和 CONTRIBUTING，不新增 AGENTS 或复制本文。模板实例配置由包声明，通用右侧面板不得出现招聘专属标签。

模板参数：`pnpm test:template-parameters` 使用真实独立模板导入、界面修改/取消/无效值/撤销/重开、Worker 与本地内置表单，核对活动、排队和原固定计划仍用旧值，新人工运行用新值；并检查导出清值和普通流程参数编辑。计划使用真实一分钟到期，支持 `FLOWARK_TEST_EXECUTABLE`。只使用虚构数据，语义见[模板实例参数](template-parameters.md)。

真实定时：`pnpm test:schedule-residency` 约需四分钟，从界面创建每分钟计划，使用生产计时器验证最小化、托盘驻留、同计划占用跳过、固定快照及正常退出重开不补跑。只使用独立数据目录与内置本地表单，退出测试进程后核对加密跳过记录；不直接调用 tick 或改动时钟。支持 `FLOWARK_TEST_EXECUTABLE` 指向安装路径；默认开发模式需先完成 `pnpm build`。此验证不能替代长期驻留或真实硬件休眠验收。

计划编辑：`pnpm test:schedule-editing` 经界面创建、取消/保存编辑、无效时区拒绝、暂停状态保留与冲突复核；分别等待原固定版本和明确更新后的真实分钟到期，在内置表单核对不同虚构输入、1920 CSS 像素及保存重开后的两个成功 Run。窄窗口同时打开右侧网页检查编辑布局。支持 `FLOWARK_TEST_EXECUTABLE`，不访问招聘网站；规则见[计划显式更新](schedule-editing.md)。

2026-09-20 导出与退出修复验证：`pnpm test:flow-export` 检查真实界面当前草稿导出、取消和旧包导入；`pnpm test:quit-confirmation` 检查真实 Worker 与 205 条队列之后的退出确认。两者使用隔离数据，支持 `FLOWARK_TEST_EXECUTABLE` 指向候选或安装版；对话框响应仅在测试实例注入，实际运行结果见 [验收](acceptance.md)。

2026-09-20 节点期限与高级输入验证：`pnpm test:node-timeout` 在隔离安装/开发实例中验证内置表单、人工/容器超时与恢复；`pnpm test:invalid-node-json` 通过实际编辑器检查错误文本保留、提交阻止、修正及恢复。两者支持 `FLOWARK_TEST_EXECUTABLE`，具体结果见 [验收](acceptance.md)。

2026-09-20 Excel 行列保留验证：`pnpm test:resource-editor` 通过界面创建包含首、中、尾空行与 H12 值的矩阵，实际读取、引用另存、再读取并核对文件坐标；同时检查内置复杂表单宽度 1920。文件单元与真实 Worker 验证空工作表、稀疏行列、值类型和产物副本。规则见 [Excel 行列位置保留](excel-row-preservation.md)，结果见 [验收](acceptance.md)。

人工核对后重新运行：`pnpm test:run-rerun` 用实际界面选择原快照或当前保存内容、预览取消与确认、首步调试、来源/派生导航，核对 1920 像素内置复杂表单字段和本地 HTTP 回执；延迟或丢失真实宿主回复验证重复确认与迟到导航，重开不重放。支持 `FLOWARK_TEST_EXECUTABLE`。`pnpm test:runtime` 同时执行已有运行宿主与重跑集成文件，覆盖当前授权、固定脚本、排队复验和事务原子性。语义见[人工核对后重新运行](run-rerun.md)，交付结果见[验收](acceptance.md)。

长流程视口：`pnpm test:editor-layout` 同时核对完整投影与所选步骤聚焦，覆盖长流程、嵌套条件/循环的节点和边、面板与窗口变化、参数编辑时手动视口保留，以及内置本地网页会话和 1920 CSS 像素。支持 `FLOWARK_TEST_EXECUTABLE` 验证旧包复现及新候选/安装版；边界见[流程图语义](flowchart.md)，实际结果见[验收](acceptance.md)。

内置回收确认：`pnpm test:embedded-close` 在隔离原生网页验证销毁事件、启动/取消竞态与代际隔离；`pnpm test:embedded-cleanup` 在完整隔离客户端验证关闭故障、宿主阻断、界面提示和正常退出重开，支持 `FLOWARK_TEST_EXECUTABLE` 验证候选包。`pnpm test:runtime` 包含关闭挂起时的真实 Worker/脚本进程收尾。故障通过测试边界注入，不代表已观察到系统自然故障；语义与预算见[关闭确认](embedded-cleanup.md)。

2026-09-20 脚本监护验证：`pnpm test:runtime` 纳入 script-supervision.integration.ts，先完成构建再运行。该文件支持 `FLOWARK_TEST_EXECUTABLE` 指向候选应用；私有 Host 夹具使用候选自己的编译器，明确区分源码 Runtime 与实际打包 Host。`pnpm test:store-upgrade` 通过新旧 `FLOWARK_TEST_EXECUTABLE` / `FLOWARK_PREVIOUS_EXECUTABLE` 检查真实打包 Host 的 v1→v2 保留及旧 reader 拒绝；只使用隔离目录。过程和结果归[验收记录](acceptance.md)。

运行详情：`pnpm test:run-observation` 经真实界面验证无报告脚本、进度、固定名称、普通输出、调试/等待/取消、正常重开和有明确边界的存储故障展示，支持 `FLOWARK_TEST_EXECUTABLE`。`pnpm test:runtime` 纳入 storage-full.integration.ts 的真实 SQLite 容量失败与异步采样一致性，先构建再运行。仅用独立数据与内置本地表单，见[运行详情与实时观察](run-observation.md)。

系统挂起：`pnpm test:system-suspend` 在完整隔离客户端注入 powerMonitor 事件，验证真实 Host 回执、旧 WebContents 销毁、旧准入撤销、恢复后新流程与本地复杂表单回执，支持 `FLOWARK_TEST_EXECUTABLE`。`pnpm test:runtime` 同时执行 system-suspend.integration.ts，涵盖多计划、重跑与真实 SQLite 写失败下 Worker/忙脚本回收。不能将事件夹具称为硬件睡眠；规则见[系统挂起生命周期](system-suspend.md)。

脱敏回归：`pnpm test:redaction` 使用独立虚构凭据，验证实际 Vault、SDK、Worker、运行详情和重开，以及 Main/Host 拒绝消息；支持 `FLOWARK_TEST_EXECUTABLE`。`pnpm test:runtime` 包含独立 `redaction.integration.ts` 的真实进程/存储证据。测试故障注入不代表实际 Keychain 或真实 AI 故障，详见[脱敏边界](redaction-boundaries.md)。
