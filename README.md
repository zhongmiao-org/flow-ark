# FlowArk · 序舟

FlowArk 是本地优先的自动化工作台，连接浏览器、自定义脚本和业务文件；后续通过可选的平台服务提供设备监控与远程治理。

此目录是 **FlowArk 项目主目录，也是独立的治理仓库**。客户端、服务端、后台管理台以独立 Git 仓库放在子目录中，各自构建和发布。

治理仓库：[zhongmiao-org/flow-ark](https://github.com/zhongmiao-org/flow-ark)，默认分支为 `main`。

## 当前状态

- 文档基线：P0，2026-09-16。
- 当前交付：P0 已完成，统一架构、开发约束、路线图和子仓库隔离规则已校验。
- 下一阶段：P1.1，建立 `flow-ark-client` 单机客户端工程。
- 尚未创建应用子仓库、可运行工程、机器可读协议或安装包；尚未发布契约版本。
- 本仓库当前没有应用安装、构建或测试命令。

## 文档入口

| 文档 | 用途 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 开始开发前必读：统一约束、目标仓库操作、验证与交付规则 |
| [总体架构](docs/architecture.md) | 系统职责、进程模型、执行语义、数据归属、设备与平台边界 |
| [ROADMAP](ROADMAP.md) | 阶段任务、依赖、排除项和验收关口 |
| [契约管理](contracts/README.md) | 公共协议的归属、版本、发布和消费者接入方式 |

架构文档是完整架构的唯一来源，ROADMAP 记录范围和进展，AGENTS.md 将二者转为开发规则。子仓库仅补充自身实现细节。

## 仓库地图

```text
flow-ark/                          # 当前治理仓库
├── .git/
├── .gitignore                    # 忽略下列独立应用仓库
├── README.md
├── AGENTS.md
├── ROADMAP.md
├── docs/
│   └── architecture.md
├── contracts/
│   └── README.md                 # 目前只有管理约定，没有已发布 Schema
├── flow-ark-client/               # 规划：P1.1 创建，具有自己的 .git/
├── flow-ark-server/               # 规划：P2 创建，具有自己的 .git/
└── flow-ark-admin/                # 规划：P2 创建，具有自己的 .git/
```

| 仓库 | 负责内容 | 技术方向 | 建立阶段 |
| --- | --- | --- | --- |
| `flow-ark` | 总体文档、公共契约、跨仓库决策 | Markdown、JSON Schema、OpenAPI | P0 |
| `flow-ark-client` | 编辑器、本地执行、调度、SQLite、系统能力 | Electron、React、TypeScript、Playwright、ExcelJS | P1.1 |
| `flow-ark-server` | 平台 API、用户权限、设备、任务、MySQL 迁移 | Spring Boot、MySQL、Maven | P2 |
| `flow-ark-admin` | 平台管理界面 | React、TypeScript | P2 |

不使用 Git submodule，不创建跨仓库 pnpm workspace，不通过相邻目录引用代码。客户端和管理台分别管理 Node 依赖；客户端可在自己仓库内部组织多个包。数据库是存储与部署组件，其迁移分别属于客户端和服务端，不另建数据库仓库。

## 从哪里开始开发

1. 阅读 [AGENTS.md](AGENTS.md)、[架构文档](docs/architecture.md) 和 [当前 roadmap](ROADMAP.md)。
2. 确认任务归属和阶段：P1 仅开发单机客户端，服务端与管理台留到 P2。
3. P1.1 在 `flow-ark-client` 中初始化独立仓库，建立自己的 `AGENTS.md`、README、构建与检查命令；其他子仓库在对应阶段创建。
4. 在目标仓库执行 Git 操作，先确认 `git rev-parse --show-toplevel` 指向该仓库。尚未初始化的子目录会向上找到治理仓库，不能据此误提交。
5. 应用必须可单独克隆、构建、测试和运行；发布产物不依赖 `flow-ark` 主目录存在。

治理仓库的 SSH 地址为 `git@github.com:zhongmiao-org/flow-ark.git`。应用子仓库地址和软件发布渠道尚未指定，待各阶段建立后补充对应安装与启动命令。

## P1 成功标准

Windows、macOS 安装后的客户端，在不部署 FlowArk 服务端、不登录平台的情况下，独立完成：

**拉取数据 → JS/TS 处理 → 生成 Excel → 浏览器上传 → 核对业务结果。**

不依赖平台不等于所有业务流程离线可用：访问业务 API 或业务网站仍需相应网络。可视化编排覆盖顺序、条件、串行循环，任务支持手动触发和应用驻留期间的本机定时。

后续平台按“先集中监控，再远程治理”推进；接入平台不取消本地独立模式，也不自动上传本地流程、凭据或浏览器登录态。
