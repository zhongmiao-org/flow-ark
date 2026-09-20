# 开发预览验收记录

## 2026-09-20 日常安装与真实桌面调试：0.1.23

本节补齐上一节的日常安装缺口。重新使用桌面工具检查时，Mac 已可操作；升级前核对 0.1.16 的 6 个流程、0 个活动任务，无本机计划，原两步“网页拾取练习”及“虚构拾取用户”内容保留。通过应用菜单正常退出后，进程检查确认日常应用停止，再执行备份和替换。

- 已安装 `/Users/mac/Applications/FlowArk.app`，Info.plist 与实际日常窗口均显示 0.1.23，代码沿用客户端 `a6c7d04a3d11d867039f50cd2bb7fce4b018b285`。DMG 与 SHA-256 沿用上一节，安装内容的 app.asar 摘要与已验收候选一致，没有重新构建。
- 旧应用备份为 `/private/tmp/flowark-0123-delivery-y8zwx3kj/FlowArk-0.1.16.app`；加密用户数据备份为 `/private/tmp/flowark-0123-delivery-y8zwx3kj/daily-data-before-upgrade`。安装前后 SQLite 文件和 data-key.enc 摘要一致；日常重开并展开内置网页后，只读比较确认 6 个流程、4 条既有 Run、快照及 40 条事件的加密记录保留，数据密钥不变、数据库仍 v1。22 条文档中仅 embedded 浏览器绑定由打开面板时的既有 enable 调用重写；未把随机密文变化误报为业务数据丢失。比较不解密或输出业务值。
- 最终安装路径通过 `test:run-history`、`test:artifact-cleanup`、`test:browser-viewport`、`test:embedded` 四组回归；使用独立临时数据与内置复杂表单。日志 `/private/tmp/flowark-0123-installed.log`。
- `FLOWARK_PREVIOUS_EXECUTABLE` 指向备份的 0.1.16，`FLOWARK_TEST_EXECUTABLE` 指向最终 0.1.23，实际执行 `pnpm test:install`：旧版创建虚构凭据、模板实例和成功运行，新版在同一隔离数据目录重开，记录与实例配置/权限保持，密钥不返回 Renderer；两版均验证关闭窗口进入托盘、恢复显示和正常退出。模板只在本地创建，未访问招聘站点或真实 API。日志 `/private/tmp/flowark-0123-upgrade.log`，机器可读结果在客户端忽略的 `test-results/install.json`。
- 安装脚本首次在写入前遇到系统 Python 缺少 hashlib.file_digest；改用兼容的分块摘要后完成。初次失败没有创建备份或替换应用，未通过删除数据绕过检查。旧版隔离启动有 sandbox_extension_issue_file 诊断，应用实际启动、运行、托盘和正常退出断言均通过；不将它描述为操作系统隔离能力验收。
- 日常真实窗口通过右上角按钮重新显示 `http://127.0.0.1:4178/`，整窗截图确认画布、通用参数和 PC 三栏表单同时可见，面板标明桌面宽度 1920。新参数编辑器正确展示原填写值；历史页显示原 4 条记录及搜索、状态/来源筛选入口。
- 随后从日常窗口明确启动原两步练习的逐步调试，运行 `72d69953-f6d3-4e3f-8523-d7a5c52bf91d` 在首步前暂停；单步打开表单，再停到填写步骤；第二次单步后执行完成，网页姓名实际为“虚构拾取用户”，步骤输出 filled=true，表单仍显示尚未提交。保留此次第 5 条 Run 作为调试证据，没有改写流程内容、访问招聘站点或发送业务消息。最终窗口停留在完成详情与右侧本地表单。

日常安装阻塞已解除。本轮不新增源码、公共契约或数据库迁移；仍不能标记完整 P1：两站生产适配器当前明确拒绝未校准操作，Codex 实接与真实招聘按用户要求后置，外部浏览器和完整业务矩阵继续未验收。

## 2026-09-20 运行历史分页与完整状态：0.1.23

落实[运行历史](run-history.md)。新增按写入顺序的分页、名称/ID 字面量搜索、状态/来源筛选，每页 25/50/100 条；旧记录可进入详情并继续使用显式产物清理。首次查询固定记录边界，较早页面不会被新增 Run 挤动；状态按请求时的当前值筛选。bootstrap 保留原最近 200 条 runs，并新增从完整记录生成的活动、队列和各流程最近结果，界面不再用截断列表判断运行槽。

- `pnpm check` 的类型、95 项单元与构建通过。新增四项真实 SQLite 验证覆盖 503 条相同时间戳、跨页插入九条记录、状态更新、关闭重开、事务回滚、字面量匹配、组合筛选、无效/不匹配游标和分块扫描让出事件循环。首次类型检查发现新增测试把 value 节点误写为 data，改为现有协议后通过，未改变节点契约。
- 固定构建后 `pnpm test:runtime` 的 28 项真实 Worker 通过。新增实际等待人工并再排队 205 次：原 bootstrap.runs 窗口看不到活动 Run，但 runOverview 仍返回该 Run、205 条队列、207 条总数及更早另一流程的成功结果；精确 ID 搜索和详情读取可访问旧输出。没有以数据库样例冒充这些真实执行。
- `test:run-history` 在隔离 Electron 中先真实生成文件产物，停止应用后写入 257 条同时间样例用于列表压力，再重开并真实运行第二次。通过三页记录、期间新增不挤动旧页、详情返回保留页码、组合筛选/无结果、较早产物清理及重开后的已清理状态；原业务文件和另一 Run 的副本保留。257 条样例仅用于展示验证，没有执行其标注的业务。
- 使用测试 IPC 回复延迟验证三种竞态：离开详情后的旧轮询不重新打开详情；旧搜索不覆盖新筛选；读取旧 Run 期间修改搜索不打开过期详情。实际宿主请求及持久化仍使用产品处理器，延迟只注入隔离测试实例的返回阶段。
- 加强界面断言为完整 ID 后，发现测试在页码更新但旧行尚未清空时过早读取；翻页/筛选现在立即清空旧结果并禁用翻页，测试等到目标完整 ID 再断言。修正后源码与候选均通过。1040×700 下筛选区和历史容器不溢出，宽表格自身横向滚动；内置表单实际 URL、input 控件与 1920 CSS 像素宽度均核对，不用工作台截图中的原生网页留白判断网页绘制。
- 源码 `test:artifact-cleanup` 通过；只读 DMG 候选依次通过 `test:run-history`、`test:artifact-cleanup`、`test:browser-viewport`、`test:embedded`。15 个视口场景保持 1920 CSS 像素，覆盖首次后台导航、三种尺寸、原生输入/单选、收起恢复、最小化和导航；完整复杂表单继续核对回执、上传下载、截图、取消与重开。全程只有内置网页与本地虚构数据。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.23-arm64.dmg`，SHA-256 `70998d69d02f98b3864790b5c3d7f2ef48efe0ff6e6305c336d73782ea8ea701`。只读候选 `/private/tmp/flowark-0123-delivery-y8zwx3kj/FlowArk.app`，摘要 `/private/tmp/flowark-0123-delivery.json`；未签名/公证，默认图标。候选历史数据 `/private/tmp/flowark-run-history-ui-odvfPU`，工作台截图与 JSON 在客户端忽略的 test-results；日志 `/private/tmp/flowark-0123-{check,runtime,history-ui,cleanup-ui,package,candidate}.log`。
- 只读核对日常 `/Users/mac/Applications/FlowArk.app` 仍为 0.1.16；未替换应用、修改日常数据或创建摘要中规划的备份。最终安装与日常整窗验收仍等待先前 Mac 解锁确认。
- 客户端 [PR #20](https://github.com/zhongmiao-org/flow-ark-client/pull/20) 经 [CI 35496028554](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35496028554) Validate 与 Auto Merge 成功，实际合并提交 `a6c7d04a3d11d867039f50cd2bb7fce4b018b285`；客户端 main 已同步且干净。
- 采用治理 [PR #29](https://github.com/zhongmiao-org/flow-ark/pull/29) 的实际合并基线 `44ec75bf473de8bda2d8f8ef5f3340bad97ebb3b`，其 [CI 35495228118](https://github.com/zhongmiao-org/flow-ark/actions/runs/35495228118) 检查和自动合并成功。公共契约 0.7.0、Run 状态、SQLite 表结构与加密格式不变；既有记录无迁移。

200 条历史访问及概览截断缺口已补齐。本轮没有建立全文索引，稀疏筛选最坏仍扫描完整历史，bootstrap 仍完整解密计算概览；不宣称海量历史性能已验收。真实招聘、真实 AI、外部浏览器、最终安装与 P1 总体验收继续保留原状态。

## 2026-09-20 运行产物清理预览：0.1.22

落实[产物清理](artifact-cleanup.md)。运行详情新增只读预览和勾选确认，清理范围为本次应用产物目录，包括副本和中间文件；目录外的原业务文件、其他 Run、运行终态、快照、产物索引、事件、待办与外发去重记录保留。活动、收尾、并发、异常目录、跨 Run 旧引用和过期预览被拒绝。默认保留全部，不自动按时间删除。

- `pnpm check` 的类型、91 项单元与构建通过。新增五项宿主/文件专项使用真实 SQLite 与文件系统，覆盖预览无副作用、旧外部记录、内外链接、同名副本、100 条名称上限与完整计数、状态变化、并发、清理后重开及已清理索引不能被同路径新文件复活。新增测试最初有两处可选返回值的类型声明错误，修正后通过，未放宽行为断言。
- 最终固定构建下 `pnpm test:runtime` 的 27 项真实 Worker 通过。新增等待人工时拒绝清理、完成后清理、后续 Run 和业务输出保留、重开后的历史/快照/产物状态核对；取消后真实副本已完成但能力调用迟到时，Run 虽终止仍拒绝清理，收尾结束才允许预览。宿主为每个 Run 跟踪仍在执行的能力请求。
- 清理前真实 SQLite query_only 写入失败时没有删除文件；受控注入部分删除与完成事务失败，分别核对未完成状态、索引回滚、意图保留与显式重试。pending 记录重开转为 interrupted，不自动继续删除；完成事务不能保存时界面不假报成功。注入故障不作为真实磁盘满或整机断电验收。
- `test:artifact-cleanup` 在真实 Electron 和内置复杂表单中运行文件写入、上传、下载、截图与等待人工。运行中按钮禁用、宿主拒绝；预览取消后文件不变，预览后新增文件使确认失效并清空核对勾选。重新确认后删除 6 个应用内文件，另一条 WAITING_INPUT 的运行及其副本保持有效，原业务输出内容保留，Run 历史只追加清理事件；后续继续第二条运行成功。
- 同一界面测试验证 1040×700 右侧面板、1920 CSS 像素网页宽度、清理列表无横向溢出、重开后已清理状态与禁用定位、零剩余文件提示。工作台截图仅核对清理区域；原生网页另通过其实际 innerWidth、上传文件和产物字节核对，不把工作台截图中的网页留白当成原生页面绘制证据。没有提交表单或访问招聘站点。
- 一次与 `package:mac` 并行的运行回归出现 FIFO 等待超时（26/27）；构建脚本会删除并重建 dist，存在共享执行文件竞争。已改为固定构建后顺序运行，27/27 通过，并在 FIFO 测试中增加失败终态诊断。原失败日志 `/private/tmp/flowark-0122-runtime.log` 保留，最终结果见 `/private/tmp/flowark-0122-runtime-stable-build.log`；并发构建为已确认的测试执行风险，单次失败没有保存足以独立断定根因的 Worker 诊断。
- 源码清理与产物历史界面通过；最终只读 DMG 候选通过 `test:artifact-cleanup`、`test:artifact-history`、`test:embedded` 三组，包含旧记录、完整复杂表单回执、最小化、上传下载、截图、取消与重开。候选清理数据 `/private/tmp/flowark-artifact-cleanup-ui-UL6JVO`，日志 `/private/tmp/flowark-0122-{check,typecheck,cleanup-ui,history,package,candidate}.log`。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.22-arm64.dmg`，SHA-256 `79b9e4d6401618c159066a4259aa93497138fdad4f1255bed5df7f62b86c5f85`。候选 `/private/tmp/flowark-0122-delivery-jbya8xzx/FlowArk.app`，摘要 `/private/tmp/flowark-0122-delivery.json`；未签名/公证，默认图标。工作台证据在客户端忽略的 `test-results/artifact-cleanup-preview.png` 与 JSON。
- 只读核对日常 `/Users/mac/Applications/FlowArk.app` 仍为 0.1.16，本次未替换应用、未创建摘要中规划的备份或修改日常数据。最终安装和日常整窗验收仍等待先前 Mac 解锁确认。
- 客户端 [PR #19](https://github.com/zhongmiao-org/flow-ark-client/pull/19) 经 [CI 35494586511](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35494586511) 检查并自动合并，实际合并提交 `470f353568131abd83b12e219ef20a97b6b916d3`。
- 采用治理 [PR #27](https://github.com/zhongmiao-org/flow-ark/pull/27) 的实际合并基线 `335327ee362900941ed9ced14a416c41e27089e6`。公共契约 0.7.0 与 ArtifactRef 不变；清理记录使用既有文档存储，无表结构迁移，旧产物索引保留。

历史列表当前仍只有最近 200 条的入口，需要后续补齐更早记录访问，不能将本次当成完整历史管理验收。真实招聘、AI、外部浏览器、最终安装与 P1 总体验收仍未完成。

## 2026-09-20 运行产物副本与完整性：0.1.21

落实[产物副本约定](artifact-snapshots.md)。在 0.1.20 真实 Worker 中复现两次运行覆盖 result.txt 后，旧 Run 仍成功但历史产物读到新内容。现在每次登记按 Run/产物 ID 保存独立副本和 SHA-256；业务源文件保持原位，同 Run 重复名称也互不覆盖。复制完成和取消复查后，索引与事件在单一 SQLite 事务中提交；失败清理未发布副本，保留业务输出，不重放文件动作。

- `pnpm check` 的类型、86 项单元和构建通过。三项新增单元覆盖同名独立文件、来源删除、同长度改动使缓存失效、定位强制复验、缺失/符号链接、旧格式、预先取消、复制中取消、复制期间来源变化和失败清理。最后列表排版调整后类型检查与打包构建再次通过。
- `pnpm test:runtime` 的 26 项真实 Worker 验证通过。新增跨 Run/同 Run 同名副本、删除源文件与宿主重开、旧格式当前文件兼容、同长度篡改；登记事件故障回滚索引，真实复制完成后受控延迟返回，再取消 Run，确认不登记迟到产物、无后续节点，源文件仍保留。更新原 Excel/ZIP 场景，明确删除源文件不会让历史副本失效，删除或符号链接替换副本则拒绝定位。
- `test:artifact-history` 在真实 Electron 中核对“已保存副本”“副本内容已改动”“旧记录，未保存副本”以及缺失状态；新旧定位按钮经真实 IPC 与宿主返回相应路径，损坏与缺失被拒绝、按钮禁用、Run 成功历史保持。旧记录在停止的隔离测试库按旧格式准备，不访问日常数据；系统 `showItemInFolder` 被测试拦截，只核对参数，不视为 Finder 人工验收。
- 新界面验收脚本首次在旧记录准备时遇到测试上下文不支持动态 import，改由测试进程读取自身临时密文并使用 Electron 系统解密，修复后通过；没有放宽产品断言。截图发现长路径挤窄按钮，随后把名称、状态、路径分行，按钮保持单行，候选截图已核对。
- 源码与只读 DMG 候选均通过 `test:artifact-history`、`test:resource-editor`、`test:embedded`。资源流程继续核对真实 HTTP、文件字节、ZIP、Excel 与内置上传；复杂表单继续核对回执、最小化执行、上传下载、截图、取消与重开。全部使用隔离虚构数据、本地服务和内置网页。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.21-arm64.dmg`，SHA-256 `db226898a8f9cd57065567e76112bd8c068665a7714145353d034cb06bb3ef04`。只读候选 `/private/tmp/flowark-0121-delivery-fkt2tu1_/FlowArk.app`，摘要 `/private/tmp/flowark-0121-delivery.json`；未签名/公证，默认图标。日志 `/private/tmp/flowark-0121-{check,runtime,history,resources,embedded,typecheck,package,candidate}.log`；候选历史界面证据在客户端忽略的 `test-results/artifact-history.png` 与 JSON。
- 再次只读核对 `/Users/mac/Applications/FlowArk.app` 仍为 0.1.16；本次未替换日常安装，也未创建摘要内规划的备份。先前 Mac 解锁确认未收到，最终安装路径和日常整窗验收待完成。
- 客户端 [PR #18](https://github.com/zhongmiao-org/flow-ark-client/pull/18) 经 [CI 35493218243](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35493218243) Validate / Auto Merge 成功，实际合并提交 `d3fc014c9815b3136f76bc9e62e0dd186b9cff4c`。
- 采用治理 [PR #25](https://github.com/zhongmiao-org/flow-ark/pull/25) 的实际合并基线 `9f094a6682e91195dda338ccc20aa5dddf74df2b`。公共契约 0.7.0 与 ArtifactRef 不变；元数据增加 storage/sha256，run.detail 增加 integrity，无数据库表结构迁移。旧数据不补造历史副本。

副本当前不自动清理，按 Run 的历史清理交互仍未交付。真实招聘、真实 AI、外部浏览器与 P1 总体验收仍未完成；摘要校验不宣称能抵御恶意本机程序或文件系统竞争。

## 2026-09-20 上传资源预检与执行边界：0.1.20

落实[上传资源检查](upload-resources.md)。在 0.1.19 宿主实际复现：只有 browser upload 使用的未绑定目录仍通过预检。现在字面量和流程参数可确定的上传目录必须绑定且为有效目录，嵌套分支/循环同样检查，已知文件名先验证目录范围；文件存在性留到上传边界，允许前序步骤生成文件。参数引用目录也显示在“参数与绑定”。动态来源执行时重新检查描述、目录范围、普通文件和可读性，失败不调用驱动或重试。

- `pnpm check` 的类型、83 项单元与构建通过。新增三项验证参数整体/字段引用、参数对象不递归执行内嵌引用、动态来源延后、未完成草稿的目录发现，以及缺失/目录/不可读文件、内外符号链接与未来文件的路径检查。最初测试有联合类型与回调类型收窄错误，修正测试声明后通过，没有产品行为改动或放宽断言。
- `pnpm test:runtime` 的 23 项真实 Worker 验证通过。新增两个场景覆盖八种准入错误（目录未绑定、参数引用目录、非目录/失效路径、越界名称、非法描述），确认没有 Run/快照/计划或前置文件副作用；先写文件再上传允许通过，并在驱动边界核对生成字节。
- 动态上传的缺失绑定、缺失文件、目录、越界符号链接、错误类型分别失败；暂停后删除文件也失败。排队期间删除目录时，启动预检失败且没有 node-start。使用受控驱动调用计数确认这些错误都未到达上传驱动，没有自动重试；该部分不作为真实浏览器兼容证明。
- `test:resource-editor` 经真实 Electron 界面配置参数 `{binding:uploads,name:source.txt}` 并引用；未绑定上传目录时点击运行明确报错，Run 数为零，HTTP 服务未收到请求，前置 source.txt 未生成。随后通过界面发现并绑定 uploads 目录，保存重开后完成 13 步 HTTP/文件/ZIP/Excel/内置上传流程，核对网页读取文件内容及原资源断言。执行前文件尚不存在，证明未阻止正常的前序生成场景。
- `pnpm package:mac` 生成 `flow-ark-client/release/FlowArk-0.1.20-arm64.dmg`，SHA-256 `957668c806d1ea563656e42aeec8352ce45f7767d268002f2e89c0497db17743`；只读候选 `/private/tmp/flowark-0120-delivery-p1j9gzaz/FlowArk.app`，摘要 `/private/tmp/flowark-0120-delivery.json`。包未签名/公证，默认图标。
- 只读 DMG 候选通过 `test:resource-editor`、`test:picker-ui`、`test:embedded` 三组验收，包括 12 种网页动作、复杂表单回执、上传下载、最小化、取消与重开。全部使用隔离虚构数据、本地服务与内置浏览器。日志 `/private/tmp/flowark-0120-{check,runtime,resources,typecheck,package,candidate}.log`。
- 再次只读确认 `/Users/mac/Applications/FlowArk.app` 为 0.1.16；本轮未替换日常应用、未创建规划备份或修改日常数据。最终安装与日常整窗验收仍待用户解锁。
- 客户端 [PR #17](https://github.com/zhongmiao-org/flow-ark-client/pull/17) 经 [CI 35492130269](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35492130269) Validate / Auto Merge 成功，实际合并提交 `7a50ac46712aa2b24077f5c47e6d8c6b32b6cdc3`。
- 采用治理 [PR #23](https://github.com/zhongmiao-org/flow-ark/pull/23) 的实际合并基线 `0760d36300c6afdbba82d3a6ab5f60195b87181b`。契约 0.7.0、IPC、数据库和快照格式不变，旧数据不改写。

日常升级仍待先前 Mac 解锁请求的回复。真实招聘、AI、外部浏览器与 P1 总体验收仍未完成；本次不声明文件路径检查能消除操作系统竞争或隔离恶意可信脚本。

## 2026-09-20 HTTP 请求体引用校验：0.1.19

落实[引用校验修正](value-editor.md)。0.1.18 代码审计与实际执行校验器确认：`body` 被无条件排除，HTTP 请求体中的缺失来源不被检查，来源步骤删除也被接纳；`params.toString` 因原型链成员判断被误接纳。现在仅排除真正的条件/循环子步骤，保存与运行预检、编辑器结构调整和参数删除均检查 HTTP 请求体。参数名必须为自身属性，空路径段及循环 index 子字段不被接纳。旧数据不自动改写，未知输出子字段仍在执行时核对。

- `pnpm check` 通过类型、80 项单元和构建。新增三项覆盖嵌套请求体、来源删除/移动、容器子输出移动、参数名/路径、分支循环作用域及复制子树引用；合法嵌套值经执行核心核对类型与实际值。
- `pnpm test:runtime` 的 21 项真实 Worker 验证通过。新增测试用本地 HTTP 服务接收两次分支/循环请求，核对参数、前序输出、item/index 的真实请求体；模拟旧客户端保存的无效草稿与固定版本，保存、手动运行、版本运行和计划创建均拒绝。确认没有生成 Run/快照/计划、没有向服务发请求、前置文件副作用未发生、旧草稿与成功历史均未改写。
- `test:resource-editor` 界面确认 HTTP 请求体引用的参数删除、来源步骤删除和前移被阻止，原参数及两步定义保留；随后 13 步资源流程保存重开并执行成功，真实 HTTP、文件、ZIP、Excel 和内置上传结果通过。旧 `test:flow-editing` 与 `test:value-editor` 回归通过，未知子字段仍按原行为在运行时失败。
- 新增界面检查起初遗漏参数页签切换，随后计数误含开始/结束图形；补齐实际导航并限定业务节点后重跑。两项为验收脚本问题，不当作产品缺陷，也未放宽引用和执行结果断言。
- `pnpm package:mac` 已生成 `flow-ark-client/release/FlowArk-0.1.19-arm64.dmg`，SHA-256 `1d4cf5ccea9dd0088e79b7874de61ff8f79dc221bac7a56bcce0ea3dd88f31a3`；只读解包候选 `/private/tmp/flowark-0119-delivery-wrw5jugi/FlowArk.app`，摘要 `/private/tmp/flowark-0119-delivery.json`。包未签名/公证，默认图标。
- 只读 DMG 候选通过 `test:resource-editor`、`test:value-editor`、`test:flow-editing`、`test:embedded` 四组验收；最后一组继续核对完整复杂表单回执、最小化、上传下载、取消与重开。全部为本地服务、隔离虚构数据和内置浏览器。日志 `/private/tmp/flowark-0119-{check,runtime,resources,editing,values,typecheck,package,candidate}.log`。
- 再次只读确认日常 `/Users/mac/Applications/FlowArk.app` 为 0.1.16；未替换应用、未创建摘要中规划的备份、未修改日常数据。最终安装路径与日常整窗验收待解锁后完成。
- 客户端 [PR #16](https://github.com/zhongmiao-org/flow-ark-client/pull/16) 经 [CI 35491371140](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35491371140) Validate / Auto Merge 成功，实际合并提交 `f2626edc6ef444845566bf3632173cbeac5c2fa4`。
- 采用治理 [PR #21](https://github.com/zhongmiao-org/flow-ark/pull/21) 的合并基线 `9feedd6aa73fff327febc6bc89f27d7a84cda045`；契约 0.7.0、IPC、数据库及快照格式不变。

日常升级仍待先前 Mac 解锁请求的回复，当前不替换正在使用的应用。此项不代表上传预检、历史产物等其他可靠性问题已完成；真实招聘、真实 AI、外部浏览器和 P1 总体验收仍未完成。

## 2026-09-20 HTTP、文件与 Excel 可读配置：0.1.18

落实[资源节点配置](resource-node-forms.md)。HTTP 方法、地址、请求头和请求体，文件目录绑定、读写、复制与 ZIP 列表，以及 Excel 行列数据和模板单元格映射均提供表单。值保留类型和变量引用；表格分页不丢失隐藏数据，重复映射与非法单元格地址不覆盖已有配置。切换操作提示使用默认值并支持撤销，高级节点 JSON 保留。公共契约 0.7.0、IPC、数据库和执行器未变更。

- `pnpm check` 通过类型检查、77 项单元与构建；新增三项覆盖映射名称、Excel 边界、矩阵不可变编辑及操作预设。`pnpm test:runtime` 的 20 项真实 Worker 验证通过。
- `pnpm test:resource-editor` 从界面搭建 13 步流程，以本地 HTTP 返回值驱动文本写入/读取/复制、ZIP、Excel 写入/读取/模板填充和内置表单上传。核对 GET/POST 方法、请求头和请求体、文本字节、ZIP 条目、数字/布尔/引用、12 行 8 列末页数据、公式对象、模板合并单元格/字体/数字格式/第二工作表与原模板字节。界面配置后保存重开、单步后继续，所有操作使用隔离虚构数据，没有提交表单或意外 Run。
- 另两次明确启动的失败 Run 验证 HTTP 503 只请求一次、不执行后续步骤，以及 `../` 越界文件写入被阻止、目录外文件不存在。映射更名/重复拒绝、归档列表换行、行列删除/撤销、操作切换/撤销和最小 1040×700 布局通过；表格允许内部横向滚动，工作台与参数栏无横向溢出。
- 首次新增界面验收发现：未先获得焦点的下拉选择会与前一个值编辑合并成一条历史，撤销操作切换时连带撤回公式。草稿分组现按实际变更控件补充分组边界，按钮命令独立成组；修复后新增用例及旧 `test:flow-editing` 均通过。未放宽数据恢复断言。
- `test:value-editor`、`test:flow-editing`、`test:desktop`、`test:editor-layout`（17 场景）、`test:picker-ui`（13 步/12 种网页动作）、`test:action-library` 均通过。全部网页回归使用内置浏览器与本机复杂表单。
- `pnpm package:mac` 已生成 `flow-ark-client/release/FlowArk-0.1.18-arm64.dmg`，SHA-256 `f94c434529c65ac53643b3d013ec794251f2e32a964d6703a6d3a7db46e61261`。只读解包候选 `/private/tmp/flowark-0118-delivery-a55me2na/FlowArk.app`；摘要 `/private/tmp/flowark-0118-delivery.json`。包未签名/公证，使用默认图标。
- 只读 DMG 候选通过 `test:resource-editor`、`test:value-editor`、`test:flow-editing`、`test:picker-ui`、`test:editor-layout`、`test:embedded` 六组验收；完整表单继续覆盖回执、最小化、上传下载、取消重开与故障处理。日志 `/private/tmp/flowark-0118-{check,runtime,resources,editing,values,desktop,layout,picker,actions,package,candidate}.log`。工作台截图用于核对资源表格布局，原生子网页另由执行及浏览器测试验证；未将工作台截图中的子网页空白当作整窗绘制结论。
- 日常安装尚未执行：此前桌面工具报告 Mac 锁屏，已请求用户解锁；当前尚未收到回复。只读 Info.plist 再次确认 `/Users/mac/Applications/FlowArk.app` 为 0.1.16。本轮未替换应用、未创建记录中规划的旧版备份、未修改日常数据；候选验证不能替代最终安装路径与日常整窗验收。
- 客户端 [PR #15](https://github.com/zhongmiao-org/flow-ark-client/pull/15) 经 [CI 35490668188](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35490668188) Validate / Auto Merge 成功，实际合并提交 `5e4f051ae201a5ffc054eec03e31e357826e9e51`。
- 采用治理设计 [PR #19](https://github.com/zhongmiao-org/flow-ark/pull/19) 的合并基线 `873ea5e7dfe56e808c4d01df4c940878201aa40a`。

真实招聘、真实 AI、外部浏览器与 P1 总体验收仍未完成。1920 CSS 像素网页宽度沿用已交付实现，不能由此推断所有 PC 网站均兼容。

## 2026-09-20 可读参数与通用变量选择：0.1.17

落实[通用值与变量选择](value-editor.md)。浏览器值字段、数据、条件/断言、循环集合和脚本输入提供统一变量选择，按名称/路径搜索后明确确认；显示当前来源与精确路径，不将引用伪装为空文本或默认勾选。候选遵循实际词法前序作用域，循环体可选最近一层 item/index；未知结果可以指定高级子路径，运行时缺失仍报错。运行参数保留文本、数字、布尔、空、数组/对象类型，删除被引用的参数名会被阻止。草稿历史、旧流程和快照语义不变。

- `pnpm check` 通过类型检查、74 项单元与构建，新增四项验证作用域、嵌套循环、可表达的静态字段、未知结果与非法路径，并用真实引擎核对候选引用、对象/布尔/数字类型及缺失路径失败。`pnpm test:runtime` 20 项通过。
- `pnpm test:value-editor` 从界面创建参数和 15 步流程，完成参数引用填写姓名、布尔勾选、部门下拉、读取值用于条件/断言、循环当前项填写和序号记录/数字判断、脚本输入引用。保存重开与单步/继续后核对实际网页与宿主完整输出；故意引用缺失子字段时明确失败，无固定值回退。搜索/取消、切回固定值/撤销、参数删除保护、未完成输入保存阻止、最小 1040×700 下的引用选择器也通过。两次显式调试均使用虚构数据，没有表单提交或额外 Run，网页宽度为 1920。
- `test:flow-editing`、`test:picker-ui`（13 步/12 种网页动作）、`test:editor-layout`（17 场景）、`test:action-library`、`test:desktop` 通过。浏览器绑定和节点高级 JSON 的旧测试选择器改为准确的标签/容器；不再把新增的参数控件当作唯一 select/textarea。已有可读表单的节点默认收起高级 JSON，展开状态按节点独立保持。
- 验收过程保留失败：新增脚本起初误匹配 Monaco 的隐藏 alert，随后误读已被宿主转换为 outputPreview 的事件 result 字段；分别收紧提示定位并使用真实 run.detail.output 后通过。旧结构编辑用例发现高级 JSON 展开状态被新选中的同类节点继承，增加节点 key 后对应回归通过。未放宽实际字段、类型或作用域断言。
- `pnpm package:mac` 成功；只读 DMG 提取的候选应用已通过 `test:value-editor`、`test:flow-editing`、`test:picker-ui`、`test:editor-layout`、`test:embedded` 五组验收，完整表单仍覆盖回执、上传下载、最小化、取消重开与故障处理。全部回归使用隔离数据、内置浏览器和本地虚构页面。日志 `/private/tmp/flowark-0117-{check,runtime,values,editing,picker,layout,actions,desktop,package,candidate}.log`。
- 安装包 `flow-ark-client/release/FlowArk-0.1.17-arm64.dmg`，SHA-256 `ac5d90d98276768e4b77ac239126f4ec1b51464d2ef4802e203a22fa78687f52`；候选 `/private/tmp/flowark-0117-delivery-pv1g6zkv/FlowArk.app`，摘要 `/private/tmp/flowark-0117-delivery.json`。包仍未签名/公证，默认图标。
- 日常安装尚未执行：桌面工具报告 Mac 锁屏且无法自动解锁，已请用户解锁，以便检查活动任务并正常退出旧版。只读 Info.plist 确认 `/Users/mac/Applications/FlowArk.app` 仍为 0.1.16；未替换应用、未创建旧版备份或修改日常数据。0.1.17 最终安装路径与日常桌面验收待完成，不能用候选通过代替。
- 客户端 [PR #14](https://github.com/zhongmiao-org/flow-ark-client/pull/14) 经 [CI 35489630516](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35489630516) Validate / Auto Merge 成功，实际合并 `0108b8814034ac405b1e1f66728fbc22255b88fe`。
- 采用治理 [PR #17](https://github.com/zhongmiao-org/flow-ark/pull/17) 的合并基线 `8f74dd740c6d693b496ddd573aca2450f9600a5e`。契约 0.7.0、IPC 和数据库未变更。

HTTP、文件和 Excel 的完整可读配置仍待推进；高级 JSON 可用，不将首批值字段接入写成所有节点配置已经完成。真实招聘、真实 AI、外部浏览器和 P1 总体验收仍未完成。

## 2026-09-20 流程结构编辑与草稿历史：0.1.16

落实[流程结构编辑](flow-editing.md)：动作库可在选中节点前后连续插入；复制普通节点或完整条件/循环子树，生成独立 ID 并重映射内部输出引用（含条件/循环输出中的子节点结构键），普通文本、脚本、路径和外部引用不替换。支持当前分支上下移动及明确目标移动；删除和移动若新增前向引用、引用缺失、循环变量越界或失效子输出路径，显示具体引用并拒绝变更。已有未完成的普通字段不阻止独立结构编辑。

- 当前打开草稿保留最近 100 次内存编辑历史，包括节点、参数、脚本、绑定和当前选择。连续聚焦输入合并为一项，工具栏可撤销/重做；画布支持 ⌘/Ctrl Z、⌘/Ctrl Shift Z，输入框与 Monaco 保留文本撤销。新编辑清空重做分支，保存保留历史，重新进入流程清空历史；不撤销执行副作用、不修改已有 Run/计划。
- `pnpm check`：类型检查、70 项单元与构建通过。新增纯函数验证嵌套插入/移动、不可变原结构、子树独立 ID、内部/外部引用与普通字面量、实际执行复制后的条件/循环输出、失效引用拒绝、100 次上限、输入分组、选择/绑定恢复、重做失效与流程隔离。`pnpm test:runtime` 20 项通过。
- `pnpm test:flow-editing` 真实界面完成默认引用来源删除/移动阻止、删除/撤销/重做、前后连续插入、填写动作复制与独立配置、完整条件/循环子树复制、跨分支移动、循环 item 外移阻止、键盘/文本撤销、绑定恢复、保存重开和最小 1040×700 布局。保存后的流程逐步执行导航/填写/单选；已暂停 Run 后再修改并保存草稿，当前 Run 仍使用原填写值并成功，网页宽度保持 1920。没有无意产生 Run 或提交；末尾明确启动的调试 Run 为唯一运行。
- `test:action-library`、`test:picker-ui`（13 步/12 网页动作）、`test:editor-layout`（17 场景）、`test:desktop` 通过。空白搭建用例按新增引用保护改为先删除引用方再删除来源，不放宽输出或执行断言。长节点 ID 在最窄参数栏换行，无横向溢出。首次新验收脚本未先启用内置浏览器，绑定选项缺失导致失败；补齐真实设置步骤后通过，未修改产品去绕过绑定。
- `pnpm package:mac` 成功，DMG 提取候选和最终 `/Users/mac/Applications/FlowArk.app` 路径分别通过 `test:flow-editing`、`test:picker-ui`、`test:editor-layout`、`test:embedded` 四组验收。完整表单仍覆盖回执、上传下载、最小化、取消重开与故障处理。所有回归为隔离数据、内置浏览器和本地虚构页面。日志 `/private/tmp/flowark-0116-{check,runtime,editing,actions,picker-ui,layout,desktop,package,candidate,installed}.log`。
- 客户端 [PR #13](https://github.com/zhongmiao-org/flow-ark-client/pull/13) 经 [CI 35488337713](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/35488337713) Validate / Auto Merge 成功，实际合并 `f695723944cce617940b7b47580cdf68eb7610f9`。采用治理 [PR #15](https://github.com/zhongmiao-org/flow-ark/pull/15) 合并基线 `88edc8c159e32b0611e2893c1ae3e8ec26d1be95`；公共契约 0.7.0、数据库与旧流程不变。
- 安装包 `flow-ark-client/release/FlowArk-0.1.16-arm64.dmg`，SHA-256 `c9df3c7f97b573ef1398a2ceb3db57c0dfb21e6dee0f0441ed10a13c681059c3`。安装 `/Users/mac/Applications/FlowArk.app`，旧版备份 `/private/tmp/flowark-0116-delivery-y59z2b9b/FlowArk-0.1.15.app`。候选和安装 app.asar 摘要一致：`7ec50bbe318ff79664e75567eb41a54500ab2d9421960338767a43d2610b2b90`，摘要 `/private/tmp/flowark-0116-delivery.json`。仍未签名/公证，默认图标。
- 日常客户端重新打开显示 0.1.16，升级前后的 6 个流程与 0 个活动任务保留。进入“网页拾取练习”，实际点击复制填写节点后显示 3 步及独立副本；点击撤销后恢复原有 2 步、原节点 ID 与“虚构拾取用户”内容。没有保存或运行变更。右侧打开 `http://127.0.0.1:4178/`，整窗截图确认编辑工具、动作库、画布、参数与 PC 三栏表单同时可见，标明“桌面宽度 1920”；网页仍为 0 次交互、尚未提交。

统一变量选择与其他节点的可读配置继续推进。真实招聘、真实 AI、外部浏览器和 P1 总体验收仍未完成。

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
| C-13 | 部分 | 实际 SQLite query_only 写失败停止新任务并保留原数据；新版库拒绝打开。0.1.21 真实同名产物副本、复制取消、登记事件失败回滚与内容变更拒绝定位通过；历史版本升级与磁盘满实机未测 |
| C-14 | 部分 | macOS arm64 从 DMG 实际安装、正常退出；0.1.0 → 0.1.1、0.1.16 → 0.1.23 同数据目录保留历史/密钥及模板配置通过；0.1.23 日常窗口两步调试成功（SQLite 结构仍 v1）。真实两站与浏览器登录恢复、未来表结构迁移未测 |
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
