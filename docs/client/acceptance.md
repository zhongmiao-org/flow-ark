# 开发预览验收记录

日期：2026-09-16。当前证据来自客户端仓库本地检查、真实进程、桌面窗口和 localhost 虚构数据；无真实投递、消息或联系方式交换。按用户要求先开发程序，招聘网站实测后置。P1 尚未完成，不将预览包描述为招聘业务可用版本。

## 0.1.2 流程图语义与安装验证

- 用户提出条件应使用菱形等常用流程图约定。保留 React Flow，自定义 SVG 节点与连接桩，映射和选型见 [流程图语义](flowchart.md)。修复原投影中条件节点直接连接后续步骤、分支体缺少汇合的问题；循环增加逐项、下一项和完成路径。辅助开始/结束/汇合点不进入保存和执行，流程契约仍为 0.3.0，数据库无变化。
- `pnpm check`：类型检查、34 项测试及构建通过。新增测试验证空分支/空循环、嵌套布局不重叠、图形路径与引擎执行一致以及投影不修改源流程。本次执行器未改动，未重复报告为新的完整进程/浏览器验收。
- 开发目录与最终安装版 `pnpm test:desktop` 均通过；实际点击菱形和循环节点后可编辑，保存不夹带辅助节点，形状/连接桩无 React Flow 错误。文档和工作簿输出连接点通过 SVG 轮廓几何检查。截图 `test-results/flowchart-branches.png`、`test-results/flowchart-loop.png` 已查看。
- `pnpm package:mac` 通过。从最终 DMG 安装到 `/Users/mac/Applications/FlowArk.app`，确认原应用未运行才更新；旧程序备份 `/private/tmp/flowark-shapes-upgrade-5_41h4nq/FlowArk-0.1.1.app`。测试采用独立数据目录，日常数据未改写。
- DMG `release/FlowArk-0.1.2-arm64.dmg`，SHA-256 `4b825bdb31a3a246e7ceed9781d4d59287d615b3d0b95cc7456ce8876588dc51`；zip `release/FlowArk-0.1.2-arm64-mac.zip`，SHA-256 `6b53caabc4d1ca7969e6aa609093328075f6fef29d20f12430d1b9514d4e91d5`。未签名、未公证、未正式发行。
- 客户端本地提交 `be2e99a`；公开远程推送仍待用户明确，未尝试绕过先前自动审批拒绝。无依赖变更、CI、外部网站操作或真实业务外发。

## 0.1.1 本地增量验证

- `pnpm check` 通过：类型检查、31 项单元测试与构建；`pnpm test:runtime` 13 项通过。新增真实 Worker 的工作簿填充 → ZIP → 产物登记、产物删除/符号链接替换、并发准入 FIFO、退出/计划停用阻止延迟入队、定时占用与重复触发、大时钟跳跃，以及实际宿主 SIGKILL 后脚本回收和活动/排队 Run 不重放。
- 工作簿测试分别核对原模板字节不变、填充值、样式、合并单元格、公式及其他工作表；ZIP 重新读取核对选定文件内容，越界/重复/目录/输出自身/外部符号链接拒绝，失败不覆盖已有输出。
- 桌面操作回归已验证通用编辑器切换模板填充/ZIP 生成 v2 节点，模板独立实例表单仍有效，右侧无招聘字段。确认待办方法曾遗漏在 Preload 白名单，已修复；实际安装版验证请求能到达宿主并正确拒绝未知记录，未执行真实发送。
- 准入修复提交 `579e251`；契约 0.3.0 提交 `a81f5fc` 和 tag `contracts-v0.3.0` 已推送治理仓库。客户端源码仍仅本地保存，公开远程推送审批待用户答复。
- 文件与桌面功能提交 `2a4f83a`，版本号修复 `8c3364c`。客户端 package.json 记录治理基线和契约采用版本；自有 Markdown 仍只有 README 与 CONTRIBUTING。
- 从 DMG 安装到 `/Users/mac/Applications/FlowArk.app`；保留旧版 `/private/tmp/flowark-upgrade-hkr2ymkc/FlowArk-0.1.0.app`。使用 `FLOWARK_PREVIOUS_EXECUTABLE` 指向旧版、`FLOWARK_TEST_EXECUTABLE` 指向新安装版运行 `pnpm test:install`：0.1.0 创建虚构凭据与成功 Run，0.1.1 在同一隔离目录重开保留历史及密钥状态，托盘和正常退出通过。证据 `test-results/install.json`，未修改日常用户数据。
- 修正侧栏版本号后重新生成并从最终 DMG 安装，安装版 `pnpm test:desktop` 再次通过：实际版本显示 0.1.1、JS/TS 执行、通用操作切换与模板配置；截图 `test-results/file-operations-editor.png` 已人工查看。
- 最终 DMG `release/FlowArk-0.1.1-arm64.dmg`，SHA-256 `d5e6a4e6759a7c0ccf195d09bc1315433d33bfec550de40b3cc26c03cb5ec8b0`；zip `release/FlowArk-0.1.1-arm64-mac.zip`，SHA-256 `1a9c2bf26d598b86ec536be229d4cacbf788cfb420d6501bd5464e335af10ee8`。未签名、未公证、未正式发布。
- 当前客户端提交 `8c3364c` 独立克隆到 `/private/tmp/flowark-clone-011-bh4ktio_/client`，无治理父目录；`pnpm install --frozen-lockfile --offline --ignore-scripts` 与 `pnpm check` 通过。没有把安装脚本跳过后的克隆称为 Electron 离线启动通过。
- macOS 偶发 Helper sandbox extension、task_policy_set 提示仍记录在日志；没有屏蔽或称其已经修复。升级和桌面行为断言均通过。没有真实 API Key、真实投递或发送。

以下环境检查表和交付散列记录 0.1.0 基线；C/J 矩阵结合本节增量证据更新。

## 环境与检查

macOS 27.0（26A428），arm64；Node 24.3.0，pnpm 10.14.0；Electron 44.4.1、React 19.3.0、TypeScript 7.0.2、playwright-core 1.63.0、selenium-webdriver 4.49.0、ExcelJS 4.4.0。精确依赖由 `pnpm-lock.yaml` 固定。

| 检查 | 实际结果与证据入口 |
| --- | --- |
| `pnpm typecheck` | 通过 |
| `pnpm test` | 24 项通过：Schema/引用/分支循环、加密恢复、IPC、模板、两家 AI 模拟、招聘动作策略、有限批次协调、确认/过期/未知结果/联系方式去重 |
| `pnpm build` | 通过；Monaco 大 chunk 警告保留 |
| `pnpm test:runtime` | 7 项通过：真实 Worker/脚本、FIFO/快照、取消、计划跳过、错误与进程丢失分类、凭据脱敏、暂停、SQLite 写入故障 |
| `pnpm test:browser` | 本机 Chrome 153.0.8010.48：指定路径、专用临时 Profile、空 Playwright 缓存；localhost DOM/输入/上传/回执/下载/关闭取消通过 |
| `pnpm test:scenario` | HTTP → 独立 TS → ExcelJS → 会话进程 → 本机 Chrome 上传 → 页面回执断言，9 个节点通过；服务器收到的工作簿数值另行核对 |
| `pnpm test:desktop` | 真实 Electron 窗口、sandbox/contextIsolation/nodeIntegration、SQLite、安全存储、React Flow、Monaco、保存并执行 JS/TS 通过 |
| `pnpm package:mac` | 输出 arm64 `.app` / zip / DMG；DMG 内部链接已修复并重建，签名、公证、正式发布尚未完成 |
| 独立克隆 | `/private/tmp/flowark-clone.emvmKx/client`，`git clone --no-local`；无治理父目录，`pnpm install --frozen-lockfile --offline --ignore-scripts` 后 `pnpm check` 通过。未在该克隆安装 Electron 或宣称离线桌面启动 |
| 安装后 `pnpm test:install` | 从 DMG 安装到 `/Users/mac/Applications/FlowArk.app`；首次启动、虚构 API Key 系统保护存储、最小流程、关闭隐藏托盘、正常退出、同目录重开后历史与密钥状态保留均通过 |

测试源码在 `tests/` 与 `scripts/*smoke*`。可再现的脱敏结果和截图写入被忽略的 `test-results/`，没有提交私人数据。最初联调发现 Selenium `http.js` 路径不存在导致会话进程退出，修正为实际包入口后完整场景通过；不能只用直接调用驱动的测试代替进程集成测试。

## C-01～C-16

| 编号 | 结果 | 已有证据 / 尚缺部分 |
| --- | --- | --- |
| C-01 | 部分 | 无平台的 HTTP/TS/Excel 上传场景通过；两站真实闭环未验证 |
| C-02 | 本地通过 | 顺序引用、真/假分支、空/多项循环、前向与越界引用拒绝 |
| C-03 | 本地通过 | 运行中改草稿不影响快照；计划保留原版本 |
| C-04 | 部分 | 脚本抛错/忙循环、执行 Worker 被杀、取消、浏览器关闭中断等待已测；真实网站浏览器崩溃后业务结果待测 |
| C-05 | 模拟通过 | 招聘协调丢回执落 UNKNOWN，不重复提交；真实站点回执未测 |
| C-06 | 部分 | 排队、运行、暂停、人工等待取消及资源槽重用通过；Safari 接管未测 |
| C-07 | 部分 | 0.1.1 实际宿主 SIGKILL 后脚本退出，活动与排队记录重开变 INTERRUPTED 且不重放；整机断电矩阵未测 |
| C-08 | 部分 | 退出/休眠间隙跳过、固定版本、占用、重复触发和停用时异步准入撤销已验证；长期实机调度未测 |
| C-09 | 部分 | 手动 FIFO、专用 Profile、会话租约；用户日常浏览器窗口未被测试工具操作，完整多会话实机矩阵未测 |
| C-10 | 部分 | 系统保护存储实际初始化；API Key 不返回 Renderer；事件/输出凭据脱敏、导出排除绑定。系统 Keychain 不可用的故障注入未测 |
| C-11 | 本地通过 | 不支持格式/能力、模板摘要篡改、作用域/依赖/浏览器路径及缺失绑定在执行前拒绝 |
| C-12 | 本地通过 | 主动 progress、真实节点/循环事件；无虚构总完成百分比 |
| C-13 | 部分 | 实际 SQLite query_only 写失败停止新任务并保留原数据；新版库拒绝打开。历史版本升级与磁盘满实机未测 |
| C-14 | 部分 | macOS arm64 从 DMG 实际安装、正常退出；0.1.0 → 0.1.1 同数据目录保留历史/密钥通过（SQLite 结构仍 v1）。真实两站与浏览器登录恢复、未来表结构迁移未测 |
| C-15 | 部分 | Chrome 身份/路径/版本检查、本地绑定、运行前重验；无自动回退。Firefox/Safari 未达支持承诺 |
| C-16 | 部分 | 包无额外自动化浏览器，依赖使用 playwright-core，空缓存下本机 Chrome 成功；完整断网安装环境和无浏览器目标机器未测 |

## J-01～J-14

| 编号 | 结果 | 说明 |
| --- | --- | --- |
| J-01 | 未验收 | 两站实际账号、网页版功能和资格未知；尚无经真实页面校准的 DOM 选择器 |
| J-02 | 未验收 | 没有真实筛选、简历投递或发送证据；不能由模板创建成功推导 |
| J-03 | 模拟部分通过 | 会话/草稿/确认/回执协调通过，生产站点读取及发送未实现 |
| J-04 | 本地通过 | 七类动作独立 deny/confirm/auto、绑定目标/账号/内容/简历/上下文 |
| J-05 | 模拟通过 | 无依据正文、联系信息、越权内容、模型错误进入待办，零发送 |
| J-06 | 模拟部分通过 | WAITING_PEER 与实际联系方式独立，真实原生请求/接受/拒绝入口未测 |
| J-07 | 本地通过 | 已知对方实际微信格式与来源、持久化可复制待办、同人同号跨职位去重；通知失败不丢待办。真实取得微信号未测 |
| J-08 | 本地部分通过 | 手机动作独立授权、分享值核对；站点手机号交换与归属未测 |
| J-09 | 模拟通过 | 丢回执 UNKNOWN、重复事件/再生成内容不能重发、配置/上下文变化阻止旧内容 |
| J-10 | 模拟通过 | 有限批次结束释放槽，待确认/等待对方持久化，重启不补发；真实两站连续运行未测 |
| J-11 | 模拟部分通过 | 错误账号阻止 AI/发送；真实验证码与会话变更识别尚未实现 |
| J-12 | 未验收 | 原生入口缺失尚待实测；未使用 App、私有接口或替代站点冒充 |
| J-13 | 模拟通过，实接未验收 | Codex Responses 与 DeepSeek Chat Completions 独立请求/完整草稿/错误处理通过；没有真实 API Key 实调，不依赖 Codex 登录态 |
| J-14 | 本地通过 | 两个模板独立实例、版本摘要校验、导入不运行、不继承权限/绑定，保存旧流程与快照；暂无模板差异合并 UI |

## 浏览器矩阵与剩余开发

| 系统 / 浏览器 | 当前证据 |
| --- | --- |
| macOS Chrome 153.0.8010.48 / playwright-core 1.63.0 | 本机 localhost 自动化与完整通用流程通过；招聘网站未验收 |
| macOS Firefox / geckodriver | `/Applications/Firefox.app` 不存在；适配路径存在，未启动验证 |
| macOS Safari 27.0 / 系统 safaridriver | 驱动版本可读取；显式原生服务路径已实现，未启用/启动会话，扫码、登录、验证码人工接管、上传均未验收 |
| Windows 360 安全 / 极速 / 极速 X | 均未验证，属于 P1.W |

后续仍需完成：两站生产页面适配与准确账号/目标/简历核对；完整城市/薪资筛选；真实 AI 调用；账号登录与验证码人工参与；真实业务分别授权后的验收；Firefox/Safari 兼容矩阵；未来数据库迁移升级与签名、公证。账号、API Key、人工验证和签名证书缺失不会被本地 mock 替代为通过。

## 0.1.0 交付标识（历史）

- 客户端实现提交 `e32c3f4e6a278fd59e75173aa6cc17b9eef4b69e`；打包修复提交 `6ab5f15`。当前只在本地提交，远程推送状态见下条。
- 已只读确认治理仓库 PRIVATE、客户端远程 PUBLIC。客户端完整源码推送被自动审批拒绝，等待用户选择改为私有后推送或确认继续公开；没有绕过拒绝、没有擅自更改仓库可见性。
- 契约 tag `contracts-v0.1.0` 与 `contracts-v0.2.0` 已推送到指定治理远程，0.2.0 发布提交 `342eabd`。
- 最终 DMG：`release/FlowArk-0.1.0-arm64.dmg`，SHA-256 `5b84d09856af6b6b0bc3922b18d9b941818264548a1051b029c813288032f56e`。
- zip：`release/FlowArk-0.1.0-arm64-mac.zip`，SHA-256 `f4fdd43a8e09d1e3f78e9d32e8b45cdd0fcae077a3b4b8390cea9ace788c7ebe`。
- 应用已安装并打开于 `/Users/mac/Applications/FlowArk.app`。测试使用独立临时数据目录；打开给用户的程序使用正常用户数据目录。

安装验证发现并修复：原生 DMG 暂存使用 Node 文件复制时把 Framework 相对链接改为绝对开发目录链接，安装后 ICU 资源定位失败；改用 `ditto`，打包及安装回归检查全部链接必须相对且留在 bundle 内，再从 DMG 安装和重开通过。另修复打包宿主中 esbuild 可执行文件必须指向 `app.asar.unpacked` 的路径问题，打包版实际 TS 执行已验证。未把开发目录运行成功当作安装成功。

本机 Electron 偶发输出 Helper Resources 的 sandbox extension 提示；界面、隔离选项、执行与正常退出检查通过，该系统提示未被屏蔽或宣称已解决。预览包使用默认 Electron 应用图标，正式品牌图标与签名分发仍待后续完善。

用户两项追加要求已验证：通用右侧面板没有招聘专属栏目，模板通过包内 Schema 打开独立实例表单；客户端自有 Markdown 只有 `README.md` 与 `CONTRIBUTING.md`，其余集中在本治理仓库 `docs/client/`。非招聘模板配置、表单摘要篡改拒绝和导入不继承自动权限均有单元回归，桌面回归实际填写并保存模板配置且没有创建新 Run。
