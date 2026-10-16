# 持久引导会话

2026-10-16 S08身份增量：治理#790/Figma先行，客户端#288经最新CI自动合并并安装，拒绝响应/消息/正文段身份冲突；合法多消息、推理与交错文本段保持。实际宿主合成传输15个会话/16请求、取消显式重试、来源异常不确认及重开不重放取得证据；真实模型/外发0，原简历私有记录与凭据保持。详情见[流式身份](conversation-stream-identity.md#客户端修复与实际证据)；当前仍不代表真实用户Key访谈或完整S08通过。

2026-10-16 输入顺序修复：按既有Figma冲突/恢复状态补明确规则，治理#781先行；客户端#286消除保存回执在快照归并后另写旧正文的缺口。真实Renderer人工复现与修复、正常保存、跳号/其他会话和本地未提交输入保持已有局部证据，详见[记录](conversation-receipt-order.md)。不将受控桥接或重挂载计为真实API、原生IPC延迟或完整S08通过。

2026-10-16 增量：客户端#279/#280固定采用0.24.0，普通已确认会话输出真实sequence/evidence和完整只读结果；内部草稿试聊独立固定来源，不自动成为本人事实。仍复用onmessage顺序、取消、持久化及恢复；发送前复验草稿，旧历史保留。实现、原生证据与真实Key缺口见[会话来源与试聊](skill-trial.md)。下文0.19.0为初始交付记录。

2026-10-15，按[长期计划](guided-skills-boss-plan-20261015.md)推进G1/G2。新增通用conversation节点，为独立个人蒸馏提供多轮访谈基础；求职事实字段和访谈规程归模板，客户端不内置业务提示词。

## 使用与边界

节点创建/读取独立会话后立即返回状态，等待用户不占Run。用户从待办进入，核对指令、已选上下文、模型和自有Key费用，保存输入或发送下一轮；完整成功后才能确认对话。来源流程按confirmed条件读取transcript，再整理事实和Skill。新运行不自动重放外发，确认对话不授予发送权限，也不替代最终Skill确认。

数据与消息见[0.19.0契约](../../contracts/v0.19.0/README.md)。宿主负责加密持久化、单会话请求串行、修订和请求身份、取消、预算与重开；Renderer通过onmessage接收带序号的完整持久化快照，重复/旧事件丢弃，跳号或连接中断按完整快照核对，不拼接失序残片。恢复不自动调用模型。

## Figma先行

在原Section新增8个原生可编辑状态：

| 状态 | 节点 |
| --- | --- |
| 节点配置 | [505:5303](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5303) |
| 对话与输入 | [505:5408](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5408) |
| 生成与取消 | [505:5500](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5500) |
| 未完成与重试 | [505:5588](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5588) |
| 确认只读 | [505:5676](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5676) |
| 修订冲突 | [505:5761](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5761) |
| 消息核对恢复 | [505:5848](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5848) |
| 紧凑会话 | [505:5934](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=505-5934) |

复用原Button/AntInput、文字样式和Semantic Light/Dark。结构检查：268个Frame、222个Text、34个Instance，零图片填充，字体仅Noto Sans SC/Inter；原186与前批场景保留。已读取配置/对话/紧凑的高保真上下文与截图，修正紧凑首卡宽度和多行输入后再看图；有限原型未实际点击验证，不等同可输入/流式功能通过。完整控件禁用、未保存离开与键盘焦点仍需按实施补细并核对。

## 交付状态

治理[PR #743](https://github.com/zhongmiao-org/flow-ark/pull/743)已由最新CI合并，提交`bcff18cc2718a56f78290ab83dae4351d2218ff8`，不可变tag `contracts-v0.19.0`已发布。客户端固定采用该快照并生成类型及校验器，[PR #273](https://github.com/zhongmiao-org/flow-ark-client/pull/273)源提交`36aac2091dd74cd3782e48d7bb21a3dd1e4529ee`的[最新CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38720351913)中Validate与Auto Merge成功，实际合并`86c062c19aca338f3a49ce5f6834cf9ec34a8751`。安装及原生核对另记，不以PR合并代替运行验收。

客户端实现：动作库与节点配置、键/上下文引用、入口AI资源声明和ZIP导出；宿主加密会话、修订/请求身份与有限并发、完整快照onmessage、两家流式适配、取消/手动重试及退出清理；待办中的输入保存、离开保护、消息恢复和确认只读。无个人蒸馏或招聘业务专属节点。

本地`pnpm typecheck`、`pnpm build`、修改源文件Prettier、`git diff --check`及契约SHA256校验通过。构建仍有既有的大包体提示。按当前UI/UE阶段约定未新增/运行单元测试。

隔离预览使用实际面板、宿主和适配器，输入虚构资料、受控SSE响应，无真实Key或网络模型调用。人工核对了保存后离开与返回、刷新恢复已保存输入、同轮取消/重试不重复用户消息、HTTP429保留失败且不自动重试、旧快照丢弃、跳号后读取完整快照、供应商会话隔离、两种协议完整终态、用量未知与明确用量、确认只读、供应商切换清空模型，以及Light/Dark和紧凑布局。此证据不等同原生会话IPC、系统重启、真实API及S08全部异常通过；这些项目继续独立验收。

原生续批：首次候选安装暴露运行时AJV编译与既有CSP冲突，页面空白，未将其记为安装通过。改为复用构建时静态校验生成流程，未放宽CSP；[修复PR #274](https://github.com/zhongmiao-org/flow-ark-client/pull/274)源`7a86b14`经[最新CI](https://github.com/zhongmiao-org/flow-ark-client/actions/runs/38720950173)Validate/Auto Merge通过，实际合并`fe0d409fa4c7048ad773958ca6b9a955a30335b1`。

修复后重新生成macOS arm64 ZIP/DMG并更新现有应用，候选与安装ASAR一致。正常退出后备份原应用和加密资料，串行更新并确认唯一主进程；原工作区正常打开，经动作库实际添加持久引导会话并显示完整配置，随后撤销临时添加，回到原零步骤流程及列表。只读比对全部加密documents保持一致，未保存临时节点、未新增Run。原生界面显示AI服务未配置，因此没有创建或发送真实会话；原生会话IPC、Key鉴权、真实流式API及系统重开会话仍待资源到位后验收。详细安装路径、备份和截图仅保留本机，不进入公开仓库。

个人工作区镜像、资料解析和Skill最终确认仍属后续契约/能力，不将会话保存在加密数据库等同于已完成工作区落盘。G3–G5与完整BOSS验收保持未完成。
