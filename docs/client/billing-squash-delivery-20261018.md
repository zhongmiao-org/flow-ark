# 2026-10-18 计费阻塞下的明确授权合并

用户明确要求“继续目标，ci受阻可能是免费账户欠费，通过GitHub cli进行压缩合并”。本批按该指令，用 GitHub CLI 的 `gh pr merge --squash --match-head-commit` 合并下表 15 个积压 PR。没有直接推送 main、使用 admin、修改保护规则或支付账户费用；默认后续交付仍遵守 AGENTS.md 的 PR/CI 规则。本次例外也适用于登记本批结果的治理 PR。

## 原因与合并结果

Actions 的实际注释为：任务因近期付款失败或支出限制而未启动。它不能确定账户属于免费方案，也不是代码检查失败。代表证据为治理 Validate 117397587400 与客户端 Validate 117397445897：二者均无执行步骤；Auto Merge 跳过。合并不代表 CI 已通过，也没有伪造成功状态。

先治理 #833–#841，再按各项依赖落实客户端 #301–#306；模板仓库 #19 此前已实际合并，无本批待合并项。更新分支后核对远端最新 head/base 与可合并状态，使用准确 head 合并并复读实际 mergeCommit/mergedAt。文档同一位置的新增段落逐段保留，检查双方整份文本的每一行均保留、无冲突标记，再提交解析结果。没有取单边覆盖另一边。以下均是实际 squash 提交，时间为 2026-10-18。

| PR | 实际合并 SHA | 内容 |
| --- | --- | --- |
| [flow-ark#833](https://github.com/zhongmiao-org/flow-ark/pull/833) | f1a3dc8e977f151273732c1997d18c7001dd9c0c | docs(client): 记录来源整理故障与可视化恢复边界 |
| [flow-ark#834](https://github.com/zhongmiao-org/flow-ark/pull/834) | f5810d915ea668fbebaf9164120f421e4a487a2d | feat(contracts): 定义来源整理运行范围核对 |
| [flow-ark#835](https://github.com/zhongmiao-org/flow-ark/pull/835) | dd0cc2d511937901c0426849b69fa82e469dd652 | docs(client): 记录BOSS接管制作与复制动作修复 |
| [flow-ark#836](https://github.com/zhongmiao-org/flow-ark/pull/836) | 9fbf9fc5fc053a498c462ba72eae4b2751d7d647 | docs(templates): 记录可读导出设计与本机更新 |
| [flow-ark#837](https://github.com/zhongmiao-org/flow-ark/pull/837) | f17aac63a3e8af1c7cee0be893e1b727e4e4cde8 | docs(templates): 记录独立工作区原生复用验证 |
| [flow-ark#838](https://github.com/zhongmiao-org/flow-ark/pull/838) | 9df5a6d4a3f1ebbb86f8b014de6e16c68c1cabf5 | docs(results): 记录可读结果设计与本机修复 |
| [flow-ark#839](https://github.com/zhongmiao-org/flow-ark/pull/839) | 76997650e5c6f7dd047465bf0247d23a16ddf636 | docs(contracts): 定义入口结果只读展示草案 |
| [flow-ark#840](https://github.com/zhongmiao-org/flow-ark/pull/840) | 3b02c53229951adb5650b2433559a85d921960a5 | docs(templates): 明确显式空值结果保持语义 |
| [flow-ark#841](https://github.com/zhongmiao-org/flow-ark/pull/841) | 0ab4c23051b5432ee2f9c6fa928adec3cd2205f1 | docs(client): 规定空值结构可视化编辑边界 |
| [flow-ark-client#301](https://github.com/zhongmiao-org/flow-ark-client/pull/301) | 5a81428e009a6ace4f0eb72e223550bae273cf77 | fix(ai): 修复来源整理绑定与字段反馈 |
| [flow-ark-client#302](https://github.com/zhongmiao-org/flow-ark-client/pull/302) | 67465583c5e58a44bcbce62debb930695002522d | fix(templates): 复制编译时复用本入口标准写动作 |
| [flow-ark-client#303](https://github.com/zhongmiao-org/flow-ark-client/pull/303) | ae626a0aa71dd55790850b5a040abd95609b74d8 | feat(templates): 添加可读导出核对与说明预览 |
| [flow-ark-client#304](https://github.com/zhongmiao-org/flow-ark-client/pull/304) | 7d40d7bbc83dbd3cdf5eb9b623282b3412ffd075 | fix(results): 默认显示可读结果并收起高级原文 |
| [flow-ark-client#305](https://github.com/zhongmiao-org/flow-ark-client/pull/305) | 37aa110b0f2283d05ec0627fec5304fe061a5faf | fix(templates): 保留已保存的显式空值结果 |
| [flow-ark-client#306](https://github.com/zhongmiao-org/flow-ark-client/pull/306) | efb26ffb3bdb5ff3c094e7a44157f9060d229f79 | fix(templates): 补全空值结构可视化编辑 |

## 本地验证与安装来源

- 治理分支依次运行 `python3 .github/check-governance.py`、`git diff --check`：通过；链接、仓库忽略边界、所有历史契约校验和保持。
- 客户端每次引入前序 main 后运行 `pnpm typecheck`：通过；最终 main 再运行 `pnpm typecheck`、`pnpm build`、13 份变更源文件的 Prettier 检查与 `git diff --check`：通过。构建仅有现存大 chunk 警告，没有新增或运行单元测试。构建日志 `/private/tmp/flowark-merged-main-build-20261018.log`。
- 客户端最终 main 为 `efb26ffb3bdb5ff3c094e7a44157f9060d229f79`，固定契约仍是已发布 0.35.1。相对已安装候选基线 `6595e46ce3a7e3820622e6c2a2305f7f22752962` 的完整二进制 diff 与前次最终安装源补丁逐字节同摘要：`52e6454f82bb0da5697c4e06029f27ff280eaa5e56ae59797b4ec0a55350db20`。没有遗漏或退回此前 #301–#306 的改动。
- `/Users/mac/Applications/FlowArk.app` 的 ASAR 仍为 `330efb9bbba54471c5c0f9ced208c4e93f2c848524f382030677192e08a57550`。它是前次已打包安装且已有原生 UI 记录的同一候选；本批完成合并源的生产构建，没有再次替换/重启、操作业务数据或把旧 UI 观察冒称本批新验收。[安装及可视化复导证据](null-schema-ui.md#最终候选安装与正式复导)。

## 主线接续

本批解除了积压 PR 的交付阻塞。0.36.0 来源运行核对 G1 已合并，但尚无发布 tag 或客户端消费者；入口整体结果仍在 drafts，未发布也未采用。不能因合并设计文档宣布这些通用能力已运行。后续先完成真实契约发布与宿主/UI 的准确范围核对，再接续可视化来源整理、草稿和版本确认。[现有范围](source-reduction-review.md)与[主计划](guided-skills-boss-plan-20261015.md)保持。

个人 22 次访谈来源、失败片段与检查点保持；本批真实模型调用和招聘外发均为 0，最终 Skill 未生成。此前具体付费重试和虚构 BOSS 实例的状态写入授权尚待用户答复，登录按用户要求暂不进行；本次合并授权不替代这些单独动作。完整 G3–G5、S08、186/U01–U12 与 Agent 自动生成目标保持，模板作者和使用者仍通过 UI 操作，JSON 仅调试/高阶配置。
