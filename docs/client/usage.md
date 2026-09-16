# FlowArk · 序舟

本地自动化工作台，当前交付 **0.1.0 开发预览版，macOS Apple Silicon**。已有可运行 Electron 客户端、流程编辑器、独立执行进程、SQLite、文件/Excel/HTTP/浏览器节点和本机调度。

**招聘业务尚未验收完成。** 两个模板可以创建和配置；授权、AI 草稿、外发记录和联系方式提醒的内部流程已有回归测试。BOSS/智联的真实账号与页面入口尚未校准，生产适配器明确阻止外发。不能用本地测试代表真实投递、聊天或交换成功。按用户本次调整，先开发程序，招聘网站实测后置。

- [验收记录与 C/J 矩阵](acceptance.md)
- [开发约束](../../AGENTS.md) · [固定契约与迁移](contracts-adoption.md)
- [统一架构](https://github.com/zhongmiao-org/flow-ark/blob/main/docs/architecture.md) · [治理路线图](https://github.com/zhongmiao-org/flow-ark/blob/main/ROADMAP.md)

## 安装和启动

本地构建输出位于 `release/`：`FlowArk-0.1.0-arm64.dmg`、`FlowArk-0.1.0-arm64-mac.zip` 和 `mac-arm64/FlowArk.app`。打开 DMG 后将应用复制到 Applications，或用户自己的 `~/Applications`。安装包不包含额外自动化浏览器。

当前包 **未签名、未公证**，没有公开发行渠道和自动更新服务。系统对来源的提示与组织分发政策分别处理，不通过脚本关闭 Gatekeeper 或删除隔离属性。仅记录本机实际启动结果，不承诺其他机器直接运行。

首次打开不要求平台账号。点击「第一个流程」的「运行」可验证本地执行；「编辑」可添加节点、调整同层顺序，配置条件/串行循环，并使用 Monaco 编辑 JS/TS。流程需先保存，保存时检查引用和格式。运行中的流程绑定快照，编辑只影响后续运行。

「设置」选择已经安装的 Chrome。程序使用专用 Profile，不读取日常默认 Profile；路径或版本变化会要求重新绑定。Firefox 需要显式选择本机 geckodriver，Safari 使用 `/usr/bin/safaridriver`；这两条路线尚未完成兼容验收，不宣称支持。Windows 三款 360 后续单独验证。

「参数与绑定」绑定本地目录和允许此流程使用的凭据。文件节点的名称相对于绑定目录，禁止越界或符号链接逃逸。浏览器上传值格式为 `{"binding":"work","name":"resume.pdf"}`；浏览器截图和下载进入运行产物目录。

「模板库」内有 BOSS、智联两个模板。创建后从工具栏「实例配置」打开模板声明的表单，设置平台账号、明确目标 ID、简历版本、授权事实、所选浏览器及逐动作模式。投递、发送简历、回复、微信/手机请求和接受分别设置禁止、确认或自动。待确认动作保存在「待办」，确认只绑定页面显示的具体内容；下轮必须再次核对账号、目标和上下文。当前生产站点适配未完成，运行模板只生成限制待办。

「设置」可写入 Codex/OpenAI 或 DeepSeek API Key；Renderer 不获得已存密钥。点击接口验证会向**所选供应商**发送虚构的开发经验样例，可能产生该供应商费用。此功能不使用 Codex CLI、ChatGPT 或桌面登录态。模型 ID 可配置，账号可用性以实际返回为准。默认候选 `gpt-5.3-codex` / `deepseek-flash`，当前两家均未用真实密钥验收。

关闭窗口会进入托盘；菜单「退出 FlowArk」停止驻留调度、处理当前任务并取消队列。定时只在应用运行时生效，退出、休眠或长时间停顿后的错过任务不会补跑。暂停在步骤边界生效，取消先通知执行进程，必要时回收本任务的进程。

## 数据和可信代码

默认数据保存在 Electron 的用户数据目录（macOS 为 `~/Library/Application Support/flow-ark-client`）；实际路径可在设置查看。开发测试可用 `FLOWARK_DATA_DIR` 指定隔离目录。安装目录、源码仓库不保存运行数据库。

SQLite 结构化业务载荷使用 AES-256-GCM 加密，数据密钥和 API Key 使用 Electron safeStorage 的 macOS 系统保护存储；不可用时阻止初始化，不降级为明文。运行产物和浏览器 Profile 是本机文件，并非整盘加密，受用户目录权限及系统磁盘保护。不要将整个数据目录上传或提交到 Git。

JS/TS 面向用户审阅过的**可信代码**，可使用 Node 内置能力；独立进程不是安全沙箱。当前不接受第三方脚本依赖，准入时明确拒绝，运行中不安装包。SDK 示例：

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
```

浏览器回归可设置 `FLOWARK_CHROME_PATH` 指向用户已安装的 Chrome。任何命令都不执行 `playwright install`。`test-results/`、`release/` 和运行数据均不提交；测试只使用虚构数据。没有 GitHub Actions、其他 CI、commitlint 或 Husky；本地检查不等于 CI。

目录职责：`src/renderer` 界面；`src/main` 窗口、系统存储和白名单 IPC；`src/host` SQLite、队列、调度、会话；`src/core` 无 UI/数据库依赖的执行语义；`src/workers` 独立进程入口；`src/adapters` HTTP/文件/脚本/浏览器能力；`src/recruiting` 业务协调、策略和 AI；`contracts` 固定发布复制件。

## 当前限制

- 两站生产 DOM 适配与真实业务闭环尚未完成；求职筛选目前只有关键词、公司排除及明确目标范围，城市/薪资等完整筛选仍待扩展。
- Codex、DeepSeek 只有协议模拟与错误处理测试，真实 API 与账号模型可用性待安全配置密钥后验证。
- Firefox 未安装；Safari 原生驱动路线已编写，登录、验证码接管及上传未验收；Windows 未验收。
- Excel 支持首个工作表基础读取、生成和上传，不承诺宏、公式计算或复杂模板保持。浏览器暂不支持跨 iframe 操作。
- 本机定时为固定分钟间隔，不支持退出后系统服务或 cron 表达式。版本 1 数据库支持初始化和拒绝未知新版，尚无跨版本升级包验证。
- 目前使用 node:sqlite，Node 会提示实验性 API；Monaco 懒加载资源较大，构建有 chunk size 提示，均不代表已消除后续兼容或性能风险。

官方协议参考：[OpenAI Responses 结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs)、[Codex 模型](https://developers.openai.com/api/docs/models/gpt-5.3-codex)、[DeepSeek Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)。这些资料不能代替本人的 API 实调与业务验收。

本文集中于治理仓库，客户端只保留精简 README 和贡献指南。模板配置表单来自模板包，不在通用编辑器右侧固定显示业务字段。
