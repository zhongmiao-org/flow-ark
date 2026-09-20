# 开发预览验收记录

## 2026-09-20 内置网页桌面宽度：0.1.15

按用户要求，内置网页以 1920 CSS 像素宽度排版，通过 Chromium 原生页面缩放适配右侧面板；高度随可视区域换算。面板显示“桌面宽度 1920”，最小窗口的网页内容区保留 480 像素并收紧参数栏。导航后恢复缩放，收起/恢复和窗口调整不刷新网页或清空输入。公共契约 0.7.0、数据库和旧流程不变，采用治理 `3919077ba34ea83e63c78da677c57e5d9719c987`。

- `pnpm check` 通过类型检查、64 项单元和构建，`pnpm test:runtime` 20 项通过。
- 新增 `pnpm test:browser-viewport`：15 个场景检查首次面板未展开时导航、展开、原生输入框/单选点击、1040×700 / 1200×800 / 1380×900、收起/展开、最小化/恢复、第二次导航。实际 `innerWidth` 均为 1920，桌面媒体查询为真，原生边界与面板一致；除明确导航外会话 ID、页面起始时间及输入值保留，无意外 Run 或表单提交。
- `test:picker` 跨站嵌套 iframe、原生无悬停点击、偏移与页面缩放、失败时无点击、Shadow DOM 定位通过；`test:picker-lifecycle` 17 项关闭/恢复/导航/重建通过；`test:picker-ui` 的 13 步/12 种网页动作与 input/radio/checkbox/select 拾取通过；`test:editor-layout` 17 个布局与长流程场景通过。
- `test:embedded` 完整复杂表单回执、最小化执行、上传下载、取消与重开通过；`test:embedded-capture` 保留旧截图挂起与新视图重建竞争检查，取消后不登记迟到产物、隐藏绘制宿主不显示。原型设备模拟曾出现创建时原生崩溃、导航重置及 OOPIF 输入坐标差异，最终移除该路线并使用原生页面缩放；原生缩放下限通过最小面板内容区约束处理。
- `pnpm package:mac` 成功。只读 DMG 解出的候选应用通过 `test:browser-viewport`、`test:picker-ui`、`test:editor-layout`、`test:embedded`。最终 `/Users/mac/Applications/FlowArk.app` 路径以独立数据再次通过同样四组验证。全部测试使用隔离数据、内置浏览器和本地虚构表单。日志 `/private/tmp/flowark-0115-{check,runtime,viewport,picker,picker-lifecycle,picker-ui,layout,embedded,capture,package,candidate,installed}.log`。
- 客户端 [PR #12](https://github.com/zhongmiao-org/flow-ark-client/pull/12) 经 [CI 35487407123](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35487407123) Validate / Auto Merge 成功，实际合并提交 `16e550de41822d5688d2c4bea1587b88844de833`。治理设计 [PR #12](https://github.com/zhongmiao-org/flow-ark/pull/12) 与实现约束 [PR #13](https://github.com/zhongmiao-org/flow-ark/pull/13) 均先由 CI 自动合并。
- 安装包 `flow-ark-client/release/FlowArk-0.1.15-arm64.dmg`，SHA-256 `686ab99fa0f33e2dc9c7010a3d5e2b92977d6930e8074a1a5057fcbc7df535b2`。安装 `/Users/mac/Applications/FlowArk.app`，旧版备份 `/private/tmp/flowark-0115-delivery-af08d7nf/FlowArk-0.1.14.app`。候选与安装 app.asar 摘要一致：`33b17b56b82f8b5a11f0b35ca8b2832dfae1ebdb18cb50c73b20da2f831e5e28`，摘要 `/private/tmp/flowark-0115-delivery.json`。仍未签名/公证，默认图标。

- 日常客户端已重新打开，显示 0.1.15，原有 5 个流程与 0 个活动任务保留。重新进入“网页拾取练习”，原填写节点内容仍为“虚构拾取用户”；右侧打开 `http://127.0.0.1:4178/`，桌面工具整窗截图确认 PC 三栏表单、画布、动作库和参数栏同时可见，面板标明“桌面宽度 1920”。日常实例没有保存或运行新流程，也没有填写或提交表单。

固定桌面布局不等于所有 PC 网站均已兼容。BOSS/智联、真实 AI、外部浏览器和真实招聘业务未测试，P1 总体尚未完成。

## 2026-09-20 具体动作库与添加位置：0.1.14

对应[产品参考](product-reference.md)第二项。动作库直接添加 12 种网页操作，支持分类、中文或英文关键词搜索、键盘添加。搜索跨分类且显示“全部”；清空后恢复原分类。另保留数据、HTTP、脚本、文件、Excel、断言、条件、循环、人工节点。添加位置明确选择主流程末尾、条件分支或嵌套循环体；连续添加保持目标，目标删除后禁用添加并要求重新选择，避免静默落到主流程。上传文件绑定、目录内文件名和下载产物名可用表单配置。仅使用既有节点协议，公共契约 0.7.0、数据库和语义图形不变。

- `pnpm check` 通过类型、64 项单元和构建。`pnpm test:action-library` 验证分类、跨分类关键词、无结果状态、键盘添加、嵌套分支持久化、删除添加目标、重开恢复与无意外 Run。
- `pnpm test:picker-ui` 从空白草稿经新入口创建 13 步流程（12 种网页操作，单选/复选各一次），通过真实网页拾取 input/radio/checkbox/select，再用配置界面完成等待、读取文字、读取输入值、按键、点击、上传、下载和截图。保存重开后逐步执行，核对字段、增行结果、读取输出、上传文件文本、下载字节及 PNG；本场景没有提交表单。
- `pnpm test:editor-layout` 的 17 个尺寸、面板切换和长流程场景通过；`pnpm test:desktop` 的脚本/文件/Excel 编辑、持久化、语义图形与 Worker 回归通过。桌面旧脚本原先将导航/截图的框架输入框当作“显示但禁用”，且未展开高级定位；此次按现有界面改为检查入口不存在、编辑框架时主动展开，保留框架路径与重开断言后通过，未放宽实际结果检查。
- `pnpm package:mac` 成功。DMG 解出的候选应用、最终 `/Users/mac/Applications/FlowArk.app` 路径分别通过 `test:action-library`、`test:picker-ui`、`test:editor-layout`、`test:embedded` 四组验证。最后一组继续验证复杂表单提交回执、后台/最小化、上传下载、取消重开及故障处理。全部使用内置浏览器、独立临时数据和本地虚构表单。日志 `/private/tmp/flowark-0114-{check,actions,picker,layout,desktop,package,candidate,installed}.log`。
- 客户端 [PR #11](https://github.com/zhongmiao-org/flow-ark-client/pull/11) 经 [CI 35486217430](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35486217430) 的 Validate / Auto Merge 成功，实际合并提交 `bf9fdf9b033a078adfa275348f3b17ad784456d6`。CI 包含 `pnpm check` 和 `pnpm test:runtime`，不替代 macOS 图形验收；采用治理基线 `effac3a6f2c11c6191fa1c6a8749f9a6402ef72c`。
- 安装包 `flow-ark-client/release/FlowArk-0.1.14-arm64.dmg`，SHA-256 `8d51b72514673aaa151575a2c379bb080ecfb2984abef36e7e74948414c934dd`。旧应用备份 `/private/tmp/flowark-0114-delivery-97w44zkw/FlowArk-0.1.13.app`；候选与安装 app.asar 摘要一致：`dd8ea3ce5ec8c0da77d1e702b90173be508d8f826d4f0e3b0e759b8f205cc69b`。交付摘要 `/private/tmp/flowark-0114-delivery.json`；仍未签名/公证，默认图标。
- 日常桌面显示 0.1.14、原有 5 个流程和 0 个活动任务。打开“网页拾取练习”，搜索 `radio` 只显示勾选动作，清空后恢复动作列表；选中旧填写节点，配置仍为“虚构拾取用户”。右侧打开 `http://127.0.0.1:4178/`，整窗截图确认动作库、完整节点、参数和网页同屏正常显示。日常实例未添加或保存节点、未运行新任务或提交表单，保留该练习与网页供检查。

前后插入、复制、撤销及统一变量选择仍待实现。BOSS/智联真实业务、真实 AI、外部浏览器与 P1 总体验收状态不变。

## 2026-09-20 网页面板与编排布局：0.1.13

对应[产品参考](product-reference.md)的第一项。0.1.12 在隔离安装版展开右侧网页后，画布宽度从约 656 缩至 334 像素但沿用旧视口，同一回归明确失败；1040×700 窗口还存在横向溢出。固定尺寸投影使用的测量就绪状态在此次复现中始终为 false，原自动定位被跳过。0.1.13 改为视口就绪后按实际尺寸定位，尺寸变化优先保留选中步骤；单纯选择和参数修改不触发定位。窄窗口打开网页时将节点库改为顶部横向栏，最小窗口画布约 279 像素宽、主区域无横向溢出。节点语义、公共契约 0.7.0 和数据库不变。

- `pnpm check` 通过类型检查、64 项单元和构建；最终测试脚本的 `pnpm typecheck` 通过。初版测试存在 TS 回调序列化错误和空值类型检查错误，已修正后重跑；不将这些失败算作旧版产品缺陷。旧版正式失败为 `open-without-selection: null clipped horizontally`，日志 `/private/tmp/flowark-0113-layout-before.log`。
- 新增 `pnpm test:editor-layout`：17 个真实窗口布局场景通过，覆盖 1040×700、1200×800、1380×900、展开/收起、未保存内容和手动缩放保持、81 步长流程末尾选中节点、窄屏节点与分支添加。核对原生网页边界、会话 ID、页面起始时间、已填写内容、无意外 Run/提交及网页截图非空白。工作台截图与 WebContentsView 页面截图分别保存，日常整窗显示通过桌面工具另验。
- `pnpm test:picker-ui` 通过空白草稿的拾取、填写、保存重开及五步实际执行。`pnpm package:mac` 生成 DMG；从 DMG 提取的候选应用与最终安装路径分别通过 `test:editor-layout`、`test:picker-ui`、`test:embedded`。完整内置表单验证保留控件、上传下载、回执、最小化与故障处理检查，全部使用独立临时目录和本地虚构数据。日志 `/private/tmp/flowark-0113-{check,layout-final,picker-ui,package,candidate,installed}.log`。
- 客户端 [PR #10](https://github.com/zhongmiao-org/flow-ark-client/pull/10) 经 [CI 35485044425](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35485044425) 的 Validate / Auto Merge 成功，实际合并为 `7f48a15c188382856f4f9f4d8675f21ccf318555`。CI 包含 `pnpm check` 和 `pnpm test:runtime`，不替代 macOS 图形验收。采用治理基线 `61dab8ab51eb3fba44287165325a902f14a3f5c3`。
- 安装包 `flow-ark-client/release/FlowArk-0.1.13-arm64.dmg`，SHA-256 `c6ff5d4adc2df3d6fd7f2080bebdf3f6302129d83e54b2476886259f6ec14ece`。已升级 `/Users/mac/Applications/FlowArk.app`，旧应用备份 `/private/tmp/flowark-0113-delivery-s2dldu2g/FlowArk-0.1.12.app`。候选与安装 app.asar 一致：`442b3f7031595b5b7101c99fe8428b30cd25e37f08ff7837e1c34848694dee5b`。交付摘要 `/private/tmp/flowark-0113-delivery.json`；仍未签名/公证，默认图标。
- 日常应用显示 0.1.13、原有 5 个流程、0 个活动任务。打开原“网页拾取练习”，选择姓名填写节点，展开、收起再展开右侧 `http://127.0.0.1:4178/`；桌面整窗截图确认节点完整可见、配置仍为“虚构拾取用户”、真实表单正常绘制。日常实例未运行新流程、未改保存数据、未提交表单，保留编辑器和右侧网页供检查。

仅完成布局改进，动作搜索、直接动作入口、前后插入等仍待实现。BOSS/智联、真实 AI、外部浏览器与 P1 总体验收状态不变。

## 2026-09-20 后台截图清理与新网页显示：0.1.12

已在 0.1.11 安装应用的隔离数据中复现一种空白场景：后台截图的原生调用尚未返回时取消 Run，随后启动新流程、展开面板，新网页能读取到填写值，但原生视图 `getVisible()` 为 false、边界仍为初始化尺寸，而产品状态返回可见。原因是旧截图宿主对全部网页阻止布局，结束清理时又没有恢复新网页的布局。0.1.12 将截图宿主绑定具体视图，当前网页按实际父视图关闭，旧截图只清理自己的资源；公共契约 0.7.0 和数据库格式不变。此复现证明该竞态确实存在，不证明每次历史空白均出自同一原因。

- 新增 `pnpm test:embedded-capture`，通过完整应用、真实 Run 和内置本地表单延迟原生截图的异步返回。0.1.11 安装路径失败，修复后源码通过：旧截图待清理时新网页立即显示、可关闭，新截图不受旧清理影响，完成后移回面板，字段值保留且 PNG 非空白；取消的 Run 没有迟到产物或后续节点，页面提交次数 0，无额外可见窗口和未处理异常。
- `pnpm check`（类型、64 项单元、构建）、`pnpm test:runtime`（20 项进程）、`pnpm test:picker-lifecycle`（17 项）、`pnpm test:embedded` 通过。`pnpm test:picker` 首次在 125% 缩放跨站框架用例超时；诊断记录到原生输入被尚未更新的子框架路由到不同屏幕位置。测试增加等待所有框架像素比和绘制完成，不修改产品拾取逻辑、不放宽目标或点击拦截断言；有界 20 轮诊断和最终正式拾取套件通过。最终类型、变更文件 Prettier 与差异空白检查通过。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.12-arm64.dmg`，SHA-256 `92b66f1c80b1c63b92e713628566877ed1b465bd8c9cd99f0356e90ec23e590f`。从 DMG 解出的候选应用通过 `pnpm test:embedded-capture` 和 `pnpm test:embedded`，均使用隔离临时数据。客户端 [PR #9](https://github.com/zhongmiao-org/flow-ark-client/pull/9) 经 [CI 35483524785](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35483524785) 的 Validate / Auto Merge 成功，合并提交 `7b3989e07ab8691807b0d8275bc3272b7407e806`；采用治理基线 `310203b8a57787715f6608067aaf12ef860b9504`。
- 已安装 `/Users/mac/Applications/FlowArk.app`，旧 0.1.11 备份 `/private/tmp/flowark-0112-delivery-rgqu5c_a/FlowArk-0.1.11.app`。候选与安装 app.asar 摘要一致，为 `f8cebaffb0ceadc168e42d22cfcad51d3d58a9bfbe1638d42d69a4271c1901c7`。安装路径的 `pnpm test:embedded-capture`、`pnpm test:embedded`、`pnpm test:picker-ui` 全部退出码 0，使用隔离数据；日志为 `/private/tmp/flowark-0112-{candidate,installed}.log`，摘要为 `/private/tmp/flowark-0112-delivery.json`。仍未签名/公证，使用默认图标。
- 日常窗口显示 0.1.12、原有 5 个流程和 0 个活动任务。重新打开右侧 `http://127.0.0.1:4178/`，点击最小化并通过“窗口 → 显示工作台”恢复后，截图确认表单正常绘制；再次实际桌面点选姓名框返回“已选取 · 测试姓名 *”，保留原“虚构拾取用户”配置并保存。日常实例没有运行新流程或提交表单，停留在练习编辑器与右侧本地表单。
- 复现和检查日志：`/private/tmp/flowark-capture-installed-before.log`、`/private/tmp/flowark-paint-race-before.json`、`/private/tmp/flowark-0112-{check,runtime,embedded-capture,picker-lifecycle,embedded,picker}.log`；缩放诊断为 `/private/tmp/flowark-zoom-{repeated,rendered}.log`，正式复验为 `/private/tmp/flowark-0112-test-picker-final.log`。以上均只使用内置浏览器与虚构本地数据，招聘和真实 AI 本次未测试。

## 2026-09-20 静止光标点选修复：0.1.11

0.1.10 日常窗口中的“只聚焦、不返回目标”已在完整隔离应用通过同一桌面控制动作复现：检查模式已启用，但点击前没有鼠标移动，网页收到 mousedown/mouseup/click。Chromium 检查工具在没有悬停节点时会放行按下；原自动回归先移动再点击，因此未覆盖该触发条件。0.1.11 先拦截原生按下和对应抬起，清除旧悬停，再仅通过移动解析点击位置；不重放网页点击。跨进程框架由 Main 注入坐标转换，保留唯一定位和取消隔离，详见 [元素拾取](element-picker.md)。契约和数据库格式不变。

- `pnpm check`：类型检查、64 项单元及构建通过；`pnpm test:runtime`：20 项真实进程通过。`pnpm test:picker` 新增静止点击、旧悬停、视图偏移、125% 缩放、嵌套跨站框架及解析失败，记录 14 项目标证据；`pnpm test:picker-lifecycle` 17 项检查通过。`pnpm test:picker-ui`、`pnpm test:embedded`、`pnpm test:forms`、变更文件格式和差异空白检查通过。全部浏览器测试均为内置模式、本地虚构数据。
- 隔离完整应用的真实桌面点击在修复前失败、修复后返回“测试姓名 *”；修复后的网页 DOM 鼠标事件记录为空。证据为 `/private/tmp/flowark-picker-no-move-{before,after}.json`。测试中曾只等待主进程缩放设置而读取到旧布局坐标，改为等待网页实际像素比变化后通过，不将此测试时序问题记为产品修复。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.11-arm64.dmg`，SHA-256 `128b6f5adb933d1031be89e6abb5567aaf84daa1b2752874236acdd9c48e5f34`。从 DMG 解出的候选应用与安装路径分别通过 `pnpm test:picker-ui`、`pnpm test:embedded`，使用独立临时数据和 Profile，退出码均为 0。已安装 `/Users/mac/Applications/FlowArk.app`，旧 0.1.10 备份 `/private/tmp/flowark-0111-delivery-3w6ii2s2/FlowArk-0.1.10.app`；候选与安装 app.asar 摘要一致，为 `c36df39e43c66c88a6e2d8bbf63439f19068e3dcbdc12cb104ecece4f628268b`。仍未签名/公证，使用默认图标。
- 日常安装版界面确认 0.1.11、原有 5 个流程、0 个活动任务。打开“网页拾取练习”，在右侧本地表单点击同一姓名输入框，返回“已选取 · 测试姓名 *”，拾取本身保持字段为空、交互次数 0；原填写内容保留。保存并运行两步流程，Run `40380f8d` 的两个节点完成且状态为 `SUCCEEDED`，网页实际姓名为“虚构拾取用户”、交互次数 1，未提交表单。当前保留运行结果与右侧表单供检查。
- 客户端 [PR #8](https://github.com/zhongmiao-org/flow-ark-client/pull/8) 经 [CI 35482521407](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35482521407) 的 Validate / Auto Merge 成功，合并提交 `3180d53379a1c1299955aa7bcd85368c731b65b2`；采用治理基线 `440082a21aec5665e043289a7e91e9e6a553d60c`，契约仍为 0.7.0。本地日志 `/private/tmp/flowark-0111-{check,runtime,picker,lifecycle,picker-ui,embedded,forms,package,candidate,installed}.log`，安装摘要 `/private/tmp/flowark-0111-delivery.json`。

本节替代下方历史记录中的静止点击待定位状态。曾出现的日常会话网页空白仍未定位根因，不能将本次点选修复扩展为长期绘制问题已解决。BOSS/智联、真实 AI 和招聘业务本次未测试；P1 业务验收状态不变。

## 2026-09-20 拾取期间关闭网页的清理修复：0.1.10

真实 Electron 夹具在 `DOM.resolveNode` 解析期间关闭网页后，0.1.9 稳定产生未处理的“网页会话已关闭”。原因是底层命令在检查已关闭状态时同步抛错，绕过清理调用的 Promise catch。0.1.10 将命令错误统一转为 Promise rejection，不改变选择器、流程、IPC 或持久化格式，也不增加操作重试。

- `pnpm test:picker-lifecycle`：修复前首个关闭用例失败，修复后 17 项检查通过。包括解析期间关闭后重建、高亮延迟清理前关闭，以及三轮面板收起、窗口隐藏、最小化、导航、关闭重建；每次恢复均重新点选、填写、读取，并核对真实网页截图非空白，未提交表单。测试使用源码构建的隔离夹具，不代表安装包或无限期运行验收。
- `pnpm check` 的类型检查、63 项单元与构建通过，`pnpm test:runtime` 20 项真实进程通过。`pnpm test:picker`、`pnpm test:picker-ui`、`pnpm test:embedded`、`pnpm test:forms` 及变更文件格式检查通过；全部浏览器测试使用内置模式与本地虚构数据。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.10-arm64.dmg`，SHA-256 `9fb7b0b7fa87fd19d63a18e5ed4a8012fa29e323e3d47ccd52da16a3dbd6e2fa`。从 DMG 解出的候选应用与安装路径分别通过 `pnpm test:picker-ui`、`pnpm test:embedded`，全部退出码 0；数据和 Profile 为独立临时目录。已安装 `/Users/mac/Applications/FlowArk.app`，旧 0.1.9 备份 `/private/tmp/flowark-0110-delivery-loqaqec5/FlowArk-0.1.9.app`；候选与安装应用 app.asar 摘要一致，为 `f873a8a1675d580a589adb07007f4d84426849a90e04b77304401f26adbc4e76`。仍未签名/公证，使用默认图标。
- 客户端 [PR #7](https://github.com/zhongmiao-org/flow-ark-client/pull/7) 经 [CI 35480794656](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35480794656) 的 Validate / Auto Merge 成功，合并提交 `5b478b1ffc8bca0a3bff84a8793ccc42a7b2ce41`；采用治理基线 `f4a5769c2c45877b92493dbda5976572d07e33fc`，契约仍为 0.7.0。
- 本地日志：`/private/tmp/flowark-picker-lifecycle-before.log`、`/private/tmp/flowark-picker-lifecycle-cycles.log`，以及 `/private/tmp/flowark-0110-{check,runtime,picker,picker-ui,embedded,forms,package,candidate,installed}.log`；忽略目录证据为 `test-results/picker-lifecycle.json`。早期隐藏/恢复测试未等待 macOS 隐藏事件，修正测试等待后通过，不将该测试时序问题记录为产品修复。

升级后实际日常窗口显示 0.1.10、原有 5 个流程和 0 个活动任务，复杂表单在右侧正常绘制，原填写配置保留，“验证定位”返回唯一匹配。通过桌面控制点击网页时再次出现只聚焦输入框、不返回拾取结果，重新启用选取和移动指针后仍如此，已取消该请求。该现象发生在重开后，不能仅归因于长会话；自动回归的 WebContents 原生输入与桌面控制点击结果不同，原因仍未定位。不将自动测试通过或关闭异常修复描述为全部人工点选可用。当前停留在“网页拾取练习”编辑器和本地表单，无待运行任务、无表单提交。招聘与真实 AI 验收状态不变。

## 2026-09-20 元素拾取与可读动作配置：0.1.9

参考用户提供的影刀 6.0 演示，本次实现从右侧内置网页点选目标、可读目标名称、填写内容及原生下拉选项表单；CSS 与 iframe 路径放在高级编辑中，并可校验唯一匹配。公共契约保持 0.7.0，仅使用已有 selector/framePath/name，不保存网页输入值或整页 DOM。录制、AI 生成与在线模板商店不属于本次交付。

- 客户端 [PR #6](https://github.com/zhongmiao-org/flow-ark-client/pull/6) 已于 2026-09-18 经 [CI 35333793061](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35333793061) 的 Validate / Auto Merge 成功合并，提交 `821577acae1cc7f61605daae23104361ae8c52d4`；采用治理设计 [PR #4](https://github.com/zhongmiao-org/flow-ark/pull/4)，基线 `39c6b6dcbe69d27907b74a99fb986092cf02ab33`。
- `pnpm check`：类型检查、63 项单元测试、构建通过。`pnpm test:runtime`：20 项真实 Worker 测试通过，新增继续/单步前等待拾取消除，控制指令待消费时拒绝新拾取。
- `pnpm test:picker`：真实嵌套跨站 iframe、开放 Shadow DOM、特殊字符定位、结构定位提示、重复目标拒绝、密码和当前值不回传、下拉选项、Escape、旧请求、隐藏、执行前清理通过。跨站 OOPIF 用正式驱动同一路径的 CDP Input；顶层 UI 用 WebContents 原生输入。拾取不触发网页按钮，退出检查模式后正常操作只触发一次。
- `pnpm test:picker-ui` 从空白界面建立打开网页、填姓名、radio、checkbox、select 五个步骤；点选、保存、重开、逐步执行后实际值核对通过。`pnpm test:forms` 的复杂表单字段、上传字节、服务端回执、无效操作和拒绝不重发通过；`pnpm test:embedded` 的目录绑定、单步、最小化完整表单、取消重开、文件传输和网页崩溃处理通过；`pnpm test:embedded-isolation` 的网页隔离与会话回归通过。
- `pnpm package:mac` 已生成 `flow-ark-client/release/FlowArk-0.1.9-arm64.dmg`，SHA-256 `0a4868138e12b8d9d59d5d953eeee847610a569fe98c0f2d954c5952371ddd0e`。从 DMG 解出的候选应用与安装路径均分别通过 `pnpm test:picker-ui` 和 `pnpm test:embedded`，退出码均为 0，使用独立虚构数据。已安装 `/Users/mac/Applications/FlowArk.app`；旧 0.1.8 备份在 `/private/tmp/flowark-019-delivery-8nz_2_lj/FlowArk-0.1.8.app`。2026-09-20 再次核对安装包与候选包 app.asar 摘要一致，安装 Main 与当前构建逐字节一致。仍未签名/公证，使用默认图标。

人工核对过程保留异常：2026-09-18 日常窗口曾出现右侧空白，但同一版本隔离实例可以显示；2026-09-20 未改代码即观察到日常窗口正常显示。该长时间运行的日常会话还出现点击仅聚焦输入框、未返回拾取结果；正常退出并确认旧进程结束后，重开安装版再点选已返回“测试姓名 *”，保留“虚构拾取用户”配置。原生鼠标诊断实例也取得 `#full-name`，且页面 mousedown/mouseup/click 监听记录为空，证明确实拦截点击。未定位旧会话异常的根因，不宣称永久修复或完整长期稳定性通过。

2026-09-20 安装版人工交接：保留原有 4 个流程，另存两步“网页拾取练习”（本地网址 + 填写姓名），通过界面绑定内置浏览器。重开后在实际右侧网页点选姓名输入框，生成“填写 测试姓名 *”；保存后单步 Run `263a3e05`，两个节点输出与最终 `SUCCEEDED` 可见，右侧实际值为“虚构拾取用户”。本次练习没有提交表单。完整 107 步复杂表单仍保留，先前暂停 Run `b5478817` 在升级退出时明确取消，未自动续跑或重放。测试服务仍为 `http://127.0.0.1:4178/`，不是开机常驻服务。

本地证据：`/private/tmp/flowark-picker-{check-final,runtime-final,forms,embedded,adapter-final,ui-final,isolation,package,candidate,installed}.log`、`/private/tmp/flowark-native-probe.log`，客户端忽略目录 `test-results/picker-ui.json`。Markdown 继续只在治理仓库管理，客户端自有说明为 README / CONTRIBUTING。本次未测试招聘网站或调用真实 AI，P1 业务完成状态不变。



## 2026-09-18 目录绑定补丁：0.1.8

安装版人工导入复杂表单后发现，参数面板原来只显示固定 workspace，无法为模板中的 work 上传和回执目录完成配置。0.1.8 根据流程嵌套节点和上传引用列出目录名，选择 work 保留独立 workspace 值。契约和持久化格式不变。

`pnpm check` 的类型、61 项单元与构建通过；开发版 `pnpm test:embedded` 增加真实 UI 选择 work 目录、保存、核对 workspace 不变，再执行上一节完整内置表单回归，结果通过。DMG SHA-256 为 `d24327db671a9c8c1ccdbaf4773d130523fbfa6fcc06f9d729b8d6004e78c7f2`，路径 `flow-ark-client/release/FlowArk-0.1.8-arm64.dmg`；0.1.7 应用保留 `/private/tmp/flowark-018-delivery-7kp_ksrg/FlowArk-0.1.7.app`。从 DMG 安装到 `/Users/mac/Applications/FlowArk.app` 后，安装路径的完整 `pnpm test:embedded` 通过，包含实际 UI 目录绑定、单步、最小化、取消重开、文件传输与会话丢失；退出码 0。此前 0.1.6 → 0.1.7 已验证完整数据升级，0.1.8 不变更数据格式，实际日常数据中的 4 个流程保留。客户端 [PR #5](https://github.com/zhongmiao-org/flow-ark-client/pull/5) 的最终 [CI 35329645349](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35329645349) Validate / Auto Merge 成功，合并提交 `55d64087e7300d751d468b467ab46cd4b5a53f96`。首次因 GitHub 将创建/打标签时旧取消的同名检查视为必需检查而拒绝合并；更新安装证据后触发完整新检查，未手工合并或绕过分支保护。


安装版人工交接：复杂表单模板已通过系统文件选择器导入，绑定内置浏览器、`work=/private/tmp/flowark-form-lab`，使用虚构 `fictional.txt`；本机测试服务运行在 `http://127.0.0.1:4178`。逐步调试 Run `b5478817` 已执行 open，并在 fill_name 前暂停，实际画面确认左侧调试记录与右侧表单并列。服务和样本为本地临时测试资源，未配置开机常驻。未访问或执行招聘站点。

## 2026-09-18 右侧网页面板实现：0.1.7 主窗口右侧网页面板

客户端 [PR #4](https://github.com/zhongmiao-org/flow-ark-client/pull/4) 经 [CI 35328102149](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35328102149) 的 Validate、Auto Merge 成功后合并为 `a8e20c82d8f06d4c34c83e032761b1ff15d20dab`。采用治理基线 `ec7b432112ce3d3927a83b9db02301d3733e8077`（治理 PR #2），契约仍为 0.7.0。

- 右上角按钮在没有运行流程时也可展开网页面板，支持 HTTP(S) 地址、重新加载、收起。真实桌面人工核对同一窗口中的左侧工作台和右侧复杂表单，未再打开招聘网站；此前只读校准 Run 已取消。
- `pnpm check`：类型检查、60 项单元、构建通过；`pnpm test:runtime`：19 项真实 Worker 通过。`pnpm test:forms` 的 9 场景通过（浏览器校验、6 类禁止/无效操作、完整字段及字节核对、服务端拒绝无重复提交）。
- `pnpm test:browser`：原生内置适配器的跨源嵌套框架、清空输入、上传下载、严格定位与取消通过。`pnpm test:embedded-isolation`：网站无 Node/IPC/preload、后台计时、同面板新页面、非法本地 URL、非命令下载拒绝、Cookie 保留、重开下载通过。`pnpm test:scenario`：HTTP、脚本、Excel、框架上传/回执与取消通过。均为本机虚构数据；本机 Chrome/Firefox/Safari 本次未实测。
- `pnpm test:embedded`：UI 启用/展开、首步暂停、单步、最小化完整表单、取消后在最小化状态重建、上传和下载、恢复/隐藏、网页崩溃后结束人工等待并生成待办通过；没有新增可见窗口，应用正常退出。`pnpm test:desktop` 完整工作台回归通过。
- macOS arm64 DMG：`flow-ark-client/release/FlowArk-0.1.7-arm64.dmg`，SHA-256 `9861fa971ece33d9675997ee30538ccc3d7860a99be95bcb206c5d80298e5d62`。从 DMG 解出的应用通过 0.1.6 → 0.1.7 隔离数据升级，保留历史、受保护虚构凭据及原模板实例配置，托盘驻留与退出/重开通过。

0.1.7 已安装 `/Users/mac/Applications/FlowArk.app`，安装路径的 `pnpm test:embedded` 完整回归通过；旧应用备份 `/private/tmp/flowark-017-delivery-nn5mpgkb/FlowArk-0.1.6.app`。随后人工导入复杂表单时发现界面固定 workspace 目录的问题，0.1.8 跟进修复，下方检查证据保持对应版本。本地证据：客户端忽略目录 `test-results/{embedded-desktop,embedded-isolation,browser,form-lab,install}.json`；日志 `/private/tmp/flowark-panel-*.log`。Electron 44.4.1 / Chromium 152.0.7977.78。包仍未签名/公证，使用默认图标。

P1 业务尚未完成：BOSS/智联账号、真实投递、AI 回复与联系方式交换本次没有校准或执行；Codex 实接后置。模拟 suspend 测试不等同于硬件睡眠验收。0.1.6 Profile 保留，但不承诺自动迁移其登录 Cookie。详细边界见 [内置浏览器](embedded-browser.md)。

## 2026-09-17 源码首次公开提交与 CI 自动合并

用户明确确认客户端保持公开、治理仓库保持私有。客户端远程首次初始化仅写入空基线 `d1eed72`，全部源码随后经 `feat/client-initial` 的 [PR #2](https://github.com/zhongmiao-org/flow-ark-client/pull/2) 进入 main；`automerge` 标签保留，GitHub Actions 于 2026-09-17 15:15（Asia/Shanghai）完成 squash 合并，提交 `f4157d4ad3ea7ebb1f99737f7142518031ba7a30`。此前各节“仅本地提交、公开推送待确认”均为历史状态。

- [CI 35193545328](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35193545328) 的 `Validate` 与 `Auto Merge` 均通过；校验类型前缀分支和 Conventional Commits PR 标题，锁定依赖安装后执行 `pnpm check`、`pnpm test:runtime`。本地同样通过类型检查、59 项单元、构建及 18 项真实进程验证。
- main 要求 PR、最新必需检查 `Validate` 通过、分支与 main 同步及会话问题解决；管理员同样受约束，禁止强推和删除。自动合并使用当前 head SHA，核对非草稿、标签、head/base 与必需检查，不手工合并。
- 首轮 CI 的检查已通过，但自动合并使用总体 CLEAN 状态导致自身尚在运行时拒绝合并；已改为核对必需检查，22 个合并与命名门禁场景通过。旧 `codex/` 分支和 PR #1 已被类型前缀分支与 PR #2 替代并清理。
- 此次仅交付源码、贡献规则与 CI；未重新打包、安装、调用真实 AI 或执行招聘外发，不改变下方业务与浏览器验收边界。治理规范与本记录仍是治理仓库本地改动，未随客户端公开。

## 2026-09-17 最新交付：0.1.5 已安装，可逐步调试

本地提交 `7e97e42`，契约 0.7.0。最终类型检查、59 项单元、18 项真实进程通过；完整桌面、9 个复杂表单场景及真实 Electron/Chrome 的单步、继续、取消、重开后上传通过。调试不会修改既有快照或自动重放步骤，详情与日志见 [调试交付](debugging.md)。

最终 DMG 已生成，0.1.4 → 0.1.5 在隔离数据上保留历史、受保护的虚构凭据、既有模板全部配置与版本，托盘和正常退出通过。DMG 解出应用的完整桌面回归通过；备份旧应用后安装至 `/Users/mac/Applications/FlowArk.app`，安装路径的 `pnpm test:debug` 再次通过，退出码 0。旧应用保留 `/private/tmp/flowark-015-delivery-ls6ynztk/FlowArk-0.1.4.app`；未在日常数据上执行测试流程。

Chrome 153.0.8010.48 的原生下载恢复仍失败，0.1.5 对该组合在准入及驱动层拒绝自动下载；不是恢复问题已修复。此明确限制替代先前「暂缓全部 0.1.5 交付」的开发决定，以推进表单、上传与 BOSS 录入调试。招聘生产适配、真实外发、Codex、其他浏览器与正式签名发行均未据此完成。下方各小节为历史增量证据，安装状态以本节为准。

## 2026-09-17 当前增量：复杂表单与浏览器控件

本地表单实验室覆盖 input、radio、checkbox、单选/多选 select、日期、异步联动、自定义控件及文件上传，提供配套流程和虚构文件。契约 0.7.0 已发布，开发版通用浏览器面板新增选择、勾选、读取输入值和按键操作，旧流程不自动升级。

`pnpm check` 通过类型检查、56 项单元与构建；真实 Chrome 经运行宿主执行的 9 个表单场景通过预期断言，核对接收字段、上传字节和回执，错误操作阻止后续步骤，HTTP 422 未误报业务成功或自动重发。开发桌面配置保存/重开通过。完整命令、边界与报告见 [复杂表单实验室](form-lab.md)。仅验证开发版，安装仍为 0.1.4；Chrome 上传下载恢复及 P1 最终业务缺口不变。

## 2026-09-17 当前阶段：简单网站通用流程

按用户调整，先完善无需账号的简单网站操作；Codex 实调和最终招聘闭环后置，不作为当前前置条件。新增可导入的表单练习模板与 `pnpm test:simple-site`，在本机 Chrome 通过真实宿主完成填写、提交、回执、条件分支、Excel 与截图；缺失元素失败后没有执行后续节点，再次运行成功。类型检查、格式和构建通过，未重新宣称完整 54 项套件或上传下载恢复回归通过。见 [简单网站验证](simple-sites.md)。

安装仍为 0.1.4；本次仅增加示例和验证脚本，没有替换安装包。Chrome 上传下载恢复、长期运行及跨浏览器验证仍有缺口，P1 尚未完成。

## 2026-09-16 历史验证

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
| C-01 | 部分 | localhost 的 HTTP/TS/Excel 上传场景及 Selenium 公开测试网站的填写/回执/条件/Excel/截图通过；两站真实闭环后续验证 |
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

当前优先完善简单网站与 Chrome 恢复稳定性、长期运行及交付验证。后续仍需完成：两站生产页面适配与准确账号/目标/简历核对；城市/薪资筛选的真实页面取证；用户配置后的 Codex 实接与两家 Provider 在真实招聘上下文的验证；账号登录与验证码人工参与；真实业务分别授权后的验收；Firefox/Safari 兼容矩阵；未来数据库迁移升级与签名、公证。后置项不阻塞当前通用阶段，也不会被本地 mock 替代为通过。

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
