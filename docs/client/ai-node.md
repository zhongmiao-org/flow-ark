# 结构化 AI 通用节点

2026-10-15，长期计划G1/G2的首批能力。契约见[0.18.0](../../contracts/v0.18.0/README.md)。个人蒸馏、JD与回复仍由模板配置指令和输出格式，客户端不写业务判断。

## Figma先行

在原文件补充[节点配置](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5279)、[资源缺失](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5392)、[请求与取消](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5476)、[失败恢复](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=498-5562)。复用Button/AntInput、原字体及Semantic主题，保留原186与上一批26场景。

节点位于动作库独立AI组，既可在步骤清单也可在编排检查器配置；绑定逻辑资源、用户供应商和明确模型，指令为多行文本，输入沿用ValueField来源选择。输出格式提供字段名/类型/必需的可视化编辑，复杂结构保留高级JSON Schema编辑。AI绑定独立于“允许脚本读取凭据”；切换供应商清空模型，不在节点中输入Key。保存/切换不调用模型。

配置区复用现有表单与未保存守卫，窄侧栏纵向排列，完整编辑页按宽度分两列/单列；Key缺失、格式非法、取消和迟到回执都保留草稿。运行核对显示网络发送和用户token消耗，输出内容/请求ID/实际模型/用量分别展示；失败无输出。

## 本批证据与后续

契约、客户端实现、类型/构建、原生运行、真实两家API及ZIP复导分别记录。当前仅已补设计并读取高保真上下文，契约待PR发布，客户端待实现；未产生真实模型调用。无Key或服务不可用时不能用受控响应记作真实API通过。多轮持久会话、Skill确认版本、资料解析和BOSS模板仍为长期计划待实现项。
