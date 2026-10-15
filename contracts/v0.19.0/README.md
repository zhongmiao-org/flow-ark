# 契约 0.19.0：持久引导会话与有序消息

2026-10-15。新增`conversation` v1节点与能力`conversation-v1`，为个人蒸馏等独立流程提供通用访谈机制。流程1.0、包2.0、SDK1.0不变；发布以真实tag为准，契约不等于实现或真实API验收。

## 流程节点与继续方式

节点包含`binding`（既有ai/use逻辑资源）、`key`（Value，解析后须为1–100字符的非空白字符串）、`title`、固定非空白`instructions`、`input`（Value）及`maxRequests`（1–50，包含手动重试与失败尝试）。只有key/input参与变量解析，固定指令不按引用求值。

宿主从当前不可变Run快照创建或读取会话，立即返回ConversationOutput，不等待用户，不自动调用模型或保留运行租约。普通流程按flowId与key隔离，模板按instanceId与key隔离；复制流程和新模板实例独立。模板跨入口复用仍要求当前入口声明conversation/conversation-v1、ai及对应ai/use资源，不借用其他入口资源或授权。

会话身份还包括规范化指令、上下文、标题、逻辑绑定、显式provider/model、请求上限的SHA256指纹。同一范围/键/指纹重复运行读取同一会话；内容或绑定变化建立新会话，保留旧记录和确认内容，不静默重置旧版本。会话保存创建来源flowId/nodeId，引用的是选定上下文快照，不随流程编辑改变。

输出为sessionId/status/revision/transcript。只有confirmed返回完整user/assistant消息数组，其他状态transcript必须为空。作者在可视化流程用status条件分支：待处理则结束本批；用户确认后显式重跑，读取完整对话再整理数据。此机制不是任意步骤位置恢复，不自动重放前序步骤；作者须把外发等操作放在确认分支后并沿用独立副作用去重。运行成功只说明本批节点已完成，不说明访谈或Skill已完成。

确认对话只固定访谈记录，不代表事实已核对、Skill已确认或发送已授权。Skill结构化整理、来源与用户逐项确认继续由独立流程完成。不得把本节点当成隐藏业务脚本。

## 会话、输入与模型请求

ConversationSnapshot状态为draft/generating/ready/failed/cancelled/confirmed，包含修订、持久单调序号、固定上下文、输入草稿、固定位置的messages及attempts。消息有稳定id/turnId/role/text/state，助手关联requestId；尝试记录自己的请求身份、状态、实际模型、供应商请求ID和usage（未知为null）。user消息与assistant占位在请求前一次持久化；重试复用同一轮位置、分配新requestId，不重复插入user。

白名单IPC：`conversation.detail({id})`读取；`conversation.draft({id,revision,text})`保存输入；`conversation.send({id,revision,requestId,text,reviewed:true})`显式发起下一轮；`conversation.retry({id,revision,requestId,reviewed:true})`重试最后一个未完成轮次；`conversation.cancel({id,requestId})`仅取消准确活动尝试；`conversation.confirm({id,revision})`确认只读记录。requestId匹配稳定id格式，重复同一requestId只返回现有状态，不能发起另一模型调用；相同身份但不同内容须拒绝。send/retry先核对预期修订并持久登记尝试，再取Key；每会话只允许一个活动请求。

输入草稿最多4000字符，单条助手正文最多100000字符，messages最多100条，attempts不超过节点maxRequests；整个会话快照及单次模型请求序列化分别不超过1MiB。上限在网络前核对，超限保留已保存内容，不能静默截断历史、无限重试或扩张预算。保存失败不得显示成功或开始网络；输入尚未保存时离开需保护，支持保存后退出和重开继续。未完成助手残片可查看但不进入下一轮模型上下文或transcript；完整user消息保留。

用户在发送前核对固定指令、上下文、模型、历史和额度消耗。所有token来自用户自己受保护的Key，宿主按当前配置修订取Key，Renderer/Worker/会话/ZIP均不持Key。活动会话请求持有明确provider/model，使用期间禁止更改该Provider凭据；没有Key则阻止当前模型调用而保留会话，不使用开发者额度或静默换服务。资料是数据，不能改变系统规则、调用工具或扩大选定范围；模型只生成文本。

## onmessage、完整快照与恢复

宿主将每次持久化后的状态包装为ConversationEvent，通过Main白名单通道交给Renderer的`onmessage(listener)`；返回取消订阅函数，回调不暴露Electron事件/原始IPC/任意topic。事件为`conversation.snapshot`，携带sessionId、稳定eventId、单调sequence、当前requestId/turnId及完整snapshot。eventId必须为sessionId与sequence的稳定组合；序号和身份须与snapshot一致。快照内含截至本序号的完整正文和消息位置，绝不将裸分片直接追加到UI。

每会话串行接收、验证和归并；低于或等于已应用序号的重复/旧事件丢弃，其他会话事件隔离。跳号、解析失败或连接恢复时保留当前输入及最后快照，进入核对态，通过detail读取宿主持久完整快照；核对期间至多保留最新一个有界完整事件，禁止无限缓存，不提前显示完成或允许确认。恢复后按最新有效序号整体替换，不拼接残片，不重新调用模型。卸载或切换会话必须解除订阅，异步detail回执还需校验当前界面身份/世代，不能覆盖新会话。

同一请求的complete/failed/cancelled终态只采纳一次；迟到分片不能改变它。取消先持久化取消状态并撤销活动请求，之后到达的生成和取Key回执不得提交；取消目标为准确requestId，不因其他轮次变化误取消。手动重试使用新身份，旧尝试不覆盖新位置。完成正文和尝试终态原子保存后才发布ready，模型截断、拒绝、缺少完整终态、序号/内容不一致、鉴权或限流均失败；部分内容始终为partial。

用户confirm必须核对当前revision、无活动请求及最后一轮助手完整成功，无未保存输入；confirmed不可继续发送或覆盖。退出/崩溃后generating恢复为cancelled并保留草稿/残片，绝不自动续费重试。聊天不占Run运行槽；宿主仍管理有限并发和关机取消，不另建客户端外的常驻服务。

## 模板、存储与采用顺序

包只携带节点定义、指令和输入表达式，声明逻辑AI资源与conversation-v1；不导出会话、确认记录、聊天、绑定、Key或历史。作者仍须把真实资料移到使用者参数/资源，公开导出不能仅检查Key。旧客户端在能力预检拒绝新节点。

会话与事件快照由本地宿主写入现有加密documents，新增文档kind，不改SQLite表布局/user_version，不清库；Worker不写数据库。确认会话引用由宿主管理，未来Skill/工作区契约独立采用，当前不声称会话已镜像到个人资料目录。日志不含完整上下文或正文；私有运行数据不提交Git。

治理合并并发布0.19.0后，客户端固定复制契约和摘要，生成类型与校验器；消费者独立构建，不读取父仓库。语义检查与实际人工验收覆盖CAS冲突、双提交、序号跳跃/重复、切换迟到、取消与重试、退出重开、无Key、上限、失败正文及确认隔离。示例/正反例只证明格式，不能替代会话或真实API验收。当前阶段不新增/运行单元测试。

协议参考：[OpenAI流式事件](https://developers.openai.com/api/docs/guides/streaming-responses)、[DeepSeek流式对话补全](https://api-docs.deepseek.com/api/create-chat-completion/)。两家适配器分别核对完整终态和用量；不显示推理过程，不以一种服务的受控响应代替另一种真实服务。
