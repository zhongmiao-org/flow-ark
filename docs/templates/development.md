# 模板开发

## 2026-10-15 当前主线：可视化作者制作

按[本次计划](../client/guided-skills-boss-plan-20261015.md)，先治理/Figma，再补客户端通用能力；由我们在客户端可视化编排、调试并导出独立个人蒸馏流程和 BOSS 多入口模板。模板仓库保存客户端导出的公开资产、来源/许可、版本、业务 Schema、提示词和站点配置；不能只有开发脚本能构建、使用者仍需手改 JSON 才可用。缺少多入口/Schema/资源/Skill 等作者能力时先补通用能力，不把业务藏入客户端或一个大脚本节点。

蒸馏通过用户自有 Key 引导材料、偏好、风格和边界，结果经编辑/试聊/确认保存在个人工作区；BOSS 模板引用确认版本。公开 ZIP 不含真实简历、个人 Skill、Key、登录态或作者绝对路径；另工作区导入后，只绑定使用者资源和权限即可运行。交互/bug 与本主线并行，原 Agent 自动生成目标继续保留，不以作者手动编排代替。下节的全部186板前置顺序为历史安排。

## 后续 Agent 闭环与 BOSS 投递验收

2026-10-12 用户安排：当前先完成现有186画板对应的UI、UE与功能逻辑；随后补齐Agent自动创建流程，按“描述诉求 → 自动匹配skill、模板或MCP → 生成完整可用流程 → 人工review或微调 → 运行”验收，首个业务验收采用BOSS直聘投递流程。完整顺序见[ROADMAP](../../ROADMAP.md)，通用Agent要求见[客户端目标](../client/agent-flow-generation.md)。

该后续阶段的BOSS业务技能/规程、模板入口、参数Schema、提示词、站点定位、筛选与投递、去重和业务结果核对归flow-ark-templates；客户端负责通用能力发现/匹配、规划调用、流程生成、版本和执行宿主，不写入BOSS专属逻辑。需先具备真实可用的模板或工具能力，再核对Agent是否根据业务诉求自动选用、配置并生成完整流程；人工主要提供业务条件、登录/授权、review及少量微调，不逐节点配置RPA。

验收须核对真实账号与简历、目标职位/筛选和数量范围、明确投递授权、实际投递回执及未知结果不重放。现有recruiting-boss仅适配检查，仍未完成投递；虚构网站、AI补问、占位流程或格式校验不能作为通过。此前前程无忧“下一模板阶段”的记载保留为历史安排，后续优先级以最新ROADMAP为准。

## 仓库与开发约定

模板仓库为独立的 flow-ark-templates，远程 git@github.com:zhongmiao-org/flow-ark-templates.git。不使用 submodule、父目录依赖或符号链接。机器契约固定复制已发布版本；共同约束只维护在治理根 AGENTS.md。

templates/ 管理业务模板及可独立打包的 demo，examples/scenarios/ 管理联调说明，fixtures/ 管理虚构网站，tooling/ 管理校验、打包及联调。每个模板独立版本，包格式见 [规范](package-format.md)。测试与真实业务必须分开，不提交个人简历、Key、登录态或输出。

联调使用显式客户端可执行文件与隔离数据目录，把标准包经正式入口安装后执行。客户端独立检查不依赖此源码仓库；本仓库也不能 import 客户端源码。更改站点或提示词只发模板；SDK 新能力由治理契约及客户端先发布。

使用与贡献说明保留在模板仓库 README/CONTRIBUTING，设计及验收在本目录。规范提交使用 type(scope): description，分支 type/lowercase-hyphen-name，禁止工具名前缀。PR 添加 automerge，由最新提交 CI 检查及自动合并交付。

当前命令：`pnpm check` 独立校验、测试并打包；`pnpm forms:serve` 启动完整模拟表单；`FLOWARK_TEST_EXECUTABLE=/absolute/path/FlowArk.app/Contents/MacOS/FlowArk pnpm test:client` 通过安装版公共 IPC 验证标准包。产物输出 dist，测试资料必须虚构。DeepSeek 联调的凭据引用和模型显式指定，说明见模板仓库 README。
