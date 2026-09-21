# 模板解耦验收

2026-09-21。范围：独立模板仓库、标准包、多入口实例、通用 SDK、客户端业务迁出和本机开发数据清理。当前为未正式发布的开发候选，不承担旧客户端兼容。前程无忧真实简历更新属于下一模板阶段。

## 仓库交付

| 仓库 | 已自动合并 PR | 合并提交 |
| --- | --- | --- |
| 治理 | [#59](https://github.com/zhongmiao-org/flow-ark/pull/59)、[#60](https://github.com/zhongmiao-org/flow-ark/pull/60) | `dc659234284b81b47fb254e451515cc4cdf838a8`、`aff8f5e3ce56d410e52173f736f4327bed156ffa` |
| 模板 | [#1](https://github.com/zhongmiao-org/flow-ark-templates/pull/1) | `1fd7ce7f1da2652e31c56fe6a9efadbaebc39c8d` |
| 客户端 | [#34](https://github.com/zhongmiao-org/flow-ark-client/pull/34) | `0d5009f` |

三仓均由最新 PR 提交的 Validate 检查后自动合并。模板 main 仅空提交初始化，实际文件经 PR 交付。契约 tag 是开发快照，不是产品发版。

## 已完成验证

- 模板仓库 `pnpm check`：20 项测试、7 个标准包；连续构建字节相同。招聘协调、策略、事实核验、提示词、站点脚本及其测试已迁出客户端，完整模拟网站位于模板 fixtures；两项招聘站点探测模板明确标记未经真实验收。
- 客户端 `pnpm check`、`pnpm test:runtime`：类型、通用节点、包校验及真实宿主／Worker 测试通过。覆盖篡改、危险路径、符号链接、加密 ZIP、重复／大小写条目、文件数和字节超限、缺失资源、远程 Schema、同版本冲突、重复导入、取消、源包替换与 SQLite 安装回滚。
- 实例行为覆盖默认拒绝、每入口独立预检、串行运行、跨实例隔离、配置／状态共享、人工输入、授权动作去重及未知结果不重放、新版实例授权重置、计划固定入口／版本、历史引用卸载保护。
- `pnpm test:desktop` 验证通用编辑器、IPC 安全边界与实际 Worker。安装版 `pnpm test:install` 验证独立数据目录执行、加密凭据和重开回读；`pnpm test:template-parameters` 验证模板预览取消、Schema 表单保存、标准包导出和本地新身份导出不带实例值。
- 模板仓库 `pnpm test:client` 使用仓库外的安装版可执行文件。执行期间 templates 源码目录被隐藏；通过公共 IPC 导入已复制的 ZIP，完成文件模板、多入口离线检查、内置浏览器填写与回读，重开后配置仍在且可再次运行。包内静态脚本不依赖源码或安装依赖；没有额外自动化浏览器下载。
- 同一安装版测试显式绑定 DeepSeek 和 `deepseek-flash`，用虚构姓名完成真实 API、结构化结果和模板事实校验。测试凭据仅临时复制受系统保护的加密文件并在结束后删除，日志未输出 Key。真实调用成功不代表所有模型、Codex API 或招聘业务已通过。

本机开发证据：`/private/tmp/fa-final-check.log`、`/private/tmp/fa-final-runtime.log`、`/private/tmp/fa-desktop.log`、`/private/tmp/fa-install-platform.log`、`/private/tmp/fa-template-ui3.log`、`/private/tmp/fa-installed-final.log`。这些临时日志不是 Git 交付物；可复现命令与行为断言保存在各仓库测试中。

## 本机数据清理

先在隔离样本验证显式维护工具，再正常退出日常应用并执行。清除 6 个流程、4 条输出、6 次运行、6 个快照、3 个流程版本和 60 条事件；应用管理的运行产物及缓存按归属清理。该逻辑不在应用启动、普通安装或 CI 中执行。

保留 2 条浏览器配置、1 条 AI 验证配置；274 个保留文件逐字节 SHA-256 对比一致，包含加密凭据、受保护数据密钥及浏览器状态。既有备份、`/Users/mac/Documents/个人资料`、外部输出目录均未清除。证明位于 `/private/tmp/fa-reset-proof.json`。不实施旧客户端数据迁移或升降级验证。

## 验收边界

0.2.0 macOS arm64 开发候选输出 ZIP/DMG，未签名、未公证。最终安装路径及清理兼容代码后的检查另补记录。完整历史表单桌面脚本没有全部重跑，本轮通过项以上述命令为准。

真实招聘登录、URL 跳转后身份核对、线上简历差异判断、更新与回读尚未实施；下一阶段在模板仓库完成前程无忧模板。没有把模拟表单、DeepSeek 虚构输入或通用 Run 成功描述为实际简历已更新。
