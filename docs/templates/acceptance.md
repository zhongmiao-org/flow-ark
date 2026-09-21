# 模板解耦验收

2026-09-21。范围：独立模板仓库、标准包、多入口实例、通用 SDK、客户端业务迁出和本机开发数据清理。当前为未正式发布的开发候选，不承担旧客户端兼容。前程无忧真实简历更新属于下一模板阶段。

## 0.2.1 统一 ZIP 往返增量

自定义流程、修改后的模板流程与模板库统一「导出 ZIP」，默认文件名与清单 ID／版本一致。自定义流程包含可编辑参数结构、原生节点能力、文件／浏览器逻辑资源及默认禁止的写入声明；参数值、本机路径、凭据和授权不导出。重新导入标准包后可重新填写参数、绑定目录、明确授权并运行。

治理 [PR #63](https://github.com/zhongmiao-org/flow-ark/pull/63) → `8c1f90a1120b12fb7421bf0fca8a0e52afbe8c07`；客户端 [PR #36](https://github.com/zhongmiao-org/flow-ark-client/pull/36) → `4905e375f3e71366464b0dcaedb05ad341733681`，均已由最新提交 CI 自动合并。

验证：`pnpm check` 164 项通过。自定义流程经实际编辑器按钮导出、正式 ZIP 入口导入、实例参数表单填写、默认拒绝检查和目录授权后，打包 TS 脚本与文件节点成功输出 `ROUNDTRIP WORKS`。源码和仓库外 0.2.1 安装版的 `pnpm test:flow-export` 均通过，模板库导出保持原包摘要。

本机默认并发宿主回归曾分别出现一次强杀夹具超时和一次 `kill EPERM`；同一 76 项集合串行复核全部通过，Linux CI 的默认 `pnpm test:runtime` 76 项通过。保留失败记录，不将本次串行成功当作并发夹具问题已修复。日志：`/private/tmp/fa-zip-runtime.log`、`/private/tmp/fa-zip-runtime-recheck.log`、`/private/tmp/fa-zip-runtime-serial.log`、`/private/tmp/fa-zip-ui-final.log`、`/private/tmp/fa-zip-installed.log`。

0.2.1 macOS arm64 ZIP／DMG 开发候选已生成并安装到 `/Users/mac/Applications/FlowArk.app`，仍未签名、公证或正式发布。日常连续重开两次成功，工作台保持空、2 项浏览器配置和 DeepSeek 凭据保留，加密凭据摘要不变；见 `/private/tmp/fa-zip-daily-verified.json`。旧应用备份到 `/Users/mac/Library/Application Support/FlowArk Backups/development-before-zip-export-20260921T115801`；本次未执行数据清理。

## 仓库交付

| 仓库 | 已自动合并 PR | 合并提交 |
| --- | --- | --- |
| 治理 | [#59](https://github.com/zhongmiao-org/flow-ark/pull/59)、[#60](https://github.com/zhongmiao-org/flow-ark/pull/60) | `dc659234284b81b47fb254e451515cc4cdf838a8`、`aff8f5e3ce56d410e52173f736f4327bed156ffa` |
| 模板 | [#1](https://github.com/zhongmiao-org/flow-ark-templates/pull/1) | `1fd7ce7f1da2652e31c56fe6a9efadbaebc39c8d` |
| 客户端 | [#34](https://github.com/zhongmiao-org/flow-ark-client/pull/34) | `0d5009f`（主体）；收尾 [#35](https://github.com/zhongmiao-org/flow-ark-client/pull/35) → `a5d5d2a4643095ce9771d1dcf228ee1e1152ca31` |

三仓均由最新 PR 提交的 Validate 检查后自动合并。模板 main 仅空提交初始化，实际文件经 PR 交付。契约 tag 是开发快照，不是产品发版。

## 已完成验证

- 模板仓库 `pnpm check`：20 项测试、7 个标准包；连续构建字节相同。招聘协调、策略、事实核验、提示词、站点脚本及其测试已迁出客户端，完整模拟网站位于模板 fixtures；两项招聘站点探测模板明确标记未经真实验收。
- 客户端 `pnpm check`（162 项）、`pnpm test:runtime`（75 项）：类型、通用节点、包校验及真实宿主／Worker 测试通过。覆盖篡改、危险路径、符号链接、加密 ZIP、重复／大小写条目、文件数和字节超限、缺失资源、远程 Schema、同版本冲突、重复导入、取消、源包替换与 SQLite 安装回滚。
- 实例行为覆盖默认拒绝、每入口独立预检、串行运行、跨实例隔离、配置／状态共享、人工输入、授权动作去重及未知结果不重放、新版实例授权重置、计划固定入口／版本、历史引用卸载保护。
- `pnpm test:desktop` 验证通用编辑器、IPC 安全边界与实际 Worker。安装版 `pnpm test:install` 验证独立数据目录执行、加密凭据和重开回读；`pnpm test:template-parameters` 验证模板预览取消、Schema 表单保存、标准包导出和本地新身份导出不带实例值。
- 模板仓库 `pnpm test:client` 使用仓库外的安装版可执行文件。执行期间 templates 源码目录被隐藏；通过公共 IPC 导入已复制的 ZIP，完成文件模板、多入口离线检查、内置浏览器填写与回读，重开后配置仍在且可再次运行。包内静态脚本不依赖源码或安装依赖；没有额外自动化浏览器下载。
- 同一安装版测试显式绑定 DeepSeek 和 `deepseek-flash`，用虚构姓名完成真实 API、结构化结果和模板事实校验。测试凭据仅临时复制受系统保护的加密文件并在结束后删除，日志未输出 Key。真实调用成功不代表所有模型、Codex API 或招聘业务已通过。

本机开发证据：`/private/tmp/fa-final-check.log`、`/private/tmp/fa-final-runtime.log`、`/private/tmp/fa-desktop.log`、`/private/tmp/fa-install-platform.log`、`/private/tmp/fa-template-ui3.log`、`/private/tmp/fa-installed-final.log`。这些临时日志不是 Git 交付物；可复现命令与行为断言保存在各仓库测试中。

## 本机数据清理

先在隔离样本验证显式维护工具，再正常退出日常应用并执行。清除 6 个流程、4 条输出、6 次运行、6 个快照、3 个流程版本和 60 条事件；应用管理的运行产物及缓存按归属清理。该逻辑不在应用启动、普通安装或 CI 中执行。

保留 2 条浏览器配置、1 条 AI 验证配置；274 个保留文件逐字节 SHA-256 对比一致，包含加密凭据、受保护数据密钥及浏览器状态。既有备份、`/Users/mac/Documents/个人资料`、外部输出目录均未清除。证明位于 `/private/tmp/fa-reset-proof.json`。不实施旧客户端数据迁移或升降级验证。

## 验收边界

0.2.0 macOS arm64 开发候选已生成 ZIP/DMG，未签名、未公证，已安装到 `/Users/mac/Applications/FlowArk.app`。旧应用只做可逆文件备份，位置 `/Users/mac/Library/Application Support/FlowArk Backups/development-before-template-split-20260921T114016`；不提供旧客户端升降级兼容。

最终候选再次通过 `test:install`、`test:template-parameters` 和模板 `test:client`。日常数据连续打开两次：流程、历史、计划、待办、模板和实例均为零，保留 2 项浏览器配置和 DeepSeek 凭据，无存储故障；两份加密凭据文件摘要未改变。见 `/private/tmp/fa-final-install.log`、`/private/tmp/fa-final-ui.log`、`/private/tmp/fa-daily-verified.json`。

完整模拟表单模板 1.0.1 补齐入口网站地址表单，通过安装版完成原生控件、附件、提交及回执写文件；服务端恰好接受一次 `FORM-0001`，附件内容及文件回执一致，3 个模板实例重开验证通过。见 `/private/tmp/fa-full-form-installed.log`，模板 [PR #2](https://github.com/zhongmiao-org/flow-ark-templates/pull/2) 已由最新提交 CI 自动合并，提交 `66a2682744498e8948023d8c60d04659a7fea546`。完整历史表单桌面脚本没有全部重跑，本轮通过项以上述命令为准。

真实招聘登录、URL 跳转后身份核对、线上简历差异判断、更新与回读尚未实施；下一阶段在模板仓库完成前程无忧模板。没有把模拟表单、DeepSeek 虚构输入或通用 Run 成功描述为实际简历已更新。
