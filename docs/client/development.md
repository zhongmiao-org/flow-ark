# FlowArk 客户端

客户端仓库负责 P1 macOS 单机客户端，Electron / React / TypeScript / pnpm / SQLite。当前为开发阶段，真实业务与兼容状态只以 acceptance.md 的证据为准。

统一规则入口：主目录存在时先读 [AGENTS.md](../../AGENTS.md)、[架构](../architecture.md)、[ROADMAP](../../ROADMAP.md)。远程 [flow-ark](https://github.com/zhongmiao-org/flow-ark)，0.1.14 采用治理基线 `effac3a6f2c11c6191fa1c6a8749f9a6402ef72c`。契约为应用 `contracts/` 中固定的发布副本，版本及发布状态见 [契约采用记录](contracts-adoption.md)；不得伪造已发布 tag。

独立克隆仍适用：Renderer 只用白名单 IPC；Main 仅系统集成；host 统一 SQLite、队列和调度；core 不依赖 Electron/React/SQL；Worker 与独立浏览器会话通过消息访问宿主。可信脚本单独进程，不称安全沙箱。凭据由系统保护，不明文降级。副作用先落盘，未知不重放。Chrome 仅 playwright-core 显式本机路径，Firefox/Safari 仅明确本机原生驱动，不下载浏览器、接管默认 Profile 或静默切换模式。2026-09-18 新增显式内置模式，使用主窗口右侧 WebContentsView、隔离网站 Renderer 和专用 Session，见 [内置浏览器](embedded-browser.md)。AI 仅草稿，动作逐项授权。真实外发需要账号、目标、内容与范围的明确配置。P1 无服务端、管理台、平台注册、商店或常驻服务。

Git 每次写操作前确认本仓库根；Conventional Commits，中文描述。按 2026-09-17 的统一规则，每次提交走客户端自己的功能分支 PR，添加 `automerge` 标签，等待当前提交的 CI 检查通过并由 CI 自动合并，核对实际合并结果后再从最新默认分支继续开发；不直接推送默认分支。具体规则见 [AGENTS.md](../../AGENTS.md)。不额外添加 Husky、commitlint 或自动发布。依赖与构建不读父目录，不跨仓库源码导入。私密业务数据、Profile、凭据、产物不得提交。

命令（定义见 package.json；执行结果另记）：`pnpm install --frozen-lockfile`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm dev`、`pnpm test:browser`、`pnpm test:browser-recovery`、`pnpm test:vault`、`pnpm test:desktop`、`pnpm test:picker`、`pnpm test:picker-ui`、`pnpm test:picker-lifecycle`、`pnpm test:embedded-capture`、`pnpm package:mac`。默认浏览器测试全部使用内置网页与本地虚构数据；本机 Chrome 兼容命令为 `pnpm test:chrome` 和 `pnpm test:chrome-recovery`，本次不执行。不执行 playwright install。原 Chrome 恢复回归的历史失败状态及边界见 [恢复缺口](browser-recovery.md)；凭据测试使用虚构数据，见 [凭据存储](credential-storage.md)。修改状态、副作用、取消、调度须有行为测试。代码、检查、打包、安装运行、真实业务与 Git 推送分开报告。

目录：src/main 系统集成，src/host 持久化/调度，src/core 执行语义，src/workers 进程入口，src/adapters 能力，src/recruiting 业务，src/renderer 界面，src/shared IPC/类型，contracts 固定规范与生成类型，tests 虚构数据回归。完整总体架构不复制到本仓库。

表单实验室：`pnpm forms:serve` 启动本地开发页面；`pnpm test:forms` 经真实宿主验证控件、提交与预期失败。页面在 fixtures/form-lab，测试服务和流程在 scripts/fixtures；不随安装包发行，也不属于产品服务端。验证记录见 [表单实验室](form-lab.md)。

动作库：`pnpm test:action-library` 验证分类、跨分类搜索、键盘添加、条件和嵌套循环目标、删除目标后重新选择；`pnpm test:picker-ui` 从空白草稿经动作入口搭建 12 种网页操作的 13 步流程，拾取 input/radio/checkbox/select，配置上传和下载，保存重开后逐步运行并核对控件、产物内容和截图。均使用内置浏览器与隔离虚构数据，支持 `FLOWARK_TEST_EXECUTABLE` 验证安装路径。

编排布局：`pnpm test:editor-layout` 验证右侧网页展开、收起、窗口缩放及长流程中的当前节点。使用隔离数据与本地表单；支持 `FLOWARK_TEST_EXECUTABLE` 对安装版执行。工作台与子网页分别采集截图，不能用工作台 WebContents 的截图推断原生子网页是否绘制。真实桌面整窗显示另行验收。

逐步调试：`pnpm test:debug` 经真实 Electron IPC 和本机 Chrome 验证单步、输出、表单上传、取消及重开。设置 `FLOWARK_TEST_EXECUTABLE` 可针对安装版执行；数据和 Profile 均使用独立临时目录。见 [调试交付](debugging.md)。

本文件只在治理仓库维护。客户端仅保留 README 和 CONTRIBUTING，不新增 AGENTS 或复制本文。模板实例配置由包声明，通用右侧面板不得出现招聘专属标签。
