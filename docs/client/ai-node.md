# 结构化 AI 通用节点

2026-10-15，长期计划G1/G2的首批能力。契约见[0.18.0](../../contracts/v0.18.0/README.md)。个人蒸馏、JD与回复仍由模板配置指令和输出格式，客户端不写业务判断。

## Figma先行

在原文件补充[节点配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5279)、[资源缺失](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5392)、[请求与取消](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5476)、[失败恢复](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5562)。复用Button/AntInput、原字体及Semantic主题，保留原186与上一批26场景。

节点位于动作库独立AI组，既可在步骤清单也可在编排检查器配置；绑定逻辑资源、用户供应商和明确模型，指令为多行文本，输入沿用ValueField来源选择。输出格式提供字段名/类型/必需的可视化编辑，复杂结构保留高级JSON Schema编辑。AI绑定独立于“允许脚本读取凭据”；切换供应商清空模型，不在节点中输入Key。保存/切换不调用模型。

配置区复用现有表单与未保存守卫，控件纵向排列并允许操作换行。运行前核对列出供应商、模型、网络发送和用户token消耗；节点结果沿用既有结果查看器呈现结构化输出、请求ID、实际模型及可取得的用量，未知用量为null。Key缺失或非法格式阻止调用，失败不输出可供后续步骤采用的结果。

## 本批证据与后续

- 治理[PR #738](https://github.com/zhongmiao-org/flow-ark/pull/738)已合并为 `86ddfdfd45a99f020a01761ee9c6d0c4d5688861`，Validate与Auto Merge通过；已发布不可变tag `contracts-v0.18.0`，包与SDK版本不变。
- 客户端[PR #271](https://github.com/zhongmiao-org/flow-ark-client/pull/271)实现动作库、配置、输入引用、宿主请求、运行核对与模板导出声明；采用上述治理提交和契约。最新提交`acf3f8f`的Validate与Auto Merge通过，实际合并为`b5e59a187f5fe51b8f54f6fd8c66ac1447f761fa`；创建PR时标签触发的旧检查取消，未将旧结果作为通过依据。
- 本地 `pnpm contracts:generate`、`pnpm typecheck`、`pnpm build`、变更代码Prettier、固定契约校验和及`git diff --check`通过；构建有现有大包提示。按当前阶段约定未新增、未运行单元测试。
- 使用实际生产配置组件做隔离人工预览，只有虚构模型元数据，不连接宿主或模型。已核对供应商切换清空模型、显式采用本地已存模型、字段增改/布尔类型、重复名称保留草稿、无效JSON恢复、明暗主题和窄栏。该核对不证明宿主执行、真实Key可用或模型请求成功。
- 原生安装后运行、两家真实API及鉴权/限流/取消回执、ZIP导出与独立复导仍待验收；保留当前日用客户端进程，未以并行原生实例或预览替代。

高级JSON Schema支持复杂嵌套配置；本批可视化字段编辑仅覆盖顶层字段，不声称已经具备完整嵌套Schema作者工具。多轮持久会话、Skill确认版本、资料解析及BOSS模板仍为长期计划待实现项。无Key或服务不可用时不能用受控响应记作真实API通过。
