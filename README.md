# FlowArk · 序舟

FlowArk 是本地优先的自动化工作台，连接显式选择的内置浏览器或本机已安装浏览器、自定义脚本和业务文件；首版 AI 适配 Codex、DeepSeek，后续通过可选的平台服务提供设备监控、远程治理和模板商店。

此目录是 **FlowArk 项目主目录，也是独立的治理仓库**。客户端、模板、服务端、后台管理台以独立 Git 仓库放在子目录中，各自构建和发布。

治理仓库：[zhongmiao-org/flow-ark](https://github.com/zhongmiao-org/flow-ark)，默认分支为 `main`。

## 当前状态

2026-09-21：业务模板、demo/example 和完整模拟网站已迁入独立 [flow-ark-templates](https://github.com/zhongmiao-org/flow-ark-templates)。通用客户端 0.2.1 开发候选已安装至日常路径，支持标准 ZIP 安装、多入口实例、资源／授权配置、通用脚本 SDK，以及模板和自定义流程统一 ZIP 导出。尚未正式发版，不维护旧客户端兼容路径。

模板使用：模板库 → 导入标准包 → 审阅能力 → 安装 → 创建实例 → 配置资源与授权 → 选择入口运行。导入、打开表单和保存配置均不执行隐藏脚本。独立构建、安装版无源码运行和 DeepSeek 虚构资料实接证据见[模板验收](docs/templates/acceptance.md)。

下一阶段是前程无忧简历更新模板；真实招聘网站、账号登录和更新回读尚未验收，P1 不标记整体完成。历史版本证据保留在[客户端验收](docs/client/acceptance.md)，不再代表当前内置业务或旧客户端支持范围。服务端、管理台、远程执行和在线商店尚未实现。

## 文档入口

| 文档 | 用途 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 开始开发前必读：统一约束、目标仓库操作、验证与交付规则 |
| [总体架构](docs/architecture.md) | 系统职责、进程模型、执行语义、数据归属、设备与平台边界 |
| [P1 招聘交互验收](docs/p1-recruiting.md) | BOSS/智联业务目标、AI 回复、分动作授权、联系方式提醒和实测标准 |
| [ROADMAP](ROADMAP.md) | 阶段任务、依赖、排除项和验收关口 |
| [契约管理](contracts/README.md) | 公共协议的归属、版本、发布和消费者接入方式 |
| [客户端使用](docs/client/usage.md) | 内置复杂表单练习、安装与数据版本、实际开发命令 |

架构文档是完整架构的唯一来源，ROADMAP 记录范围和进展，AGENTS.md 将二者转为开发规则。应用实现记录也集中在本仓库，子仓库仅保留必要的使用与贡献说明。

## 仓库地图

```text
flow-ark/                          # 当前治理仓库
├── .git/
├── .gitignore                    # 忽略下列独立应用仓库
├── README.md
├── AGENTS.md
├── ROADMAP.md
├── docs/
│   ├── architecture.md
│   └── p1-recruiting.md           # 首个业务场景的配置与验收
├── contracts/
│   └── README.md                 # 契约管理与已发布版本入口
├── flow-ark-client/               # 已建立的独立客户端仓库，根仓库忽略
├── flow-ark-templates/            # 独立模板开发仓库，根仓库忽略
├── flow-ark-server/               # 规划：P2 创建，具有自己的 .git/
└── flow-ark-admin/                # 规划：P2 创建，具有自己的 .git/
```

| 仓库 | 负责内容 | 技术方向 | 建立阶段 |
| --- | --- | --- | --- |
| `flow-ark` | 总体文档、公共契约、跨仓库决策 | Markdown、JSON Schema、OpenAPI | P0 |
| `flow-ark-client` | 编辑器、本地执行、通用 AI、SQLite、系统能力 | Electron、React、TypeScript、Playwright/Selenium 适配器、ExcelJS | P1.1 |
| `flow-ark-templates` | 业务模板、demo/example、脚本、提示词、业务测试 | TypeScript、JSON Schema、标准 ZIP 包 | P1 解耦 |
| `flow-ark-server` | 平台 API、用户权限、设备、任务、MySQL 迁移 | Spring Boot、MySQL、Maven | P2 |
| `flow-ark-admin` | 平台管理界面 | React、TypeScript | P2 |

不使用 Git submodule，不创建跨仓库 pnpm workspace，不通过相邻目录引用代码。客户端和管理台分别管理 Node 依赖；客户端可在自己仓库内部组织多个包。数据库是存储与部署组件，其迁移分别属于客户端和服务端，不另建数据库仓库。

## 从哪里开始开发

1. 阅读 [AGENTS.md](AGENTS.md)、[架构文档](docs/architecture.md) 和 [当前 roadmap](ROADMAP.md)。
2. 确认任务归属和阶段：P1 仅开发单机客户端，服务端与管理台留到 P2。
3. 客户端开发进入 `flow-ark-client`；使用说明见其 README，开发/契约采用/验收文档统一位于本仓库 [docs/client](docs/client/development.md)。应用仓库不放 AGENTS.md；其他子仓库在对应阶段创建。
4. 在目标仓库执行 Git 操作，先确认 `git rev-parse --show-toplevel` 指向该仓库。尚未初始化的子目录会向上找到治理仓库，不能据此误提交。
5. 应用必须可单独克隆、构建、测试和运行；发布产物不依赖 `flow-ark` 主目录存在。

治理仓库的 SSH 地址为 `git@github.com:zhongmiao-org/flow-ark.git`。客户端为 `git@github.com:zhongmiao-org/flow-ark-client.git`，安装和开发命令见其 [README](https://github.com/zhongmiao-org/flow-ark-client/blob/main/README.md)。正式软件发布渠道未建立。

所有仓库统一使用 Conventional Commits：`feat`、`fix`、`chore`、`docs` 等类型，格式为 `type(scope): description`，范围可省略；工作分支同样以类型开头，例如 `feat/client-initial`、`fix/browser-recovery`、`docs/contributing`，不使用 `codex/` 前缀。按 2026-09-17 的调整，每次提交均通过功能分支 PR 交付，添加固定的 `automerge` PR 标签，等待各自 CI 检查通过并自动合并；不直接推送默认分支。此要求覆盖治理仓库、所有现有及后续应用子仓库；本地检查与真实业务验收仍须分别留证。完整提交与验证规则见 [AGENTS.md](AGENTS.md)。

## P1 成功标准

当前先完善 macOS 内置浏览器与本地复杂表单，暂停招聘站点、真实 AI 和外部浏览器测试。完整 P1 仍保留本机 Chrome 两站业务闭环及 Firefox/Safari 分别验收，Windows 三款 360 后续验证。最终目标是客户端不部署 FlowArk 服务端、不登录管理平台即可按配置执行：

**BOSS 直聘／智联招聘网页版：职位筛选 → 选定简历投递或发送 → AI 回复 → 微信/手机号交换 → 对方微信号提醒与结果核对。**

投递、回复、请求/接受微信、请求/接受手机号分别配置禁止、需确认或自动执行；AI 按简历事实和当前对话生成回复，超范围进入人工待办。两站网页版的功能可达性须实测，未取得对方微信号不能仅凭“交换请求已发送”报成功。

内置模式复用应用随附 Electron 内核，通过右上角按钮在主窗口右侧显示网页；收起面板或最小化后仍可执行。本机浏览器模式支持发现和手动指定已有程序：Chrome 使用 `playwright-core`，Firefox/Safari 使用 Selenium 路线，Windows 360 按实际版本验证。统一 BrowserDriver 隔离两种模式，不额外下载浏览器，也不静默切换模式。详细矩阵见架构文档。

历史数据处理、Excel 生成与上传流程曾通过本机 Chrome 技术回归，不替代上述业务验收；Chrome 153.0.8010.48 的原生下载恢复崩溃仍未修复，自动下载继续明确阻止。当前没有真实招聘动作或 Firefox/Safari 兼容通过的声明。

不依赖平台不等于全部离线：访问招聘网站仍需网络；AI 首版通过用户自己的 API Key 接入 **OpenAI Codex 模型（Responses API）和 DeepSeek（Chat Completions API）**，不依赖 Codex CLI 或桌面登录态。模型 ID 可配置并需验证，密钥仅在本地受保护存储中保存。可视化编排覆盖顺序、条件、串行循环，任务支持手动触发和应用驻留期间的本机定时。

P1 提供“BOSS 直聘投递简历”“智联招聘投递简历”本地模板，创建流程时绑定个人简历、浏览器、AI 和动作权限。P4 再建设模板商店：服务端管理目录和版本，管理台审核发布，客户端下载后创建本地流程；模板更新不覆盖已有流程，下载不自动执行。具体边界和架构图见 [总体架构](docs/architecture.md)。

后续平台按“先集中监控，再远程治理”推进；接入平台不取消本地独立模式，也不自动上传本地流程、凭据或浏览器登录态。
