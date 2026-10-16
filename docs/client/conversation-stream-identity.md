# 会话流的响应与消息身份

2026-10-16，接续[会话顺序](conversation-receipt-order.md)和[长期计划](guided-skills-boss-plan-20261015.md)S08。现有宿主用完整持久快照通过onmessage归并，OpenAI也核对流内序号，但适配器未完整核对响应/正文所属消息。完全虚构传输的实际Conversations/加密Store人工观察中：DeepSeek中途更换chunk id、OpenAI分片更换item_id或终态更换response id，均被错误标为ready/complete。

## 设计与修复边界

先更新既有Figma未完成板[505:5588](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5588)和恢复板[505:5848](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5848)三处规则文字：序号、响应及正文所属消息须一致；身份变化停止并保持未完成，不能因完成提示确认采用。复用原组件/变量/字体，两张整图已查看，无新画板。本批不新增交互元素，不修改契约/SQLite/模板节点格式或自动重试策略。

按[OpenAI官方流式事件定义](https://developers.openai.com/api/reference/resources/responses/streaming-events)核对response生命周期、output_index、item_id与content_index；保留合法推理项、多个有序助手消息/文本段，逐项核对终态正文，不把文字恰好相同当身份一致。[DeepSeek官方Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)的各chunk属于同一ID；本次固定该ID，usage-only分片也不能换响应。只处理单个HTTP响应，不拼接重连/重试残片，不虚构供应商没有提供的序号。

任一身份冲突、正文路径缺失、重复声明或不一致终态使本轮failed，残片保持partial，不供确认/后续节点采用；之前完整历史和输入保持。只用用户绑定的Key，既有取消/120秒期限/显式新尝试/持久恢复及onmessage身份归并继续适用。无自动重试、换服务或外发。

按当前UI/UE阶段，不新增/运行单元测试。以实际Conversations、SSE适配器、加密Store和onmessage发布完成受控人工传输矩阵；响应/系统Key为虚构边界，与原生IPC、真实供应商/网络和本人蒸馏分别记证。类型/构建/格式、PR/最新CI、最终合并源安装及原简历资料保持继续独立核对。真实Key、完整S08/186/U01–U12/Agent及G3–G5/BOSS不因本批局部修复宣布完成。
