# CI 可用性

2026-10-29，本人确认三个仓库先保持公开，正式结束前不改为私有。已通过 GitHub 当前仓库元数据核对 `flow-ark`、`flow-ark-client`、`flow-ark-templates` 均为 public；不自动变更仓库可见性。

三个仓库保留原有 PR 检查，增加 main 推送及手动触发，以便核对合并后的准确提交和重新检查主线。分支/PR 标题约定只检查 PR；Auto Merge 只在同仓库、非草稿、带 automerge 标签的 PR 上执行，继续核对准确 head/base 和所有所需检查。主线与 PR 使用不同并发键，主线运行不进入 PR 合并步骤。

现有 Auto Merge 使用 GITHUB_TOKEN，GitHub 不会因其产生的 push 再启动工作流。因此在准确合并成功后显式执行 `gh workflow run ci.yml --ref main`，Auto Merge 作业单独持有 actions:write 供此调用；Validate 仍默认 contents:read，不增加新令牌或密钥。被触发的主线运行不会进入 Auto Merge，不形成循环。[GitHub 官方触发规则](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)

| 仓库               | Validate 的实际范围                |
| ------------------ | ---------------------------------- |
| flow-ark           | 治理链接、仓库边界和契约摘要       |
| flow-ark-client    | 固定依赖安装、类型检查、构建       |
| flow-ark-templates | 固定依赖安装、模板完整性校验、构建 |

当前 UI 阶段继续不新增或运行单元测试，保留原有测试套件。CI 成功不代表客户端安装、BOSS 业务、网站当天上限或最终 ZIP 交付通过。

仓库切为公开之后，治理 PR #1111、#1112 已实际启动 Validate 和 Auto Merge 并成功。此前 #1110、客户端 #378/#379 因计费未启动及经本人授权手工合并是当时的历史事实，不是当前 CI 状态。新增触发入口的准确 PR、合并提交、主线与手动运行证据在执行后补录，不先行宣称成功。

首轮触发入口 PR 已实际通过 CI 并自动合并：治理 #1113 为 `46648f97607f244411183643ee075023c81f8405`，客户端 #380 为 `d3fd4a69ffb9bbb72591c62cc95fa657601c9475`，模板 #59 为 `9d2f7a6431c57a5c1f9fd780b18769928125d8bf`。通过普通 workflow_dispatch 启动的 [治理主线](https://github.com/zhongmiao-org/flow-ark/actions/runs/40816501590)、[客户端主线](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/40816503343)、[模板主线](https://github.com/zhongmiao-org/flow-ark-templates/actions/runs/40816505177)均已实际成功，各自 head_sha 与上述合并提交相同。自动合并后的显式触发另行核对。
