# FlowArk · 序舟

本地自动化工作台，当前为 **macOS Apple Silicon 开发预览版**。已有可运行 Electron 客户端、流程编辑器、逐步调试、独立执行进程、SQLite、文件/Excel/HTTP/浏览器节点和本机调度。2026-09-20 当前源码、已验收候选与日常安装均为 0.1.35，客户端 [PR #33](https://github.com/zhongmiao-org/flow-ark-client/pull/33) 已由 CI 自动合并。日常 0.1.28 → 0.1.35 升级、旧数据保留及实际内置网页练习后正常重开已验证。源码、候选包与日常安装的具体能力分别以[验收记录](acceptance.md)为准，P1 尚未完成。

0.1.35 的 187 项单元、74 项宿主测试，以及源码 redaction（7 组）、run-observation（5 组）、embedded、flow-export（5 组）均通过；DMG 候选 redaction（7 组）、run-observation（5 组）、embedded、install 四组通过，install 使用 0.1.28 → 0.1.35 隔离数据升级。对象键和公共错误出口脱敏已修复；Main 加密失败验收使用定向错误注入，不代表实际 Keychain 故障。详见[脱敏边界](redaction-boundaries.md)与[验收记录](acceptance.md)。

当前仅使用 **FlowArk 内置浏览器和本地复杂表单** 完善通用功能；招聘站点、真实 AI 与外部浏览器测试后置，不要求现在准备账号。此前的 [Selenium 简单网站练习](simple-sites.md) 保留为历史示例，不作为当前测试入口。

使用 [本地表单实验室](form-lab.md)：在客户端目录运行 `pnpm forms:serve`，点击应用右上角「打开网页面板」，输入 `http://127.0.0.1:4178` 并点击「访问网页」。网页在主窗口右侧按 1920 CSS 像素桌面宽度排版，等比缩放到面板。可手动练习，也可下载配套流程和虚构文件；导入流程后选择 FlowArk 内置浏览器并绑定独立的 `work` 目录，再运行或[逐步调试](debugging.md)。

**招聘业务尚未验收完成。** 两个模板可以创建和配置；授权、AI 草稿、外发记录和联系方式提醒的内部流程已有回归测试。基础交付后已只读查看两站公开入口，真实账号及业务页面仍未校准，生产适配器明确阻止外发。不能用本地测试或公开页面可达代表真实投递、聊天或交换成功。

- [验收记录与 C/J 矩阵](acceptance.md)
- [开发约束](../../AGENTS.md) · [固定契约与迁移](contracts-adoption.md)
- [统一架构](https://github.com/zhongmiao-org/flow-ark/blob/main/docs/architecture.md) · [治理路线图](https://github.com/zhongmiao-org/flow-ark/blob/main/ROADMAP.md)

## 安装和启动

0.1.35 预览构建输出位于客户端 `release/`：`FlowArk-0.1.35-arm64.dmg`、`FlowArk-0.1.35-arm64-mac.zip` 和 `mac-arm64/FlowArk.app`。安装或替换前正常退出旧应用，再从 DMG 将应用复制到 Applications 或自己的 `~/Applications`；先按下方说明备份数据。本机日常路径 `/Users/mac/Applications/FlowArk.app` 已安装 0.1.35。安装包不包含额外自动化浏览器，显式内置模式复用随附 Electron 内核。

2026-09-20 日常升级记录：升级前无活动任务或计划，原有 6 个流程、5 条历史。正常退出旧版后，旧应用与完整数据已备份到 `/Users/mac/Library/Application Support/FlowArk Backups/0.1.28-before-0.1.35-20260920T150140Z`，再替换为已验收的 0.1.35 并从桌面启动。只读核对原 25 条文档、53 条事件的全部载荷及两份加密凭据文件保持不变，SQLite v1 → v2，`quick_check` 为 `ok`。在日常界面运行已有「网页拾取练习」，仅访问 `http://127.0.0.1:4178` 并填写虚构姓名；Run `d44bd4a6` 成功且实际网页已填写，零提交。正常退出重开后，28 条文档、60 条事件、6 个流程和 6 条历史完整保留，没有重放。证据为 `/private/tmp/flowark-0135-daily-retention.json`、`/private/tmp/flowark-0135-daily-reopen.json`，详细记录见[验收](acceptance.md)。

本机 Chrome 153.0.8010.48 的自动下载恢复仍存在原生 SIGSEGV，因此该版本的 download 操作继续在准入及驱动层明确拒绝。此前表单、上传及取消重开的单项通过不能替代完整恢复验收，详见 [恢复缺口](browser-recovery.md)。内置模式的本地表单上传、下载与取消另有独立证据；当前不重测外部 Chrome。

当前包 **未签名、未公证**，没有公开发行渠道和自动更新服务。系统对来源的提示与组织分发政策分别处理，不通过脚本关闭 Gatekeeper 或删除隔离属性。仅记录本机实际启动结果，不承诺其他机器直接运行。

首次打开不要求平台账号。点击「第一个流程」的「运行」可验证本地执行；「编辑」可添加节点、调整顺序，配置条件/串行循环，并使用 Monaco 编辑 JS/TS。点击运行或逐步调试会先保存当前有效草稿，再生成不可变快照；未完成输入、引用或格式错误会阻止执行。运行中的流程不受后续草稿修改影响。

画布按语义使用不同形状：条件为菱形、数据为平行四边形、人工操作为梯形、文件为文档形、工作簿为叠页形，脚本为双侧线矩形；普通处理使用矩形。条件的成立/否则两路执行后汇合，串行循环显示逐项、下一项回边和完成出口。开始、结束、汇合点只是图形辅助，不增加运行步骤。详细约定见 [流程图语义](flowchart.md)。

当前在「设置」启用内置浏览器，并在流程「参数与绑定」的「本机浏览器」中选择 FlowArk 内置浏览器。右上角网页面板无需先运行流程即可访问页面；收起面板或最小化工作台后流程继续，恢复窗口后仍可查看页面，网页高度随面板调整。内置网站会话与工作台 Renderer 隔离，不使用用户日常浏览器 Profile。

本机浏览器是另一个显式模式，保留发现和手动路径绑定；路径或版本失效时拒绝启动，不静默切换为内置模式。Firefox 需要明确的本机 geckodriver，Safari 使用 `/usr/bin/safaridriver`；这两条路线尚未完成兼容验收，不宣称支持。Windows 三款 360 后续单独验证。

「参数与绑定」绑定本地目录和允许此流程使用的凭据。文件节点的名称相对于绑定目录，禁止越界或符号链接逃逸。浏览器上传值格式为 `{"binding":"work","name":"resume.pdf"}`；浏览器截图和下载进入运行产物目录。

0.1.34 起已修复通用模板参数的双来源编辑：由模板声明的运行参数在右侧显示只读摘要，点击「编辑实例配置」按模板表单修改；普通流程和招聘适配器的独立通用参数保持原编辑方式。保存失败会在表单内显示错误并保留输入，成功后参数与绑定同步，可整体撤销或重做，撤销后须再次保存。打开或取消不保存、不运行，其他实例、已有运行快照和固定计划不随本次修改改变。弹窗期间原生网页暂时隐藏，关闭后恢复同一会话。该版 175 项单元、模板参数 7 组、视口 15 个场景及值编辑、完整内置表单源码回归通过，DMG 候选四组验证通过；当前日常 0.1.35 已包含此修复。详见[模板实例参数](template-parameters.md)和[验收记录](acceptance.md)。

Excel 节点可切换「填充工作簿模板」：templateName 指定已有 xlsx，name 指定另存文件，sheet 为空则使用第一张表，cells 形如 `{"A2":"名称","B2":42}`，也可引用流程参数。原模板不会被覆盖，保留未修改单元格、样式和其他工作表。文件节点的「归档为 ZIP」接受明确的 files 相对路径数组。输出完整写入后才替换文件；登记的运行产物保存独立副本，详情「定位副本」会核对内容与可用性。原业务文件被覆盖或删除不改变已保存的历史副本；旧记录没有副本时会明确说明。

浏览器节点可选择操作、填写目标元素选择器，并配置「iframe 路径」：每行一个 CSS 选择器，从外到内最多 8 层，留空操作顶层。每层须唯一匹配 iframe/frame；缺失、重复或被移除时停止，不转到其他页面执行。打开网页和页面截图只作用于顶层，切换到这两种操作会清空路径。当前新增网页动作使用 v3；编辑旧节点的框架信息采用 v2/v3，旧流程和已保存计划不自动改写。原生选择、目标勾选、输入值读取和按键属于 v3，见 [浏览器框架](browser-frames.md) 与 [表单实验室](form-lab.md)。

「模板库」内有 BOSS、智联两个模板。创建后从工具栏「实例配置」打开模板声明的表单，设置平台账号、明确目标 ID、简历版本、授权事实、所选浏览器及逐动作模式。投递、发送简历、回复、微信/手机请求和接受分别设置禁止、确认或自动。待确认动作保存在「待办」，确认只绑定页面显示的具体内容；下轮必须再次核对账号、目标和上下文。当前生产站点适配未完成，运行模板只生成限制待办。

两个招聘模板 1.2.0 的「岗位筛选」支持完整城市名称、包含公司、排除职位词、现场/混合/远程办公及人民币月薪区间。各组同时满足；空列表不新增限制。月薪填写岗位下限至少、上限至多，0 表示对应方向不限，启用时至少填写一个边界。缺失、面议、非月薪或非人民币信息不会自动换算；不匹配时在 AI 调用前进入待办，提交前再核对。待办展示岗位证据和来源，岗位条件变化会使旧确认失效。旧实例保留原表单，使用新增字段需从新版模板创建独立实例。规则见 [岗位筛选](recruiting-filters.md)。

「设置」保留 Codex/OpenAI 或 DeepSeek API Key 的受保护配置入口；Renderer 不获得已存密钥。接口验证会向**所选供应商**发送虚构的开发经验样例，可能产生该供应商费用，不使用 Codex CLI、ChatGPT 或桌面登录态。模型 ID 可配置，账号可用性以实际返回为准。当前真实 AI 测试后置；0.1.5 开发版 DeepSeek 虚构样例曾通过实调，不能视为本轮或招聘上下文已验收。Codex 未实调，详见 [AI 实接](ai-validation.md)。

关闭窗口会进入托盘；菜单「退出 FlowArk」停止驻留调度，有任务时先显示退出确认，再处理当前任务和队列。定时只在应用驻留时生效，错过的周期不追赶执行。0.1.33 起在收到系统挂起事件后撤销尚未准入的旧请求并停止当前任务，持久化失败也不会跳过实际停止；恢复后须重新发起被撤销的人工作业。候选通过 `powerMonitor.emit` 系统事件夹具，当前日常 0.1.35 已包含该修复；最小化/托盘和事件夹具均不等于硬件休眠验收。暂停在步骤边界生效，取消先通知执行进程，必要时回收本任务拥有的进程。详见[系统挂起](system-suspend.md)及[验收记录](acceptance.md)。

运行记录支持搜索、筛选和翻页；进入详情再返回保留位置。0.1.32 起新增可读当前步骤、运行总耗时、实例范围内的主动进度和普通运行已保存输出，长输出可只读展开；当前日常 0.1.35 已包含此增量。存储故障时只能把已保存状态当历史，未保存的最终结果需核对，不能以旧 RUNNING 宣称仍在执行。详见[运行详情与实时观察](run-observation.md)。

## 数据和可信代码

默认数据保存在 Electron 的用户数据目录（macOS 为 `~/Library/Application Support/flow-ark-client`）；实际路径可在设置查看。开发测试可用 `FLOWARK_DATA_DIR` 指定隔离目录。安装目录、源码仓库不保存运行数据库。

SQLite 结构化业务载荷使用 AES-256-GCM 加密，数据密钥和 API Key 使用 Electron safeStorage 的 macOS 系统保护存储；不可用时阻止初始化，不降级为明文。运行产物和浏览器 Profile 是本机文件，并非整盘加密，受用户目录权限及系统磁盘保护。不要将整个数据目录上传或提交到 Git。

SQLite 从 0.1.31 起使用 v2，保护脚本持久租约；从 0.1.30 及更早版本升级时保留原记录，旧版会拒绝打开升级后的目录。0.1.31–0.1.34 → 0.1.35 无新增迁移；本轮日常 0.1.28 → 0.1.35 已完成 v1 → v2 并核对旧数据保留。**不能仅替换旧应用来直接降级当前 v2 数据，也不能手动调低数据库版本号。** 如需回退至 0.1.28，应在应用退出后使用上方升级前的旧应用与完整数据备份，并保留升级后数据另行核对；备份不含升级后新增历史。真实旧 reader 拒绝另有隔离验证，不代表未来表结构变更或物理磁盘满已验收。

JS/TS 面向用户审阅过的**可信代码**，可使用 Node 内置能力；独立进程不是安全沙箱。脚本面板的「绑定本地包」选择已安装包中 package.json 所在目录，记录名称与精确版本，可使用普通包、scope 包和已安装的 npm/pnpm 依赖。新建运行或保存计划前检查声明并静态打包；运行中不下载、不安装。排队任务和已保存计划使用固定代码，包被修改后需重新保存计划才采纳新内容。运行详情可展开查看固定的依赖版本与摘要。

导入带依赖的模板只创建未绑定草稿，须重新选择本机目录。支持可静态解析的 JS/TS、ESM/CommonJS、JSON；无法解析的动态导入和原生扩展会报错，不承诺所有 npm 包可用。依赖包在运行时读文件、联网或自行动态加载的内容不属于静态快照，不能据此声称外部数据已冻结。完整边界见 [本地脚本依赖](script-dependencies.md)。SDK 示例：

```ts
export default async ({ input, logger, progress, artifact, signal }) => {
  signal.throwIfAborted();
  logger.info('开始处理');
  progress(1, 1);
  const file = await artifact('result.txt', JSON.stringify(input));
  return { file };
}
```

`credential(id)` 只解析该流程显式授权的凭据，成功的内部读取返回原值，供脚本实际使用；展示、日志、调试预览和已保存输出经脱敏。0.1.35 同时遮盖可识别的对象键和公共错误，不因脱敏增加凭据读取。旧历史中已轮换或当前未知的秘密不能可靠识别，本次修复不自动清除全部旧历史，也不保证识别任意编码后的秘密。可信脚本仍可自行访问系统，不应运行不信任的模板或代码；脚本不自动重试。详见[脱敏边界](redaction-boundaries.md)。

流程导出排除本机绑定、动作策略、个人事实、凭据和运行历史，参数值清空；节点字面量和脚本仍需要用户审阅。导入创建新草稿，不执行；模板升级应创建新实例对照修改，不覆盖既有计划和 Run。尚无在线商店、模板差异合并界面。

备份时退出应用，并保留整个数据目录和原系统用户的 Keychain 条件。仅复制 SQLite 或 `.enc` 文件不能保证跨系统解密。卸载应用不会自动删除数据；如需清除，在应用退出后由用户处理设置中显示的数据目录。当前没有跨设备密钥迁移功能。

## 独立开发

以下命令均在独立客户端仓库 `flow-ark-client` 执行；本治理仓库不提供应用构建命令。客户端独立克隆后可构建，不读取父目录源码、规范或构建产物。已锁定 Node 24.3.0、pnpm 10.14.0、Electron 44.4.1；完整版本见锁文件。Electron 同时提供工作台运行时和显式内置网页模式的内核，不作为本机浏览器模式的静默后备。

```sh
pnpm install --frozen-lockfile
pnpm setup:electron
pnpm check
pnpm test:runtime
pnpm dev
```

`setup:electron` 只准备随应用使用的 Electron 运行时，不安装 Chrome/Firefox。Electron 44 使用显式安装命令。若分发网络不可用，使用团队可信镜像时必须对照已锁定 Electron npm 包的 `checksums.json` 核对 SHA-256；不得静默更换版本。当前打包命令使用已准备的 Electron 目录。构建会替换 `dist`，先完成构建再运行依赖它的测试，不与运行中的验证并发重建。

```sh
pnpm forms:serve          # 手动练习入口：127.0.0.1:4178 的本地复杂表单
pnpm test:forms           # 独立宿主和内置网页：字段、文件及本地提交回执
pnpm test:embedded        # 完整客户端：右侧网页、调试、最小化、上传下载与重开
pnpm test:run-observation # 运行详情、输出与明确标注的故障回复夹具
pnpm test:redaction       # 虚构凭据实际读取、输出脱敏及明确标注的加密错误夹具
pnpm test:system-suspend  # powerMonitor 系统事件夹具，不是硬件睡眠验收
pnpm test:template-parameters # 模板实例参数保存、隔离、撤销与内置网页
pnpm test:browser         # 内置网页：localhost 框架、严格定位、上传下载与取消
pnpm test:scenario        # HTTP → TS → Excel → 内置网页上传 → 本地回执断言
pnpm test:desktop         # 启动 Electron，测试 React Flow、Monaco、保存和运行
pnpm package:mac          # 本机 arm64 zip + 原生 hdiutil DMG，未签名
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:desktop
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:embedded
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:run-observation
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:redaction
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:system-suspend
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:template-parameters
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:install
# 使用隔离数据验证旧版写入后新版重开；不访问日常用户数据
FLOWARK_PREVIOUS_EXECUTABLE='/absolute/path/previous/FlowArk.app/Contents/MacOS/FlowArk' FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:install
```

`forms:serve` 是独立驻留的练习服务，其余表单验证自行建立隔离夹具。上述浏览器回归默认使用内置模式；本机 Chrome 兼容回归是另列的 `test:chrome` / `test:chrome-recovery`，当前不执行。命令名称、参数和支持的候选范围以客户端 `package.json` 与对应脚本为准，不执行 `playwright install`。`test-results/`、`release/` 和运行数据均不提交；测试只使用虚构数据。提交按 [统一规则](../../AGENTS.md) 走 PR、添加 `automerge` 标签并由 CI 自动合并；本地检查、CI 结果与真实浏览器验收分别记录。不额外添加 commitlint 或 Husky。

目录职责：`src/renderer` 界面；`src/main` 窗口、系统存储和白名单 IPC；`src/host` SQLite、队列、调度、会话；`src/core` 无 UI/数据库依赖的执行语义；`src/workers` 独立进程入口；`src/adapters` HTTP/文件/脚本/浏览器能力；`src/recruiting` 业务协调、策略和 AI；`contracts` 固定发布复制件。

## 当前限制

- 两站生产 DOM 适配与真实业务闭环尚未完成；筛选策略已有本地验证，真实岗位城市、薪资和工作方式的页面读取仍需校准，不能用虚构数据回归代替 J-02。
- DeepSeek 在 0.1.5 开发版完成虚构样例的真实请求和草稿校验；Codex 尚无凭据配置，真实接口与两站真实招聘上下文仍待验证。
- Firefox 未安装；Safari 原生驱动路线已编写，登录、验证码接管及上传未验收；Windows 未验收。
- Excel 支持首个工作表基础读取、生成、按单元格填充模板和上传；保留常规样式与工作表，不承诺宏、公式重算或所有高级工作簿特性。Chrome 的嵌套框架操作验证见验收记录；Firefox/Safari 仍需分别验证。
- 本机定时为固定分钟间隔，不支持退出后系统服务或 cron 表达式。0.1.33 的挂起取消与旧请求撤销已通过本地宿主及候选系统事件夹具，硬件休眠仍未验收。SQLite 当前为 v2，现有版本升级保留记录不代表未来表结构迁移均已验证。
- 当前日常 0.1.35 已包含对象键及公共错误脱敏，但不保证识别未知历史秘密或任意编码内容，也不会自动清理全部旧历史，见[脱敏边界](redaction-boundaries.md)。
- 目前使用 node:sqlite，Node 会提示实验性 API；Monaco 懒加载资源较大，构建有 chunk size 提示，均不代表已消除后续兼容或性能风险。

官方协议参考：[OpenAI Responses 结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)、[Codex 模型](https://developers.openai.com/api/docs/models/gpt-5.3-codex)、[DeepSeek Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)。这些资料不能代替本人的 API 实调与业务验收。

本文集中于治理仓库，客户端只保留精简 README 和贡献指南。模板配置表单来自模板包，不在通用编辑器右侧固定显示业务字段。
