# FlowArk · 序舟

本地自动化工作台，当前源码为 **0.1.5 开发中，macOS Apple Silicon**；本机已安装版本仍为 **0.1.4**。已有可运行 Electron 客户端、流程编辑器、独立执行进程、SQLite、文件/Excel/HTTP/浏览器节点和本机调度。各版本安装结果见验收记录。

**招聘业务尚未验收完成。** 两个模板可以创建和配置；授权、AI 草稿、外发记录和联系方式提醒的内部流程已有回归测试。基础交付后已只读查看两站公开入口，真实账号及业务页面仍未校准，生产适配器明确阻止外发。不能用本地测试或公开页面可达代表真实投递、聊天或交换成功。

- [验收记录与 C/J 矩阵](acceptance.md)
- [开发约束](../../AGENTS.md) · [固定契约与迁移](contracts-adoption.md)
- [统一架构](https://github.com/zhongmiao-org/flow-ark/blob/main/docs/architecture.md) · [治理路线图](https://github.com/zhongmiao-org/flow-ark/blob/main/ROADMAP.md)

## 安装和启动

已验收的 0.1.4 本地构建输出位于 `release/`：`FlowArk-0.1.4-arm64.dmg`、`FlowArk-0.1.4-arm64-mac.zip` 和 `mac-arm64/FlowArk.app`。打开 DMG 后将应用复制到 Applications，或用户自己的 `~/Applications`。安装包不包含额外自动化浏览器。

0.1.5 尚未生成或安装交付包：本机 Chrome 153 在上传下载后关闭、重开并再次下载时发生原生 SIGSEGV。纯 Playwright 也已复现，取消不是必要条件。失败断言保留，未把单项通过称为完整恢复通过；详细证据见 [恢复缺口](browser-recovery.md) 和验收记录。

当前包 **未签名、未公证**，没有公开发行渠道和自动更新服务。系统对来源的提示与组织分发政策分别处理，不通过脚本关闭 Gatekeeper 或删除隔离属性。仅记录本机实际启动结果，不承诺其他机器直接运行。

首次打开不要求平台账号。点击「第一个流程」的「运行」可验证本地执行；「编辑」可添加节点、调整同层顺序，配置条件/串行循环，并使用 Monaco 编辑 JS/TS。流程需先保存，保存时检查引用和格式。运行中的流程绑定快照，编辑只影响后续运行。

画布按语义使用不同形状：条件为菱形、数据为平行四边形、人工操作为梯形、文件为文档形、工作簿为叠页形，脚本为双侧线矩形；普通处理使用矩形。条件的成立/否则两路执行后汇合，串行循环显示逐项、下一项回边和完成出口。开始、结束、汇合点只是图形辅助，不增加运行步骤。详细约定见 [流程图语义](flowchart.md)。

「设置」选择已经安装的 Chrome。程序使用专用 Profile，不读取日常默认 Profile；路径或版本变化会要求重新绑定。Firefox 需要显式选择本机 geckodriver，Safari 使用 `/usr/bin/safaridriver`；这两条路线尚未完成兼容验收，不宣称支持。Windows 三款 360 后续单独验证。

「参数与绑定」绑定本地目录和允许此流程使用的凭据。文件节点的名称相对于绑定目录，禁止越界或符号链接逃逸。浏览器上传值格式为 `{"binding":"work","name":"resume.pdf"}`；浏览器截图和下载进入运行产物目录。

Excel 节点可切换「填充工作簿模板」：templateName 指定已有 xlsx，name 指定另存文件，sheet 为空则使用第一张表，cells 形如 `{"A2":"名称","B2":42}`，也可引用流程参数。原模板不会被覆盖，保留未修改单元格、样式和其他工作表。文件节点的「归档为 ZIP」接受明确的 files 相对路径数组。输出完整写入后才替换文件并登记产物；运行详情可在文件夹中显示产物，文件已移动、删除或不可访问时显示提示，历史运行结果保持不变。

浏览器节点可选择操作、填写目标元素选择器，并配置「iframe 路径」：每行一个 CSS 选择器，从外到内最多 8 层，留空操作顶层。每层须唯一匹配 iframe/frame；缺失、重复或被移除时停止，不转到其他页面执行。打开网页和页面截图只作用于顶层，切换到这两种操作会清空路径。新增节点或编辑框架配置后保存为 v2，旧节点和已保存计划不自动改写，见 [浏览器框架](browser-frames.md)。

「模板库」内有 BOSS、智联两个模板。创建后从工具栏「实例配置」打开模板声明的表单，设置平台账号、明确目标 ID、简历版本、授权事实、所选浏览器及逐动作模式。投递、发送简历、回复、微信/手机请求和接受分别设置禁止、确认或自动。待确认动作保存在「待办」，确认只绑定页面显示的具体内容；下轮必须再次核对账号、目标和上下文。当前生产站点适配未完成，运行模板只生成限制待办。

两个招聘模板 1.2.0 的「岗位筛选」支持完整城市名称、包含公司、排除职位词、现场/混合/远程办公及人民币月薪区间。各组同时满足；空列表不新增限制。月薪填写岗位下限至少、上限至多，0 表示对应方向不限，启用时至少填写一个边界。缺失、面议、非月薪或非人民币信息不会自动换算；不匹配时在 AI 调用前进入待办，提交前再核对。待办展示岗位证据和来源，岗位条件变化会使旧确认失效。旧实例保留原表单，使用新增字段需从新版模板创建独立实例。规则见 [岗位筛选](recruiting-filters.md)。

「设置」可写入 Codex/OpenAI 或 DeepSeek API Key；Renderer 不获得已存密钥。点击接口验证会向**所选供应商**发送虚构的开发经验样例，可能产生该供应商费用。此功能不使用 Codex CLI、ChatGPT 或桌面登录态。模型 ID 可配置，账号可用性以实际返回为准。默认候选 `gpt-5.3-codex` / `deepseek-flash`。0.1.5 开发版的 DeepSeek 虚构样例实调已通过；Codex 未实调。已安装 0.1.4 不含本次提示词修复，详见 [AI 实接](ai-validation.md)。

关闭窗口会进入托盘；菜单「退出 FlowArk」停止驻留调度、处理当前任务并取消队列。定时只在应用运行时生效，退出、休眠或长时间停顿后的错过任务不会补跑。暂停在步骤边界生效，取消先通知执行进程，必要时回收本任务的进程。

## 数据和可信代码

默认数据保存在 Electron 的用户数据目录（macOS 为 `~/Library/Application Support/flow-ark-client`）；实际路径可在设置查看。开发测试可用 `FLOWARK_DATA_DIR` 指定隔离目录。安装目录、源码仓库不保存运行数据库。

SQLite 结构化业务载荷使用 AES-256-GCM 加密，数据密钥和 API Key 使用 Electron safeStorage 的 macOS 系统保护存储；不可用时阻止初始化，不降级为明文。运行产物和浏览器 Profile 是本机文件，并非整盘加密，受用户目录权限及系统磁盘保护。不要将整个数据目录上传或提交到 Git。

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

`credential(id)` 只解析该流程显式授权的凭据。返回值和日志经脱敏；可信脚本仍可自行访问系统，不应运行不信任的模板或代码。脚本不自动重试。

流程导出排除本机绑定、动作策略、个人事实、凭据和运行历史，参数值清空；节点字面量和脚本仍需要用户审阅。导入创建新草稿，不执行；模板升级应创建新实例对照修改，不覆盖既有计划和 Run。尚无在线商店、模板差异合并界面。

备份时退出应用，并保留整个数据目录和原系统用户的 Keychain 条件。仅复制 SQLite 或 `.enc` 文件不能保证跨系统解密。卸载应用不会自动删除数据；如需清除，在应用退出后由用户处理设置中显示的数据目录。当前没有跨设备密钥迁移功能。

## 独立开发

本仓库独立克隆后可构建，不读取父目录源码、规范或构建产物。已锁定 Node 24.3.0、pnpm 10.14.0、Electron 44.4.1；完整版本见锁文件。Electron 是界面运行时，不用于自动化备用浏览器。

```sh
pnpm install --frozen-lockfile
pnpm setup:electron
pnpm check
pnpm test:runtime
pnpm dev
```

`setup:electron` 只准备 Electron 运行时，不安装 Chrome/Firefox。Electron 44 使用显式安装命令。若分发网络不可用，使用团队可信镜像时必须对照已锁定 Electron npm 包的 `checksums.json` 核对 SHA-256；不得静默更换版本。当前打包命令使用已准备的 Electron 目录。

```sh
pnpm test:browser   # 已安装 Chrome，localhost 虚构页面，专用临时 Profile
pnpm test:scenario  # HTTP → TS → Excel → Chrome 上传 → 页面回执断言
pnpm test:desktop   # 启动 Electron，测试 React Flow、Monaco、保存和运行
pnpm package:mac    # 本机 arm64 zip + 原生 hdiutil DMG，未签名
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:desktop
FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:install
# 使用隔离数据验证旧版写入后新版重开；不访问日常用户数据
FLOWARK_PREVIOUS_EXECUTABLE='/absolute/path/previous/FlowArk.app/Contents/MacOS/FlowArk' FLOWARK_TEST_EXECUTABLE='/absolute/path/FlowArk.app/Contents/MacOS/FlowArk' pnpm test:install
```

浏览器回归可设置 `FLOWARK_CHROME_PATH` 指向用户已安装的 Chrome。任何命令都不执行 `playwright install`。`test-results/`、`release/` 和运行数据均不提交；测试只使用虚构数据。没有 GitHub Actions、其他 CI、commitlint 或 Husky；本地检查不等于 CI。

目录职责：`src/renderer` 界面；`src/main` 窗口、系统存储和白名单 IPC；`src/host` SQLite、队列、调度、会话；`src/core` 无 UI/数据库依赖的执行语义；`src/workers` 独立进程入口；`src/adapters` HTTP/文件/脚本/浏览器能力；`src/recruiting` 业务协调、策略和 AI；`contracts` 固定发布复制件。

## 当前限制

- 两站生产 DOM 适配与真实业务闭环尚未完成；筛选策略已有本地验证，真实岗位城市、薪资和工作方式的页面读取仍需校准，不能用虚构数据回归代替 J-02。
- DeepSeek 在 0.1.5 开发版完成虚构样例的真实请求和草稿校验；Codex 尚无凭据配置，真实接口与两站真实招聘上下文仍待验证。
- Firefox 未安装；Safari 原生驱动路线已编写，登录、验证码接管及上传未验收；Windows 未验收。
- Excel 支持首个工作表基础读取、生成、按单元格填充模板和上传；保留常规样式与工作表，不承诺宏、公式重算或所有高级工作簿特性。Chrome 的嵌套框架操作验证见验收记录；Firefox/Safari 仍需分别验证。
- 本机定时为固定分钟间隔，不支持退出后系统服务或 cron 表达式。版本 1 数据库支持初始化和拒绝未知新版；0.1.0 → 0.1.1 保留历史/密钥已验证，但两版数据库结构相同，不能代替未来表结构迁移验收。
- 目前使用 node:sqlite，Node 会提示实验性 API；Monaco 懒加载资源较大，构建有 chunk size 提示，均不代表已消除后续兼容或性能风险。

官方协议参考：[OpenAI Responses 结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)、[Codex 模型](https://developers.openai.com/api/docs/models/gpt-5.3-codex)、[DeepSeek Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)。这些资料不能代替本人的 API 实调与业务验收。

本文集中于治理仓库，客户端只保留精简 README 和贡献指南。模板配置表单来自模板包，不在通用编辑器右侧固定显示业务字段。
