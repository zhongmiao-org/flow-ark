# 模板开发

模板仓库为独立的 flow-ark-templates，远程 git@github.com:zhongmiao-org/flow-ark-templates.git。不使用 submodule、父目录依赖或符号链接。机器契约固定复制已发布版本；共同约束只维护在治理根 AGENTS.md。

templates/ 管理业务模板及可独立打包的 demo，examples/scenarios/ 管理联调说明，fixtures/ 管理虚构网站，tooling/ 管理校验、打包及联调。每个模板独立版本，包格式见 [规范](package-format.md)。测试与真实业务必须分开，不提交个人简历、Key、登录态或输出。

联调使用显式客户端可执行文件与隔离数据目录，把标准包经正式入口安装后执行。客户端独立检查不依赖此源码仓库；本仓库也不能 import 客户端源码。更改站点或提示词只发模板；SDK 新能力由治理契约及客户端先发布。

使用与贡献说明保留在模板仓库 README/CONTRIBUTING，设计及验收在本目录。规范提交使用 type(scope): description，分支 type/lowercase-hyphen-name，禁止工具名前缀。PR 添加 automerge，由最新提交 CI 检查及自动合并交付。

当前命令：`pnpm check` 独立校验、测试并打包；`pnpm forms:serve` 启动完整模拟表单；`FLOWARK_TEST_EXECUTABLE=/absolute/path/FlowArk.app/Contents/MacOS/FlowArk pnpm test:client` 通过安装版公共 IPC 验证标准包。产物输出 dist，测试资料必须虚构。DeepSeek 联调的凭据引用和模型显式指定，说明见模板仓库 README。
