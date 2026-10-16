# BOSS岗位方向评估与三路建议

2026-10-16，承接[资料来源](boss-profile-sources.md)、[独立复用](boss-source-reuse-20261016.md)与长期计划G4。用户暂不登录，真实简历另在私有实例本地解析；本批继续制作JD方向判断的可复用业务入口，不把缺Key、未确认Skill或未登录当作已通过。

## Figma先行与已有能力

原文件sVciNUZHG9yx81gCpYzjH9、页面1:3、Section487:7024追加四张1440×1080原生可编辑状态：

| 状态 | 节点 |
| --- | --- |
| 输入、固定来源与自有Key | [625:6992](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-6992) |
| 明确符合建议 | [625:7094](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7094) |
| 明确不符合建议 / Dark | [625:7196](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7196) |
| 不确定、缺口或冲突转本人 | [625:7298](https://www.figma.com/design/sVciNUZHG9yx81gCpYzjH9?node-id=625-7298) |

复用581:6158、AntInput139:2、Button1:146/1:148、单套Semantic Light/Dark与Noto Sans SC/Inter。每张后代36Frame、3Ellipse、33Text、21Vector、8Instance，零图片填充；清除继承无关跳转，导航修正为模板库并查看全部修正后整图。Section扩为4480×53160，原186保持。这是静态业务状态规格，不计可点击原型或客户端运行通过，未新建库组件/主题。

当前通用context、固定Skill、结构化AI、条件、脚本及result/attention已经有可视化节点或SDK，已发布契约足以表达；本批不增加客户端业务节点/分支/提示词，不修改包2.0、SDK1.0或公共契约。AI响应仍经现有宿主能力，不将一次结构化评估当作已验证onmessage完整对话矩阵。

## 制作入口与来源

从准确0.1.4复制制作下一检查点，保留四个旧入口。新增手动、不定时的job-assessment入口，资源仅固定确认profile与用户自己的ai，读取本实例共享求职配置；不要求浏览器，不能把此独立入口当作自动取得真实会话JD。

输入字段为jobTitle、jobDescription、descriptionComplete及可选sourceLabel，公开默认空文本/false。本批明确由调用方选择JD，complete只是本人声明，不是宿主核验的真实站点/账号/会话证据。后续接入登录后的真实会话时必须从该会话读取、核验目标和内容变化，不能用本入口的手填来源、旧摘要或模型自报字段绕过；缺登录校准继续保留。

可视化步骤独立负责：读取固定配置→整理输入/条件缺口→条件成立时读取固定Skill、结构化AI、校验原句与规则引用、按建议分支保存；缺口及review分支登记本人待办。业务小脚本只整理、验证和保存，不包办浏览器、模型、分支或流程定义。业务规程、Schema、提示词映射和来源归模板仓库，作者通过客户端维护后原始导出，不手改流程JSON或ZIP。

所有模型token由明确绑定的用户Key承担，不使用开发者Key或已有其他工作区的服务。不调用AI的整理不能成为模型已成功证据；缺Key或确认Skill时预检阻止，本批实际未配置不能捏造评估。个人资料与模型输入只在私有实例/受保护Run保留，公开包无真实简历、Key、Skill、本机路径或对话。

## 三路建议、证据与后续动作

- match：JD职责/要求与明确目标相符，原句与目标引用有效且无阻断未知或冲突；仅准备后续已授权的草稿路径。
- mismatch：有明确不相容方向及JD原句依据，例如目标前端、正文明确主播；不是只按标题/单词拒绝。仅生成not-interested-proposal，当前不点击站点或发送拒绝。
- review：正文未声明完整、空白/缺材料、共享条件缺口/冲突、相近方向、标题/职责矛盾、模型不确定、引用原句/规则无效或有阻断未知；保留原因并通知本人，不先发简历或自行作承诺。

模型返回有限结构化decision/reason/targetRole/quotes/unknowns/conflicts，不允许模型返回动作授权或伪造宿主来源。下游确定性校验：targetRole必须来自本次明确目标，quote必须是本次原始JD正文中的真实连续片段；缺证据、冲突或未知降为review。模型结论即使通过格式/引用检查也仅是建议，不能据此证明事实或语义判断正确。原始建议与降级原因分开保存。

宿主输入整理计算JD内容摘要，保存本次配置修订和实际读取Skill的固定版本/摘要；模型不能提供这些身份。通知按实例/JD摘要/配置修订/Skill版本去重并保留首次来源/已读；缺口阶段尚未读取Skill时不伪造其身份。公开结果明确accountVerified=false、eligibleForActions=false，nextAction仅draft-only/not-interested-proposal/ask-user。规则变化须重新评估，旧Run不改写。

不感兴趣最终仍是独立站点副作用，需要实际页面入口、deny/confirm/auto配置、当前账号/会话/JD/版本复验、持久去重和回执；简历发送、自我介绍、回复及人工接管也仍须完整实现。暂不登录不删除这些要求，不把本批独立建议入口当作完成自动聊天或拒绝。

## 验收与交付

本批先合并治理与Figma，再通过客户端配置字段、公开提示词、节点与三路分支，明确带回、系统导出原始ZIP，独立模板PR核对公开资产与编译来源。沿用阶段约定不新增/运行单元测试，按需现有validate/build及人工节点、输入引用、预检、缺资源阻止、独立复导和重开验证。模板结果需实际自有Key与确认Skill后才可计模型评估通过；不能用直接调用整理函数或注入provider冒充。

完整验收保留：前端/主播、相近岗位、混合职责、正文缺失/partial、恶意JD要求换规则/读Key、模型伪造引用/无效输出/不确定/鉴权限流取消、同键首次来源、配置或Skill变化、真实会话JD来源与发送前复验、独立消费者重绑与旧版本保持。真实Key个人蒸馏/本人确认、完整BOSS登录/投递/简历/聊天/不感兴趣、G3–G5/186/U01–U12/Agent保持未完整验收。当前为先行设计，尚未制作新模板包。
