# 会话流的响应与消息身份

2026-10-16，接续[会话顺序](conversation-receipt-order.md)和[长期计划](guided-skills-boss-plan-20261015.md)S08。现有宿主用完整持久快照通过onmessage归并，OpenAI也核对流内序号，但适配器未完整核对响应/正文所属消息。完全虚构传输的实际Conversations/加密Store人工观察中：DeepSeek中途更换chunk id、OpenAI分片更换item_id或终态更换response id，均被错误标为ready/complete。

## 设计与修复边界

先更新既有Figma未完成板[505:5588](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5588)和恢复板[505:5848](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5848)三处规则文字：序号、响应及正文所属消息须一致；身份变化停止并保持未完成，不能因完成提示确认采用。复用原组件/变量/字体，两张整图已查看，无新画板。本批不新增交互元素，不修改契约/SQLite/模板节点格式或自动重试策略。

按[OpenAI官方流式事件定义](https://developers.openai.com/api/reference/resources/responses/streaming-events)核对response生命周期、output_index、item_id与content_index；保留合法推理项、多个有序助手消息/文本段，逐项核对终态正文，不把文字恰好相同当身份一致。[DeepSeek官方Chat Completions](https://api-docs.deepseek.com/api/create-chat-completion/)的各chunk属于同一ID；本次固定该ID，usage-only分片也不能换响应。只处理单个HTTP响应，不拼接重连/重试残片，不虚构供应商没有提供的序号。

任一身份冲突、正文路径缺失、重复声明或不一致终态使本轮failed，残片保持partial，不供确认/后续节点采用；之前完整历史和输入保持。只用用户绑定的Key，既有取消/120秒期限/显式新尝试/持久恢复及onmessage身份归并继续适用。无自动重试、换服务或外发。

按当前UI/UE阶段，不新增/运行单元测试。以实际Conversations、SSE适配器、加密Store和onmessage发布完成受控人工传输矩阵；响应/系统Key为虚构边界，与原生IPC、真实供应商/网络和本人蒸馏分别记证。类型/构建/格式、PR/最新CI、最终合并源安装及原简历资料保持继续独立核对。真实Key、完整S08/186/U01–U12/Agent及G3–G5/BOSS不因本批局部修复宣布完成。

## 客户端修复与实际证据

治理[PR #790](https://github.com/zhongmiao-org/flow-ark/pull/790)的最新CI38863865988中Validate/Auto Merge成功，实际合并`63aab82aca0e5beadec64a166c70550fb7384241`。客户端[PR #288](https://github.com/zhongmiao-org/flow-ark-client/pull/288)源`01a5556dd04a2fca90de90bbafa066e8571bca18`，最新[CI38864688000](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38864688000)两项成功，实际合并`5e4733c22e397102b349197aebdf64256e2ff501`；旧38864651819因标签事件取消，不计通过。

适配器固定DeepSeek每个chunk（含仅用量分片）的响应ID。OpenAI固定创建响应身份，逐项登记output_index/item_id及content_index，拒绝重复/缺失路径、异类输出或不一致完成正文；全局连续序号检查继续先行。专用通用文本跟踪器保留推理项、多条助手消息/多段正文，交错分片先按所在位置缓存，仅向现有宿主delta回调推进连续正文。读取游标只向前，不反复扫描全部已输出前缀；总正文100000字符、HTTP8MiB等原预算保持，工具/拒绝仍不采用。

错误沿既有宿主failed/partial持久化，过去完整历史不改；不生成新动作、自动重试、订阅或业务提示词。Renderer、协议/SQLite/现有公开ZIP均未改，原onmessage快照身份/序号归并继续使用。没有把供应商缺少的序号自行补造成服务端证明。这里固定的是当前HTTP响应及其消息路径，不等于真实账号或事实核验。

`pnpm typecheck`、`pnpm build`、两文件Prettier和`git diff --check`通过，构建保留既有chunk体积提示。未新增/运行单元测试。复现与最终人工矩阵使用实际Conversations宿主、SSE适配器、onmessage发布和加密Store，Key/网络回复全部合成，未使用原私有资料：

| 层次 | 证据 |
| --- | --- |
| 修复前五个会话 | 两家正常路径完整；DeepSeek中途换ID、OpenAI换item_id/完成response ID也错误标ready/complete |
| 修复后同五项 | 正常仍ready/complete，三个异常改failed/partial，坏分片不作为完整正文采用 |
| 最终15个会话/16次合成请求 | 逐字节分割UTF-8及CRLF；DeepSeek正文/usage-only身份变化和未结束事件；OpenAI消息/响应/段路径、最终消息ID、缺创建、重复声明、序号缺口均拒绝 |
| 合法多项/交错 | 推理项与两条助手消息、多个文本段正常完成；交错的甲、后段丙、前段乙最终按甲乙丙显示，推理不混入回复；已知用量0保持 |
| 取消/显式重试 | 取消后新尝试保留一条用户消息，旧delta被拒绝；不混入上一尝试残片，无自动重试 |
| 持久与UI | 各会话onmessage递增且身份格式通过，Store正常重开不发请求/不重放；实际ConversationPanel显示未完成/partial及禁用确认，Light/Dark局部查看 |

以上矩阵不是真实供应商、原生IPC或完整S08验收。实际组件读取同一合成宿主快照，未把本地桥接称为原生连接；截图中的模型计数是合成尝试，不是实际Key收费。临时预览与服务已关闭。

## 最终安装与私有资料

从合并main执行`pnpm package:mac`，复用已有Electron，不下载浏览器。正常退出原应用、核对零安装版进程并备份旧App与闭合私有数据后，串行替换并保留回滚备份。安装ASAR和合并源候选一致，具体摘要如下：

- app.asar：`edbf54bdbd1bef44c2e762142b417cb930ee0fb094243fcff7b6fc643be5fdbd`。
- DMG：`c4b05b5cf710edaf6ea133e015ce35a7e60994ba82a7fd5a59697de1327aa6c4`。

安装版正常重开原私有工作区，核对同一真实资料实例、README.md/initial、原1条解析Run与缺ai/workspace禁运行；全部加密documents/events及受保护凭据与本批闭合备份相同。模型服务仍未配置，未创建/发送真实会话；最后返回更新前的AI服务设置页。唯一安装版主进程。安装启动与资料保留不计原生流式IPC/API验证。

本次只读进入实例及切换入口后，返回设置出现未保存实例提示；未保存临时表单值，选择不保存离开后恢复原AI设置。原记录/凭据比对通过，提示成因和避免误判脏状态另列待核对，本批未修复。

继续真实用户Key蒸馏/本人确认、真实流式协议/网络/IPC、完整S08的重连/超时/旧订阅/预算矩阵，以及G3–G5/BOSS/186/U01–U12/Agent闭环。长期目标保持进行中，暂不登录的选择保持。
