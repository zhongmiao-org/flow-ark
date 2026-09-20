# 固定契约来源

- 治理基线：`39c6b6dcbe69d27907b74a99fb986092cf02ab33`。
- P1 规范源：`zhongmiao-org/flow-ark` 的 `contracts-v0.7.0` tag（2026-09-17 已推送），规范目录 `contracts/v0.7.0/`。
- 采用版本：契约 0.7.0，流程格式 1.0；既有节点版本 1，工作簿模板填充、文件归档和显式框架路径浏览器节点使用版本 2，浏览器表单控件使用版本 3。摘要见 `contracts/SHA256SUMS`；客户端 package.json 的 flowark 字段记录基线及采用版本。
- 客户端内的 `contracts/p1.schema.json` 和示例是固定发布复制件；程序不读取父目录。
- 生成器：json-schema-to-typescript 16.0.0；执行 `pnpm contracts:generate`，生成 `src/shared/contracts.generated.ts`。
- 运行时使用 Ajv 8.20.0（2020-12 模式），另校验引用作用域、能力与资源绑定。
- 升级顺序：治理仓库新规范及兼容/迁移说明 → 发布不可变 tag → 更新客户端复制件和摘要 → 再生成类型 → 正反例与行为回归 → 客户端版本发布。
- SQLite 迁移由 `src/host/store.ts` 管理。首版 user_version=1；更高版本拒绝打开，迁移失败不删库。所有业务 JSON 使用 AES-256-GCM 加密，数据密钥由 macOS Keychain 保护的 Electron safeStorage 保管。

- 0.2.0 契约发布提交：`342eabd`；实例配置表单随模板包分发，客户端 Markdown 不保存采用说明。
- 0.3.0 契约发布提交：`a81f5fc`；工作簿模板填充与文件归档均为新增节点版本，不改写旧流程与快照。本地产物界面接口见 [本地 IPC](local-ipc.md)。

- 0.4.0 契约发布提交：`16e1351`；可选脚本编译摘要与依赖清单。新版本/Run 固定编译产物，旧的无依赖计划可补编译固定文本；不改变 SQLite 表结构。细节见 [本地脚本依赖](script-dependencies.md)。

- 0.5.0 契约发布提交：`7f4a7c4`；可选 jobFilter 与 jobSnapshot，原策略保持原范围；新版模板 1.2.0 声明 recruiting-job-filter-v1 能力。没有 SQLite 表结构迁移或旧实例自动改写，见 [岗位筛选](recruiting-filters.md)。

- 0.6.0 契约发布提交：`3629b4b`；browser v2 与 FramePath，旧 v1 仅顶层。无数据库迁移或旧流程/计划自动升级，见 [浏览器框架](browser-frames.md)。

- 0.7.0 契约发布提交：`60ab503`；browser v3 增加 select/check/inputValue/press，能力 browser-forms-v1。旧 v1/v2、计划及快照保持原样，无数据库迁移；旧端拒绝新节点版本。见 [复杂表单验证](form-lab.md)。
