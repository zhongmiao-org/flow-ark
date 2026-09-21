# 贡献规范

治理仓库维护公共架构、契约、开发边界和验收；客户端与模板仓库各自独立构建。开始前读取 AGENTS.md、docs/architecture.md 和 ROADMAP.md。模板源码、demo、example、完整模拟站点归 flow-ark-templates，客户端不得内置业务枚举和选择器。

提交及 PR 使用 Conventional Commits，工作分支使用 `type/小写英文数字连字符`，例如 `feat/template-import`。不使用 `codex/` 等工具名前缀。功能分支 → 本地检查 → PR → `automerge` → 最新提交必需检查通过 → CI 自动合并；不得绕过检查手工合并或直接推 main。破坏兼容记录 `BREAKING CHANGE:` 与迁移办法。

治理检查：`python3 .github/check-governance.py`。跨仓库依次交付治理契约、模板、客户端消费者，各自记录真实 PR/CI 和验收证据。根目录不建立跨仓库依赖；正式包和使用方独立持有已采用契约。
