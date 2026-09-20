# 固定契约来源

- 0.1.24 治理基线：`5a49614c01cabd894b3449f4c7d212d25aa2fac0`。本地 schedule.update 带 revision，默认保留原版本、明确采用草稿并保留启停状态；schedule.save 专用于创建，不再接受此前界面未使用的 id。公共契约 0.7.0、Run/计划存储及 SQLite 表结构不变，旧缺 revision 记录首次更新后获得 revision，无迁移。

- 0.1.23 治理基线：`44ec75bf473de8bda2d8f8ef5f3340bad97ebb3b`。新增本地 run.list 有界分页、字面量搜索与状态/来源筛选；bootstrap 增加完整记录的 runOverview，保留既有最近 200 条 runs。公共契约 0.7.0、Run 状态、加密数据格式及 SQLite 表结构不变。

- 0.1.22 治理基线：`335327ee362900941ed9ced14a416c41e27089e6`。新增 run.artifacts.preview/clear，run.detail 返回 artifactCleanup；产物增加 clearedAt 和 cleared 状态。沿用契约 0.7.0、ArtifactRef、流程和计划，无 SQLite 表结构迁移；清理状态使用既有文档存储，旧索引和外发去重记录保留。
- 0.1.21 治理基线：`9f094a6682e91195dda338ccc20aa5dddf74df2b`。每次产物登记保存独立副本，元数据增加 storage/sha256，run.detail 增加 integrity；沿用契约 0.7.0 和 ArtifactRef，无 SQLite 表结构迁移。旧记录不补造历史副本，只核对当前可访问性。
- 0.1.20 治理基线：`0760d36300c6afdbba82d3a6ab5f60195b87181b`。补齐上传目录准入、参数目录发现和执行时普通文件/可读性校验，保留前序生成文件；沿用现有上传值、契约 0.7.0、IPC、数据库与快照格式，不改写旧数据。
- 0.1.19 治理基线：`9feedd6aa73fff327febc6bc89f27d7a84cda045`。修复 HTTP body 引用漏检与参数原型链判断，沿用既有前序作用域和自身属性规则；公共契约 0.7.0、IPC、数据库及快照格式不变，不改写旧数据。
- 0.1.18 治理基线：`873ea5e7dfe56e808c4d01df4c940878201aa40a`。新增 HTTP、文件、Excel 可读字段、映射和行列编辑；使用既有节点与值引用，公共契约 0.7.0、IPC、数据库及运行语义不变。
- 0.1.17 治理基线：`8f74dd740c6d693b496ddd573aca2450f9600a5e`。新增类型化参数和通用值字段的引用选择，使用既有单键 `$ref` 与执行作用域；公共契约 0.7.0、IPC、数据库及快照语义不变。
- 0.1.16 治理基线：`88edc8c159e32b0611e2893c1ae3e8ec26d1be95`。新增草稿插入、子树复制、目标移动与内存编辑历史；使用既有节点和输出引用语义，公共契约 0.7.0、数据库、快照和旧绑定不变。
- 0.1.15 治理基线：`3919077ba34ea83e63c78da677c57e5d9719c987`。内置网页以 1920 CSS 像素宽度排版并缩放展示，公共契约 0.7.0、数据库、旧流程及绑定不变。
- 0.1.14 治理基线：`effac3a6f2c11c6191fa1c6a8749f9a6402ef72c`。新增具体动作入口、搜索和显式添加位置，只生成已有节点协议；公共契约 0.7.0、数据库及旧流程格式不变。
- 0.1.13 治理基线：`61dab8ab51eb3fba44287165325a902f14a3f5c3`。本次修复网页面板展开、收起与窗口缩放后的画布可见性；公共契约 0.7.0、数据库及旧流程格式不变。
- 0.1.12 治理基线：`310203b8a57787715f6608067aaf12ef860b9504`。修复后台截图取消后新网页不显示，契约和数据库格式不变。
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
