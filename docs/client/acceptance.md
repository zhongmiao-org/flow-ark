# 开发预览验收记录

日期：2026-09-16。证据包括客户端本地检查、真实进程、桌面窗口、localhost 虚构数据及基础交付后的两站公开页面只读探测；无真实投递、消息或联系方式交换。P1 尚未完成，不将预览包描述为招聘业务可用版本。

## 0.1.5 当前增量：DeepSeek 实接与只读入口

- 本机 Chrome 已读取 BOSS/智联公开页面及未登录入口，未登录账号或执行外发。真实账号、简历和会话校准仍未完成，生产适配器继续阻断；证据见 [只读页面校准](site-calibration.md)。
- 使用客户端已有 DeepSeek 配置和虚构事实实际调用 `deepseek-flash`。首次返回的 `needsHuman` 类型错误被拦截；补充 Schema 后的无依据正文同样被拦截；统一提示词与校验器的固定短语后，0.1.5 开发版完整草稿通过格式、上下文与事实校验，实际用量 804 tokens。三次调用均为代码调整后的显式验证，没有新增自动重试、转换错误字段或放宽正文规则，见 [AI 实接](ai-validation.md)。
- 最终 `pnpm check` 通过类型检查、54 项单元与构建；真实 API 经开发版 Main/宿主调用后正常退出。Codex 凭据未配置，真实请求尚未验证。已安装仍为 0.1.4，不含本次提示词修复；0.1.5 未打包安装。
- 提示词修复本地提交 `07c2b20`，未推送客户端公开远程。治理 Markdown 的 92 个本地链接、代码块及差异空白检查通过；客户端自有 Markdown 仍仅 README/CONTRIBUTING。

## 0.1.5 开发中：框架路径与会话清理

- 契约 0.6.0 `3629b4b` 及 `contracts-v0.6.0` 已推送私有治理仓库；客户端 `f555a15` 仅本地提交，公开推送授权状态不变。browser v2 提供最多 8 层的显式 CSS 框架路径，旧 v1、计划和快照不自动升级。细节见 [浏览器框架](browser-frames.md)。
- 通用编辑器可选择浏览器操作、目标元素和逐层 iframe 路径，保存重开保留 v2 与完整路径；页面导航和截图禁用并清空框架路径。开发目录 `pnpm test:desktop` 通过，已查看 `test-results/browser-frame-editor.png`；通用右侧无招聘字段。
- `pnpm check` 通过：类型检查、53 项单元测试、构建；`pnpm test:runtime` 16 项通过。新增协议/模板兼容、无效路径与顶层操作拒绝、Selenium 框架切换/复位/并发/超时模型及会话生命周期验证。Firefox/Safari 只验证了适配器模型，未宣称实机通过。
- 本机 Chrome 153.0.8010.48、playwright-core 1.63.0 的 `pnpm test:browser` 通过（headless、显式本机路径、空浏览器缓存、独立 Profile）：嵌套跨源读取/输入/点击/上传/下载，顶层同名元素隔离，缺失/重复/非框架/非法选择器拒绝，延迟框架、命令间替换重定位、命令内移除失败且不重放，以及关闭取消等待。证据 `test-results/browser.json`。
- 会话旧请求的延迟异常可能按绑定 ID 关闭新实例，针对性用例在修复前稳定失败，修复后通过。现按实例清理；关闭中的会话仍占用清理等待，新启动等待旧 Profile 释放，并重新检查取消信号。临时 trace 已撤回，不把另一个 Chrome 崩溃误记为该修复解决。
- **`pnpm test:scenario` 完整回归未通过，不交付 0.1.5 安装包。** 真实宿主 → Worker → 会话进程的首轮跨源框架上传、Excel B3=90、回执、顶层隔离和下载产物核对通过；缺失框架失败且零点击、框架等待取消且不执行后续点击均通过。但再次运行到下载时 Chrome 发生原生崩溃，Run 正确记录 FAILED，没有重放。分阶段证据 `test-results/scenario-frames.json`；最终日志 `/private/tmp/flowark-015-scenario-final.log`。
- 原生退出日志显示 Chrome SIGSEGV 在宿主发出关闭请求之前；macOS 报告 `Google Chrome-2026-09-16-190104.ips`，发生于 2026-09-16 19:01:02（UTC+8），EXC_BAD_ACCESS/KERN_INVALID_ADDRESS。脱敏摘要 `test-results/chrome-native-crash.json`。仅证明原生崩溃，尚未定位 Chrome 内部原因或证明所有触发条件。
- 对照：0.1.4 `b62c843` 的 Worker 在新 Profile 中连续两次顶层下载重开通过；0.1.5 的独立框架下载 → 只读重开 → 再下载通过。固定下载目录、将关闭等待从 2.5 秒增至 15 秒均未解决完整场景，实验全部撤回；没有更换浏览器、升级用户 Chrome、清空日常 Profile、弱化测试断言或自动重放。
- 进一步缩减：仅上传下载后关闭并重开同一测试 Profile 已复现，取消不是必要条件；绕开 FlowArk 引擎、宿主、Sessions 和适配器的纯 Playwright `frameLocator` / `contentFrame` 两组试验都出现关闭挂起与后续下载失败。内存文件上传、逐页关闭也未解决，均撤回。独立命令 `pnpm test:browser-recovery` 已实际执行且失败：第一轮 1.243 秒已保存并核对下载，随后关闭至 30 秒超时；第二轮只读与第三轮上传下载本次正常。两次服务器接收内容均正确，不能因后两轮成功忽略第一轮失败。证据 `test-results/browser-recovery.json`，日志 `/private/tmp/flowark015-browser-recovery.log`；复现范围见 [恢复缺口](browser-recovery.md)。
- 新回归脚本已本地提交 `44c5ab6`，类型检查、语法及格式检查通过；还原上传实验后的 `pnpm build` 通过，当前构建不包含被撤回的实验。治理 Markdown 的 83 个本地链接与代码块检查通过，客户端自有 Markdown 仍仅 README/CONTRIBUTING。此处没有重新宣称完整场景通过，也没有新增产品规避参数。
- 后续 Chrome 两轮正常关闭后，第三轮下载仍发生原生崩溃，排除强制回收为必要条件；系统报告 `Google Chrome-2026-09-16-192518.ips`，摘要 `test-results/chrome-clean-close-crash.json`。另取得挂起进程线程采样，尚未定位内部根因；没有新增浏览器规避参数。
- 凭据故障注入发现并修复解密后端 `ENOENT` 被误判为文件缺失、导致生成新数据密钥的问题。现在仅捕获读取文件本身的缺失错误，原密文和已有数据密钥均保留。`pnpm test:vault` 六项真实加密及注入检查通过，`pnpm check` 的类型检查、53 项单元和构建通过；开发目录 `pnpm test:desktop` 再次通过，覆盖主进程启动、加密存储、IPC、Worker 与编辑器。日志 `/private/tmp/flowark015-vault-before-retry.log`、`/private/tmp/flowark015-vault-after.log`、`/private/tmp/flowark015-vault-check.log` 和 `/private/tmp/flowark015-vault-desktop.log`。具体范围见 [凭据存储](credential-storage.md)。这是模拟后端故障，没有锁定或改动用户 Keychain。
- Safari 27.0 / 系统 safaridriver 22625.1.29.11.27 已尝试创建 localhost 测试会话，真实返回必须启用 Safari Developer 设置中的 `Allow remote automation`。零网页步骤执行，没有更改系统设置；证据 `test-results/safari-probe.json`。Firefox 应用仍不存在。
- 凭据修复本地提交 `4055064`，未推送客户端公开远程。治理 Markdown 的 86 个本地链接、代码块、差异空白检查通过；客户端自有 Markdown 仍仅 README/CONTRIBUTING。
- 独立克隆 `/private/tmp/flowark-clone-015-19uy2yto/client` 无治理父目录，使用 `pnpm install --frozen-lockfile --offline --ignore-scripts --store-dir /Users/mac/Library/pnpm/store` 后 `pnpm check` 通过（53 项测试）。首次使用默认临时缓存因缺包失败，指定已有缓存后成功；未安装或宣称在该克隆启动 Electron。契约 0.1.0～0.6.0 在临时目录重生成逐字节一致，客户端三份 Schema/示例摘要核对通过。
- 当前安装仍是 0.1.4，未打包、安装或宣称完整验收通过 0.1.5。上述框架回归仅使用 localhost，后续两站公开探测和 DeepSeek 实接见本文件开头。未执行真实招聘外发；C-04/C-06/C-09 的浏览器恢复范围仍有缺口。

## 0.1.4 招聘岗位筛选与证据核对

- 两个内置模板升级到 1.2.0，城市、包含公司、排除职位词、现场/混合/远程工作方式及人民币月薪范围均由模板 Schema 提供。通用右侧仍无招聘配置；已有实例不被升级或覆盖。旧策略没有 jobFilter 时维持原范围，模板导入不继承个人规则、账号或自动权限。
- AI 生成前核对岗位详情，提交前重新读取并核对；缺少页面证据、列表与详情不一致、未知薪资单位或条件不符均不自动发送。岗位证据/来源变化使旧确认失效，仅 observedAt 变化不重复要求确认。草稿缓存绑定稳定岗位证据；待办展示来源和已知字段，无效结构不转发为显示字段。规则变化不清空投递/简历/消息去重。
- 修复未发送 BLOCKED 动作因时段等临时限制而永久复用旧拒绝的问题；新批次可重新校验，失效确认不继承。首次详情读取被筛选拦截也会撤销已有确认；岗位恢复符合条件后必须重新确认，已在两站投递、简历和回复路径验证。已提交、明确失败或结果未知的动作仍不重试。
- 最终 `pnpm check` 通过：类型检查、47 项测试、构建；`pnpm test:runtime` 16 项通过。新增两站虚构适配器覆盖七类外发在不匹配/未知详情时 AI 和提交均为零、符合条件的投递和简历不重放、薪资完整区间与单位、确认后的证据变化、提交前复查、缓存失效和旧模板兼容。属于本地模拟验证，J-02/J-03 真实页面读取和业务回执尚未完成。
- 开发版和安装版 `pnpm test:desktop` 通过：两站模板的城市/公司/职位词/工作方式/月薪字段可填写、保存及重开，未新增 Run，通用右侧无业务字段。桌面检查发现并修正通用下拉框标签与选项混合的可访问名称问题；薪资开关对齐也已修正。安装版截图 `test-results/boss-resume-apply-filters.png` 已查看，智联截图为 `test-results/zhaopin-resume-apply-filters.png`。
- `pnpm package:mac` 输出最终 DMG，安装到 `/Users/mac/Applications/FlowArk.app`；安装前核实旧版未运行，备份 `/private/tmp/flowark-filters-upgrade-zpkx243h/FlowArk-0.1.3.app`。隔离数据的 `pnpm test:install` 验证 0.1.3 → 0.1.4 保留历史、受保护的虚构密钥、托盘和正常退出；旧模板实例完整记录逐字段相等，来源仍为 1.1.0，目录模板变为 1.2.0。证据 `test-results/install.json`；最终替换记录 `test-results/filters-install.json`，首次 0.1.4 构建另存 `/private/tmp/flowark-filters-final-u3e68pvg/FlowArk-0.1.4-first-build.app`。日常数据未改写。
- DMG `release/FlowArk-0.1.4-arm64.dmg`，SHA-256 `264e132d3ee6825d5ccd92689e908ee956124110b90a62172c3dcf017417745c`；zip `release/FlowArk-0.1.4-arm64-mac.zip`，SHA-256 `5af1561f0abe06937cf72d6ba3ce0e543beb94fc789d351740ba58697828258d`。未签名、未公证，保留默认 Electron 图标和已记录的系统/构建提示。
- 独立克隆 `/private/tmp/flowark-clone-014-jsft3xcj/client` 无治理父目录，`pnpm install --frozen-lockfile --offline --ignore-scripts` 及 `pnpm check` 通过（47 项测试）；未安装或宣称离线启动 Electron。契约生成器在临时目录复现 0.1.0～0.5.0 的全部已发布版本，Schema/示例/摘要逐字节一致。
- 契约 0.5.0 提交 `7f4a7c4` 和 `contracts-v0.5.0` 已推送私有治理仓库；客户端功能提交 `aeae285`、确认失效修复 `b62c843` 仅本地保存，最终包及安装/升级回归均基于 `b62c843`，公开远程推送仍待用户答复。详细 Markdown 继续集中管理，客户端自有文件仅 README/CONTRIBUTING。本次未打开招聘网站、未调用真实 AI、未执行真实外发。

## 0.1.3 本地脚本依赖与固定编译产物

- 新增脚本本地包目录绑定，读取 package.json 的名称和精确版本；静态打包 JS/TS、ESM/CommonJS、JSON 和已安装的传递依赖。脚本包不自动安装、下载或执行安装钩子，模板导入只产生未绑定草稿。编译边界见 [本地脚本依赖](script-dependencies.md)。
- 运行和保存计划前固定编译文件及摘要，修复旧预检重复写入相同节点文件的问题。当前 Run、排队 Run 和重启后的计划都复用原产物，重新保存计划才采纳依赖变化；每次脚本执行前核对摘要，丢失或损坏时阻止执行。
- `pnpm typecheck`、`pnpm test` 38 项与 `pnpm build` 通过；`pnpm test:runtime` 16 项通过。新增用例覆盖精确声明/模板清单、scope 子路径、Node 内置 CommonJS 引用、JSON、pnpm 风格符号链接、缺包/错误版本/未声明/动态/原生依赖拒绝、不回退客户端依赖，以及真实 Worker 的队列快照、修改同版本包内容、重开计划、产物删除/篡改零脚本副作用、旧计划兼容。
- 开发版与最终安装版 `pnpm test:desktop` 均通过：界面绑定虚构包、显示版本、实际脚本执行结果和运行清单通过；既有图形、Monaco、通用右侧及模板实例配置一起回归。已查看 `test-results/script-packages-editor.png`。
- `pnpm package:mac` 通过，最终 DMG 安装到 `/Users/mac/Applications/FlowArk.app`。安装前核实旧版未运行，0.1.2 备份在 `/private/tmp/flowark-dependencies-upgrade-mpe911bo/FlowArk-0.1.2.app`。安装版 `pnpm test:install` 在隔离数据目录验证 0.1.2 → 0.1.3：历史 Run、受系统保护的虚构密钥状态、托盘、正常退出与重开均保留；证据 `test-results/install.json`。未改写日常用户数据。
- DMG `release/FlowArk-0.1.3-arm64.dmg`，SHA-256 `4867c4e65f4bd74a9be582700b6f182f0cd7d08ad75c49ad6b631af29b5c703b`；zip `release/FlowArk-0.1.3-arm64-mac.zip`，SHA-256 `9df43bc9a8768839be828861740d0fac3703d8b54a5f93f986e3bd1837bfcba0`。未签名、未公证、默认 Electron 图标及已有 Helper/大 chunk/SQLite 提示仍保留；安装运行通过不等于正式发行。
- 契约 0.4.0 提交 `16e1351` 与 `contracts-v0.4.0` 已推送私有治理仓库；客户端 `be0abf3` 仅本地提交，公开远程仍待用户答复。客户端自有 Markdown 仍只有 README 与 CONTRIBUTING。没有真实招聘网站、AI API 或外发验证，不改变 P1 业务验收状态。
- 独立克隆 `/private/tmp/flowark-clone-013-v690r_35/client` 无治理父目录，`pnpm install --frozen-lockfile --offline --ignore-scripts` 与 `pnpm check` 通过（类型检查、38 项测试、构建）。没有在克隆中安装 Electron，不能将这项证据记为离线桌面启动。

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
| C-03 | 本地通过 | 运行中改草稿不影响快照；0.1.3 队列/计划固定脚本依赖，重开和目录删除不漂移；编译摘要异常阻止执行 |
| C-04 | 部分 | 脚本抛错/忙循环、执行 Worker 被杀、取消、浏览器关闭中断等待已测；真实网站浏览器崩溃后业务结果待测 |
| C-05 | 模拟通过 | 招聘协调丢回执落 UNKNOWN，不重复提交；真实站点回执未测 |
| C-06 | 部分 | 排队、运行、暂停、人工等待取消及资源槽重用通过；Safari 接管未测 |
| C-07 | 部分 | 0.1.1 实际宿主 SIGKILL 后脚本退出，活动与排队记录重开变 INTERRUPTED 且不重放；整机断电矩阵未测 |
| C-08 | 部分 | 退出/休眠间隙跳过、固定版本、占用、重复触发和停用时异步准入撤销已验证；长期实机调度未测 |
| C-09 | 部分 | 手动 FIFO、专用 Profile、会话租约；用户日常浏览器窗口未被测试工具操作，完整多会话实机矩阵未测 |
| C-10 | 部分 | 系统加密实测；不可用、加密拒绝、解密后端 ENOENT、损坏密文注入通过且不换钥；API Key 不返回 Renderer，事件/输出脱敏、导出排除绑定。未实际锁定系统 Keychain |
| C-11 | 本地通过 | 不支持格式/能力、模板摘要篡改、作用域/依赖/浏览器路径及缺失绑定在执行前拒绝 |
| C-12 | 本地通过 | 主动 progress、真实节点/循环事件；无虚构总完成百分比 |
| C-13 | 部分 | 实际 SQLite query_only 写失败停止新任务并保留原数据；新版库拒绝打开。历史版本升级与磁盘满实机未测 |
| C-14 | 部分 | macOS arm64 从 DMG 实际安装、正常退出；0.1.0 → 0.1.1 同数据目录保留历史/密钥通过（SQLite 结构仍 v1）。真实两站与浏览器登录恢复、未来表结构迁移未测 |
| C-15 | 部分 | Chrome 身份/路径/版本检查、本地绑定、运行前重验；无自动回退。Firefox/Safari 未达支持承诺 |
| C-16 | 部分 | 包无额外自动化浏览器，依赖使用 playwright-core，空缓存下本机 Chrome 成功；完整断网安装环境和无浏览器目标机器未测 |

## J-01～J-14

| 编号 | 结果 | 说明 |
| --- | --- | --- |
| J-01 | 部分探测，未验收 | 本机 Chrome 已读取两站公开首页及未登录入口，见 [页面校准](site-calibration.md)；实际账号身份、简历、会话及业务入口仍未知 |
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
| J-13 | 部分实接通过 | DeepSeek 真实请求与虚构事实下的完整草稿校验通过，真实无效输出被拦截；Codex 缺少配置未实调。真实招聘回复回执未验收，不依赖 Codex 登录态 |
| J-14 | 本地通过 | 两个模板独立实例、版本摘要校验、导入不运行、不继承权限/绑定，保存旧流程与快照；暂无模板差异合并 UI |

## 浏览器矩阵与剩余开发

| 系统 / 浏览器 | 当前证据 |
| --- | --- |
| macOS Chrome 153.0.8010.48 / playwright-core 1.63.0 | 原有 localhost 通用流程及单项框架操作通过；0.1.5 上传下载后关闭/重开恢复失败，尚未解决；招聘网站未验收 |
| macOS Firefox / geckodriver | `/Applications/Firefox.app` 不存在；适配路径存在，未启动验证 |
| macOS Safari 27.0 / 系统 safaridriver | 已实际尝试建立本地会话，因未启用 Allow remote automation 被拒绝，零网页操作；未更改系统设置。扫码、登录、验证码人工接管、上传均未验收 |
| Windows 360 安全 / 极速 / 极速 X | 均未验证，属于 P1.W |

后续仍需完成：两站生产页面适配与准确账号/目标/简历核对；城市/薪资筛选的真实页面取证；Codex 实接与两家 Provider 在真实招聘上下文的验证；账号登录与验证码人工参与；真实业务分别授权后的验收；Firefox/Safari 兼容矩阵；未来数据库迁移升级与签名、公证。账号、API Key、人工验证和签名证书缺失不会被本地 mock 替代为通过。

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
