# FlowArk 远程分支清理与合并后自动删除

2026-11-03（Asia/Shanghai），按本人确认的范围，仅处理 `zhongmiao-org/flow-ark`、`flow-ark-client` 和 `flow-ark-templates`。使用 GitHub 仓库原生设置，不修改现有 CI 合并守卫、squash 方法、发布调度、仓库保护或可见性。

## 清理规则与恢复

- 分页获取全部远程分支与 PR，以当前 SHA 与已合并到默认分支的同仓库 PR 最终 head 完全一致作为本次删除条件；不根据分支年龄或名称判断。Squash 合并不能只用 `git branch --merged` 判断。
- 排除默认分支、受保护分支及开放 PR 的 head/base；每批刷新分支和开放 PR，再用准确 SHA 的 `--force-with-lease` 与原子 push 删除，发生变化则保留或停止，不强制覆盖。
- 删除前在仓库外保存候选清单、完整 SHA、合并 PR 和自包含 bundle。每份 bundle 均在新的空 bare 仓库中恢复，逐项比对引用 SHA，并通过 `git bundle verify` 和 `git fsck --full --no-reflogs`。
- 本机恢复资料位于 `$HOME/.local/state/flowark/branch-cleanup/20261103T144222+0800/`，包含 README、原始清单、结果、SHA-256、bundle、独立恢复仓库及日志。清理期间新增的已合并分支另存 delta 清单和 bundle，验证后才删除。恢复时使用空值 lease，要求远程同名分支仍不存在，不覆盖他人的新分支。
- 不删除本地分支或修改原工作区文件。原工作区有其他任务推进分支和提交；三仓库原有未提交文件的内容 SHA-256 与状态核对保持，治理文档在独立工作树交付。

## 实际清理结果

| 仓库 | 首轮删除 | 补充删除 | 合计 | 失败 | 最终保留 |
| --- | ---: | ---: | ---: | ---: | --- |
| flow-ark | 1,109 | 1 | 1,110 | 0 | main、docs/flow-zip-acceptance、docs/run-rerun-review |
| flow-ark-client | 394 | 1 | 395 | 0 | main、feat/template-packages |
| flow-ark-templates | 63 | 0 | 63 | 0 | main |

合计删除 1,568 个历史分支，没有失败或因 lease 冲突跳过。以上数量不包含承载本次规则的治理 PR 合并后由 GitHub 自动删除的源分支。

计划阶段仍开放的客户端 `feat/skill-restore-review` 已在执行前合并，刷新后符合本次条件，故纳入首轮清理。清理期间治理 #1146 与客户端 #401 的 `ci/node24-actions` 已分别合并，且发生在各仓库自动删除设置开启之前；已补充独立备份、恢复验证与准确 SHA 删除。

三个历史分支的当前 SHA 与对应已合并 PR 的最终 head 不一致，与 main 的比较仍有独有提交，因此继续保留，不把历史 PR 合并当作新 head 已交付：

| 仓库 / 分支 | 保留 SHA | 历史 PR |
| --- | --- | --- |
| flow-ark / docs/flow-zip-acceptance | 9d6f0dc6ae4f5d3c24f2c08bfa3e1fa7063bdc75 | #65 |
| flow-ark / docs/run-rerun-review | 3816d2ad5fdd3b6b023ee4b65cc4312ad22dde79 | #41 |
| flow-ark-client / feat/template-packages | 9abd52adf1e2ca3e258b3a4a4b8881e2d8fbe11d | #34 |

## 自动删除设置与验证边界

三个仓库原来的 `delete_branch_on_merge` 均为 `false`；现已分别设置并通过仓库 API 读回为 `true`。GitHub 在 PR 合并后自动删除源分支，现有 Auto Merge 使用的 API squash 合并沿用这一设置；分支保护与仓库规则仍可能阻止删除，不绕过规则。[GitHub 官方说明](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-the-automatic-deletion-of-branches)

本次真实自动删除验证使用承载本文和 AGENTS.md 规则的治理 PR：核对准确 head 的 Validate、Auto Merge、实际合并 SHA 与远程源分支消失，交付证据保存于本机 `delivery.json` 并随交付回复报告。客户端和模板仓库本次只核验设置与历史清理结果，不将其写成已经完成新的 PR 自动删除实跑。

文档检查使用现有 `python3 .github/check-governance.py` 和 `git diff --check`；不新增或运行单元测试。公共 API、契约、产品 UI、业务数据和现有发布流程没有变化。
