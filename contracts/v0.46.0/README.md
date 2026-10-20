# P1 0.46.0：结构化 AI 生成设置

2026-10-20候选，尚未发布。继承0.45.1；只新增AI节点v3、AIGenerationOptions与ai-generation-v1。包2.0/SDK1.0、SQLite、原AIRequest/AIResult/AIOutcome/收据及v1/v2字节形状保持。客户端须待准确PR合并与tag发布后独立采用。[先行设计、语义和验收](../../docs/client/ai-generation-controls.md)属于本版规则。

v3沿用v2成功status/result.output与failureMode，不改变下游引用；generation为完整固定字面对象，仅thinking与maxOutputTokens，无参数引用。thinking为provider-default/disabled/enabled，输出预算为256–16384安全整数。显式采用v3不自动修改旧流程或旧Run；导入导出保留配置，运行快照固定。

DeepSeek映射到max_tokens及thinking.type；默认不发送thinking，显式启用/关闭准确发送enabled/disabled，不另外指定reasoning_effort。OpenAI映射max_output_tokens，只允许provider-default。绑定不支持的显式模式须在付费请求前拒绝，不忽略、不切模型。输出预算包含供应商计算的思考与正文，不是预计用量或费用；响应仍只采用完整、有效Schema结果，保留既有用量/失败/取消/不重试边界，不保存思考正文。

流程必须声明ai-node-v1、ai-outcome-v1、ai-generation-v1；有效作者入口采用流程能力与额外能力并集，正式入口必须逐项包含以上能力及ai，并声明自身ai/use资源。旧消费者不支持新能力时拒绝。宿主从固定源节点取设置，Worker或模型不能扩大预算；调用前按绑定供应商复核，取消和运行期限不因新设置延长。原标准请求45秒和节点期限保持，不承诺大预算必然成功。

这份快照与纯规范检查不代表供应商真实调用、客户端UI、原始ZIP复导或招聘投递完成。当前尚未实现消费者；北京与个人资料只属于私有实例，网站150次上限目标保持。
