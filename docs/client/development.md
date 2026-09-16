# FlowArk 客户端

客户端仓库负责 P1 macOS 单机客户端，Electron / React / TypeScript / pnpm / SQLite。当前为开发阶段，真实业务与兼容状态只以 acceptance.md 的证据为准。

统一规则入口：主目录存在时先读 [AGENTS.md](../../AGENTS.md)、[架构](../architecture.md)、[ROADMAP](../../ROADMAP.md)。远程 [flow-ark](https://github.com/zhongmiao-org/flow-ark)，已采用治理基线 `a950b6ab517c2a7aee6f4faaf9db7306c3f0bdd1`。契约为 `contracts/` 中固定的 0.3.0，发布状态见 contracts-adoption.md；不得伪造已发布 tag。

独立克隆仍适用：Renderer 只用白名单 IPC；Main 仅系统集成；host 统一 SQLite、队列和调度；core 不依赖 Electron/React/SQL；Worker 与独立浏览器会话通过消息访问宿主。可信脚本单独进程，不称安全沙箱。凭据由系统保护，不明文降级。副作用先落盘，未知不重放。Chrome 仅 playwright-core 显式本机路径，Firefox/Safari 仅明确本机原生驱动，绝不下载浏览器、接管默认 Profile 或以 Electron 代替。AI 仅草稿，动作逐项授权。真实外发需要账号、目标、内容与范围的明确配置。P1 无服务端、管理台、平台注册、商店或常驻服务。

Git 每次写操作前确认本仓库根；Conventional Commits，中文描述；不添加 CI、Husky、commitlint 或自动发布。依赖与构建不读父目录，不跨仓库源码导入。私密业务数据、Profile、凭据、产物不得提交。

命令（定义见 package.json；执行结果另记）：`pnpm install --frozen-lockfile`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm dev`、`pnpm test:browser`、`pnpm test:desktop`、`pnpm package:mac`。浏览器测试只使用已有 Chrome，不执行 playwright install。修改状态、副作用、取消、调度须有行为测试。代码、检查、打包、安装运行、真实业务与 Git 推送分开报告。

目录：src/main 系统集成，src/host 持久化/调度，src/core 执行语义，src/workers 进程入口，src/adapters 能力，src/recruiting 业务，src/renderer 界面，src/shared IPC/类型，contracts 固定规范与生成类型，tests 虚构数据回归。完整总体架构不复制到本仓库。

本文件只在治理仓库维护。客户端仅保留 README 和 CONTRIBUTING，不新增 AGENTS 或复制本文。模板实例配置由包声明，通用右侧面板不得出现招聘专属标签。
