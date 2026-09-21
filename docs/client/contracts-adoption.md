# 固定契约来源

当前客户端设计分支（应用 0.3.0，未正式发版）固定采用 [契约 0.12.0](../../contracts/v0.12.0/README.md)，治理基线为 `c9e2e03dfd4dc5c661bae4d17066e12b506530c3`（[PR #104](https://github.com/zhongmiao-org/flow-ark/pull/104)，CI 自动合并），纳入[理解页输出选择](task-output-selection.md)与此前[首次教学](first-task-learning.md)规则。不可变开发快照 `contracts-v0.12.0` 保持指向 `1f1fc4771ddcf553b0748d28410b26c9ed4319ad`（[PR #99](https://github.com/zhongmiao-org/flow-ark/pull/99)），未移动 tag。新增 [同名序号文本输出](file-create-numbered.md) file v4 create/onConflict:number 及 file-create-numbered-v1；file v3 仍同名停止。SDK 1.0 和标准包 2.0 不变。

2026-09-22 理解与补问页已接入输出选择，三尺寸、目录取消/重选/移除、文件名/策略保存和发送核对通过隔离 GUI 验证。首次教学从界面选择到真实文件及预览已移除 flow.save 绑定捷径；明确覆盖保留旧产物，重开不重发。共享流程的其他任务不能夺取已有输出选择或仍绑定的归属。276 项单元与 91 项执行集成通过；系统目录返回和模型 HTTP 仍为夹具，Mac 锁屏阻止原生选择器人工验证，未完成真实供应商或 U12 验收。治理基线与公开契约不变，详见 [Figma 实施记录](design-implementation.md)。

此前输出选择后端已验证 task.output.choose/configure/clear、路径不外发、固定输出和执行版本复核，真实 Worker 覆盖序号/明确覆盖及目录失效。该轮系统目录与模型采用夹具，完整理解页尚未接入，后续界面证据见上条。

2026-09-22 learning.status/start/skip 已通过严格 IPC、并发 CAS、开始/选择/采纳/运行事务回滚、真实文本预览完成与迟到回执隔离。首次教学完成、跳过、跨重开继续、重新学习通过本机 HTTP 模型夹具和真实内置网页/Worker 链路验证；进度保存于独立加密记录，不改写旧任务/运行。初次验证通过 flow.save 测试接口准备目录，后续已由上条理解页验证替代；真实模型和非技术用户验收未完成，详见 [Figma 实施记录](design-implementation.md)。

2026-09-22 同名序号输出已通过原子不覆盖、并发/取消、真实 Worker 固定快照、内置网页输出和串行重开验证。运行检查与方案说明使用真实策略，产物登记实际文件名；旧 Run/计划及已提交文件不因草稿修改或后续失败而改写。无 SQLite 迁移，模板仓库本轮未采用新节点；当时尚未包含首次教学 UI/进度，后续实现见上条。具体证据见 [Figma 实施记录](design-implementation.md)。

2026-09-22 网页目标选择已接入受控内置页、规划上下文、采纳事务和执行来源复核。`task.web.preview/select/clear` 及本机 `webTarget` 不进入公开规划/流程契约；不新增 SQLite 表或迁移。旧运行/计划保留原选择，手动保存不能去掉宿主来源约束。应用窗口、MCP、真实账号与完整 U03 仍未完成，具体证据见 [Figma 实施记录](design-implementation.md)。

2026-09-22 [新建文本文件](file-create.md) 新增 file v3 create 和 file-create-v1，已通过原子不覆盖、真实 Worker/内置网页输出及串行重开验证。已有 write、copy、archive 语义保留，旧 Run/计划不改写，无 SQLite 迁移。模板仓库本轮未采用新节点；该增量尚未包含教学界面与学习进度，后续实现见上条。具体证据见 [Figma 实施记录](design-implementation.md)。

此前 AI 单步候选采用记录：当时客户端设计分支（应用 0.3.0，未正式发版）固定采用 [契约 0.10.0](../../contracts/v0.10.0/README.md)、SDK 1.0 和标准包 2.0，治理基线为 `c12f335c2ee1ece2c1bcabae51bcd58356d1ab1d`（[PR #93](https://github.com/zhongmiao-org/flow-ark/pull/93)，CI 自动合并）。公开契约 tag `contracts-v0.10.0` 保持指向 [PR #91](https://github.com/zhongmiao-org/flow-ark/pull/91) 的合并提交 `937a865f71a092d49f34da499778e68ef37caa05`，未移动已发布 tag。

2026-09-22 [AI 单步修改](ai-step-edit.md) 在本机 task.save 增加可选 scope、task.detail 返回当前流程/绑定摘要；沿用加密任务文档与公开规划格式 1.0，无数据库迁移。Excel 字段映射采用 excel v3 map；v1 整表读写和 v2 模板填充继续是现行规范中的独立操作，旧运行快照不改写。客户端纳入规范副本、SHA256 清单和生成类型，具体实现与真实验收见 [Figma 实施记录](design-implementation.md)。模板仓库本轮未采用新节点，也没有因此声明支持映射模板。

以下保留各历史版本的采用证据，不代表当前分支仍采用其中的旧基线。

- 0.2.0 开发候选：契约 0.8.0 / SDK 1.0 / 标准包 2.0，固定治理快照 `aff8f5e3ce56d410e52173f736f4327bed156ffa`。模板与客户端均纳入机器契约副本，独立构建。后续旧兼容代码清理不改变正式 ZIP 协议；不存在旧客户端升级／降级兼容承诺。

- 0.1.35 治理基线：`f708195eabb5088d13500f02d23fa837f6886f3b`。采用[脱敏边界](redaction-boundaries.md)，补齐对象键和公共错误输出；成功内部凭据、公共契约 0.7.0、SQLite v2 及旧流程不迁移。

- 0.1.34 治理基线：`ed7179616faa1a40f16d9435e7dc48b313f43570`。采用[模板实例参数](template-parameters.md)，统一编辑入口、失败提示和草稿撤销；公共契约 0.7.0、SQLite v2、宿主保存投影及旧计划/快照不变。

- 0.1.33 治理基线：`333273659ed5352832718d6b1604fea9f2f65ab4`。采用[系统挂起生命周期](system-suspend.md)，在内存中撤销旧执行请求并独立于写入结果停止资源；仅宿主逻辑和内部重跑校验回调变化，公共契约 0.7.0、SQLite v2、流程/计划/Run 数据不迁移。

- 0.1.32 治理基线：`5f468263aa6b0dd0507ab43162a2b35482371ac8`。采用[运行详情与实时观察](run-observation.md)，bootstrap/run.detail 新增可选 execution，run.detail 增加可选存储 fault；仅本地只读响应，公共契约 0.7.0、SQLite v2、流程/事件和输出数据不迁移。

- 0.1.31 治理基线：`1b2e4fee62ca191c601088c4543b0a148466e380`。采用[脚本进程监护](script-process-supervision.md)，新增私有脚本调用/取消及加密 script-lease；SQLite 提升为 v2，以拒绝忽略持久租约的旧 reader，v1 文档/事件字节保留。公共契约仍为 0.7.0，流程、快照、模板与脚本 SDK 不迁移。实际升级/降级与回收证据见验收记录。

- 0.1.30 治理基线：`82da2da0c1c12c676dae63c3f2746a52a87a55b2`。采用[内置网页关闭确认](embedded-cleanup.md)，Main/Host 内部启动/关闭回执包含 token/resourceId，Bootstrap 新增可选 runtimeBlock，私有故障通知覆盖无租约预览。组件随完整应用更新；公共契约 0.7.0、SQLite v1 和旧流程/快照不迁移，内部回执不兼容混用旧组件。实际验证见验收记录。

- 0.1.29 治理基线：`f45495ab4d27b03d2db4470746fa9b5aea4024c8`。长流程全图按实际尺寸计算缩放下限，增加所选步骤聚焦；仅 Renderer 投影视口变更，见[流程图语义](flowchart.md)。公共契约 0.7.0、IPC、SQLite v1 和旧流程快照不变。

- 0.1.28 治理基线：`0e2df726f07518b4f69fce585e6bdc7543ba68b8`。新增本地 `run.rerun.preview/confirm`、`run.detail.rerun`、可选 Run.rerun 与加密确认去重记录，见[人工核对后重新运行](run-rerun.md)。沿用公共契约 0.7.0 和 SQLite v1，不导出关联、不改写旧快照；旧依赖缺少固定清单时拒绝原快照重跑。

- 0.1.27 治理基线：`2a41434fa40265f72a6bc2a8f4e439a80924bfb0`。修正普通 Excel 读写压缩空行及稀疏数组导致的列偏移，保留明确提供的尾部空行，见 [Excel 行列位置保留](excel-row-preservation.md)。既有节点、公共契约 0.7.0、IPC 和 SQLite 格式不变，不修改历史快照。

- 0.1.26 治理基线：`1a565af920f1852b86182c685b5dc8c7b3075ae9`。落实全部节点已有 timeoutMs 与高级 JSON 未完成输入保护，见 [节点执行与输入](node-execution-input.md)；公共契约 0.7.0、IPC 和 SQLite 格式不变，实际交付结果见验收记录。
- 0.1.25 治理基线：`f15193f3998c597b6a7088fdd470cab19bb0fea2`。当前草稿只读导出、内容标识本地版本及完整运行退出确认，见 [导出快照与退出确认](export-and-exit.md)。仅本地 flow.export 载荷调整，公共契约 0.7.0、SQLite 和旧包导入不变；交付状态见验收记录。
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
- SQLite 迁移由 `src/host/store.ts` 管理。首版 user_version=1，0.1.31 提升为 2；新版拒绝 >2，旧版拒绝 >1，迁移失败不删库。所有业务 JSON 使用 AES-256-GCM 加密，数据密钥由 macOS Keychain 保护的 Electron safeStorage 保管。

- 0.2.0 契约发布提交：`342eabd`；实例配置表单随模板包分发，客户端 Markdown 不保存采用说明。
- 0.3.0 契约发布提交：`a81f5fc`；工作簿模板填充与文件归档均为新增节点版本，不改写旧流程与快照。本地产物界面接口见 [本地 IPC](local-ipc.md)。

- 0.4.0 契约发布提交：`16e1351`；可选脚本编译摘要与依赖清单。新版本/Run 固定编译产物，旧的无依赖计划可补编译固定文本；不改变 SQLite 表结构。细节见 [本地脚本依赖](script-dependencies.md)。

- 0.5.0 契约发布提交：`7f4a7c4`；可选 jobFilter 与 jobSnapshot，原策略保持原范围；新版模板 1.2.0 声明 recruiting-job-filter-v1 能力。没有 SQLite 表结构迁移或旧实例自动改写，见 [岗位筛选](recruiting-filters.md)。

- 0.6.0 契约发布提交：`3629b4b`；browser v2 与 FramePath，旧 v1 仅顶层。无数据库迁移或旧流程/计划自动升级，见 [浏览器框架](browser-frames.md)。

- 0.7.0 契约发布提交：`60ab503`；browser v3 增加 select/check/inputValue/press，能力 browser-forms-v1。旧 v1/v2、计划及快照保持原样，无数据库迁移；旧端拒绝新节点版本。见 [复杂表单验证](form-lab.md)。
