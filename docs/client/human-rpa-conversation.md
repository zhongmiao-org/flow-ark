# 对话式拟人 RPA（2026-11-14）

本次仅推进 Excel 到飞书多维表格闭环，暂停其他业务开发。用户明确要求先备份并清空 FlowArk 自身流程、测试、历史、产物、个人 Skill、AI 连接/凭据、登录态及缓存；替代本次旧的保留个人数据规定。其他应用、系统设置、源码、外部工程、原 Excel、飞书数据和已有备份不变。独立维护工具完成准确路径、停止、备份及恢复核验，不在启动时清库。

## 正式边界

用户从首页描述任务，自动创建应用托管工程；AI匹配内置Skill，在同一对话读取证据、补问业务规则、确认方案并生成/复核/组装。普通使用不需手工建立目录、编辑节点或定位器。登录、真人验证和业务确认仍由用户完成。

本任务固定 `desktop-human-v1`：只有 FlowArk 正式宿主的所选窗口截图/辅助功能观察及鼠标键盘动作。禁止飞书API、DOM、页面脚本、网络拦截或内部接口。Codex及子agent仅开发、检查和操作FlowArk，不能直接观察、控制或调试浏览器，也不能从外部代做业务。Excel使用正式本地文件能力。

开发模式 `FLOWARK_DEVELOPMENT_AI_LOOPBACK=1` 只允许显式本机兼容连接，使用占位凭据，必须在凭据读取前拒绝真实供应商和旧连接，独立复核同样受限。子agent根据客户端真实请求返回规划/代码/复核；不伪造usage、成功或回执。普通供应商生产能力保留，本次无付费调用授权。

## 最小接口增量

- 新白名单 `project.createManaged {name}`：宿主在应用数据区生成唯一工程目录，Renderer不能指定路径；不触发模型、配对或业务运行，沿用工程登记及正式校验。
- 拟人方案标记和工程策略由宿主传递至生成、复核及组装校验；拒绝非拟人执行能力，不能仅依靠提示词。
- 文件及窗口证据经正式只读宿主返回，同一对话关联来源、时间和范围；未知内容明确补问，不猜网页结构。
- `project.ai.observeWindow {id,screenshot}`：用户先在现有窗口面板绑定目标，再显式点击读取；Host解析本工程当前实例、核对空闲，Main只执行获准窗口的原生观察，不激活窗口、不读剪贴板、不输入，不创建业务Run或取得写入权。活动桌面租约/过期绑定/未授权截图拒绝。返回后复核同一绑定，证据和按需截图仅在下一次用户提交回答时发给当前固定模型；历史观察不能作为当前动作许可。
- 窗口证据 `window` 固定来源 `bound-window-authoring`、工程/实例/绑定身份、capturedAt、readOnly=true、actionReuseAllowed=false；observation包含实际窗口title/application/bounds/elements/truncated及可选focus，不包含可用于动作的observationId。按需image包含PNG正文/宽高；只发送已授权的该窗口，不夹带其他窗口或全量运行输出。
- `project.prepareConversation {id,revision}`：仅允许已组装的准确拟人工程，复用正式prepare/configure和原生核对。初始取证实例不兼容时只能经现有隔离新建确认；已选单个Excel来源校验SHA后，可自动提议只读来源目录绑定，其他资源缺失明确提示，不要求编辑JSON。动作仅提议confirm，用户核对配置后才保存，取消不标ready。返回固定revision/instanceId/首入口entryId及configured；普通试运行沿用入口默认参数和正式RunReview，不注入业务专属参数。工程或入口变化使旧准备失效，实际运行回执回到原对话。

## 验收及交付

不新增/运行单元测试。执行类型、构建、契约、格式与必要宿主行为核对，源码/安装/模拟/真实业务分别登记。先由FlowArk验证模拟界面，再由首页完成真实Excel/飞书任务；前3条有效记录核对映射、保存及重开防重，用户确认后才处理剩余范围。默认不清空/覆盖目标表；字段歧义补问，unknown不自动重放。

交付安装候选、工程/标准ZIP/README及摘要，各仓库PR交付；不建标签或Release。计划及Figma不代表已实现。Figma既有首页23:1941和工程AI1234:11788已于本次更新文案，继续复用现有组件。

## 实际进度

- 只读确认日常应用数据目录为 `~/Library/Application Support/flow-ark-client`，凭据由同目录Vault加密文件维护，清理不涉及系统共享钥匙串。
- 正式应用正常退出后，备份核对796个普通文件、209539896字节、两份SQLite完整性；执行恢复再清空核验，摘要逐字节一致，活动目录清空。受保护备份位于本机，未提交Git。
- 签名安装候选重开已证实旧任务列表0、未读提醒0，仅创建本次托管工程；通过首页输入真实任务，FlowArk自动读取工作簿结构并匹配内置飞书Skill，本机子agent真实返回范围补问，usage缺失明确显示，未调用用户Key。
- 用户已确认仅录入前10列（客户名称至客户所有人），不纳入K/L无表头列；目标为本机系统浏览器窗口，不用FlowArk内置浏览器。目标字段、映射、保存和写入仍待实际证据。
- 通过FlowArk原生窗口选择，准确Chrome地址栏base/table/view与用户目标一致；14:58:11辅助功能观察含407元素、未截断，动作权限关闭，未创建业务Run。原生截图两次在ScreenCaptureKit独立窗口过滤器初始化处SIGABRT；仅MainActor不足以解决，失败未采用新证据。当前候选改为准确显示器内只包含已选窗口的过滤及显式裁剪，待FlowArk重新验证；不扩大到全屏或其他窗口。依据[Apple窗口过滤](https://developer.apple.com/documentation/screencapturekit/sccontentfilter/init(display:including:))与[sourceRect](https://developer.apple.com/documentation/screencapturekit/scstreamconfiguration/sourcerect)。
- 已实现普通对话内自动准备/配置提议、正式试运行和回执展示；初始占位实例隔离、源SHA变化、取消和已组装模式守卫在临时真实Store/Templates核验，未执行网页或调用供应商，不计真实业务验收。
- 客户端准确提交 `75e622accf94962980bc30c13c04f4c25817f7cb` 已推送草稿[PR #407](https://github.com/zhongmiao-org/flow-ark-client/pull/407)，最新CI Validate和Changelog均通过；automerge标签存在，草稿未合并。治理契约提交 `71e6b39c4bcdd47e275e2a0fdf7b0974d92e7e1b` 的Validate通过，后续记录另行提交。
- 最后候选DMG摘要 `5b82e9f876e3646775caad83db7bbc3e9c18692bef4895068d8f6f7797909aee`，342982007字节；签名深度严格核对通过，包内Main/Host/Renderer入口与本机本次构建逐字节一致。候选包含display-bound仅单窗口新截图路径，但启动再次等待系统安全存储授权；未因此绕开保护或解密提供商Key。
- 真实模型替身共3个本机去重请求：范围补问、范围确认后目标取证补问、真实AX证据分析，全部由子agent响应，usage未提供；没有真实供应商请求。一次多轮平台重问由本地路由触发（0模型请求），已修正普通接续保留既有平台、显式变更仍重新确认。
- 当前真实字段映射、AI完整业务源码生成、前3条填写保存、重开防重及剩余范围未通过；无业务写入Run。任务工程及标准ZIP尚未生成，不以空白占位包交付。安装候选与README已准备，本次摘要不宣称整个目标完成。
- 开发、检查、安装、真实业务和PR结果待实际证据补充。
