# 客户端多平台发布与 Changelog 看门狗

2026-11-03 用户授权新增发布 CI。当前应用版本为 0.3.0；首次沿用该版本，后续递增。安装包生成不代表跨平台功能、签名、公证或真实招聘验收完成。

## 流程与边界

`prepare-release → 版本与双语 changelog → 版本 PR → 看门狗/候选打包 → 合并 → tag/正式打包 → GitHub Release`

- 治理先行，客户端独立 PR；保留原有未提交浏览器改动。普通 PR 不增加多平台打包。
- 应用版本唯一来源为客户端 package.json；契约及模板版本不跟随调整。首次仅允许已有版本 0.3.0 尚未发布时同版本归档。
- prepare-release 手动输入 version，创建或更新 build/release-v<version> 分支、版本 PR 及 release/automerge 标签。候选固定准确 PR head，Actions 附件保留七天，不创建正式 tag/Release。
- changelog.yml 为独立事件触发看门狗，共用脚本校验中文 CHANGELOG.md、英文 CHANGELOG_en.md 的结构、版本/日期、实质内容和已发布章节保护。普通 PR 两份 Unreleased 都须更新；Dependabot/skip changelog 仅豁免内容更新，历史修正需 changelog correction。版本 PR 不能凭标签跳过归档一致性检查。
- 自动合并等待准确最新 head 的类型、构建、看门狗和版本 PR 四平台候选；新提交重新校验，未启动或等待批准不能算通过。使用 GITHUB_TOKEN，显式 dispatch 自动合并后的 release；GitHub 的 workflow 批准要求仍保留。
- release 从已合并版本 PR 的准确 merge SHA 创建 v<version>，不得移动已有 tag；支持 pr_number 手动恢复；可选 artifact_run_id 只复用同仓库 Release workflow 中四平台均成功、附件来源 SHA 一致且未过期的正式构建。先草稿、后重新打包、完整上传及核验，全部成功才公开；高于已有最新版本才更新 Latest。
- 草稿可同版本串行重跑补齐；已公开版本只核验、不覆盖附件。发布说明取该版本双语 changelog，保留开发阶段及各平台限制。

## 产物与环境

| 平台 | Runner | 产物 |
| --- | --- | --- |
| macOS arm64 | macos-15 | DMG、ZIP |
| macOS x64 | macos-15-intel | DMG、ZIP |
| Windows x64 | windows-2022 | NSIS EXE、ZIP |
| Linux x64 | ubuntu-24.04 | AppImage、DEB |

两阶段复用固定 SHA 的打包 workflow，使用客户端固定 Node/pnpm/锁文件及 Electron。Swift 程序在同架构 macOS runner 编译；DMG 保留相对链接验证。产物含版本/平台/架构及 SHA-256 校验文件；只上传交付文件，不上传工作区/凭据/运行数据。不下载自动化浏览器，不接入发行证书、公证或应用内自动更新。

Windows/Linux 本批只新增打包交付；macOS 限定窗口能力及 Windows 脚本限制保留，不据打包成功宣称平台功能完整支持。

## 验证与当前状态

- [x] Workflow/YAML（actionlint 1.7.12）、脚本语法、Prettier、类型及构建；GitHub 实跑亦通过。
- [x] 临时目录 18 项更新日志核对：双语缺失、空白/标题伪更新、历史改写、重复章节、版本错配、标签豁免、首次/后续归档及重复版本拒绝。
- [x] 受控核对最新检查失败、陈旧 head、待批准且无 check 对象三种情况，均未发出合并或 dispatch；真实版本分支失败也未合并。
- [x] 四平台候选实构建、版本/架构/文件名及 SHA-256；macOS bundle/Swift 架构检查；正式四平台亦全部成功。
- [x] 首次 v0.3.0 tag、合并 SHA、正式四平台 12 附件/摘要、双语说明及 Latest 公开状态；公开后重跑仅核验，附件未改写。

本节仅据实际证据更新。遵守当前不新增、不运行单元测试的阶段约定。目标系统安装运行与真实业务另记。

## 2026-11-03 实际交付记录

- 治理 [#1141](https://github.com/zhongmiao-org/flow-ark/pull/1141) 正常 CI 自动合并，SHA `6e637273115bf3751780a2d86a8f97297aeafe03`。
- 客户端 [#393](https://github.com/zhongmiao-org/flow-ark-client/pull/393) 正常 CI 自动合并 `7ec06424c5072d431ce4671faaccfdeaad608c20`，实现完整 workflow、脚本和使用说明；同提交取消运行只在有替代 workflow 时排除，不排除失败或待批准。
- 客户端 [#394](https://github.com/zhongmiao-org/flow-ark-client/pull/394) 合并 `c988e9dd88b8af875e19c1eccbeb6c17dfe6652f`，支持同次 Actions 附件重跑及 app.asar 实际版本核对。
- [#396](https://github.com/zhongmiao-org/flow-ark-client/pull/396) 合并 `2cc25e0eae03f8fdbc982873cc3ad48d6efffbe1`，修复生成版本分支被普通分支正则拦截；专用严格 SemVer 分支是用户本次授权范围。
- [#397](https://github.com/zhongmiao-org/flow-ark-client/pull/397) 合并 `13acd50f39e1705750f0c60e3bece863d35bbfd0`，运行级 action_required 也阻止合并，发出合并前再次复核。
- 首次 [prepare-release](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41586389786) 成功创建 [版本 PR #395](https://github.com/zhongmiao-org/flow-ark-client/pull/395)，应用保持 0.3.0，只有两份 changelog 发生归档；初次上下文检查失败已按 #396 修复，没有跳过失败。
- 第二次 [候选 CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41586798784) 的 Windows x64 成功，类型、构建、双语看门狗通过；macOS 两架构因 runner 旧版 lipo 参数顺序失败，Linux 因 builder 的 x86_64/amd64 命名与统一 x64 不符失败。版本 PR 当时暂留草稿，正式 tag/Release 当时未创建；修订 [#399](https://github.com/zhongmiao-org/flow-ark-client/pull/399) 继续正常 CI 交付。
- 本机 arm64 实包 DMG/ZIP、bundle 相对链接、Electron/Swift 架构、Info.plist/ASAR 版本及校验和通过；此本机包包含未提交浏览器工作区改动，只作工具验证，不作正式发行源。原改动摘要仍为 `7b9f35a78b1a85450a2ad4dcac489ed7141156872db15eeac1b3806d85eae59d`，未纳入发布 PR。

未新增或运行单元测试，无真实网站、AI 请求或业务外发。正式发行从准确版本 PR 合并 SHA 重建；签名、公证、目标系统安装与跨平台功能仍独立验收。

## 首版完成与恢复验证

- 原生打包修复 [#399](https://github.com/zhongmiao-org/flow-ark-client/pull/399) 正常 CI 自动合并 `f22463aa9843681c29eaf3d02c0eb8c8ea834846`。最终 [prepare-release](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41588145493) 更新版本 PR #395，准确候选 head `4da4af7ecb2b7ec3579084a027eaf9774b66d9a5`。
- 最终 [候选 CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41588184443) 的类型、构建、双语看门狗、四平台与 Auto Merge 全部成功。版本 [#395](https://github.com/zhongmiao-org/flow-ark-client/pull/395) 实际合并 `b71e48e562e516c02fd7f5e4bd8de479fc3b3e48`，[主线 CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41589447264) 通过。
- 自动 [Release run](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41589450038) 从该合并 SHA 创建 v0.3.0 并完成四平台正式构建。首次 Publish 因 GitHub 按 tag 的 REST 端点不返回草稿而 404；没有公开不完整 Release。
- 修复 [#400](https://github.com/zhongmiao-org/flow-ark-client/pull/400) 正常 CI 合并 `b7e4a17ac440887810fa274f684fd76180459dea`，草稿由列表/ID 查询，发布控制代码固定到本次 workflow SHA，应用代码仍固定原 tag SHA。恢复只接受成功的同源正式构建，下载后再次核验内容与上传 digest，不移动 tag 或改写应用版本。
- [恢复发布](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41591131996) 的 Metadata、Publish 成功；四平台重新打包按明确恢复输入跳过，复用上述正式运行的原始附件。已公开 [v0.3.0](https://github.com/zhongmiao-org/flow-ark-client/releases/tag/v0.3.0)，共 8 个安装/压缩包与 4 份 SHA-256 文件，12 个上传摘要均逐项核对，Latest 为 v0.3.0。
- 再次手动运行 [幂等核验](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/41591380583) 成功：只执行 Metadata，打包与 Publish 均跳过；重跑前后 published_at、附件 ID/digest/updated_at 完全相同。
- 准确 tag commit、来源、控制版本、workflow 运行及 12 个附件摘要保存在[首版机器回执](release-v0.3.0.json)。这是发布 CI 与产物交付完成，不是签名、公证、目标系统完整运行或跨平台业务验收通过。

## 2026-11-03 Node 24 Actions 升级

用户要求消除 Actions 内部 Node 20 弃用警告。构建 Node 已是 24，警告来自 Action 自身的 runs.using；本批不通过强制运行环境变量掩盖旧声明。

- checkout 7.0.1、setup-node 7.1.0、upload-artifact 7.0.2、download-artifact 8.0.2、pnpm/action-setup 6.1.0 的正式发布提交均已读取 action.yml，确认使用 node24；继续固定完整 SHA。治理 CI 的 checkout 同步升级。
- 客户端构建 Node 从 24.3.0 更新为官方当前 24 LTS 补丁 24.22.2；pnpm 保持 10.14.0、锁文件和应用版本不变。README 更新推荐开发版本，package.json 的最低 Node 24.3.0 兼容声明保持。
- 附件继续使用 ZIP archive、原名称/覆盖/保留天数与下载合并规则，不重写现有 v0.3.0 tag、Release 或附件。
- 验证按 actionlint、格式、类型/构建及准确 head 的 GitHub 检查；不新增或运行单元测试，实际结果在本节后补充。
