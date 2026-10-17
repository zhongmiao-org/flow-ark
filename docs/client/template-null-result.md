# 正式模板显式 null 结果保持

2026-10-17，通用缺陷修复，沿既有 SDK 1.0 / 已发布契约，不采用任何未发布的入口结果视图草案。无交互变化，不新增 Figma 状态。

## 触发与现有证据

正式模板先以 `template.result(null)` 保存一个符合入口 resultSchema 的结果，流程随后产生其他步骤输出。客户端主线 `c09a0569c48690c08b723df43c886b56b76da8f3` 的 `src/templates/service.ts` 完成阶段使用 `get('template-result', runId) ?? output`；因此已保存 null 被当成无记录，可能被覆盖或因步骤输出不符合 Schema 导致完成失败。其他假值并未触发该空值合并行为。

Store.get 明确以 undefined 表示无文档，实际 JSON null 保持 null。SDK 写入前已有入口 Schema 校验，完成阶段仍保留同一校验；缺失结果继续使用既有流程输出回填。作者 SDK 使用单独记录且完成路径已有 undefined 判断，本次不修改它。

## 修复范围与验收

完成阶段先读取 savedResult，仅 `savedResult === undefined` 时选择流程输出，再按原入口 Schema 校验并保存。保持同 Run key、命名空间、校验和存储失败处理，不修改旧记录，不重跑已有业务，不新增迁移或契约版本。

需要通过原生 UI 的制作、原始导出、正式实例导入和运行核对：显式 null 加不同末步输出保留 null；null-only Schema 不被末步输出误判；false/0/空文本/空对象/空列表保持；未调用 result 时沿原输出；不符合 Schema 的结果仍失败；独立 Run 不串值。不得私改 Store、JSON 模板文件或 ZIP 来代替该交互证据。

本批先做代码、类型检查与构建，未完成上述原生矩阵前不标完整验收；不新增或运行应用单元测试。安装版包含多个尚未合并的候选补丁，不能直接由当前主线单独重新打包而回退既有能力。本修复的安装与原生验证单独记录。
