# 客户端多平台发布与 Changelog 看门狗

2026-11-03 用户授权新增发布 CI。当前应用版本为 0.3.0；首次沿用该版本，后续递增。安装包生成不代表跨平台功能、签名、公证或真实招聘验收完成。

## 流程与边界

`prepare-release → 版本与双语 changelog → 版本 PR → 看门狗/候选打包 → 合并 → tag/正式打包 → GitHub Release`

- 治理先行，客户端独立 PR；保留原有未提交浏览器改动。普通 PR 不增加多平台打包。
- 应用版本唯一来源为客户端 package.json；契约及模板版本不跟随调整。首次仅允许已有版本 0.3.0 尚未发布时同版本归档。
- prepare-release 手动输入 version，创建或更新 build/release-v<version> 分支、版本 PR 及 release/automerge 标签。候选固定准确 PR head，Actions 附件保留七天，不创建正式 tag/Release。
- changelog.yml 为独立事件触发看门狗，共用脚本校验中文 CHANGELOG.md、英文 CHANGELOG_en.md 的结构、版本/日期、实质内容和已发布章节保护。普通 PR 两份 Unreleased 都须更新；Dependabot/skip changelog 仅豁免内容更新，历史修正需 changelog correction。版本 PR 不能凭标签跳过归档一致性检查。
- 自动合并等待准确最新 head 的类型、构建、看门狗和版本 PR 四平台候选；新提交重新校验，未启动或等待批准不能算通过。使用 GITHUB_TOKEN，显式 dispatch 自动合并后的 release；GitHub 的 workflow 批准要求仍保留。
- release 从已合并版本 PR 的准确 merge SHA 创建 v<version>，不得移动已有 tag；支持 pr_number 手动恢复。先草稿、后重新打包、完整上传及核验，全部成功才公开；高于已有最新版本才更新 Latest。
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

- [ ] Workflow/YAML、脚本语法、格式、类型及构建。
- [ ] 临时目录核对双语缺失、空白/标题伪更新、历史改写、重复章节、版本错配、标签豁免、归档及重跑。
- [ ] 最新提交失败阻止合并，旧检查不能放行。
- [ ] 四平台候选实构建、版本/架构/文件名及 SHA-256；macOS bundle/Swift 架构检查。
- [ ] 首次 v0.3.0 tag、合并 SHA、正式四平台附件、说明及公开状态。

本节仅据实际证据更新。遵守当前不新增、不运行单元测试的阶段约定。目标系统安装运行与真实业务另记。
