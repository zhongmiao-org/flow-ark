# 本地工程与 BOSS 候选交付（2026-11-06）

本轮 macOS 本地工程/CLI/MCP/本人 API 开发、配置快照、编辑冲突和恢复的验收范围已完成，BOSS 取得两次成功后自动切换，并经修复恢复完成消息收尾及重开防重。具体失败、恢复与未验证边界见[实施和验收](local-project-development.md)。不创建标签或 Release，由本人手动发布。

## 实际压缩合并

| 仓库 | PR | 准确源提交 | 实际合并 SHA | 最新提交 CI | 源分支 |
| --- | --- | --- | --- | --- | --- |
| 治理 | [#1158](https://github.com/zhongmiao-org/flow-ark/pull/1158) | `5b9a2f51f1497bc0ad2e8e24875a83453b91f24b` | `4519efe536aa6071a11804c9de8b62bfdde4f52f` | [CI 2498 成功](https://github.com/zhongmiao-org/flow-ark/actions/runs/42158481140) | 远端已删除 |
| 客户端 | [#404](https://github.com/zhongmiao-org/flow-ark-client/pull/404) | `8966fcb5b5628b2e27e2a1bc3a5916ab5dc9bb07` | `1e7833713fd1fc53abe59a89531a5b60fc341d10` | [CI 984 成功](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/42158966958)、[Changelog 31 成功](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/42158966862) | 远端已删除 |
| 模板 | [#71](https://github.com/zhongmiao-org/flow-ark-templates/pull/71) | `7695a348ebf8eea027073d98d76ef6b324a7c542` | `430fe4577a519309a977c528f91122b2ab3353dc` | [CI 175 成功](https://github.com/zhongmiao-org/flow-ark-templates/actions/runs/42159221754) | 远端已删除 |

均为 `automerge` 正常 CI 路径；实际合并提交只有一个父提交，已核对压缩合并。更新标签引发的旧运行取消不计为最新结果。本轮未采用计费阻塞例外，没有绕过检查或直接推送 main。客户端与模板本地 main 已与 origin/main 同 SHA、工作区干净；治理交付记录另经 PR 收口。

## 本地安装与文件

唯一交付目录为 `~/FlowArk/交付/20261106-local-project`，包含 DMG、客户端 ZIP、BOSS 完整 ZIP、同字节 BOSS README/公开图片、客户端说明、可编辑 BOSS 工程、无敏感 JSON/env/常量示例、清单及逐文件 SHA256SUMS。大安装文件采用本机写时复制，不再复制历史大备份。原 rc.19 和本次新用户资料/Skill/Key/登录及业务历史保留；旧外部防重记录未导入。

| 文件 | SHA256 |
| --- | --- |
| `FlowArk-0.3.1-macos-arm64-dev-1e78337.dmg` | `44640407ea66f8c063495d6710896bc31e18a1385e6d69492f7b892865661535` |
| `FlowArk-0.3.1-macos-arm64-dev-1e78337.zip` | `0cbebe5491489d2363375bc32ff1c35fc0528e55cbb0a8c15125bca9174b422a` |
| `boss-job-search-0.2.67-rc.21.flowark-template.zip` | `593e0c91982e63a6b198eb93af91263bbca0862271a973f1bfae7b2cfbf938c5` |

客户端合并前后 Git tree 均为 `6a92abe656c8a98101fda715c4e927779772c15d`，代码完全一致。最终包包含准确治理采用 SHA；从最终 DMG 正常安装，已安装 `app.asar` 与镜像原件摘要同为 `8f773399fda0d2a1d9c20886014a17c11c6546d4b411190988d541324b797b4f`。普通启动仍显示本人 DeepSeek 已配置，无自动外发；三份 BOSS 安全/集合/进度文件继续原字节不变。交付目录全部摘要读回通过，安装包 CLI 再次独立编译交付的 BOSS 工程及配置示例通过。模板远端 main 的 ZIP Git blob 读回 SHA256 与上表一致。

**这是未发布的开发候选，包内沿用功能分支的当前应用版本 0.3.1，与已发布 v0.3.1 标签 `8d1b331afa44455e8b8c8669d4841f9206798c8a` 不同。** 新功能已登记双语 Unreleased；按现有仓库规则，不在功能 PR 中改写已发布版本。正式分发前由本人按 Prepare Release 流程准备新的发布版本，不能将此候选混作原公开 v0.3.1。未创建或替换公开 Release 附件。macOS 尚未签名/公证，其他平台未由本机安装验收。

## 准确通过口径

- 工程/配置/CLI/MCP、外部 Agent Excel 与本人 API 路径，以及真实快照/三方差异/单步继续/取消/预算和确定未执行工具的本地恢复均有本轮证据。开发 API 追加严格为已批准 4+1 次；宿主注入错误修复后的复导不再调用模型，原预算和审计保留，不写成全程无人恢复。
- BOSS 两次新招呼成功且原主流程自动切换，首次空态失败保留；修复后原主入口完成恢复时固定的两条未读，一跳过、一送达，重开不重复。不是原连续会话无中断或当天150位网站上限。未出现的新原生附件、微信/手机号和unknown不标分支通过。
- 公开导入资源为空、预算0、动作默认禁止。README写明首次本机索引、资料和Skill优先复用/无版本再访谈、Key配置，以及“API Key产生的费用由用户自行承担”。
- 类型、构建、契约/静态编译、macOS打包及目标客户端/实站验证分开记录；未新增或运行单元测试。其他平台/浏览器、所有供应商协议、全异常覆盖及首次使用20分钟目标仍未由本轮证明，不据此宣布P1全部完成。

## rc.21 元数据更正

最终候选为 `0.2.67-rc.21`，模板更正 [#72](https://github.com/zhongmiao-org/flow-ark-templates/pull/72) 源提交 `ada584e90ef4efa0e9aef339912843e5476eaab1`，压缩合并 `6d165d2a9869806facc6b7a1cc8ec38520484b33`；[当前提交 CI 成功](https://github.com/zhongmiao-org/flow-ark-templates/actions/runs/42161021490)。私有外部 MCP 辅助脚本曾直接拼接 Buffer，损坏一处权限说明的中文 UTF-8 分块；不是生产 CLI 或模型问题。修复辅助脚本解码、还原原说明后正式导出 rc.21，不覆盖 rc.20 历史归档。执行代码和动作规则未变。

rc.21 大小1,131,104字节，内容摘要 `d751a441ebe5182a2ebcd9e7a59373c0fa0dca26488593240fb82da6ec887ae2`，准确复导源码修订 `f15dd38c9cf736506da8a41f2443482ef3fa9ecc4e01fd144c65749e8d781b70` 与原工程一致。原私人实例在客户端确认同边界重建成功，六项资源、预算0、状态、回执和历史保留；三份安全/集合/进度文件原字节未变。普通模板库 rc.21 格式与摘要校验、安装、空白实例创建通过，资源为空、预算0、动作默认禁止；没有追加模型调用或外发。

本地交付目录已替换为 rc.21 ZIP、同字节 README 和公开工程，重新生成 manifest 及230项文件摘要。保留 rc.20 历史空白配置截图并准确标明版本。客户端安装包不变，不创建 Release。
